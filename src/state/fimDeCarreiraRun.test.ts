import { autoDecide } from '../engine/career';
import { PROPOSAL_EVENT, RETIRE, homeChoice } from '../engine/proposals';
import { createPrng } from '../engine/prng';
import { randomInput } from '../engine/simulation';
import { runUntilDecision } from './careerRun';

// v2.85: as escolhas "Pendurar as chuteiras" e "Voltar para casa" chegam da tela e valem só na janela dos 34 em diante.
function play(seed: number, escolha: (v: { podeParar: boolean; casa?: string }) => string | null) {
  const input = { ...randomInput(createPrng(seed)), heartClub: 'bahia' };
  const choices: string[] = [];
  let parouAos = -1;
  for (let guard = 0; guard < 800; guard++) {
    const step = runUntilDecision(input, seed, choices, 'normal');
    if (step.kind === 'done') return { result: step.result, parouAos };
    const v = step.view;
    const mine = step.eventId === PROPOSAL_EVENT ? escolha({ podeParar: v.state.podeParar === true, ...(v.casa ? { casa: v.casa.clubId } : {}) }) : null;
    if (mine === RETIRE) parouAos = Math.floor(v.age);
    choices.push(mine ?? autoDecide(step.eventId, v.temperament, () => v));
  }
  throw new Error('carreira não terminou');
}

describe('fim de carreira pela tela (v2.85)', () => {
  it('"Pendurar as chuteiras" na primeira janela possível encerra a carreira ali, por decisão', { timeout: 60_000 }, () => {
    const { result, parouAos } = play(2, (v) => (v.podeParar ? RETIRE : null));
    expect(parouAos).toBeGreaterThanOrEqual(34);
    expect(result.retirement).toBe('decisao');
    expect(Math.floor(result.endAge)).toBe(parouAos);
  });

  it('"Voltar para casa" leva ao clube de coração', { timeout: 60_000 }, () => {
    const { result } = play(2, (v) => (v.casa ? homeChoice(v.casa) : null));
    expect(result.farewell).toBe('coracao');
  });

  it('antes dos 34, "pendurar" é escolha inválida', () => {
    const input = randomInput(createPrng(2));
    const choices: string[] = [];
    for (let guard = 0; guard < 200; guard++) {
      const step = runUntilDecision(input, 2, choices, 'normal');
      if (step.kind === 'done') break;
      if (step.eventId === PROPOSAL_EVENT && step.view.state.podeParar !== true) {
        expect(() => runUntilDecision(input, 2, [...choices, RETIRE], 'normal')).toThrow(RangeError);
        return;
      }
      choices.push(autoDecide(step.eventId, step.view.temperament, () => step.view));
    }
    throw new Error('nenhuma janela antes dos 34');
  });
});
