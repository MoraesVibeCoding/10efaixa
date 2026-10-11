import { useEffect, useRef } from 'react';
import previewCfg from '../data/preview.json';

/**
 * v2.88 (pedido do usuário em 2026-10-11): as folhas de resultado (decisão e resposta da reunião) não têm botão "Seguir".
 * Fecham sozinhas em `resultadoMs`; dois toques dentro de `duploToqueMs` passam na hora (um toque só não fecha, para
 * ninguém passar sem ler); pelo teclado, Enter ou Espaço passam (o Esc fica com cada tela). Devolve os manipuladores da folha.
 */
export function useSeguirSozinho(fechar: () => void, ms: number = previewCfg.resultadoMs) {
  const lastTap = useRef(-Infinity);
  useEffect(() => {
    const timer = setTimeout(fechar, ms);
    return () => { clearTimeout(timer); };
  }, [fechar, ms]);
  function onClick(e: React.MouseEvent) {
    if (e.timeStamp - lastTap.current <= previewCfg.duploToqueMs) fechar();
    lastTap.current = e.timeStamp;
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fechar(); }
  }
  return { onClick, onKeyDown };
}

/** O tempo da barra que corre no pé da folha até ela fechar sozinha. */
export const seguirVars = (ms: number = previewCfg.resultadoMs) => ({ '--resultado-ms': `${ms}ms` }) as React.CSSProperties;
export const SEGUIR_VARS = seguirVars();
