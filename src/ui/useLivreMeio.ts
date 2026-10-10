import { useLayoutEffect, useState } from 'react';

// v2.70 (enquadramento): o meio do espaço livre entre a caixa do topo e o painel de baixo, medido na tela, para a cena
// encaixar o ponto focal ali. Sem ResizeObserver (navegador antigo, jsdom), devolve undefined e a cena fica como antes.
/** `meio`: onde o ponto focal deve cair; `topo`: o fim da caixa do topo (a pintura pode descer até ali). */
export interface Livre { meio: number; topo: number }

export function useLivreMeio(root: React.RefObject<HTMLElement | null>, topo: string, painel: string): Livre | undefined {
  const [meio, setMeio] = useState(undefined as Livre | undefined);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const a = el.querySelector(topo);
    const b = el.querySelector(painel);
    if (!a || !b) return undefined;
    const medir = () => {
      const fim = a.getBoundingClientRect().bottom;
      const inicio = b.getBoundingClientRect().top;
      setMeio({ meio: Math.round((fim + Math.max(fim, inicio)) / 2), topo: Math.round(fim) });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(a); ro.observe(b);
    window.addEventListener('resize', medir);
    return () => { ro.disconnect(); window.removeEventListener('resize', medir); };
  }, [root, topo, painel]);
  return meio;
}
