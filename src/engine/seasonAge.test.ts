import { simulateCareer } from './career';
import { createPrng } from './prng';
import { randomInput } from './simulation';

// T55f (SPEC 6.15, v2.51): cada temporada do resultado traz a idade, para a linha do tempo "Sua carreira".
describe('idade em cada temporada (T55f)', () => {
  const results = [1, 2, 3, 4, 5, 6].map((seed) => simulateCareer(randomInput(createPrng(seed)), seed));

  it('começa aos 16 e sobe um ano por temporada, sem buraco', () => {
    for (const r of results) {
      expect(r.seasons[0]!.age).toBe(16);
      r.seasons.forEach((s, i) => { expect(s.age).toBe(16 + i); });
    }
  });

  it('a última temporada é a idade final menos um (a idade final já é a do ano seguinte)', () => {
    for (const r of results) expect(r.seasons.at(-1)!.age).toBe(r.endAge - 1);
  });

  it('a temporada de maior Over cai perto da idade do auge', () => {
    for (const r of results) {
      const best = r.seasons.reduce((a, b) => (b.overall > a.overall ? b : a));
      expect(Math.abs(best.age - r.peakAge)).toBeLessThanOrEqual(1);
    }
  });
});
