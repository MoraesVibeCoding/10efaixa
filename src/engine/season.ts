import { createPrng, type Prng } from './prng';
import leagues from '../data/leagues.json';

// T17: temporada das Séries A–D com acesso e rebaixamento (formatos de 2026 fixos; seção 17 do SPEC).
// Partida sem gols: vitória/empate/derrota sorteados pela diferença de força. Desenho revisado (doubt-driven).
export type Div = 'A' | 'B' | 'C' | 'D';
export type Divisions = Record<Div, string[]>;
export interface Row { id: string; points: number; wins: number; draws: number; losses: number; home: number }
export interface Tie { a: string; b: string; winner: string }
export interface Phase { name: string; groups?: Row[][]; ties?: Tie[] }
export interface SeasonResult {
  phases: Record<Div, Phase[]>;
  champions: Record<Div, string>;
  promoted: { B: string[]; C: string[]; D: string[] };
  relegated: { A: string[]; B: string[]; C: string[] };
  next: Divisions;
}
/** Força base (reputação + efeito do jogador, no futuro) e UF; o ruído de forma é sorteado aqui dentro. */
export type ClubInfo = (id: string) => { strength: number; uf: string };

const M = leagues.match;
const L = leagues.leagues;
const DIVS: Div[] = ['A', 'B', 'C', 'D'];

export function validateMatchConfig(c: typeof M): string[] {
  const e: string[] = [];
  if (!(c.drawBase > 0 && c.drawBase < 1)) e.push('drawBase precisa estar em (0, 1)');
  if (!(c.scale > 0)) e.push('scale precisa ser > 0');
  if (!(c.formNoise >= 0)) e.push('formNoise precisa ser ≥ 0');
  if (!(c.penaltyClamp[0]! > 0 && c.penaltyClamp[1]! < 1 && c.penaltyClamp[0]! <= c.penaltyClamp[1]!)) e.push('penaltyClamp inválido');
  return e;
}
const cfgErrors = validateMatchConfig(M);
if (cfgErrors.length) throw new Error(`leagues.json (match) inválido: ${cfgErrors.join('; ')}`);

export interface Ctx { rng: Prng; strength: Map<string, number>; key: Map<string, number> }

const logistic = (x: number) => 1 / (1 + Math.exp(-x));

/** Resultado pela diferença de força `d` (já com mando, se houver) e um sorteio `u`: 3 vitória, 1 empate, 0 derrota. */
export function outcome(d: number, u: number): 0 | 1 | 3 {
  const pDraw = M.drawBase * Math.exp(-Math.abs(d) / M.scale);
  const pWin = (1 - pDraw) * logistic(d / M.scale);
  return u < pWin ? 3 : u < pWin + pDraw ? 1 : 0;
}

/** 3 = vitória do mandante, 1 = empate, 0 = derrota. Um sorteio por partida. */
export const play = (ctx: Ctx, home: string, away: string): 0 | 1 | 3 =>
  outcome(ctx.strength.get(home)! + M.homeAdv - ctx.strength.get(away)!, ctx.rng.next());

export const newRow = (id: string): Row => ({ id, points: 0, wins: 0, draws: 0, losses: 0, home: 0 });

export function record(rows: Map<string, Row>, home: string, away: string, r: 0 | 1 | 3) {
  const h = rows.get(home)!;
  const a = rows.get(away)!;
  h.home++;
  if (r === 3) { h.points += 3; h.wins++; a.losses++; }
  else if (r === 1) { h.points++; a.points++; h.draws++; a.draws++; }
  else { a.points += 3; a.wins++; h.losses++; }
}

/** Ordena por pontos, vitórias e chave sorteada antes (nunca o PRNG dentro do comparador). */
export const rank = (ctx: Ctx, rows: Row[]) =>
  [...rows].sort((x, y) => y.points - x.points || y.wins - x.wins || ctx.key.get(x.id)! - ctx.key.get(y.id)!);

