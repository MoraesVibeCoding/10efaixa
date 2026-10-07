import data from '../data/context.json';
import { CONTEXT_TAGS } from './contextTags';

// T25e (SPEC 6.13c): texto em camadas. O evento tem o texto base e, opcionalmente, uma frase de abertura por etiqueta e frases de
// contexto por etiqueta. Compõe: [abertura da etiqueta mais forte que o evento conhece] + base + [até maxContexto frases de contexto,
// por prioridade]. Sem etiqueta que o evento conheça, sai só o base (o evento de antes do T25e não muda).
export interface Layers { texto: string; abertura?: Record<string, string>; contexto?: Record<string, string> }
export const LIMITS = data.texto;
const TAGS = new Set(CONTEXT_TAGS.map((x) => x.id));

/** `tags`: etiquetas que valem agora, da mais forte para a mais fraca. */
export function composeText(l: Layers, tags: readonly string[]): string {
  const open = tags.find((tag) => l.abertura?.[tag]);
  const context = tags.filter((tag) => tag !== open && l.contexto?.[tag]).slice(0, LIMITS.maxContexto);
  return [open ? l.abertura![open]! : null, l.texto, ...context.map((tag) => l.contexto![tag]!)].filter((x): x is string => x !== null).join(' ');
}

/** Maior texto que o evento pode compor: base + a maior abertura + as maiores frases de contexto (com os espaços). */
export function worstCase(l: Layers): number {
  const lens = (r?: Record<string, string>) => Object.values(r ?? {}).map((s) => s.length).sort((a, b) => b - a);
  const open = lens(l.abertura)[0];
  const ctx = lens(l.contexto).slice(0, LIMITS.maxContexto);
  const parts = [l.texto.length, ...(open === undefined ? [] : [open]), ...ctx];
  return parts.reduce((a, b) => a + b, 0) + parts.length - 1;
}

/** Erros das camadas de um evento (vazio = ok): etiqueta que não existe, frase longa demais, aspas retas, texto composto longo demais. */
export function layerErrors(eventId: string, l: Layers): string[] {
  const errors: string[] = [];
  const check = (kind: 'abertura' | 'contexto', max: number) => {
    for (const [tag, text] of Object.entries(l[kind] ?? {})) {
      const at = `${eventId}.${kind}.${tag}`;
      if (!TAGS.has(tag)) errors.push(`${at}: etiqueta inexistente`);
      if (text.length > max) errors.push(`${at}: ${text.length} caracteres (máximo ${max})`);
      if (/["]/.test(text) || /\.\.\./.test(text)) errors.push(`${at}: aspas retas ou reticências`);
    }
  };
  check('abertura', LIMITS.aberturaMax);
  check('contexto', LIMITS.contextoMax);
  if (worstCase(l) > LIMITS.textoMax) errors.push(`${eventId}: texto composto de até ${worstCase(l)} caracteres (máximo ${LIMITS.textoMax})`);
  return errors;
}
