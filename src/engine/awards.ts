import type { Prng } from './prng';
import { leagueGroup, leagueLevel } from './stats';
import cfg from '../data/awards.json';

// T39 (SPEC 6.15): prêmios individuais da temporada, com nomes descritivos (i18n).
export type Award = keyof typeof cfg.premios;
export const AWARDS = Object.keys(cfg.premios) as Award[];
export interface AwardsInput {
  age: number; overall: number; form: number; minutes: number; league: string; goals: number;
  /** Competições vencidas na temporada (clube e seleção). */
  titles: string[];
  worldCup: { stage: string; titular: boolean; hero: boolean } | null;
}

/** Prêmios da temporada (sempre um sorteio por prêmio, na ordem do catálogo). */
export function seasonAwards(i: AwardsInput, rng: Prng): Award[] {
  const u = Object.fromEntries(AWARDS.map((a) => [a, rng.next() * 2 - 1])) as Record<Award, number>;
  if (i.minutes < cfg.minutosMin) return [];
  const p = cfg.premios;
  const nota = (a: Award) => i.overall + (i.form - 0.5) * cfg.nota.forma + (i.minutes - cfg.nota.refMinutos) * cfg.nota.minutos + u[a] * cfg.ruido;
  const bonus = (table: Record<string, number>, keys: string[]) => keys.reduce((sum, k) => sum + (table[k] ?? 0), 0);
  const level = leagueLevel(i.league);
  const brazil = leagueGroup(i.league) === 'BRA';
  const wc = i.worldCup;
  const won: Record<Award, boolean> = {
    artilheiro: i.goals > p.artilheiro.golsRef[leagueGroup(i.league)] + u.artilheiro * p.artilheiro.ruidoGols,
    selecaoDoCampeonato: nota('selecaoDoCampeonato') >= level + p.selecaoDoCampeonato.acimaDaLiga,
    revelacao: i.age <= p.revelacao.idadeMax && nota('revelacao') >= level + p.revelacao.acimaDaLiga,
    craqueDoBrasileirao: i.league === p.craqueDoBrasileirao.liga && nota('craqueDoBrasileirao') >= p.craqueDoBrasileirao.corte,
    craqueDoEstadual: brazil && nota('craqueDoEstadual') + (i.titles.includes('estadual') ? p.craqueDoEstadual.bonusTitulo : 0) >= p.craqueDoEstadual.corte,
    melhorDoMundo: nota('melhorDoMundo') + bonus(p.melhorDoMundo.bonus, i.titles) >= p.melhorDoMundo.corte,
    craqueDaCopa: !!wc && wc.titular && p.craqueDaCopa.fases.includes(wc.stage)
      && nota('craqueDaCopa') + bonus(p.craqueDaCopa.bonus, [wc.stage, wc.hero ? 'heroi' : '']) >= p.craqueDaCopa.corte,
  };
  return AWARDS.filter((a) => won[a]);
}
