import { ATTRIBUTES, type Attributes } from './attributes';
import weights from '../data/positionWeights.json';

// Seção 6.1. Goleiro lê os mesmos atributos com outro sentido (6.3); a tradução mora nos pesos.
export const POSITIONS = ['goleiro', 'zagueiro', 'lateral', 'volante', 'meia', 'ponta', 'atacante'] as const;
export type Position = (typeof POSITIONS)[number];

/** Média ponderada pelos pesos da posição (em dados) + bônus do arquétipo, arredondada para inteiro 1–99. */
export function overall(attrs: Attributes, position: Position, bonus: Partial<Attributes> = {}): number {
  const base: Record<string, number> = weights[position];
  let sum = 0;
  let total = 0;
  for (const a of ATTRIBUTES) {
    const w = base[a]! + (bonus[a] ?? 0);
    sum += attrs[a] * w;
    total += w;
  }
  return Math.round(sum / total);
}
