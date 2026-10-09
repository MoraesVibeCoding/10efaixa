import { act, fireEvent, render, screen } from '@testing-library/react';
import type { CreationInput } from '../../engine/player';
import { runUntilDecision, type Ritmo } from '../../state/careerRun';
import { autoDecide } from '../../engine/career';
import { autoChoice } from '../../engine/events';
import { t } from '../../i18n';
import { careerCode } from '../../engine/careerCode';
import { parseCareerLink } from '../../share/careerLink';
import { reviewLink } from '../../share/reviewLink';
import { Career } from './Career';
import { VISUAIS } from './look';

// T51 (b): a carreira jogada na tela, do primeiro momento ao resumo final.
const INPUT: CreationInput = {
  name: 'Dudu Maestro', shirtNumber: 11, state: 'BA', position: 'meia', archetypeId: 'classico10',
  biotype: { heightCm: 176, build: 'atletico' }, temperament: 'resenha', celebration: 'aviaozinho',
  origin: 'baseGrande', foot: 'direita', heartClub: 'bahia',
};
const LOOK = { skin: 't6', hairStyle: 'curto', hairColor: 'preto', beard: null, headband: null, boots: 'preta' };


/** T28d: a tela de propostas, se for a da vez: fica no clube (ou, sem clube, aceita a primeira proposta). */
function passProposals(): boolean {
  // v2.64: o empréstimo usa a mesma tela (o primeiro cartão é o clube atual: ficar)
  if (!screen.queryByRole('heading', { level: 1, name: t('ui.proposta.titulo') }) && !screen.queryByRole('heading', { level: 1, name: t('ui.emprestimo.titulo') })) return false;
  // o primeiro cartão é o clube atual (ficar ou renovar); sem clube, é a primeira proposta (aceitar)
  fireEvent.click(screen.getAllByRole('radio', { name: /./ })[0]!);
  fireEvent.click(screen.getByRole('button', { name: t('ui.proposta.confirmar') }));
  return true;
}