/** Método do círculo (alternância pelo índice do par): mandos 9/10 em turno único de 20. */
export function roundRobin(ctx: Ctx, clubs: string[], double: boolean): Row[] {
  const rows = new Map(clubs.map((id) => [id, newRow(id)]));
  const n = clubs.length;
  let arr = clubs.map((_, i) => i);
  const legs: [number, number][] = [];
  for (let r = 0; r < n - 1; r++) {
    for (let i = 0; i < n / 2; i++) {
      const a = arr[i]!;
      const b = arr[n - 1 - i]!;
      const aHome = i === 0 ? r % 2 === 0 : i % 2 === 0;
      legs.push(aHome ? [a, b] : [b, a]);
    }
    arr = [arr[0]!, arr[n - 1]!, ...arr.slice(1, n - 1)];
  }
  for (const [h, a] of legs) record(rows, clubs[h]!, clubs[a]!, play(ctx, clubs[h]!, clubs[a]!));
  if (double) for (const [h, a] of legs) record(rows, clubs[a]!, clubs[h]!, play(ctx, clubs[a]!, clubs[h]!));
  return rank(ctx, [...rows.values()]);
}

/** Pênaltis ponderados pela força (a = mais bem colocado). */
export function penalties(ctx: Ctx, a: string, b: string): string {
  const [lo, hi] = M.penaltyClamp as [number, number];
  const pA = Math.min(hi, Math.max(lo, 0.5 + (ctx.strength.get(a)! - ctx.strength.get(b)!) * M.penaltyStrengthWeight));
  return ctx.rng.next() < pA ? a : b;
}

/** Jogo único na casa do mais bem colocado (a); empate vai aos pênaltis. */
export function oneLeg(ctx: Ctx, a: string, b: string): Tie {
  const r = play(ctx, a, b);
  return { a, b, winner: r === 3 ? a : r === 0 ? b : penalties(ctx, a, b) };
}

/** Força com ruído de forma e chave de desempate, sorteadas em ordem fixa no início. */
export function makeCtx(ids: string[], club: ClubInfo, rng: Prng): Ctx {
  const strength = new Map<string, number>();
  const key = new Map<string, number>();
  for (const id of ids) {
    strength.set(id, club(id).strength + (rng.next() * 2 - 1) * M.formNoise);
    key.set(id, rng.next());
  }
  return { rng, strength, key };
}

/** Ida e volta: o mais bem colocado (a) decide em casa. Empate no agregado vai aos pênaltis ponderados. */
export function twoLegs(ctx: Ctx, a: string, b: string): Tie {
  const leg1 = play(ctx, b, a);
  const leg2 = play(ctx, a, b);
  const pts = (r: number, isHome: boolean) => (r === 1 ? 1 : (r === 3) === isHome ? 3 : 0);
  const aPts = pts(leg1, false) + pts(leg2, true);
  const bPts = pts(leg1, true) + pts(leg2, false);
  if (aPts !== bPts) return { a, b, winner: aPts > bPts ? a : b };
  return { a, b, winner: penalties(ctx, a, b) };
}

function knockout(ctx: Ctx, pairs: [string, string][], phases: Phase[], names: string[]): Tie {
  let ties = pairs.map(([a, b]) => twoLegs(ctx, a, b));
  phases.push({ name: names[0]!, ties });
  for (let i = 1; ties.length > 1; i++) {
    const w = ties.map((t) => t.winner);
    ties = Array.from({ length: w.length / 2 }, (_, k) => twoLegs(ctx, w[2 * k]!, w[2 * k + 1]!));
    phases.push({ name: names[i] ?? `fase${i}`, ties });
  }
  return ties[0]!;
}

const ids = (rows: Row[]) => rows.map((r) => r.id);
const without = (xs: string[], out: string[]) => xs.filter((x) => !out.includes(x));

function validate(d: Divisions) {
  const sizes: Record<Div, number> = { A: L.A.clubes, B: L.B.clubes, C: L.C.clubes, D: L.D.clubes };
  for (const div of DIVS) {
    if (d[div].length !== sizes[div]) throw new RangeError(`Série ${div} com ${d[div].length} clubes; esperado ${sizes[div]}`);
  }
  const all = DIVS.flatMap((div) => d[div]);
  if (new Set(all).size !== all.length) throw new RangeError('clube em mais de uma divisão');
}

