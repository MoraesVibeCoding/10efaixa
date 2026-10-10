import type { CareerResult } from './career';
import type { NationalYear } from './nationalYear';

// T55g (SPEC 6.15, v2.51): modelo da tela "Sua carreira": uma linha por temporada, em ordem de idade. Puro: o texto
// (nome do clube, divisão, título) é montado na tela, em pt-BR; aqui só ids e números.
export type TimelineInput = Pick<CareerResult, 'seasons' | 'titles'>;
export interface TimelineRow {
  year: number; age: number; clubId: string; division: string | null; overall: number;
  /** Ids das competições ganhas no ano (ui.titulo.*), na ordem em que o motor as registrou. */
  titles: string[];
  /** Jogos (v2.62), gols e assistências da temporada (0 nas categorias de base). */
  games: number; goals: number; assists: number;
  /** Jogos sem sofrer gol (o goleiro vê este número no lugar de gols e assistências). */
  cleanSheets: number;
  /** A primeira temporada de maior Over da carreira. */
  peak: boolean;
  /** Mudou de clube em relação à temporada anterior (a estreia não conta). */
  newClub: boolean;
  /** v2.65: a Seleção do ano, só quando houve convocação. */
  selecao?: NationalYear;
}

export function timelineOf({ seasons, titles }: TimelineInput): TimelineRow[] {
  const best = seasons.reduce((max, s) => Math.max(max, s.overall), -Infinity);
  const peakIndex = seasons.findIndex((s) => s.overall === best);
  return seasons.map((s, i) => ({
    year: s.year, age: s.age, clubId: s.clubId, division: s.division, overall: s.overall, games: s.games, goals: s.goals, assists: s.assists, cleanSheets: s.cleanSheets,
    titles: titles.filter((t) => t.year === s.year).map((t) => t.competition),
    peak: i === peakIndex,
    newClub: i > 0 && seasons[i - 1]!.clubId !== s.clubId,
    ...(s.selecao ? { selecao: s.selecao } : {}),
  }));
}
