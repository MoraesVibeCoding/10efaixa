import { autoDecide, simulateCareer } from '../engine/career';
import { PROPOSAL_EVENT } from '../engine/proposals';
import { createPrng } from '../engine/prng';
import { randomInput } from '../engine/simulation';
import flow from '../data/flow.json';
import { runUntilDecision, type Ritmo } from './careerRun';

// T28b (v2.50): com a configuração real (propostasNaTela desligada, até a tela da T28d), o jogo segue como antes.
describe('proposta de clube desligada em flow.json (T28b)', () => {
  it('a configuração entregue está desligada nos três ritmos', () => {
    expect(flow.propostasNaTela).toEqual({ rapido: false, normal: false, completo: false });
  });

  it('nenhuma tela de proposta chega ao jogador e a carreira é a mesma da simulação automática', { timeout: 60_000 }, () => {
    for (const ritmo of ['rapido', 'normal', 'completo'] as Ritmo[]) {
      const seed = 2;
      const input = randomInput(createPrng(seed));
      const choices: string[] = [];
      for (let guard = 0; guard < 800; guard++) {
        const step = runUntilDecision(input, seed, choices, ritmo);
        if (step.kind === 'done') { expect(JSON.stringify(step.result)).toBe(JSON.stringify(simulateCareer(input, seed))); break; }
        expect(step.eventId).not.toBe(PROPOSAL_EVENT);
        choices.push(autoDecide(step.eventId, step.view.temperament, () => step.view));
      }
    }
  });
});
