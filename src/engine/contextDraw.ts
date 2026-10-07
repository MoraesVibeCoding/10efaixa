import data from '../data/context.json';
import events from '../data/events.json';
import { holds, type Cond, type Ctx } from './events';
import { pickWeighted, type Prng } from './prng';

// T25e (SPEC 6.13c): sorteio de catálogo por contexto. Um evento com `sorteio: true` entra pela condição; o peso é
// peso × peso do temperamento × reforço por etiqueta; não repete na carreira salvo `recorrente`. Usa gerador próprio (a semente da
// carreira + ano + semestre), então não desloca nenhum sorteio do resto da carreira.
export interface CatalogEvent {
  id: string; peso: number; condicoes: Cond[]; sorteio?: boolean; recorrente?: boolean; marco?: boolean;
  /** Multiplicador do peso por temperamento (esquentado: clássicos e brigas; líder: vestiário; resenha: festas; frio: pressão). */
  pesoPorTemperamento?: Record<string, number>;
  /** Etiquetas de contexto que puxam o evento (cada uma que vale multiplica o peso por `reforcoPorEtiqueta`). */
  reforco?: string[];
}
export const CATALOG = events.eventos as unknown as CatalogEvent[];
export const SORTEIO = data.sorteio;

export interface DrawInput { catalog?: readonly CatalogEvent[]; ctx: Ctx; tags: readonly string[]; temperament: string; used: ReadonlySet<string>; count: number }

/** Quantos eventos de catálogo neste semestre: a parte inteira de `porSemestre` sempre, a fração sorteada, até `max`. */
export function drawCount(rng: Prng): number {
  const whole = Math.floor(SORTEIO.porSemestre);
  return Math.min(SORTEIO.max, whole + (rng.next() < SORTEIO.porSemestre - whole ? 1 : 0));
}

/** Até `count` ids de evento, sem repetir na rodada nem os já usados (salvo recorrente). */
export function drawCatalog(i: DrawInput, rng: Prng): string[] {
  const pool = (i.catalog ?? CATALOG).filter((e) => e.sorteio && !e.marco && (e.recorrente || !i.used.has(e.id)) && e.condicoes.every((c) => holds(i.ctx, c)));
  const weight = (e: CatalogEvent) => e.peso * (e.pesoPorTemperamento?.[i.temperament] ?? 1) * SORTEIO.reforcoPorEtiqueta ** (e.reforco ?? []).filter((t) => i.tags.includes(t)).length;
  const out: string[] = [];
  const left = new Map(pool.map((e) => [e.id, weight(e)]));
  while (out.length < i.count && left.size > 0) {
    const id = pickWeighted(rng, Object.fromEntries(left));
    out.push(id);
    left.delete(id);
  }
  return out;
}
