import type { Position } from './overall';
import type { Prng } from './prng';
import cfg from '../data/stats.json';

// T39 (SPEC 6.15): números da temporada por posição.
export interface SeasonStats { games: number; goals: number; assists: number; cleanSheets: number; tackles: number }
export interface StatsInput { position: Position; overall: number; minutes: number; league: string; teamResult: number }
export const ZERO_STATS: SeasonStats = { games: 0, goals: 0, assists: 0, cleanSheets: 0, tackles: 0 };

export const leagueGroup = (league: string): 'BRA' | 'EUR' | 'padrao' =>
  league.startsWith('BRA') ? 'BRA' : cfg.ligasEUR.includes(league) ? 'EUR' : 'padrao';
export const leagueLevel = (league: string): number => (cfg.nivelLiga as Record<string, number>)[league] ?? cfg.nivelLiga.padrao;

/** Números de uma temporada (sempre 3 sorteios): jogos pelos minutos; produção pela posição e pelo overall acima do nível da liga. */
export function seasonStats(i: StatsInput, rng: Prng): SeasonStats {
  const noise = () => 1 + (rng.next() * 2 - 1) * cfg.ruido;
  const [n1, n2, n3] = [noise(), noise(), noise()];
  const rate = cfg.porJogo[i.position];
  const games = Math.round(cfg.jogosPorTemporada[leagueGroup(i.league)] * i.minutes);
  const factor = Math.exp((i.overall - leagueLevel(i.league)) * cfg.porPontoAcimaDaLiga);
  const clean = rate.semSofrerGol > 0 ? Math.min(1, Math.max(0, rate.semSofrerGol + i.teamResult * cfg.semSofrerGolPorResultado)) : 0;
  return {
    games,
    goals: Math.round(games * rate.gols * factor * n1),
    assists: Math.round(games * rate.assistencias * factor * n2),
    cleanSheets: Math.round(games * clean),
    tackles: Math.round(games * rate.desarmes * n3),
  };
}

export const addStats = (a: SeasonStats, b: SeasonStats): SeasonStats => ({
  games: a.games + b.games, goals: a.goals + b.goals, assists: a.assists + b.assists,
  cleanSheets: a.cleanSheets + b.cleanSheets, tackles: a.tackles + b.tackles,
});
