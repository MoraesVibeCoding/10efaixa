import { autoDecide } from '../engine/career';
import { PROPOSAL_EVENT, RAISE, RENEW, STAY, parseProposalChoice } from '../engine/proposals';
import { createPrng } from '../engine/prng';
import { randomInput } from '../engine/simulation';
import { runUntilDecision, type Ritmo } from './careerRun';

// T28j (SPEC v2.54): a renovação é o primeiro cartão da tela de propostas quando o contrato está no fim.
vi.mock('../data/flow.json', async (original) => {
  const real = await original<{ default: Record<string, unknown> }>();
  return { default: { ...real.default, propostasNaTela: { rapido: true, normal: true, completo: true } } };
});

/** Joga o automático e devolve a primeira tela de proposta que pede ou não renovação. */
function firstScreen(seed: number, ritmo: Ritmo, due: boolean) {
  const input = randomInput(createPrng(seed));
  const choices: string[] = [];
  for (let guard = 0; guard < 800; guard++) {
    const step = runUntilDecision(input, seed, choices, ritmo);
    if (step.kind === 'done') return null;
    if (step.eventId === PROPOSAL_EVENT && (step.view.state.podeRenovar === true) === due) return { input, choices: [...choices], view: step.view };
    choices.push(autoDecide(step.eventId, step.view.temperament, () => step.view));
  }
  return null;
}
const find = (due: boolean) => {
  for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) { const s = firstScreen(seed, 'normal', due); if (s) return { seed, ...s }; }
  throw new Error('nenhuma tela encontrada');
};

describe('renovação como primeiro cartão (T28j)', () => {
  it('parser: renovar e aumento só valem quando a renovação está disponível', () => {
    const shown = [{ clubId: 'sport' }];
    expect(parseProposalChoice(RENEW, shown, true)).toBeNull();
    expect(parseProposalChoice(RAISE, shown, true)).toBeNull();
    expect(parseProposalChoice(RENEW, shown, true, () => false, false, true)).toEqual({ kind: 'renovar' });
    expect(parseProposalChoice(RAISE, shown, true, () => false, false, true)).toEqual({ kind: 'aumento' });
  });

  it('com contrato no fim, a tela traz o cartão do clube atual com renovação e pedido de aumento', { timeout: 120_000 }, () => {
    const { view } = find(true);
    expect(view.atual?.renovacao?.salarioMensal).toBeGreaterThan(0);
    expect(view.atual?.aumento?.salarioMensal).toBeGreaterThanOrEqual(view.atual!.renovacao!.salarioMensal);
    expect(view.atual?.anosRestantes).toBeLessThanOrEqual(1);
  });

  it('com contrato longo, a tela traz o clube atual sem renovação', { timeout: 120_000 }, () => {
    const { view } = find(false);
    expect(view.atual).toBeDefined();
    expect(view.atual?.renovacao).toBeNull();
  });

  it('o motor aceita renovar e pedir aumento na tela em que há renovação, e recusa onde não há', { timeout: 120_000 }, () => {
    const due = find(true);
    for (const choice of [RENEW, RAISE, STAY]) {
      expect(() => runUntilDecision(due.input, due.seed, [...due.choices, choice], 'normal')).not.toThrow();
    }
    const longo = find(false);
    expect(() => runUntilDecision(longo.input, longo.seed, [...longo.choices, RENEW], 'normal')).toThrow(/escolha inválida/);
  });

  it('com renovação na tela, o evento renovacao não aparece de novo depois dela', { timeout: 120_000 }, () => {
    const due = find(true);
    const next = runUntilDecision(due.input, due.seed, [...due.choices, RENEW], 'normal');
    expect(next.kind === 'decision' && next.eventId === 'renovacao').toBe(false);
  });
});
