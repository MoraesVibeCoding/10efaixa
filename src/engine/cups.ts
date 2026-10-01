import { CLUBS } from './clubs';
import { createPrng, type Prng } from './prng';
import { makeCtx, newRow, oneLeg, play, rank, record, roundRobin, twoLegs, type ClubInfo, type Ctx, type Phase, type Tie } from './season';
import cups from '../data/cups.json';
import foreign from '../data/foreignClubs.json';

// T19: Copa do Brasil, Copa do Nordeste, Libertadores e Sul-Americana (formatos de 2026; sorteios trocados por
// pareamento de força ou sorteio com semente — aproximações registradas em cups.json).
export const FOREIGN = foreign.clubs;
const FOREIGN_COUNTRY = new Map(FOREIGN.map((c) => [c.id, c.pais]));
export const countryOf = (id: string) => FOREIGN_COUNTRY.get(id) ?? 'BRA';

const DIV_ORDER: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
const divRank = (d: string | null) => (d === null ? 4 : DIV_ORDER[d] ?? 5);
const byStrength = (ctx: Ctx) => (x: string, y: string) => ctx.strength.get(y)! - ctx.strength.get(x)! || ctx.key.get(x)! - ctx.key.get(y)!;
const stream = (seed: number, salt: number) => createPrng(Math.imul(seed, 0x9e3779b1) ^ Math.imul(salt, 0x85ebca6b));

/** Pareamento do sorteio por força: o mais forte (mandante na volta) contra o mais fraco. */
export function seedPairs(ctx: Ctx, ids: string[]): [string, string][] {
  const s = [...ids].sort(byStrength(ctx));
  return Array.from({ length: s.length / 2 }, (_, i) => [s[i]!, s[s.length - 1 - i]!]);
}
export const runTies = (ctx: Ctx, pairs: [string, string][], legs: number): Tie[] =>
  pairs.map(([a, b]) => (legs === 2 ? twoLegs : oneLeg)(ctx, a, b));
export const adjacent = (ties: Tie[]): [string, string][] =>
  Array.from({ length: ties.length / 2 }, (_, i) => [ties[2 * i]!.winner, ties[2 * i + 1]!.winner]);
export const winners = (ties: Tie[]) => ties.map((t) => t.winner);

/** Chaveamento até a final: ida e volta, final em jogo único. */
export function bracket(ctx: Ctx, first: Tie[], phases: Phase[]): string {
  let ties = first;
  while (ties.length > 1) {
    const legs = ties.length === 2 ? 1 : 2;
    ties = runTies(ctx, adjacent(ties), legs);
    phases.push({ name: ties.length === 1 ? 'final' : `rodada${ties.length}`, ties });
  }
  return ties[0]!.winner;
}

// ---------- Copa do Brasil ----------

/** 102 vagas estaduais: cotas pelo ranking de federações; falta de clubes na UF é completada pelos mais fortes do país. */
export function copaDoBrasilEntrants(serieA: string[], champions: string[]): string[] {
  const cdb = cups.copaDoBrasil;
  const out: string[] = [];
  const taken = new Set([...serieA, ...champions]);
  const order = (a: (typeof CLUBS)[number], b: (typeof CLUBS)[number]) => divRank(a.divisao) - divRank(b.divisao) || b.reputacao - a.reputacao || (a.id < b.id ? -1 : 1);
  cdb.rankingFederacoes.forEach((uf, i) => {
    const quota = cdb.vagasPorRankingFederacao.find(([upTo]) => i + 1 <= upTo!)![1]!;
    const picks = CLUBS.filter((c) => c.uf === uf && !taken.has(c.id)).sort(order).slice(0, quota);
    for (const c of picks) { out.push(c.id); taken.add(c.id); }
  });
  const total = cdb.vagasPorRankingFederacao.reduce((s, [upTo, q], k, arr) => s + (upTo! - (k ? arr[k - 1]![0]! : 0)) * q!, 0);
  for (const c of CLUBS.filter((x) => !taken.has(x.id)).sort(order)) {
    if (out.length >= total) break;
    out.push(c.id);
  }
  return out;
}

/** 4 vagas de campeões na 3ª fase; campeão já na Série A (ou vaga não modelada) passa ao clube mais forte ainda fora. */
function phase3Champions(champions: string[], entrants: string[], serieA: string[]): string[] {
  const taken = new Set([...entrants, ...serieA]);
  const out = champions.filter((c) => !taken.has(c));
  out.forEach((c) => taken.add(c));
  const rest = CLUBS.filter((c) => !taken.has(c.id)).sort((a, b) => b.reputacao - a.reputacao || (a.id < b.id ? -1 : 1));
  while (out.length < cups.copaDoBrasil.fases.fase3.entramCampeoes) out.push(rest.shift()!.id);
  return out;
}

