import motion from '../data/motion.json';

// v2.47: números que rolam, transições e carimbos. Os tempos ficam em dados; sem matchMedia (jsdom, SSR) não anima.
export const MOTION = motion;

export function reducedMotion(): boolean {
  if (typeof globalThis.matchMedia !== 'function') return true;
  return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Valor inteiro no ponto `p` (0 a 1) do caminho de `from` a `to`, desacelerando no fim. */
export function rollAt(from: number, to: number, p: number): number {
  const k = Math.min(1, Math.max(0, p));
  const eased = 1 - (1 - k) ** 3;
  return k >= 1 ? to : Math.round(from + (to - from) * eased);
}
