import { autoDecide, simulateCareer, type DecisionView } from './career';
import { overall } from './overall';
import { createPrng } from './prng';
import { randomInput } from './simulation';

// v3.10 (pedido do usuário em 2026-10-15): a proposta de mudança de posição diz qual posição o técnico oferece, com o
// over do jogador em cada uma (o overall pode aparecer em número na tela de decisão, v2.16).
describe('proposta de mudança de posição com a posição oferecida (v3.10)', () => {
  it('a decisão traz de qual posição para qual, e o over em cada uma', { timeout: 120_000 }, () => {
    const seen: DecisionView[] = [];
    for (let seed = 1; seed <= 80 && seen.length < 3; seed++) {
      simulateCareer(randomInput(createPrng(seed)), seed, 2026, (e, t, v) => {
        if (e === 'mudanca-posicao') seen.push(v());
        return autoDecide(e, t, v);
      });
    }
    expect(seen.length).toBeGreaterThan(0);
    for (const v of seen) {
      const o = v.posicaoOferecida!;
      expect(o.de).toBe(v.position);
      expect(o.para).not.toBe(o.de);
      expect(o.overDe).toBe(v.overall);
      expect(o.overPara).toBeGreaterThanOrEqual(1);
      expect(Math.abs(o.overPara - overall(v.attributes, o.para))).toBeLessThanOrEqual(3);
    }
  });
});