/** Sequência própria por (temporada, série): mudar uma série não desloca o sorteio das outras. */
const streamFor = (seed: number, div: Div) => createPrng(Math.imul(seed, 0x9e3779b1) ^ Math.imul(DIVS.indexOf(div) + 1, 0x85ebca6b));

export function simulateSeason(d: Divisions, club: ClubInfo, seed: number): SeasonResult {
  validate(d);
  const ctx = (div: Div): Ctx => makeCtx(d[div], club, streamFor(seed, div));

  // A: pontos corridos; 4 caem.
  const tA = roundRobin(ctx('A'), d.A, true);
  // B: 2 diretos + playoffs 3º×6º e 4º×5º; 4 caem.
  const cB = ctx('B');
  const tB = roundRobin(cB, d.B, true);
  const bIds = ids(tB);
  const playoffs = [twoLegs(cB, bIds[2]!, bIds[5]!), twoLegs(cB, bIds[3]!, bIds[4]!)];
  // C: turno único; 8 melhores em quadrangulares [1,4,5,8] e [2,3,6,7]; 2 de cada sobem; final entre os líderes.
  const cC = ctx('C');
  const tC = roundRobin(cC, d.C, false);
  const cIds = ids(tC);
  const quads = L.C.formato.quadrangulares.grupos.map((g) => roundRobin(cC, g.map((pos) => cIds[pos - 1]!), true));
  const finalC = twoLegs(cC, quads[0]![0]!.id, quads[1]![0]!.id);
  // D: grupos regionais de 6; 4 por grupo no mata-mata em pares de grupos; finalistas sobem.
  const cD = ctx('D');
  const region = (id: string) => leagues.regionOrder.indexOf(club(id).uf);
  // Ordem geográfica (UF na ordem regional, depois id): grupos regionais sem concentrar os mais fortes.
  const sortedD = [...d.D].sort((x, y) => region(x) - region(y) || (x < y ? -1 : 1));
  const groupsD = Array.from({ length: L.D.grupos }, (_, g) => roundRobin(cD, sortedD.slice(g * 6, g * 6 + 6), true));
  const pairs: [string, string][] = [];
  for (let g = 0; g < groupsD.length; g += 2) {
    const [x, y] = [ids(groupsD[g]!), ids(groupsD[g + 1]!)];
    pairs.push([x[0]!, y[3]!], [x[1]!, y[2]!], [x[2]!, y[1]!], [x[3]!, y[0]!]);
  }
  const phasesD: Phase[] = [{ name: 'grupos', groups: groupsD }];
  const finalD = knockout(cD, pairs, phasesD, ['segundaFase', 'terceiraFase', 'oitavas', 'quartas', 'semifinal', 'final']);

  const relA = ids(tA).slice(-L.A.rebaixados);
  const relB = bIds.slice(-L.B.rebaixados);
  const relC = cIds.slice(-L.C.rebaixados);
  const promB = [...bIds.slice(0, L.B.acessoDireto), ...playoffs.map((t) => t.winner)];
  const promC = quads.flatMap((q) => ids(q).slice(0, L.C.formato.quadrangulares.sobemPorGrupo));
  const promD = [finalD.a, finalD.b];

  return {
    phases: {
      A: [{ name: 'pontosCorridos', groups: [tA] }],
      B: [{ name: 'pontosCorridos', groups: [tB] }, { name: 'playoffs', ties: playoffs }],
      C: [{ name: 'primeiraFase', groups: [tC] }, { name: 'quadrangulares', groups: quads }, { name: 'final', ties: [finalC] }],
      D: phasesD,
    },
    champions: { A: tA[0]!.id, B: bIds[0]!, C: finalC.winner, D: finalD.winner },
    promoted: { B: promB, C: promC, D: promD },
    relegated: { A: relA, B: relB, C: relC },
    next: {
      A: [...without(d.A, relA), ...promB],
      B: [...without(d.B, [...promB, ...relB]), ...relA, ...promC],
      C: [...without(d.C, [...promC, ...relC]), ...relB, ...promD],
      D: [...without(d.D, promD), ...relC],
    },
  };
}
