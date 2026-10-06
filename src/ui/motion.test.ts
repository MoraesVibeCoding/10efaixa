import { afterEach, describe, expect, it, vi } from 'vitest';
import { MOTION, reducedMotion, rollAt } from './motion';

describe('motion (v2.47)', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('rola do valor antigo ao novo, inteiro, e termina exato', () => {
    expect(rollAt(70, 74, 0)).toBe(70);
    expect(rollAt(70, 74, 1)).toBe(74);
    const meio = rollAt(70, 74, 0.5);
    expect(meio).toBeGreaterThan(70);
    expect(meio).toBeLessThanOrEqual(74);
    expect(Number.isInteger(meio)).toBe(true);
    expect(rollAt(74, 70, 1)).toBe(70);
    expect(rollAt(5, 9, 2)).toBe(9);
  });

  it('sem matchMedia (jsdom) ou com "reduce", não anima', () => {
    expect(reducedMotion()).toBe(true);
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q }));
    expect(reducedMotion()).toBe(true);
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q }));
    expect(reducedMotion()).toBe(false);
  });

  it('tempos vêm dos dados', () => {
    expect(MOTION.transicaoMs).toBe(300);
    expect(MOTION.rolarMs).toBeGreaterThan(0);
    expect(MOTION.carimboMs).toBeGreaterThan(MOTION.transicaoMs);
  });
});