describe('carreira na tela (T51b)', () => {
  it('mostra a primeira decisão com o jogador de verdade', () => {
    // no Rápido não há reunião na tela: a primeira tela é uma decisão
    render(<Career input={INPUT} look={LOOK} seed={11} ritmo="rapido" onRestart={() => {}} />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Dudu Maestro', { selector: '.figurinha__tarja-nome' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: t('ui.decisao.ficha') })).toBeInTheDocument();
  });

  it('jogando com as escolhas do temperamento, termina no mesmo resumo que a simulação', { timeout: 60_000 }, async () => {
    const onRestart = vi.fn();
    const onProgress = vi.fn();
    render(<Career input={INPUT} look={LOOK} visual={VISUAIS[0]!.id} seed={11} onRestart={onRestart} onProgress={onProgress} />);
    for (let guard = 0; guard < 400 && !screen.queryByRole('heading', { level: 1, name: t('ui.linhaDoTempo.titulo') }); guard++) {
      // T52: resposta da comissão por cima da tela; reunião aceita a sugestão do preparador (o mesmo do automático)
      const resposta = document.querySelector('.reuniao__resposta');
      if (resposta) { fireEvent.click(resposta.querySelector('button')!); continue; }
      if (screen.queryByRole('heading', { level: 1, name: t('ui.reuniao.titulo') })) { fireEvent.click(screen.getAllByRole('radio')[0]!); fireEvent.click(screen.getByRole('button', { name: t('ui.reuniao.propor') })); continue; }
      if (passProposals()) continue;
      const eventId = document.querySelector('[data-evento]')!.getAttribute('data-evento')!;
      const choice = autoChoice(eventId, document.querySelector('[data-temperamento]')!.getAttribute('data-temperamento')!);
      fireEvent.click(document.querySelector(`[data-opcao-id="${choice}"]`)!);
      fireEvent.click(screen.getByRole('button', { name: t('ui.decisao.confirmar') }));
      fireEvent.click(screen.getByRole('button', { name: t('ui.resultado.seguir') }));
    }
    // T55b: "Sua história" antes do resumo
    fireEvent.click(screen.getByRole('button', { name: t('ui.linhaDoTempo.verCartao') }));
    // com propostas na tela o jogador pode escolher diferente do automático: a conta é a carreira refeita com as escolhas dele
    const played = runUntilDecision(INPUT, 11, onProgress.mock.calls.at(-1)![0] as string[], 'normal');
    if (played.kind !== 'done') throw new Error('a carreira devia ter terminado');
    const result = played.result;
    // T55d: o cartão (canvas) com o texto alternativo da versão narrativa, que abre primeiro
    expect(screen.getByRole('heading', { level: 1, name: t('ui.cartao.titulo') })).toBeInTheDocument();
    const card = screen.getByRole('img', { name: /Cartão de carreira/ });
    expect(card.getAttribute('aria-label')).toContain(t(`legacy.veredito.${result.legacy.verdict}`));
    expect(card.getAttribute('aria-label')).toContain(result.headline);
    fireEvent.click(screen.getByRole('button', { name: t('ui.cartao.estatistica') }));
    expect(screen.getByRole('button', { name: t('ui.cartao.estatistica') })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('img', { name: /em números/ })).toBeInTheDocument();
    // T57e: o link copiado refaz esta mesma carreira (sem o nome) e o código é o do cartão
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copiar link' })); });
    const copied = String(writeText.mock.calls[0]![0]);
    const parsed = parseCareerLink(copied.slice(copied.indexOf('#')));
    expect(parsed.ok && parsed.data.seed).toBe(11);
    expect(copied).not.toContain(INPUT.name);
    if (parsed.ok) {
      expect(parsed.data.codigo).toBe(careerCode({ seed: 11, ritmo: 'normal', input: INPUT, choices: parsed.data.choices }));
      expect(reviewLink(parsed.data, 'Jogador do link').ok).toBe(true);
    }
    fireEvent.click(screen.getByRole('button', { name: t('ui.fim.novaCarreira') }));
    expect(onRestart).toHaveBeenCalledOnce();
    // T54: salvou ao começar e a cada decisão; no fim avisa que terminou (o App apaga o save)
    expect(onProgress.mock.calls[0]).toEqual([[], false]);
    expect(onProgress.mock.calls.some((c) => (c[0] as string[]).some((x) => x.includes('|')))).toBe(true); // houve reunião
    expect(onProgress.mock.calls.at(-1)![1]).toBe(true);
    expect(onProgress.mock.calls.filter((c) => !c[1]).length).toBe(onProgress.mock.calls.at(-1)![0].length);
  });

  it('no Normal, a reunião do meio do ano abre com a sugestão; depois de propor, vem a resposta da comissão por cima da tela', () => {
    render(<Career input={INPUT} look={LOOK} seed={11} ritmo="normal" onRestart={() => {}} />);
    for (let guard = 0; guard < 60 && !screen.queryByRole('heading', { level: 1, name: t('ui.reuniao.titulo') }); guard++) {
      if (passProposals()) continue;
      const eventId = document.querySelector('[data-evento]')!.getAttribute('data-evento')!;
      fireEvent.click(document.querySelector(`[data-opcao-id="${autoChoice(eventId, document.querySelector('[data-temperamento]')!.getAttribute('data-temperamento')!)}"]`)!);
      fireEvent.click(screen.getByRole('button', { name: t('ui.decisao.confirmar') }));
      fireEvent.click(screen.getByRole('button', { name: t('ui.resultado.seguir') }));
    }
    expect(screen.getByRole('heading', { level: 1, name: t('ui.reuniao.titulo') })).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('radio')[0]!); fireEvent.click(screen.getByRole('button', { name: t('ui.reuniao.propor') }));
    const dialog = document.querySelector('.reuniao__resposta') as HTMLElement;
    expect(dialog).not.toBeNull();
    expect(dialog.querySelector('h2')!.textContent).toMatch(new RegExp([t('ui.reuniao.resposta.aceita.titulo'), t('ui.reuniao.resposta.contrapropoe.titulo'), t('ui.reuniao.resposta.recusa.titulo')].join('|')));
    fireEvent.click(dialog.querySelector('button')!);
    expect(document.querySelector('.reuniao__resposta')).toBeNull();
  });

  it('a linha "Neste semestre" aparece só na primeira decisão depois de cada semestre (T51b)', { timeout: 60_000 }, () => {
    render(<Career input={INPUT} look={LOOK} seed={11} ritmo="completo" onRestart={() => {}} />);
    const seen = new Set<string>();
    let shownCount = 0;
    for (let guard = 0; guard < 120 && !screen.queryByRole('heading', { level: 1, name: t('ui.fim.titulo') }); guard++) {
      const resposta = document.querySelector('.reuniao__resposta');
      if (resposta) { fireEvent.click(resposta.querySelector('button')!); continue; }
      if (screen.queryByRole('heading', { level: 1, name: t('ui.reuniao.titulo') })) { fireEvent.click(screen.getAllByRole('radio')[0]!); fireEvent.click(screen.getByRole('button', { name: t('ui.reuniao.propor') })); continue; }
      if (passProposals()) continue;
      const key = document.querySelector('.carreira')!.getAttribute('data-semestre') ?? '';
      const line = document.querySelector('.decisao__semestre');
      if (seen.has(key)) expect(line, `repetiu ${key}`).toBeNull();
      if (line) shownCount++;
      seen.add(key);
      const eventId = document.querySelector('[data-evento]')!.getAttribute('data-evento')!;
      fireEvent.click(document.querySelector(`[data-opcao-id="${autoChoice(eventId, document.querySelector('[data-temperamento]')!.getAttribute('data-temperamento')!)}"]`)!);
      fireEvent.click(screen.getByRole('button', { name: t('ui.decisao.confirmar') }));
      fireEvent.click(screen.getByRole('button', { name: t('ui.resultado.seguir') }));
    }
    expect(shownCount).toBeGreaterThan(3);
  });
});

