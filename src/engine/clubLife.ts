import { CLUBS } from './clubs';
import { effectiveRep } from './europe';
import type { Prng } from './prng';
import cfg from '../data/clubLife.json';
import neighbors from '../data/neighbors.json';

// T23 (SPEC 6.9): troca de técnico, salário atrasado (dá direito de pedir para sair) e empréstimo.
export interface ClubLifeState { clubId: string; coachRelation: number; salaryDelays: number; age: number; minutes: number; expectedRank: number; actualRank: number }
export interface ClubLifeResult { coachChanged: boolean; coachRelation: number; salaryDelayed: boolean; salaryDelays: number; canRequestLeave: boolean; loanOffer: string | null }

const N = neighbors.vizinhos as Record<string, string[]>;
const byId = new Map(CLUBS.map((c) => [c.id, c]));

export function semesterClubLife(s: ClubLifeState, rng: Prng): ClubLifeResult {
  const club = byId.get(s.clubId); // undefined = clube estrangeiro
  const reputation = club?.reputacao ?? effectiveRep(s.clubId);
  const t = cfg.tecnico;
  const pCoach = Math.min(t.max, t.trocaBase + Math.max(0, s.actualRank - s.expectedRank) * t.porPosicaoAbaixo);
  const coachChanged = rng.next() < pCoach;

  const sal = cfg.salario;
  const salaryDelayed = rng.next() < Math.max(sal.min, sal.atrasoBase - reputation * sal.porReputacao);
  const salaryDelays = salaryDelayed ? s.salaryDelays + 1 : 0;

  const e = cfg.emprestimo;
  let loanOffer: string | null = null;
  const loanRoll = rng.next();
  if (club && s.age <= e.idadeMax && s.minutes < e.minutosMax && loanRoll < e.chance) {
    const [lo, hi] = e.reputacaoAbaixo as [number, number];
    const targets = CLUBS.filter((c) => (c.uf === club.uf || N[club.uf]!.includes(c.uf))
      && c.reputacao <= club.reputacao - lo && c.reputacao >= club.reputacao - hi);
    if (targets.length) loanOffer = targets[rng.int(0, targets.length - 1)]!.id;
  }

  return {
    coachChanged,
    coachRelation: coachChanged ? t.relacaoInicial : s.coachRelation,
    salaryDelayed,
    salaryDelays,
    canRequestLeave: salaryDelays >= sal.atrasosParaPedirSaida,
    loanOffer,
  };
}
