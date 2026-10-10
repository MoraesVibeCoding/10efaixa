import { act, renderHook } from '@testing-library/react';
import { MOTION } from './motion';
import { useSaida } from './useSaida';

// v2.72 (web-animation-design): os cards saem em `saidaMs` (mais rápido que a entrada) antes de sumir; sem movimento, somem na hora.
describe('saída dos cards (v2.72)', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
  const motion = (reduce: boolean) => vi.stubGlobal('matchMedia', (q: string) => ({ matches: reduce && q.includes('reduce'), media: q }));

  it('com movimento: marca "saindo" e fecha uma vez só, no fim da saída', () => {
    motion(false);
    const onClose = vi.fn();
    const { result } = renderHook(() => useSaida(onClose));
    act(() => { result.current.fechar(); result.current.fechar(); });
    expect(result.current.saindo).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(MOTION.saidaMs); });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('sem movimento: fecha na hora', () => {
    motion(true);
    const onClose = vi.fn();
    const { result } = renderHook(() => useSaida(onClose));
    act(() => { result.current.fechar(); });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('desmontado no meio da saída, não fecha depois', () => {
    motion(false);
    const onClose = vi.fn();
    const { result, unmount } = renderHook(() => useSaida(onClose));
    act(() => { result.current.fechar(); });
    unmount();
    vi.advanceTimersByTime(MOTION.saidaMs);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('a saída é mais rápida que a entrada (cerca de 20%)', () => {
    expect(MOTION.saidaMs).toBeLessThan(MOTION.transicaoMs);
  });
});

describe('saída sem movimento (v2.72)', () => {
  afterEach(() => { vi.unstubAllGlobals(); });
  it('dois toques fecham uma vez só', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q }));
    const onClose = vi.fn();
    const { result } = renderHook(() => useSaida(onClose));
    act(() => { result.current.fechar(); result.current.fechar(); });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
