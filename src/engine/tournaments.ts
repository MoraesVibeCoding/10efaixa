import type { Rung } from './nationalTeam';
import type { Prng } from './prng';
import { outcome } from './season';
import leagues from '../data/leagues.json';
import cfg from '../data/nationalTournaments.json';

// T37 (SPEC 6.11): Copa do Mundo, Copa América e Olimpíadas. Só o caminho do Brasil é simulado.
export type NTournament = keyof typeof cfg.torneios;
export const TOURNAMENTS = Object.keys(cfg.torneios) as NTournament[];
export interface TournamentInput {
  tournament: NTournament; rung: Rung; overall: number; mental: number;
  /** Dupla nacionalidade (T38): força da outra seleção no lugar da do Brasil. */
  teamStrength?: number;
}
export interface TournamentResult {
  /** 'grupos', o nome da fase em que caiu ou 'campeao'. */
  stage: string; champion: boolean; matches: number; hero: boolean; villain: boolean; injured: boolean;
  decisions: { event: string; option: string }[];
}
export type Decide = (event: string) => string;


const M = leagues.match;
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const PRINCIPAL = ['lista', 'reserva', 'titular'];
const POOLS = {
  americas: Object.values(cfg.selecoes.americas),
  todos: [...Object.values(cfg.selecoes.americas), ...Object.values(cfg.selecoes.resto)],
};
for (const p of Object.values(POOLS)) p.sort((a, b) => b - a);

/** Copa e Copa América: convocado para a principal (Copa América só para seleções das Américas). Olimpíadas: degrau Olímpica, ou principal até o limite de idade. */
export function eligible(t: NTournament, rung: Rung, age: number, country?: string): boolean {
  const def = cfg.torneios[t];
  if (country && def.adversarios === 'americas' && !(country in cfg.selecoes.americas)) return false;
  if (def.degrau === 'principal') return PRINCIPAL.includes(rung);
  return rung === 'olimpica' || (PRINCIPAL.includes(rung) && age <= cfg.torneios.olimpiadas.idadeMaxPrincipal);
}

/**
 * Caminho do Brasil: 3 jogos de grupo e o mata-mata do formato, em campo neutro.
 * ponytail: os outros grupos não são simulados; o adversário de cada fase sai de uma fatia cada vez mais forte das seleções.
 */
export function playTournament(i: TournamentInput, decide: Decide, rng: Prng): TournamentResult {
  const def = cfg.torneios[i.tournament];
  const pool = POOLS[def.adversarios as keyof typeof POOLS];
  const b = cfg.brasil;
  const m = cfg.momentos;
  const share = (b.impacto.porDegrau as Record<string, number>)[PRINCIPAL.includes(i.rung) ? i.rung : 'olimpica'] ?? 0;
  const impact = clamp((i.overall - b.impacto.refOverall) * b.impacto.porPonto, -b.impacto.max, b.impacto.max) * share;
  const base = (i.teamStrength ?? b.forca) + (rng.next() * 2 - 1) * M.formNoise;
  const opponent = (slice: number) => pool[rng.int(0, slice - 1)]! + (rng.next() * 2 - 1) * M.formNoise;
  const r: TournamentResult = { stage: 'grupos', champion: false, matches: 0, hero: false, villain: false, injured: false, decisions: [] };
  let benched = false;
  let scoredDecisive = false;

  // Fase de grupos; o momento garantido vem antes do 3º jogo.
  let points = 0;
  for (let g = 0; g < def.jogosGrupo; g++) {
    let strength = base + (benched ? 0 : impact);
    if (g === def.jogosGrupo - 1) {
      const event = rng.next() < 0.5 ? 'copa-sacrificio' : 'copa-fora-posicao';
      const option = decide(event);
      r.decisions.push({ event, option });
      const fx = (m[event as 'copa-sacrificio'] as Record<string, { forca?: number; riscoLesao?: number; semImpacto?: boolean; semImpactoAteOFim?: boolean }>)[option] ?? {};
      if (fx.semImpactoAteOFim) benched = true;
      if (fx.semImpacto || fx.semImpactoAteOFim) strength = base;
      strength += fx.forca ?? 0;
      if (fx.riscoLesao && rng.next() < fx.riscoLesao) r.injured = true;
    }
    points += outcome(strength - opponent(pool.length), rng.next());
    r.matches++;
  }
  if (points < def.pontosParaAvancar) return r;

  // Mata-mata: empate vai aos pênaltis; o primeiro empate traz o pênalti decisivo.
  const rounds = def.mataMata;
  for (let k = 0; k < rounds.length; k++) {
    r.stage = rounds[k]!;
    r.matches++;
    const d = base + (benched ? 0 : impact) - opponent(Math.max(4, Math.ceil((pool.length * (rounds.length - k)) / (rounds.length + 1))));
    const res = outcome(d, rng.next());
    let won = res === 3;
    if (res === 1) {
      const offered = !r.decisions.some((x) => x.event === 'copa-penalti');
      const option = offered ? decide('copa-penalti') : 'deixar';
      if (offered) r.decisions.push({ event: 'copa-penalti', option });
      if (option !== 'deixar') {
        const pk = m['copa-penalti'];
        won = rng.next() < clamp(pk.acertoBase + (i.mental - pk.refMental) * pk.porPontoMental, pk.limites[0]!, pk.limites[1]!);
        if (won) scoredDecisive = true; else r.villain = true;
      } else {
        won = rng.next() < clamp(0.5 + d * M.penaltyStrengthWeight, M.penaltyClamp[0]!, M.penaltyClamp[1]!);
      }
    }
    if (!won) return r;
  }
  r.stage = 'campeao';
  r.champion = true;
  r.hero = scoredDecisive || (share === 1 && !benched && rng.next() < m.heroi.chanceTitularCampeao);
  return r;
}
