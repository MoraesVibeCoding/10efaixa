import { CLUBS } from './clubs';
import { createPrng, type Prng } from './prng';
import { makeCtx, newRow, oneLeg, play, rank, record, roundRobin, twoLegs, type ClubInfo, type Ctx, type Row, type Tie } from './season';
import data from '../data/states.json';
import creation from '../data/creation.json';

// T18: 10 estaduais completos (formato em dados) + estadual simplificado nos outros 17 estados.
// Acesso simplificado: os rebaixados vão para a divisão de acesso e sobem os mais fortes dela (decisão do usuário).
type Ref = string;
interface Round { jogos: number; pares: [Ref, Ref][] }
interface Def {
  nome: string; grupos: string[][]; primeiraFase: 'turnoUnico' | 'cruzado' | 'potes';
  classificados?: { tipo: 'lideresMaisSegundos'; segundos: number };
  mataMata: Round[];
  rebaixamento:
    | { tipo: 'ultimos'; quantidade: number }
    | { tipo: 'quadrangular'; participantes: Ref[]; idaEVolta: boolean; caem: number }
    | { tipo: 'mataMata'; pares: [Ref, Ref][]; jogos: number }
    | { tipo: 'nenhum' };
  acesso: { divisao: string; pool: string[] } | null;
  fonte: string;
}

export interface StateEntry { groups: string[][]; pool: string[] }
export type StateWorld = Record<string, StateEntry>;
export interface StateResult { firstPhase: Row[][]; knockout: Tie[][]; champion: string; relegated: string[]; promoted: string[] }

const DEFS = data.estaduais as unknown as Record<string, Def>;
export const STATE_UFS = Object.keys(DEFS);
const byId = new Map(CLUBS.map((c) => [c.id, c]));

const REF = /^([GQV]|[A-D])(\d+)$/;