export function copaDoBrasil(entrants: string[], rawChampions: string[], serieA: string[], club: ClubInfo, seed: number) {
  const champions = phase3Champions(rawChampions, entrants, serieA);
  const ctx = makeCtx([...entrants, ...champions, ...serieA], club, stream(seed, 11));
  const phases: Phase[] = [];
  const step = (name: string, ids: string[], legs: number) => {
    const ties = runTies(ctx, seedPairs(ctx, ids), legs);
    phases.push({ name, ties });
    return winners(ties);
  };
  const w1 = step('fase1', entrants.slice(-28), 1);
  const w2 = step('fase2', [...entrants.slice(0, entrants.length - 28), ...w1], 1);
  const w3 = step('fase3', [...w2, ...champions], 1);
  const w4 = step('fase4', w3, 1);
  const p5 = runTies(ctx, seedPairs(ctx, [...w4, ...serieA]), 2);
  phases.push({ name: 'fase5', ties: p5 });
  const champion = bracket(ctx, p5, phases);
  const final = phases.at(-1)!.ties![0]!;
  return { phases, champion, runnerUp: final.a === champion ? final.b : final.a };
}

// ---------- Copa do Nordeste ----------

const REF = /^([A-D])(\d)$/;

export function copaDoNordeste(groups: string[][], club: ClubInfo, seed: number) {
  const N = cups.copaDoNordeste;
  const ctx = makeCtx(groups.flat(), club, stream(seed, 12));
  const rows = new Map(groups.flat().map((id) => [id, newRow(id)]));
  for (const [i, j] of N.confrontoDeGrupos as [number, number][]) {
    groups[i]!.forEach((a, x) => groups[j]!.forEach((b, y) => {
      const [h, v] = (x + y) % 2 === 0 ? [a, b] : [b, a];
      record(rows, h, v, play(ctx, h, v));
    }));
  }
  const ranked = groups.map((g) => rank(ctx, g.map((id) => rows.get(id)!)));
  const at = (ref: string) => {
    const [, g, n] = REF.exec(ref)!;
    return ranked['ABCD'.indexOf(g!)]![Number(n) - 1]!.id;
  };
  const qf = runTies(ctx, (N.quartas as [string, string][]).map(([a, b]) => [at(a), at(b)]), 1);
  const sf = runTies(ctx, [[qf[0]!.winner, qf[2]!.winner], [qf[1]!.winner, qf[3]!.winner]], 2);
  const final = runTies(ctx, [[sf[0]!.winner, sf[1]!.winner]], 2);
  return {
    groups: ranked,
    phases: [{ name: 'quartas', ties: qf }, { name: 'semifinal', ties: sf }, { name: 'final', ties: final }] as Phase[],
    champion: final[0]!.winner,
  };
}

/** Participantes de anos seguintes: cotas por estado (distribuição de 2026); grupos por potes de força. */
export function nordesteGroups(rng: Prng): string[][] {
  const quotas = cups.copaDoNordeste.vagasPorEstado as Record<string, number>;
  const picks = Object.entries(quotas).flatMap(([uf, n]) => CLUBS
    .filter((c) => c.uf === uf)
    .sort((a, b) => divRank(a.divisao) - divRank(b.divisao) || b.reputacao - a.reputacao || (a.id < b.id ? -1 : 1))
    .slice(0, n));
  const sorted = picks.sort((a, b) => b.reputacao - a.reputacao).map((c) => c.id);
  const groups: string[][] = [[], [], [], []];
  for (let p = 0; p < 5; p++) {
    const pot = sorted.slice(p * 4, p * 4 + 4);
    for (let i = pot.length - 1; i > 0; i--) { const j = rng.int(0, i); [pot[i], pot[j]] = [pot[j]!, pot[i]!]; }
    pot.forEach((id, g) => groups[g]!.push(id));
  }
  return groups;
}

// ---------- CONMEBOL ----------

/** Vagas brasileiras: Série A + campeão/vice da Copa do Brasil; vaga já ocupada desce na tabela. */
export function brazilQualifiers(table: string[], cdbChampion: string, cdbVice: string, exclude: string[] = []) {
  const taken = new Set<string>(exclude);
  const next = () => { const id = table.find((x) => !taken.has(x))!; taken.add(id); return id; };
  const take = (id: string) => (taken.has(id) ? next() : (taken.add(id), id));
  const libGroups = [table[0]!, table[1]!, table[2]!, table[3]!].map(take);
  libGroups.push(take(cdbChampion));
  const libF2 = [next(), take(cdbVice)];
  const sud = Array.from({ length: cups.conmebol.sulAmericana.brasil.grupos }, next);
  return { libGroups, libF2, sud };
}

