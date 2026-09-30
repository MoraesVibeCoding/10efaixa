import { createPrng } from './prng';

const take = (seed: number, n: number) => {
  const rng = createPrng(seed);
  return Array.from({ length: n }, () => rng.next());
};

describe('PRNG com semente', () => {
  it('mesma semente gera a mesma sequência', () => {
    expect(take(42, 100)).toEqual(take(42, 100));
  });

  it('sementes diferentes divergem', () => {
    expect(take(1, 10)).not.toEqual(take(2, 10));
  });

  it('next() fica em [0, 1)', () => {
    for (const x of take(7, 10_000)) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });

  it('distribuição uniforme: 10 baldes com ±5% da média em 100 mil sorteios', () => {
    const buckets = new Array<number>(10).fill(0);
    for (const x of take(123, 100_000)) buckets[Math.floor(x * 10)]!++;
    for (const count of buckets) expect(Math.abs(count - 10_000)).toBeLessThan(500);
  });

  it('int(min, max) inclui as duas bordas e nada fora delas', () => {
    const rng = createPrng(9);
    const seen = new Set<number>();
    for (let i = 0; i < 1_000; i++) seen.add(rng.int(-3, 6));
    expect([...seen].sort((a, b) => a - b)).toEqual([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6]);
  });

  it('estado salvo retoma exatamente a mesma sequência', () => {
    const rng = createPrng(2026);
    rng.next();
    const resumed = createPrng(0, rng.state());
    expect([rng.next(), rng.next()]).toEqual([resumed.next(), resumed.next()]);
  });
});
