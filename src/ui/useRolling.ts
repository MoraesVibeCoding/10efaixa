import { useEffect, useState } from 'react';
import { MOTION, reducedMotion, rollAt } from './motion';

/** v2.47: o número mostrado vai de `from` a `to` em `ms` (padrão `MOTION.rolarMs`). Sem `from`, ou sem movimento, já é `to`. */
export function useRolling(to: number, from?: number, ms: number = MOTION.rolarMs): number {
  const animate = from !== undefined && from !== to && !reducedMotion();
  const [shown, setShown] = useState(animate ? from : to);
  useEffect(() => {
    if (!animate) { setShown(to); return undefined; }
    let frame = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      start ??= now;
      const p = (now - start) / ms;
      setShown(rollAt(from, to, p));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate, from, to, ms]);
  return shown;
}
