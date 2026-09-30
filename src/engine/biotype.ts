import { ATTRIBUTES, type Attributes } from './attributes';
import type { Position } from './overall';
import type { Prng } from './prng';
import data from '../data/biotype.json';

// Seção 6.17. Só altura e compleição afetam o jogo; aparência nunca entra aqui.
export const BUILDS = ['franzino', 'atletico', 'forte'] as const;
export type Build = (typeof BUILDS)[number];
export interface Biotype { heightCm: number; build: Build }

export function isHeightAllowed(position: Position, heightCm: number): boolean {
  const { min, max } = data.heightRangesCm[position];
  return heightCm >= min && heightCm <= max;
}

/** Ajusta os tetos pela altura (linear a partir da referência) e compleição. Resultado inteiro em 1–99. */
export function applyBiotype(caps: Attributes, { heightCm, build }: Biotype): Attributes {
  const perCm: Partial<Attributes> = data.capPerCmAboveReference;
  const byBuild: Partial<Attributes> = data.buildCapDelta[build];
  const cm = heightCm - data.referenceHeightCm;
  const out = { ...caps };
  for (const a of ATTRIBUTES) {
    const v = caps[a] + (perCm[a] ?? 0) * cm + (byBuild[a] ?? 0);
    out[a] = Math.min(99, Math.max(1, Math.round(v)));
  }
  return out;
}

export interface Growth { deltaCm: number; big: boolean }

/** Variação total da altura até os 18 (6.17), sorteada uma vez na criação. */
export function rollGrowth(rng: Prng): Growth {
  const g = data.growth;
  const big = rng.next() < g.bigChance;
  const [lo, hi] = big ? g.big : g.normal;
  return { deltaCm: rng.int(lo!, hi!), big };
}

/** Altura na idade: prevista aos 16, variação realizada linearmente até os 18. */
export function heightAt(predictedCm: number, growth: Growth, age: number): number {
  const { startAge, endAge } = data.growth;
  const done = Math.min(1, Math.max(0, (age - startAge) / (endAge - startAge)));
  return predictedCm + Math.round(growth.deltaCm * done);
}
