import type { ReactNode } from 'react';

/**
 * v2.77: o trecho entre aspas curvas (“…”) é a voz de alguém dentro da narração (faixa da torcida, frase do empresário);
 * vira `<span class="fala">` (itálico, base.css). O resto do texto fica como está.
 */
export function comFalas(text: string): ReactNode {
  const parts = text.split(/(“[^”]*”)/);
  if (parts.length === 1) return text;
  return parts.map((p, i) => (i % 2 === 1 ? <span key={i} className="fala">{p}</span> : p));
}
