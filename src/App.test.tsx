import { fireEvent, render, screen, within } from '@testing-library/react';
import { App } from './App';
import { SAVE_KEY } from './state/save';
import { t } from './i18n';
import type { CreationInput } from './engine/player';
import type { Reveal } from './ui/screens/revealView';

// a revelação de verdade, registrando com que jogador e semente foi chamada (para comparar com a tela)
const revealCalls = vi.hoisted(() => [] as { input: CreationInput; seed: number; out: Reveal }[]);
vi.mock('./ui/screens/revealView', async (original) => {
  const real = await original<typeof import('./ui/screens/revealView')>();
  return { ...real, revealOf: (input: CreationInput, seed: number) => { const out = real.revealOf(input, seed); revealCalls.push({ input, seed, out }); return out; } };
});

// T51 (b): o app de ponta a ponta. Até a T49 ele abria numa decisão de amostra; agora começa na criação de verdade
// (a abertura, o sorteio e o ritmo da T48 ainda não têm tela).
const group = (k: string) => screen.getByRole('radiogroup', { name: t(`ui.criacao.${k}`) });
const advance = () => fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.avancar') }));

const startNew = () => fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.novaCarreira') }));

/** T52: atravessa a reunião com a comissão (propõe a sugestão e fecha a resposta), se ela for a tela da vez. */
function passMeetings() {
  for (let guard = 0; guard < 6; guard++) {
    const resposta = document.querySelector('dialog.reuniao__resposta');
    if (resposta) { fireEvent.click(resposta.querySelector('button')!); continue; }
    if (screen.queryByRole('heading', { level: 1, name: t('ui.reuniao.titulo') })) { fireEvent.click(screen.getByRole('button', { name: t('ui.reuniao.propor') })); continue; }
    return;
  }
}

function createPlayer() {
  startNew();
  fireEvent.change(screen.getByLabelText(t('ui.criacao.quemE.nome')), { target: { value: 'Dudu Maestro' } });
  fireEvent.change(screen.getByLabelText(t('ui.criacao.quemE.estado')), { target: { value: 'BA' } });
  fireEvent.click(within(group('quemE.comemoracao')).getByRole('radio', { name: t('creation.celebration.aviaozinho') }));
  advance();
  advance(); // tela "seu visual" (v2.35): o visual já vem sorteado
  fireEvent.click(within(group('emCampo.posicao')).getByRole('radio', { name: t('positions.atacante') }));
  fireEvent.click(within(group('emCampo.estilo')).getByRole('radio', { name: t('archetypes.archetype.matador') }));
  fireEvent.click(within(group('emCampo.temperamento')).getByRole('radio', { name: t('creation.temperament.frio') }));
  advance();
  fireEvent.click(within(group('origem.titulo')).getByRole('radio', { name: t('creation.origin.varzea') }));
  advance();
}

beforeEach(() => { localStorage.clear(); });

describe('App (T51b, T48): abertura → criação → revelação → ritmo → carreira', () => {
  it('abre na abertura; "Nova carreira" leva à criação, no passo "quem é ele"', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: t('ui.abertura.titulo') })).toBeInTheDocument();
    startNew();
    expect(screen.getByRole('heading', { level: 1, name: t('ui.criacao.passos.quemE') })).toBeInTheDocument();
  });

  it('ao concluir a criação, vem a revelação do jogador (T49i) com o mesmo sorteio da carreira', () => {
    const { container } = render(<App seed={11} />);
    createPlayer();
    const dialog = screen.getByRole('dialog', { name: t('ui.revelacao.titulo') });
    expect(container.querySelector('main[data-evento]')).toBeNull();
    const last = revealCalls.at(-1)!;
    expect(last.seed).toBe(11);
    expect(last.input.name).toBe('Dudu Maestro');
    expect(dialog.querySelector('.figurinha__over-grande')).toHaveTextContent(String(last.out.overall));
  });

  it('depois da revelação vem a escolha do ritmo; com o Normal, a carreira abre na primeira decisão do jogador criado', () => {
    const { container } = render(<App seed={11} />);
    createPlayer();
    fireEvent.click(screen.getByRole('button', { name: t('ui.revelacao.seguir') }));
    expect(screen.getByRole('heading', { level: 1, name: t('ui.ritmo.titulo') })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: t('ui.ritmo.comecar') }));
    passMeetings();
    expect(container.querySelector('main[data-evento]')).not.toBeNull();
    expect(screen.getByText('Dudu Maestro', { selector: '.figurinha__tarja-nome' })).toBeInTheDocument();
    // a figurinha da decisão usa o retrato pintado do visual escolhido na criação
    expect(container.querySelector('.figurinha img.figurinha__retrato--pintado')).toHaveAttribute('src', expect.stringMatching(/visual-\d\d/));
    expect(screen.getByRole('button', { name: t('ui.decisao.confirmar') })).toBeInTheDocument();
  });

  it('o ritmo escolhido chega à decisão: no Rápido não há "Confirmar escolha" (um toque decide)', () => {
    render(<App seed={11} />);
    createPlayer();
    fireEvent.click(screen.getByRole('button', { name: t('ui.revelacao.seguir') }));
    fireEvent.click(screen.getByRole('radio', { name: t('ui.ritmo.rapido.nome') }));
    fireEvent.click(screen.getByRole('button', { name: t('ui.ritmo.comecar') }));
    expect(screen.queryByRole('button', { name: t('ui.decisao.confirmar') })).not.toBeInTheDocument();
    expect(document.querySelector('.opcao__resumo')).not.toBeNull();
  });

  it('"Voltar" no ritmo volta para a revelação do mesmo jogador', () => {
    render(<App seed={11} />);
    createPlayer();
    fireEvent.click(screen.getByRole('button', { name: t('ui.revelacao.seguir') }));
    fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.voltar') }));
    expect(screen.getByRole('dialog', { name: t('ui.revelacao.titulo') })).toBeInTheDocument();
  });

  it('"Voltar" no primeiro passo volta à abertura; "Nova carreira" recomeça a criação limpa', () => {
    render(<App />);
    startNew();
    const nome = screen.getByLabelText(t('ui.criacao.quemE.nome'));
    fireEvent.change(nome, { target: { value: 'Dudu Maestro' } });
    fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.voltar') }));
    expect(screen.getByRole('heading', { level: 1, name: t('ui.abertura.titulo') })).toBeInTheDocument();
    startNew();
    expect(screen.getByLabelText(t('ui.criacao.quemE.nome'))).toHaveValue('');
  });
});

