import { fireEvent, render, screen, within } from '@testing-library/react';
import { App } from './App';
import { SAVE_KEY } from './state/save';
import { dailySeed } from './engine/daily';
import { autoDecide } from './engine/career';
import { MEETING_EVENT } from './engine/meeting';
import { runUntilDecision } from './state/careerRun';
import { careerLinkFragment } from './share/careerLink';
import { VISUAIS } from './ui/screens/look';
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
    const resposta = document.querySelector('.reuniao__resposta');
    if (resposta) { fireEvent.click(resposta.querySelector('button')!); continue; }
    if (screen.queryByRole('heading', { level: 1, name: t('ui.reuniao.titulo') })) { fireEvent.click(screen.getAllByRole('radio')[0]!); fireEvent.click(screen.getByRole('button', { name: t('ui.reuniao.propor') })); continue; }
    // T28k: tela de contratos (primeiro cartão: fica ou renova; sem clube, aceita a primeira)
    if (screen.queryByRole('heading', { level: 1, name: t('ui.proposta.titulo') })) { fireEvent.click(screen.getAllByRole('radio')[0]!); fireEvent.click(screen.getByRole('button', { name: t('ui.proposta.confirmar') })); continue; }
    return;
  }
}

function createPlayer(begin = true) {
  if (begin) startNew();
  fireEvent.change(screen.getByLabelText(t('ui.criacao.quemE.nome')), { target: { value: 'Dudu Maestro' } });
  fireEvent.change(screen.getByLabelText(t('ui.criacao.quemE.estado')), { target: { value: 'BA' } });
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
    // sem "Confirmar escolha" (pedido do usuário): no Normal, a dica de tocar numa opção
    expect(screen.getByText(t('ui.decisao.marque'))).toBeInTheDocument();
  });

  it('o ritmo escolhido chega à decisão: no Rápido não há "Confirmar escolha" (um toque decide)', () => {
    render(<App seed={11} />);
    createPlayer();
    fireEvent.click(screen.getByRole('button', { name: t('ui.revelacao.seguir') }));
    fireEvent.click(screen.getByRole('radio', { name: t('ui.ritmo.rapido.nome') }));
    fireEvent.click(screen.getByRole('button', { name: t('ui.ritmo.comecar') }));
    expect(screen.queryByText(t('ui.decisao.marque'))).not.toBeInTheDocument();
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
    // pedido do usuário (sem "Confirmar escolha"): tocar de novo na marcada decide na hora
    fireEvent.click(document.querySelector('.opcao')!);
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

// T57c (SPEC 6.15, v2.49): o desafio do dia usa a semente da data de Brasília; a carreira livre segue como antes.
describe('App: desafio do dia (T57c)', () => {
  const NOW = () => new Date('2026-10-07T12:00:00Z');
  const startDesafio = () => fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.desafio', { data: '07/10' }) }));

  it('a carreira do desafio usa a semente do dia, igual para qualquer pessoa, mesmo com outra semente injetada', () => {
    render(<App seed={11} now={NOW} storage={localStorage} />);
    startDesafio();
    createPlayer(false);
    expect(revealCalls.at(-1)!.seed).toBe(dailySeed('2026-10-07'));
  });

  it('a carreira livre não usa a semente do dia', () => {
    render(<App seed={11} now={NOW} />);
    createPlayer();
    expect(revealCalls.at(-1)!.seed).toBe(11);
  });

  it('salva o dia do desafio no save, e "Continuar" mantém o desafio', () => {
    const first = render(<App now={NOW} />);
    startDesafio();
    createPlayer(false);
    fireEvent.click(screen.getByRole('button', { name: t('ui.revelacao.seguir') }));
    fireEvent.click(screen.getByRole('button', { name: t('ui.ritmo.comecar') }));
    expect(JSON.parse(localStorage.getItem(SAVE_KEY)!)).toMatchObject({ seed: dailySeed('2026-10-07'), desafio: '2026-10-07' });
    first.unmount();
    render(<App now={() => new Date('2026-10-09T12:00:00Z')} />);
    fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.continuar', { nome: 'Dudu Maestro' }) }));
    passMeetings();
    // continuar não troca a semente nem o desafio pelo dia de hoje
    expect(JSON.parse(localStorage.getItem(SAVE_KEY)!)).toMatchObject({ seed: dailySeed('2026-10-07'), desafio: '2026-10-07' });
  });
});

// T57d (SPEC 6.15, v2.49): abrir um link "#c=..." revê a carreira, só leitura, sem tocar no save.
describe('App: rever carreira por link (T57d)', () => {
  const linkInput = {
    shirtNumber: 11, state: 'BA', position: 'meia' as const, archetypeId: 'classico10',
    biotype: { heightCm: 176, build: 'atletico' as const }, temperament: 'resenha', celebration: 'aviaozinho',
    origin: 'baseGrande', foot: 'direita', heartClub: 'bahia',
  };
  function linkHash(extra: { desafio?: string } = {}): { hash: string; seed: number } {
    const seed = 7; const choices: string[] = [];
    for (let guard = 0; guard < 500; guard++) {
      const step = runUntilDecision({ ...linkInput, name: 'Original Secreto' }, seed, choices, 'completo');
      if (step.kind === 'done') break;
      choices.push(step.eventId === MEETING_EVENT ? String(step.view.state.sugestao) : autoDecide(step.eventId, step.view.temperament, () => step.view));
    }
    return { hash: careerLinkFragment({ seed, ritmo: 'completo', input: linkInput, visual: VISUAIS[0]!.id, choices, codigo: '10F-7K3Q-9M2X', ...extra }), seed };
  }

  it('link válido abre o cartão com o aviso de só leitura e o nome genérico; não grava save', () => {
    const { hash } = linkHash();
    render(<App hash={hash} />);
    expect(screen.getByRole('heading', { level: 1, name: t('ui.cartao.titulo') })).toBeInTheDocument();
    expect(screen.getByText(t('ui.rever.aviso'))).toBeInTheDocument();
    // v2.81: o card de fim de carreira (HTML) mostra o nome; a imagem do Canvas fica fora da vista
    expect(document.querySelector('.fim__quem')).toHaveTextContent(t('ui.rever.nomeGenerico'));
    expect(localStorage.getItem(SAVE_KEY)).toBeNull();
  });

  it('link com o selo do desafio mostra o selo', () => {
    render(<App hash={linkHash({ desafio: '2026-10-07' }).hash} />);
    expect(screen.getByText('Desafio de 07/10')).toBeInTheDocument();
  });

  it('link inválido mostra o aviso e "Voltar ao início" leva à abertura', () => {
    render(<App hash="#c=lixo" />);
    expect(screen.getByRole('heading', { level: 1, name: t('ui.linkInvalido.titulo') })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: t('ui.linkInvalido.voltar') }));
    expect(screen.getByRole('heading', { level: 1, name: t('ui.abertura.titulo') })).toBeInTheDocument();
  });

  it('link com escolhas que não fecham a carreira também é inválido', () => {
    const bad = careerLinkFragment({ seed: 7, ritmo: 'completo', input: linkInput, visual: VISUAIS[0]!.id, choices: [], codigo: '10F-7K3Q-9M2X' });
    render(<App hash={bad} />);
    expect(screen.getByRole('heading', { level: 1, name: t('ui.linkInvalido.titulo') })).toBeInTheDocument();
  });

  it('"Jogar este desafio" começa a criação com a semente do link', () => {
    const { hash, seed } = linkHash();
    render(<App hash={hash} />);
    fireEvent.click(screen.getByRole('button', { name: t('ui.rever.jogar') }));
    createPlayer(false);
    expect(revealCalls.at(-1)!.seed).toBe(seed);
  });

  it('com carreira salva, "Jogar este desafio" pergunta; cancelar mantém o save', () => {
    localStorage.setItem(SAVE_KEY, '{"qualquer":"coisa"}');
    render(<App hash={linkHash().hash} />);
    fireEvent.click(screen.getByRole('button', { name: t('ui.rever.jogar') }));
    fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.confirmar.cancelar') }));
    expect(localStorage.getItem(SAVE_KEY)).toBe('{"qualquer":"coisa"}');
    expect(screen.getByRole('heading', { level: 1, name: t('ui.cartao.titulo') })).toBeInTheDocument();
  });

  it('sem link, o app abre na abertura como sempre', () => {
    render(<App hash="" />);
    expect(screen.getByRole('heading', { level: 1, name: t('ui.abertura.titulo') })).toBeInTheDocument();
  });
});

