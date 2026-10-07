import data from '../data/memory.json';
import { MILESTONES } from './milestones';

// T25d (SPEC 6.13c): memória da carreira. O motor guarda o que aconteceu (id, ano, idade, clube); os eventos leem pelo contexto
// (`mem.<id>` e `anos.<id>`) e os textos citam o passado por placeholders ({mem_<id>_ano|anos|clube}). O save refaz a carreira
// pelas escolhas, então as memórias voltam sozinhas.
export interface Memory { id: string; year: number; age: number; clubId: string }

/** Fatos de história (não são marcos) e os 20 marcos da T25c: todos viram memória. */
export const MEMORY_IDS: string[] = [...data.fatos.map((f) => f.id), ...MILESTONES.map((m) => m.id)];

/** Memórias que só entram na primeira vez (as demais se repetem: lesão grave, final perdida, troca pelo rival e os marcos de clube). */
export const ONCE = new Set(data.fatos.filter((f) => 'unica' in f && f.unica).map((f) => f.id));

/** Placeholders só aceitam letras, números e "_": o hífen dos ids de marco vira "_". */
export const memKey = (id: string): string => id.replace(/-/g, '_');

/** Contexto dos eventos: mem.<id> (aconteceu?) e anos.<id> (anos desde a última vez; -1 se nunca). Vale para todos os ids. */
export function memoryCtx(memories: readonly Memory[], year: number): Record<string, boolean | number> {
  const out: Record<string, boolean | number> = {};
  for (const id of MEMORY_IDS) {
    const last = memories.filter((x) => x.id === id).reduce((a, x) => Math.max(a, x.year), -Infinity);
    out[`mem.${id}`] = last !== -Infinity;
    out[`anos.${id}`] = last === -Infinity ? -1 : year - last;
  }
  return out;
}

const CITE = /\{mem_(\w+?)_(?:ano|anos|clube)\}/g;
const KEYS = new Map(MEMORY_IDS.map((id) => [memKey(id), id]));

/**
 * Regra de citação: um texto só cita {mem_<id>_...} se o evento exige a memória nas condições (`mem.<id> == true`), senão o texto
 * leria "daquela final" sem final nenhuma. Devolve os erros (vazio = ok). `texts`: id do evento → texto da situação.
 */
export function citationErrors(events: { id: string; condicoes: unknown[][] }[], texts: Record<string, string>): string[] {
  const errors: string[] = [];
  for (const e of events) {
    const text = texts[e.id];
    if (!text) continue;
    const required = new Set(e.condicoes.filter((c) => c[1] === '==' && c[2] === true && typeof c[0] === 'string' && (c[0] as string).startsWith('mem.')).map((c) => (c[0] as string).slice(4)));
    for (const [, key] of text.matchAll(CITE)) {
      const id = KEYS.get(key!);
      if (!id) errors.push(`${e.id}: cita memória que não existe ({mem_${key}_...})`);
      else if (!required.has(id)) errors.push(`${e.id}: cita ${id} sem exigir mem.${id} == true nas condições`);
    }
  }
  return errors;
}