/** v2.61: as escolhas automáticas até a primeira tela que já traz o resumo de uma temporada fechada. */
function choicesToFirstSummary(seed: number, ritmo: Ritmo): string[] {
  const choices: string[] = [];
  for (let guard = 0; guard < 400; guard++) {
    const step = runUntilDecision(INPUT, seed, choices, ritmo);
    if (step.kind === 'done') throw new Error('a carreira acabou sem resumo de temporada');
    if (step.view.ultimaTemporada) return choices;
    choices.push(autoDecide(step.eventId, step.view.temperament, () => step.view));
  }
  throw new Error('sem resumo de temporada');
}

describe('resumo da temporada na tela (v2.61)', () => {
  it('no Normal, o card do resumo abre por cima da primeira tela depois do fim da temporada; Continuar fecha e ele não volta no mesmo ano', { timeout: 60_000 }, () => {
    const choices = choicesToFirstSummary(11, 'normal');
    render(<Career input={INPUT} look={LOOK} seed={11} ritmo="normal" initialChoices={choices} onRestart={() => {}} />);
    const card = screen.getByRole('alertdialog', { name: t('ui.resumoTemporada.titulo') });
    expect(card).toBeInTheDocument();
    expect(screen.getByRole('button', { name: t('ui.resumoTemporada.continuar') })).toHaveFocus();
    // com o card aberto, a tela de baixo fica inerte (o leitor de tela não navega por trás do card)
    const h1 = document.querySelector('h1')!;
    expect(h1.closest('[inert]')).not.toBeNull();
    expect(card.closest('[inert]')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: t('ui.resumoTemporada.continuar') }));
    expect(screen.queryByRole('alertdialog', { name: t('ui.resumoTemporada.titulo') })).toBeNull();
    expect(document.querySelector('h1')!.closest('[inert]')).toBeNull();
    expect(document.querySelector('h1')).toHaveFocus();
  });

  it('no Completo também; no Rápido nunca', { timeout: 60_000 }, () => {
    const completo = choicesToFirstSummary(11, 'completo');
    const { unmount } = render(<Career input={INPUT} look={LOOK} seed={11} ritmo="completo" initialChoices={completo} onRestart={() => {}} />);
    expect(screen.getByRole('alertdialog', { name: t('ui.resumoTemporada.titulo') })).toBeInTheDocument();
    unmount();
    const rapido = choicesToFirstSummary(11, 'rapido');
    render(<Career input={INPUT} look={LOOK} seed={11} ritmo="rapido" initialChoices={rapido} onRestart={() => {}} />);
    expect(screen.queryByRole('alertdialog', { name: t('ui.resumoTemporada.titulo') })).toBeNull();
  });
});
