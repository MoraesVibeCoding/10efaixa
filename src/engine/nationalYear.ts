import cfg from '../data/nationalTeam.json';
import stats from '../data/stats.json';
import { isPrincipal, type CallUp, type Rung } from './nationalTeam';
import type { Position } from './overall';
import type { Prng } from './prng';

// v2.65 (SPEC 6.11): a Seleção ano a ano. Cada convocação do semestre vira jogos da data FIFA (por degrau) e cada torneio soma os
// jogos das fases; gols e assistências saem jogo a jogo pela taxa da posição (stats.json), ajustada pelo nível da seleção.
export type CalledRung = Exclude<Rung, 'nenhum'>;
export interface NationalYear {
  /** O degrau mais alto do ano. */
  rung: CalledRung;
  /** Todas as seleções (base contam, decisão do usuário); `main*` só a principal. */
  games: number; goals: number; assists: number; mainGames: number; mainGoals: number;
  tournaments: { tournament: string; stage: string }[];
  ten: boolean; captain: boolean;
}

const J = cfg.jogos;
const ORDER: CalledRung[] = ['sub17', 'sub20', 'olimpica', 'lista', 'reserva', 'titular'];
const higher = (a: CalledRung, b: CalledRung) => (ORDER.indexOf(b) > ORDER.indexOf(a) ? b : a);
const levelOf = (principal: boolean, rung: CalledRung) => (principal ? J.nivel.principal : (J.nivel as Record<string, number>)[rung] ?? J.nivel.principal);

function play(y: NationalYear, games: number, principal: boolean, rung: CalledRung, position: Position, overall: number, rng: Prng): NationalYear {
  const rate = stats.porJogo[position];
  const factor = Math.exp((overall - levelOf(principal, rung)) * stats.porPontoAcimaDaLiga);
  const pg = Math.min(J.chanceMaxPorJogo, rate.gols * factor);
  const pa = Math.min(J.chanceMaxPorJogo, rate.assistencias * factor);
  let goals = 0;
  let assists = 0;
  for (let i = 0; i < games; i++) {
    if (rng.next() < pg) goals++;
    if (rng.next() < pa) assists++;
  }
  return {
    ...y, games: y.games + games, goals: y.goals + goals, assists: y.assists + assists,
    mainGames: y.mainGames + (principal ? games : 0), mainGoals: y.mainGoals + (principal ? goals : 0),
  };
}

/** A convocação do semestre: jogos da data FIFA pelo degrau. */
export function addCallUp(y: NationalYear | null, call: CallUp & { rung: CalledRung }, position: Position, overall: number, rng: Prng): NationalYear {
  const base: NationalYear = y ?? { rung: call.rung, games: 0, goals: 0, assists: 0, mainGames: 0, mainGoals: 0, tournaments: [], ten: false, captain: false };
  const games = (J.porConvocacao as Record<CalledRung, number>)[call.rung];
  return { ...play(base, games, isPrincipal(call.rung), call.rung, position, overall, rng), rung: higher(base.rung, call.rung), ten: base.ten || call.ten, captain: base.captain || call.captain };
}

/** Um torneio do ano: os jogos que o caminho da seleção teve até a fase alcançada. */
export function addTournament(y: NationalYear | null, t: { tournament: string; stage: string; matches: number; principal: boolean; rung: CalledRung }, position: Position, overall: number, rng: Prng): NationalYear {
  const base: NationalYear = y ?? { rung: t.rung, games: 0, goals: 0, assists: 0, mainGames: 0, mainGoals: 0, tournaments: [], ten: false, captain: false };
  const out = play(base, t.matches, t.principal, t.rung, position, overall, rng);
  return { ...out, rung: higher(base.rung, t.rung), tournaments: [...base.tournaments, { tournament: t.tournament, stage: t.stage }] };
}
