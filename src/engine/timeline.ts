import type { CareerResult } from './career';

// T55g (SPEC 6.15, v2.51): modelo da tela "Sua carreira": uma linha por temporada, em ordem de idade. Puro: o texto
// (nome do clube, divisão, título) é montado na tela, em pt-BR; aqui só ids e números.
export type TimelineInput = Pick<CareerResult, 'seasons' | 'titles'>;
export interface TimelineRow {
  year: number; age: number; clubId: string; division: string | null; overall: number;
  /** Ids das competições ganhas no ano (ui.titulo.*), na ordem em que o motor as registrou. */
  titles: string[];
  /** Gols e assistências da temporada (0 nas categorias de base). */
  goals: number; assists: number;
  /** A primeira temporada de maior Over da carreira. */
  peak: boolean;
  /** Mudou de clube em relação à temporada anterior (a estreia não conta). */
  newClub: boolean;
}

export function timelineOf({ seasons, titles }: TimelineInput): TimelineRow[] {
  const best = seasons.reduce((max, s) => Math.max(max, s.overall), -Infinity);
  const peakIndex = seasons.findIndex((s) => s.overall === best);
  return seasons.map((s, i) => ({
    year: s.year, age: s.age, clubId: s.clubId, division: s.division, overall: s.overall, goals: s.goals, assists: s.assists,
    titles: titles.filter((t) => t.year === s.year).map((t) => t.competition),
    peak: i === peakIndex,
    newClub: i > 0 && seasons[i - 1]!.clubId !== s.clubId,
  }));
}