describe('save no aparelho (T54, v2.39)', () => {
  beforeEach(() => { localStorage.clear(); });

  const toRitmo = () => { fireEvent.click(screen.getByRole('button', { name: t('ui.revelacao.seguir') })); fireEvent.click(screen.getByRole('button', { name: t('ui.ritmo.comecar') })); };
  const decideFirst = () => {
    passMeetings();
    fireEvent.click(document.querySelector('.opcao')!);
    fireEvent.click(screen.getByRole('button', { name: t('ui.decisao.confirmar') }));
    fireEvent.click(screen.getByRole('button', { name: t('ui.resultado.seguir') }));
  };

  it('a carreira é salva ao começar e a cada decisão (criação, semente, ritmo e escolhas)', () => {
    render(<App seed={11} />);
    createPlayer(); toRitmo();
    expect(JSON.parse(localStorage.getItem(SAVE_KEY)!)).toMatchObject({ seed: 11, ritmo: 'normal', choices: [] });
    decideFirst();
    expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).choices.length).toBeGreaterThanOrEqual(1);
  });

  it('fechar e abrir de novo: "Continuar" volta exatamente na decisão em que parou', () => {
    const first = render(<App seed={11} />);
    createPlayer(); toRitmo(); decideFirst(); passMeetings();
    const eventId = document.querySelector('main[data-evento]')!.getAttribute('data-evento');
    first.unmount();
    render(<App seed={99} />);
    fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.continuar', { nome: 'Dudu Maestro' }) }));
    expect(document.querySelector('main[data-evento]')!.getAttribute('data-evento')).toBe(eventId);
  });

  it('"Nova carreira" com save pergunta; "Apagar e começar" apaga o save e abre a criação', () => {
    const first = render(<App seed={11} />);
    createPlayer(); toRitmo();
    first.unmount();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.novaCarreira') }));
    fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.confirmar.apagar') }));
    expect(localStorage.getItem(SAVE_KEY)).toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: t('ui.criacao.passos.quemE') })).toBeInTheDocument();
  });

  it('save danificado: "Continuar" mostra o aviso; "Começar uma nova" apaga e abre a criação; nada trava', () => {
    localStorage.setItem(SAVE_KEY, '{quebrado');
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.continuarSemNome') }));
    expect(screen.getByRole('heading', { level: 1, name: t('ui.saveInvalido.titulo') })).toBeInTheDocument();
    expect(screen.getByText(t('ui.saveInvalido.danificado'))).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: t('ui.saveInvalido.recomecar') }));
    expect(localStorage.getItem(SAVE_KEY)).toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: t('ui.criacao.passos.quemE') })).toBeInTheDocument();
  });

  it('escolha salva que o motor não aceita (save adulterado) também vira o aviso, sem quebrar a tela', () => {
    const first = render(<App seed={11} />);
    createPlayer(); toRitmo();
    first.unmount();
    const save = JSON.parse(localStorage.getItem(SAVE_KEY)!);
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...save, choices: ['nao-existe'] }));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.continuar', { nome: 'Dudu Maestro' }) }));
    expect(screen.getByRole('heading', { level: 1, name: t('ui.saveInvalido.titulo') })).toBeInTheDocument();
  });
});
