import { useEffect, useRef, useState } from 'react';
import { MOTION, reducedMotion } from './motion';

/**
 * v2.72 (web-animation-design): o card sai em `MOTION.saidaMs` antes de sumir (a saída é mais rápida que a entrada).
 * `saindo` liga a animação de saída no CSS; `fechar` pode ser chamado várias vezes e fecha uma só. Sem movimento, fecha na hora.
 */
export function useSaida(onClose: () => void): { saindo: boolean; fechar: () => void } {
  const [saindo, setSaindo] = useState(false);
  const cb = useRef(onClose);
  cb.current = onClose;
  const feito = useRef(false);
  const timer = useRef(0 as ReturnType<typeof setTimeout> | 0);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const [fechar] = useState(() => () => {
    if (feito.current) return;
    feito.current = true;
    if (reducedMotion()) { cb.current(); return; }
    setSaindo(true);
    timer.current = setTimeout(() => { cb.current(); }, MOTION.saidaMs);
  });
  return { saindo, fechar };
}
