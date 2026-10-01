import { createPrng } from './prng';
import data from '../data/calendar.json';

// Seção 6.8. O relógio entra como parâmetro: o motor continua puro e testável.
export type Tournament = keyof typeof data.tournaments;
type Def = {
  anchorYear: number; cycleYears: number; hosts: Record<string, string[]>;
  /** Sorteio por semente entre estas sedes. */
  hostPool?: string[][];
  /** Ou: sequência fixa repetida edição a edição (ex.: Copa América, 5 últimas sedes reais). */
  hostCycle?: string[][];
};
const T = data.tournaments as Record<Tournament, Def>;
const KEYS = Object.keys(T) as Tournament[];

export const startYear = (now: Date) => now.getFullYear();

export function isEditionYear(t: Tournament, year: number): boolean {
  const { anchorYear, cycleYears } = T[t];
  return year >= anchorYear && (year - anchorYear) % cycleYears === 0;
}

/** Primeira edição estritamente depois do ano dado (a do próprio ano já está em andamento ou passou). */
export function firstEditionAfter(t: Tournament, year: number): number {
  const { anchorYear, cycleYears } = T[t];
  if (year < anchorYear) return anchorYear;
  return anchorYear + (Math.floor((year - anchorYear) / cycleYears) + 1) * cycleYears;
}

/** Sede real se definida; senão a sequência fixa (hostCycle) ou sorteio estável por (semente, torneio, ano). */
export function hostOf(t: Tournament, year: number, careerSeed: number): string[] {
  if (!isEditionYear(t, year)) return [];
  const { hosts, hostPool = [], hostCycle, anchorYear, cycleYears } = T[t];
  if (hosts[year]) return hosts[year]!;
  if (hostCycle) return hostCycle[((year - anchorYear) / cycleYears) % hostCycle.length]!;
  const rng = createPrng(Math.imul(careerSeed, 0x9e3779b1) ^ Math.imul(year, 0x85ebca6b) ^ KEYS.indexOf(t));
  return hostPool[rng.int(0, hostPool.length - 1)]!;
}

/** Temporada europeia (ago–mai): o 2º semestre abre, o 1º semestre do ano seguinte fecha. */
export function europeanSeason(year: number, semester: 1 | 2): string {
  const start = semester === 2 ? year : year - 1;
  return `${start}/${String((start + 1) % 100).padStart(2, '0')}`;
}