export function validateStates(d: unknown): string[] {
  const errors: string[] = [];
  const all = (d as typeof data).estaduais as unknown as Record<string, Def>;
  const seen = new Map<string, string>();
  for (const [uf, s] of Object.entries(all)) {
    const ids = [...s.grupos.flat(), ...(s.acesso?.pool ?? [])];
    for (const id of ids) {
      const c = byId.get(id);
      if (!c) errors.push(`${uf}: clube inexistente ${id}`);
      else if (c.uf !== uf) errors.push(`${uf}: ${id} é de ${c.uf}`);
      if (seen.has(id)) errors.push(`${uf}: ${id} também em ${seen.get(id)}`);
      seen.set(id, uf);
    }
    const refs = [...s.mataMata.flatMap((r) => r.pares.flat()),
      ...('participantes' in s.rebaixamento ? s.rebaixamento.participantes : []),
      ...('pares' in s.rebaixamento ? s.rebaixamento.pares.flat() : [])];
    for (const r of refs) if (!REF.test(r)) errors.push(`${uf}: referência inválida ${r}`);
    if (!/https?:\/\//.test(s.fonte)) errors.push(`${uf}: fonte ausente`);
  }
  return errors;
}

const errs = validateStates(data);
if (errs.length) throw new Error(`states.json inválido:\n${errs.join('\n')}`);

export const initialStates = (): StateWorld =>
  Object.fromEntries(STATE_UFS.map((uf) => [uf, { groups: DEFS[uf]!.grupos.map((g) => [...g]), pool: [...(DEFS[uf]!.acesso?.pool ?? [])] }]));

/** Partidas da 1ª fase: turno único, grupos cruzados (só contra outros grupos) ou potes (Paulistão, aproximação). */
function firstPhasePairs(kind: Def['primeiraFase'], groups: string[][]): [string, string][] {
  const pairs: [string, string][] = [];
  const add = (a: string, b: string, k: number) => pairs.push(k % 2 === 0 ? [a, b] : [b, a]);
  if (kind === 'turnoUnico') return [];
  for (let i = 0; i < groups.length; i++) {
    for (let j = i + 1; j < groups.length; j++) {
      groups[i]!.forEach((a, x) => groups[j]!.forEach((b, y) => {
        if (kind === 'cruzado' || x === y) add(a, b, x + y + i + j);
      }));
    }
  }
  if (kind === 'potes') {
    const n = groups.length;
    groups.forEach((g, p) => g.forEach((a, s) => {
      for (let t = s + 1; t < g.length; t++) add(a, g[t]!, s + t);
      add(a, groups[(p + 1) % n]![(s + 1) % g.length]!, p + s + 1);
    }));
  }
  return pairs;
}

function runFirstPhase(ctx: Ctx, def: Def, groups: string[][]): { byGroup: Row[][]; geral: Row[] } {
  if (def.primeiraFase === 'turnoUnico') {
    const t = roundRobin(ctx, groups.flat(), false);
    return { byGroup: [t], geral: t };
  }
  const rows = new Map(groups.flat().map((id) => [id, newRow(id)]));
  for (const [h, a] of firstPhasePairs(def.primeiraFase, groups)) record(rows, h, a, play(ctx, h, a));
  const byGroup = groups.map((g) => rank(ctx, g.map((id) => rows.get(id)!)));
  return { byGroup, geral: rank(ctx, [...rows.values()]) };
}

function resolver(byGroup: Row[][], geral: Row[], q: string[], prev: Tie[]) {
  return (ref: Ref): string => {
    const [, kind, n] = REF.exec(ref)!;
    const i = Number(n) - 1;
    const id = kind === 'G' ? geral[i]?.id : kind === 'Q' ? q[i] : kind === 'V' ? prev[i]?.winner : byGroup['ABCD'.indexOf(kind!)]?.[i]?.id;
    if (!id) throw new RangeError(`referência sem clube: ${ref}`);
    return id;
  };
}

function simulateFull(uf: string, entry: StateEntry, club: ClubInfo, rng: Prng): StateResult {
  const def = DEFS[uf]!;
  const ctx = makeCtx([...entry.groups.flat(), ...entry.pool], club, rng);
  const { byGroup, geral } = runFirstPhase(ctx, def, entry.groups);
  let q: string[] = [];
  if (def.classificados?.tipo === 'lideresMaisSegundos') {
    const leaders = byGroup.map((g) => g[0]!);
    const seconds = rank(ctx, byGroup.map((g) => g[1]!)).slice(0, def.classificados.segundos);
    q = rank(ctx, [...leaders, ...seconds]).map((r) => r.id);
  }
  const knockout: Tie[][] = [];
  for (const round of def.mataMata) {
    const at = resolver(byGroup, geral, q, knockout.at(-1) ?? []);
    knockout.push(round.pares.map(([a, b]) => (round.jogos === 2 ? twoLegs : oneLeg)(ctx, at(a), at(b))));
  }
  const at = resolver(byGroup, geral, q, []);
  const rb = def.rebaixamento;
  const relegated =
    rb.tipo === 'ultimos' ? geral.slice(-rb.quantidade).map((r) => r.id)
      : rb.tipo === 'quadrangular' ? roundRobin(ctx, rb.participantes.map(at), rb.idaEVolta).slice(-rb.caem).map((r) => r.id)
        : rb.tipo === 'mataMata' ? rb.pares.map(([a, b]) => {
          const t = (rb.jogos === 2 ? twoLegs : oneLeg)(ctx, at(a), at(b));
          return t.winner === t.a ? t.b : t.a;
        })
          : [];
  // Acesso simplificado: sobem os mais fortes da divisão de acesso (força com ruído), tantos quantos caíram.
  const promoted = [...entry.pool].sort((x, y) => ctx.strength.get(y)! - ctx.strength.get(x)! || ctx.key.get(x)! - ctx.key.get(y)!)
    .slice(0, relegated.length);
  return { firstPhase: byGroup, knockout, champion: knockout.at(-1)![0]!.winner, relegated, promoted };
}

/** Clubes da UF nas Séries A–D: turno único + final em ida e volta (ou só a final com 2 clubes). */
function simulateSimplified(ids: string[], club: ClubInfo, rng: Prng): string {
  const ctx = makeCtx(ids, club, rng);
  if (ids.length === 1) return ids[0]!;
  const sorted = ids.length === 2 ? rank(ctx, ids.map(newRow)) : roundRobin(ctx, ids, false);
  return twoLegs(ctx, sorted[0]!.id, sorted[1]!.id).winner;
}

const stream = (seed: number, uf: string) =>
  createPrng(Math.imul(seed, 0x9e3779b1) ^ Math.imul(creation.states.indexOf(uf) + 101, 0x85ebca6b));

export function simulateStates(w: StateWorld, club: ClubInfo, seed: number) {
  const champions: Record<string, string> = {};
  const states: Record<string, StateResult> = {};
  const next: StateWorld = {};
  for (const uf of creation.states) {
    if (DEFS[uf]) {
      const r = simulateFull(uf, w[uf]!, club, stream(seed, uf));
      states[uf] = r;
      champions[uf] = r.champion;
      const swap = new Map(r.relegated.map((id, i) => [id, r.promoted[i]!]));
      next[uf] = {
        groups: w[uf]!.groups.map((g) => g.map((id) => swap.get(id) ?? id)),
        pool: [...w[uf]!.pool.filter((id) => !r.promoted.includes(id)), ...r.relegated],
      };
    } else {
      const ids = CLUBS.filter((c) => c.uf === uf && c.divisao !== null).map((c) => c.id);
      if (ids.length < data.simplificado.minimo) throw new RangeError(`${uf}: menos de ${data.simplificado.minimo} clubes para o estadual`);
      champions[uf] = simulateSimplified(ids, club, stream(seed, uf));
    }
  }
  return { champions, states, next };
}
