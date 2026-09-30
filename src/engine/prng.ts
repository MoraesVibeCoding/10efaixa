// Única fonte de aleatoriedade do motor (o gerador nativo do JS é proibido; ver teste de guarda).
// mulberry32: estado de 32 bits, período 2^32 — suficiente para uma carreira.
// Referência: https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
export interface Prng {
  /** Float em [0, 1). */
  next(): number;
  /** Inteiro em [min, max], bordas inclusas. */
  int(min: number, max: number): number;
  /** Estado atual, para save/load. */
  state(): number;
}

export function createPrng(seed: number, state = seed >>> 0): Prng {
  let s = state >>> 0;
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    state: () => s,
  };
}

/** Sorteia uma chave com probabilidade proporcional ao peso. */
export function pickWeighted<K extends string>(rng: Prng, weights: Record<K, number>): K {
  const entries = Object.entries(weights) as [K, number][];
  let roll = rng.next() * entries.reduce((s, [, w]) => s + w, 0);
  for (const [k, w] of entries) if ((roll -= w) < 0) return k;
  return entries.at(-1)![0];
}
