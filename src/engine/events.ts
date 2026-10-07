import type { Prng } from './prng';
import data from '../data/events.json';
import creation from '../data/creation.json';
import scenes from '../data/scenes.json';

// T25 (SPEC 6.13, 6.18): eventos com condições, opções e efeitos em dados; toda decisão aponta para uma cena.
export type Ctx = Record<string, number | string | boolean>;
type Val = number | string | boolean;
export type Cond = [string, string, Val];
type Effect = [string, 'add' | 'set' | 'mul', Val];
interface EventDef {
  id: string; cena: string; peso: number; condicoes: Cond[];
  /** `jeito`: temperamento a que a opção remete (SPEC v2.17). Decisões têm 3 opções, cada uma com um jeito diferente. */
  opcoes: { id: string; efeitos: Effect[]; jeito?: string; ajustes?: { etiqueta: string; efeitos: Effect[] }[] }[];
  politica: { padrao: string };
  /** T25c: marco da carreira (primeira vez); quem sorteia é `fireMilestones`, nunca o sorteio comum de eventos. */
  marco?: boolean;
  /** T25e: evento de catálogo; entra só pelo sorteio por contexto (`contextDraw.ts`), nunca pelo sorteio comum. */
  sorteio?: boolean;
}

const TEMPERAMENTS: string[] = creation.temperaments;

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
    if (opts.length !== 1 && opts.length !== 3) errors.push(`${at}: precisa de 1 opção (só narrado) ou 3 (decisão), tem ${opts.length}`);
    const jeitos = opts.map((o) => o.jeito);
    if (opts.length === 1 ? jeitos[0] !== undefined : new Set(jeitos).size !== 3 || jeitos.some((j) => !j || !TEMPERAMENTS.includes(j))) {
      errors.push(`${at}: cada opção de decisão precisa de um jeito válido e diferente (${jeitos.join(', ')})`);
    }
    for (const o of opts) {
      for (const [field, op] of o.efeitos) {
        if (!(field in def.campos)) errors.push(`${at}/${o.id}: campo desconhecido ${field}`);
        if (op !== 'add' && op !== 'set' && op !== 'mul') errors.push(`${at}/${o.id}: efeito inválido ${op}`);
      }
    }
    const optIds = opts.map((o) => o.id);
    const choice = e.politica?.padrao;
    if (!choice || !optIds.includes(choice)) errors.push(`${at}: política aponta para opção inexistente ${choice}`);
  }
  return errors;
}

const errs = validateEvents(data, scenes.cenas);
if (errs.length) throw new Error(`events.json inválido:\n${errs.join('\n')}`);

const EVENTS = data.eventos as unknown as EventDef[];
const BY_ID = new Map(EVENTS.map((e) => [e.id, e]));
const RANGES = data.campos as unknown as Record<string, [number | null, number | null] | "bool">;

/** Condição `[campo, operador, valor]` sobre um contexto; campo ausente nunca vale. */
export const holds = (c: Ctx, [field, op, v]: Cond) => field in c && OPS[op]!(c[field]!, v);

const pool = (c: Ctx) => EVENTS.filter((e) => !e.marco && !e.sorteio && e.condicoes.every((k) => holds(c, k)));
export const eligibleEvents = (c: Ctx): string[] => pool(c).map((e) => e.id);

/** Sorteio ponderado entre os elegíveis (ordem fixa do catálogo); nenhum elegível = null. */
export function pickEvent(c: Ctx, rng: Prng): string | null {
  const ok = pool(c);
  if (!ok.length) return null;
  let roll = rng.next() * ok.reduce((s, e) => s + e.peso, 0);
  for (const e of ok) if ((roll -= e.peso) < 0) return e.id;
  return ok.at(-1)!.id;
}

/** Aplica os efeitos da opção (puro), respeitando os limites de cada campo. */
export function applyOption(s: Ctx, eventId: string, optionId: string, tags: readonly string[] = []): Ctx {
  const opt = BY_ID.get(eventId)?.opcoes.find((o) => o.id === optionId);
  if (!opt) throw new RangeError(`opção inexistente: ${eventId}/${optionId}`);
  const out = { ...s };
  // T25e: o contexto ajusta as consequências: os efeitos extras das etiquetas que valem somam-se aos da opção
  const effects = [...opt.efeitos, ...(opt.ajustes ?? []).filter((a) => tags.includes(a.etiqueta)).flatMap((a) => a.efeitos)];
  for (const [field, op, v] of effects) {
    const range = RANGES[field];
    const cur = (out[field] as number) ?? 0;
    let next: Val = op === 'set' ? v : op === 'mul' ? cur * (v as number) : cur + (v as number);
    if (Array.isArray(range) && typeof next === 'number') {
      const [lo, hi] = range;
      next = Math.round(Math.min(hi ?? Infinity, Math.max(lo ?? -Infinity, next)) * 1000) / 1000;
    }
    out[field] = next;
  }
  return out;
}

/** Decisão automática (simulação e ritmo Rápido): a opção do jeito do jogador; sem opção própria, o padrão do evento. */
export function autoChoice(eventId: string, temperament: string): string {
  const e = BY_ID.get(eventId)!;
  return e.opcoes.find((o) => o.jeito === temperament)?.id ?? e.politica.padrao;
}

/** Temperamento a que a opção remete; null nos eventos só narrados. */
export const jeitoOf = (eventId: string, optionId: string): string | null =>
  BY_ID.get(eventId)?.opcoes.find((o) => o.id === optionId)?.jeito ?? null;

export const sceneOf = (eventId: string) => BY_ID.get(eventId)!.cena;

/** Fração do salário que o jogador aceita ao assinar com o clube do coração, pela opção do seu jeito (v2.23: o número mora em events.json). */
export const heartSalaryFactor = (temperament: string): number =>
  applyOption({ salarioFator: 1 }, 'proposta-coracao', autoChoice('proposta-coracao', temperament)).salarioFator as number;
