import { adjacent, bracket, runTies, seedPairs, winners } from './cups';
import { EURO_LEAGUES, europeClubsIn } from './europe';
import { createPrng } from './prng';
import { makeCtx, newRow, play, rank, record, roundRobin, twoLegs, type ClubInfo, type Ctx, type Phase, type Row, type Tie } from './season';
import data from '../data/europe.json';

// T30 (SPEC 6.10): temporada europeia — 6 ligas, copa nacional e Champions/Europa League (formato de fase de liga).
export interface EuroCup { leaguePhase: Row[]; playoffs: Tie[]; knockout: Tie[][]; champion: string }
export interface EuropeResult {
  leagues: Record<string, Row[]>; champions: Record<string, string>;
  cups: Record<string, { rounds: Tie[][]; champion: string }>; ucl: EuroCup; uel: EuroCup;
}
/** Classificação da temporada anterior por liga (define as vagas UEFA). */
export type EuroTables = Record<string, string[]>;

const U = data.copasUEFA;
const stream = (seed: number, salt: number) => createPrng(Math.imul(seed, 0x9e3779b1) ^ Math.imul(salt + 31, 0x85ebca6b));

export const initialEuroTables = (): EuroTables =>
  Object.fromEntries(EURO_LEAGUES.map((l) => [l, europeClubsIn(l).sort((a, b) => b.reputacao - a.reputacao || (a.id < b.id ? -1 : 1)).map((c) => c.id)]));

/** Vagas por posição na liga anterior + os mais fortes do pool de outras ligas (reputação com ruído). */
export function uefaEntrants(tables: EuroTables, seed: number): { ucl: string[]; uel: string[] } {
  const rng = stream(seed, 1);
  const ucl: string[] = [];
  const uel: string[] = [];
  const cl = U.vagasChampions as Record<string, number>;
  const el = U.vagasEuropaLeague as Record<string, number>;
  for (const l of EURO_LEAGUES) {
    ucl.push(...tables[l]!.slice(0, cl[l]));
    uel.push(...tables[l]!.slice(cl[l], cl[l]! + el[l]!));
  }
  const pool = data.outros.clubs.map((c) => ({ id: c.id, s: c.reputacao + (rng.next() * 2 - 1) * 6 })).sort((a, b) => b.s - a.s).map((c) => c.id);
  ucl.push(...pool.slice(0, cl.outros));
  uel.push(...pool.slice(cl.outros, cl.outros! + el.outros!));
  return { ucl, uel };
}

/** Copa nacional: os piores da liga jogam uma preliminar até sobrarem 16; depois mata-mata em jogo único. */
function nationalCup(ctx: Ctx, table: Row[]) {
  const ids = table.map((r) => r.id);
  const extra = ids.length - 16;
  const rounds: Tie[][] = [];
  let alive = ids.slice(0, 16 - extra);
  if (extra > 0) {
    const prelim = runTies(ctx, seedPairs(ctx, ids.slice(16 - extra)), 1);
    rounds.push(prelim);
    alive = [...alive, ...winners(prelim)];
  }
  let ties = runTies(ctx, seedPairs(ctx, alive), 1);
  rounds.push(ties);
  while (ties.length > 1) { ties = runTies(ctx, adjacent(ties), 1); rounds.push(ties); }
  return { rounds, champion: ties[0]!.winner };
}

/** Fase de liga com 36 clubes: calendário circular (cada um enfrenta os 4 seguintes e os 4 anteriores), 4 jogos em casa. */
function uefaCup(ids: string[], club: ClubInfo, seed: number, salt: number): EuroCup {
  const rng = stream(seed, salt);
  const ctx = makeCtx(ids, club, rng);
  const order = [...ids];
  for (let i = order.length - 1; i > 0; i--) { const j = rng.int(0, i); [order[i], order[j]] = [order[j]!, order[i]!]; }
  const rows = new Map(order.map((id) => [id, newRow(id)]));
  const n = order.length;
  for (let i = 0; i < n; i++) {
    for (let d = 1; d <= U.jogosFaseDeLiga / 2; d++) {
      const [a, b] = [order[i]!, order[(i + d) % n]!];
      const [h, v] = d % 2 === 1 ? [a, b] : [b, a];
      record(rows, h, v, play(ctx, h, v));
    }
  }
  const leaguePhase = rank(ctx, [...rows.values()]);
  const r = leaguePhase.map((x) => x.id);
  const [from, to] = U.playoffs as [number, number];
  const seeds = r.slice(from - 1, to);
  const playoffs = seeds.slice(0, seeds.length / 2).map((id, i) => twoLegs(ctx, id, seeds[seeds.length - 1 - i]!));
  const top = r.slice(0, U.diretoOitavas);
  const r16 = top.map((id, i) => twoLegs(ctx, id, playoffs[playoffs.length - 1 - i]!.winner));
  const phases: Phase[] = [];
  const champion = bracket(ctx, r16, phases);
  return { leaguePhase, playoffs, knockout: [r16, ...phases.map((p) => p.ties!)], champion };
}

export function simulateEuropeSeason(prev: EuroTables, club: ClubInfo, seed: number): EuropeResult & { next: EuroTables } {
  const leagues: Record<string, Row[]> = {};
  const champions: Record<string, string> = {};
  const cups: EuropeResult['cups'] = {};
  EURO_LEAGUES.forEach((l, i) => {
    const ids = europeClubsIn(l).map((c) => c.id);
    const ctx = makeCtx(ids, club, stream(seed, 10 + i));
    leagues[l] = roundRobin(ctx, ids, true);
    champions[l] = leagues[l]![0]!.id;
    cups[l] = nationalCup(ctx, leagues[l]!);
  });
  const e = uefaEntrants(prev, seed);
  return {
    leagues, champions, cups,
    ucl: uefaCup(e.ucl, club, seed, 2),
    uel: uefaCup(e.uel, club, seed, 3),
    next: Object.fromEntries(EURO_LEAGUES.map((l) => [l, leagues[l]!.map((r) => r.id)])),
  };
}
