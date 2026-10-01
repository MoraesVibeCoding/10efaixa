import type { Prng } from './prng';
import data from '../data/events.json';
import scenes from '../data/scenes.json';

// T25 (SPEC 6.13, 6.18): eventos com condições, opções e efeitos em dados; toda decisão aponta para uma cena.
export type Ctx = Record<string, number | string | boolean>;
type Val = number | string | boolean;
type Cond = [string, string, Val];
type Effect = [string, 'add' | 'set', Val];
interface EventDef {
  id: string; cena: string; peso: number; condicoes: Cond[];
  opcoes: { id: string; efeitos: Effect[] }[];
  politica: { padrao: string; temperamento?: Record<string, string> };
}

const OPS: Record<string, (a: Val, b: Val) => boolean> = {
  '==': (a, b) => a === b, '!=': (a, b) => a !== b,
  '>=': (a, b) => (a as number) >= (b as number), '<=': (a, b) => (a as number) <= (b as number),
  '>': (a, b) => (a as number) > (b as number), '<': (a, b) => (a as number) < (b as number),
};

export function validateEvents(d: unknown, sceneIds: string[]): string[] {
  const errors: string[] = [];
  const def = d as { campos: Record<string, unknown>; eventos: Partial<EventDef>[] };
  const ids = new Set<string>();
  for (const e of def.eventos ?? []) {
    const at = `evento ${e.id ?? '?'}`;
    if (!e.id || ids.has(e.id)) errors.push(`${at}: id ausente ou repetido`);
    else ids.add(e.id);
    if (!e.cena || !sceneIds.includes(e.cena)) errors.push(`${at}: cena ausente ou inexistente (${e.cena ?? 'nenhuma'})`);
    for (const [, op] of e.condicoes ?? []) if (!OPS[op]) errors.push(`${at}: operador inválido ${op}`);
    const opts = e.opcoes ?? [];
    if (!opts.length) errors.push(`${at}: sem opções`);
    for (const o of opts) {
      for (const [field, op] of o.efeitos) {
        if (!(field in def.campos)) errors.push(`${at}/${o.id}: campo desconhecido ${field}`);
        if (op !== 'add' && op !== 'set') errors.push(`${at}/${o.id}: efeito inválido ${op}`);
      }
    }
    const optIds = opts.map((o) => o.id);
    for (const choice of [e.politica?.padrao, ...Object.values(e.politica?.temperamento ?? {})]) {
      if (!choice || !optIds.includes(choice)) errors.push(`${at}: política aponta para opção inexistente ${choice}`);
    }
  }
  return errors;
}

const errs = validateEvents(data, scenes.cenas);
if (errs.length) throw new Error(`events.json inválido:\n${errs.join('\n')}`);

const EVENTS = data.eventos as unknown as EventDef[];
const BY_ID = new Map(EVENTS.map((e) => [e.id, e]));
const RANGES = data.campos as unknown as Record<string, [number | null, number | null] | "bool">;

const holds = (c: Ctx, [field, op, v]: Cond) => field in c && OPS[op]!(c[field]!, v);

export const eligibleEvents = (c: Ctx): string[] => EVENTS.filter((e) => e.condicoes.every((k) => holds(c, k))).map((e) => e.id);

/** Sorteio ponderado entre os elegíveis (ordem fixa do catálogo); nenhum elegível = null. */
export function pickEvent(c: Ctx, rng: Prng): string | null {
  const ok = EVENTS.filter((e) => e.condicoes.every((k) => holds(c, k)));
  if (!ok.length) return null;
  let roll = rng.next() * ok.reduce((s, e) => s + e.peso, 0);
  for (const e of ok) if ((roll -= e.peso) < 0) return e.id;
  return ok.at(-1)!.id;
}

/** Aplica os efeitos da opção (puro), respeitando os limites de cada campo. */
export function applyOption(s: Ctx, eventId: string, optionId: string): Ctx {
  const opt = BY_ID.get(eventId)?.opcoes.find((o) => o.id === optionId);
  if (!opt) throw new RangeError(`opção inexistente: ${eventId}/${optionId}`);
  const out = { ...s };
  for (const [field, op, v] of opt.efeitos) {
    const range = RANGES[field];
    let next: Val = op === 'set' ? v : ((out[field] as number) ?? 0) + (v as number);
    if (Array.isArray(range) && typeof next === 'number') {
      const [lo, hi] = range;
      next = Math.round(Math.min(hi ?? Infinity, Math.max(lo ?? -Infinity, next)) * 1000) / 1000;
    }
    out[field] = next;
  }
  return out;
}

/** Decisão automática (simulação e ritmo Rápido): política do evento por temperamento. */
export function autoChoice(eventId: string, temperament: string): string {
  const p = BY_ID.get(eventId)!.politica;
  return p.temperamento?.[temperament] ?? p.padrao;
}

export const sceneOf = (eventId: string) => BY_ID.get(eventId)!.cena;
