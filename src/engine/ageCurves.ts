import type { Attribute } from './attributes';
import data from '../data/ageCurves.json';

const curves: Record<string, number[][]> = data.curves;

/** Multiplicador de evolução por idade (6.4): >0 cresce, 0 platô, <0 cai. Fora dos pontos, mantém a ponta. */
export function ageCurve(attribute: Attribute, age: number): number {
  const pts = curves[data.attributeCurve[attribute]]!;
  if (age <= pts[0]![0]!) return pts[0]![1]!;
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i] as [number, number];
    if (age <= x1) {
      const [x0, y0] = pts[i - 1] as [number, number];
      return y0 + ((y1 - y0) * (age - x0)) / (x1 - x0);
    }
  }
  return pts.at(-1)![1]!;
}