/** Estrangeiros: cada país distribui suas vagas pela força (reputação + ruído), atuais campeões à parte. */
export function foreignQualifiers(rng: Prng, holders: string[]) {
  const lib = cups.conmebol.libertadores.vagas as Record<string, { grupos: number; fase2?: number; fase1?: number }>;
  const sud = cups.conmebol.sulAmericana.vagas as Record<string, { grupos?: number; faseNacional?: number }>;
  const out = { libGroups: [] as string[], libF2: [] as string[], libF1: [] as string[], sudGroups: [] as string[], sudNational: {} as Record<string, string[]> };
  for (const country of Object.keys(lib)) {
    const pool = FOREIGN.filter((c) => c.pais === country && !holders.includes(c.id))
      .map((c) => ({ id: c.id, s: c.reputacao + (rng.next() * 2 - 1) * 8 }))
      .sort((a, b) => b.s - a.s).map((c) => c.id);
    const take = (n = 0) => pool.splice(0, n);
    out.libGroups.push(...take(lib[country]!.grupos));
    out.libF2.push(...take(lib[country]!.fase2));
    out.libF1.push(...take(lib[country]!.fase1));
    out.sudGroups.push(...take(sud[country]!.grupos));
    if (sud[country]!.faseNacional) out.sudNational[country] = take(sud[country]!.faseNacional);
  }
  return out;
}

/** 32 em 8 grupos por potes de força; evita mesmo país no grupo quando possível (exceto os livres de restrição). */
function drawGroups(ctx: Ctx, ids: string[], unrestricted: Set<string>, rng: Prng, lastPot?: string[]): string[][] {
  const groups: string[][] = Array.from({ length: 8 }, () => []);
  const ordered = [...ids].filter((x) => !lastPot?.includes(x)).sort(byStrength(ctx));
  const pots = [0, 1, 2, 3].map((p) => ordered.slice(p * 8, p * 8 + 8));
  if (lastPot) pots[3] = [...ordered.slice(24), ...lastPot];
  pots.forEach((pot, p) => {
    const shuffled = [...pot];
    for (let i = shuffled.length - 1; i > 0; i--) { const j = rng.int(0, i); [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]; }
    for (const id of shuffled) {
      const free = groups.filter((g) => g.length === p);
      const ok = free.find((g) => unrestricted.has(id) || !g.some((x) => !unrestricted.has(x) && countryOf(x) === countryOf(id)));
      (ok ?? free[0]!).push(id);
    }
  });
  return groups;
}

export function libertadores(e: { groups: string[]; f2: string[]; f1: string[] }, club: ClubInfo, seed: number) {
  const rng = stream(seed, 13);
  const ctx = makeCtx([...e.groups, ...e.f2, ...e.f1], club, rng);
  const f1 = runTies(ctx, seedPairs(ctx, e.f1), 2);
  const f2 = runTies(ctx, seedPairs(ctx, [...e.f2, ...winners(f1)]), 2);
  const f3 = runTies(ctx, adjacent(f2).map(([a, b]) => [a, b].sort(byStrength(ctx)) as [string, string]), 2);
  const fromF3 = winners(f3);
  const groupIds = drawGroups(ctx, e.groups, new Set(fromF3), rng, fromF3);
  const groups = groupIds.map((g) => roundRobin(ctx, g, true));
  const w = groups.map((g) => g[0]!.id);
  const r = groups.map((g) => g[1]!.id);
  const r16 = runTies(ctx, w.map((id, i) => [id, r[(i + 1) % 8]!] as [string, string]), 2);
  const knockout: Phase[] = [{ name: 'oitavas', ties: r16 }];
  const champion = bracket(ctx, r16, knockout);
  return {
    preliminary: [{ name: 'fase1', ties: f1 }, { name: 'fase2', ties: f2 }, { name: 'fase3', ties: f3 }] as Phase[],
    groups, knockout, champion,
    f3Losers: f3.map((t) => (t.winner === t.a ? t.b : t.a)),
    thirds: groups.map((g) => g[2]!.id),
  };
}

export function sulAmericana(e: { groups: string[]; national: Record<string, string[]> }, libF3Losers: string[], libThirds: string[], club: ClubInfo, seed: number) {
  const rng = stream(seed, 14);
  const nat = Object.values(e.national).flat();
  const ctx = makeCtx([...e.groups, ...nat, ...libF3Losers, ...libThirds], club, rng);
  const natTies: Tie[] = [];
  for (const clubs of Object.values(e.national)) {
    const s = [...clubs];
    for (let i = s.length - 1; i > 0; i--) { const j = rng.int(0, i); [s[i], s[j]] = [s[j]!, s[i]!]; }
    natTies.push(oneLeg(ctx, s[0]!, s[1]!), oneLeg(ctx, s[2]!, s[3]!));
  }
  const groupIds = drawGroups(ctx, [...e.groups, ...winners(natTies), ...libF3Losers], new Set(), rng);
  const groups = groupIds.map((g) => roundRobin(ctx, g, true));
  const playoffs = runTies(ctx, groups.map((g, i) => [g[1]!.id, libThirds[(i + 1) % 8]!].sort(byStrength(ctx)) as [string, string]), 2);
  const r16 = runTies(ctx, groups.map((g, i) => [g[0]!.id, playoffs[i]!.winner] as [string, string]), 2);
  const knockout: Phase[] = [{ name: 'oitavas', ties: r16 }];
  const champion = bracket(ctx, r16, knockout);
  return { national: { name: 'faseNacional', ties: natTies } as Phase, groups, playoffs: { name: 'playoffs', ties: playoffs } as Phase, knockout, champion };
}
