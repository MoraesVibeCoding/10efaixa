import { autoDecide } from '../engine/career';
import { PROPOSAL_EVENT } from '../engine/proposals';
import { createPrng } from '../engine/prng';
import { randomInput } from '../engine/simulation';
import flow from '../data/flow.json';
import { runUntilDecision, type Ritmo } from './careerRun';

// T28d (v2.50): a configuração entregue liga a proposta na tela nos três ritmos (flow.json), e o jogo passa por ela.
describe('proposta de clube ligada em flow.json (T28d)', () => {
  it('a configuração entregue está ligada nos três ritmos', () => {
    expect(flow.propostasNaTela).toEqual({ rapido: true, normal: true, completo: true });
  });

  it('com a configuração real, a tela de proposta chega ao jogador em todos os ritmos', { timeout: 60_000 }, () => {
    for (const ritmo of ['rapido', 'normal', 'completo'] as Ritmo[]) {
      const seed = 2;
      const input = randomInput(createPrng(seed));
      const choices: string[] = [];
      let proposals = 0;
      for (let guard = 0; guard < 800; guard++) {
        const step = runUntilDecision(input, seed, choices, ritmo);
        if (step.kind === 'done') break;
        if (step.eventId === PROPOSAL_EVENT) proposals++;
        choices.push(autoDecide(step.eventId, step.view.temperament, () => step.view));
      }
      expect(proposals, ritmo).toBeGreaterThan(0);
    }
  });
});