describe('App: reiniciar a carreira em qualquer tela (v2.56)', () => {
  beforeEach(() => { localStorage.clear(); });
  const reiniciar = () => screen.getByRole('button', { name: t('ui.reiniciar.botao') });
  const toRitmo = () => { fireEvent.click(screen.getByRole('button', { name: t('ui.revelacao.seguir') })); };

  it('a abertura e a criação não têm o botão (v2.69: ainda não há carreira; a criação tem o próprio Voltar); revelação, ritmo e carreira têm', () => {
    render(<App seed={11} />);
    expect(screen.queryByRole('button', { name: t('ui.reiniciar.botao') })).toBeNull();
    startNew();
    expect(screen.queryByRole('button', { name: t('ui.reiniciar.botao') })).toBeNull();
    createPlayer(false);
    expect(reiniciar()).toBeInTheDocument(); // revelação
    toRitmo();
    expect(reiniciar()).toBeInTheDocument(); // ritmo
    fireEvent.click(screen.getByRole('button', { name: t('ui.ritmo.comecar') }));
    passMeetings();
    expect(reiniciar()).toBeInTheDocument(); // decisão
  });

  it('com o aviso aberto, o resto da tela fica inerte; "Continuar jogando" mantém a carreira', () => {
    render(<App seed={11} />);
    createPlayer();
    toRitmo();
    fireEvent.click(screen.getByRole('button', { name: t('ui.ritmo.comecar') }));
    passMeetings();
    const eventId = document.querySelector('main[data-evento]')!.getAttribute('data-evento');
    fireEvent.click(reiniciar());
    expect(document.querySelector('main[data-evento]')!.closest('[inert]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: t('ui.reiniciar.cancelar') }));
    expect(document.querySelector('main[data-evento]')!.closest('[inert]')).toBeNull();
    expect(document.querySelector('main[data-evento]')!.getAttribute('data-evento')).toBe(eventId);
    expect(localStorage.getItem(SAVE_KEY)).not.toBeNull();
  });

  it('"Reiniciar" apaga o save e volta à abertura, sem a carreira para continuar', () => {
    render(<App seed={11} />);
    createPlayer();
    toRitmo();
    fireEvent.click(screen.getByRole('button', { name: t('ui.ritmo.comecar') }));
    passMeetings();
    expect(localStorage.getItem(SAVE_KEY)).not.toBeNull();
    fireEvent.click(reiniciar());
    fireEvent.click(screen.getByRole('button', { name: t('ui.reiniciar.confirmar') }));
    expect(localStorage.getItem(SAVE_KEY)).toBeNull();
    expect(screen.getByRole('button', { name: t('ui.abertura.novaCarreira') })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: t('ui.reiniciar.botao') })).toBeNull();
  });

  it('na criação, o "Voltar" do primeiro passo volta à abertura (v2.69: o Reiniciar saiu da criação)', () => {
    render(<App seed={11} />);
    startNew();
    fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.voltar') }));
    expect(screen.getByRole('button', { name: t('ui.abertura.novaCarreira') })).toBeInTheDocument();
  });
});
