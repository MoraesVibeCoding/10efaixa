import { autoDecide, simulateCareer, type Decider } from './career';
import { leagueOf, marketValue } from './market';
import { createPrng } from './prng';
import { randomInput } from './simulation';
import market from '../data/market.json';

// v3.07 ligado (DE ACORDO do usuário em 2026-10-15): o valor mostrado na decisão passa pela liga, crescimento e clube,
// com o teto da curva sobre o valor final.
vi.mock('../data/motor.json', async (o) => {
  const r = await o<{ default: Record<string, unknown> }>();
  return { default: { ...r.default, ligado: true } };
});

describe('valor de mercado na carreira com o motor (v3.07)', () => {
  it('em liga de nível 1 o valor da tela fica acima do valor base, e nunca passa do teto', { timeout: 120_000 }, () => {
    let tier1 = 0;
    for (let seed = 1; seed <= 12; seed++) {
      const spy: Decider = (e, t, v) => {
        const x = v();
        expect(x.marketValueEUR).toBeLessThanOrEqual(market.curva.tetoEUR);
        const l = x.clubId ? leagueOf(x.clubId) : '';
        if (l === 'ENG' || l === 'ESP') {
          tier1++;
          expect(x.marketValueEUR).toBeGreaterThanOrEqual(Math.min(market.curva.tetoEUR, marketValue(x.overall, x.age) * 1.5));
        }
        return autoDecide(e, t, v);
      };
      simulateCareer(randomInput(createPrng(seed)), seed, 2026, spy);
    }
    expect(tier1).toBeGreaterThan(0);
  });
});
