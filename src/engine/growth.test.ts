import { heightAt, rollGrowth } from './biotype';
import { createPrng } from './prng';

describe('estirão', () => {
  const rng = createPrng(18);
  const rolls = Array.from({ length: 100_000 }, () => rollGrowth(rng));

  it('variação sempre entre −3 e +10 cm, normal até +6', () => {
    const bad = rolls.filter((g) => g.deltaCm < -3 || g.deltaCm > (g.big ? 10 : 6) || (g.big && g.deltaCm <= 6));
    expect(bad).toEqual([]);
    expect(new Set(rolls.map((g) => g.deltaCm))).toEqual(new Set([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
  });

  it('5% ±0,5% de estirão grande', () => {
    expect(Math.abs(rolls.filter((g) => g.big).length / 100_000 - 0.05)).toBeLessThanOrEqual(0.005);
  });

  it('prevista aos 16, metade aos 17, completa aos 18, e não muda depois', () => {
    const g = { deltaCm: 8, big: true };
    expect(heightAt(180, g, 16)).toBe(180);
    expect(heightAt(180, g, 17)).toBe(184);
    expect(heightAt(180, g, 18)).toBe(188);
    expect(heightAt(180, g, 25)).toBe(188);
    expect(heightAt(180, { deltaCm: -3, big: false }, 30)).toBe(177);
  });
});
