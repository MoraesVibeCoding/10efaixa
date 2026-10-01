import type { Prng } from './prng';
import cfg from '../data/retirement.json';

// T34 (SPEC 6.14, 6.18): gatilhos de aposentadoria e proposta de despedida.
export type RetireReason = 'decisao' | 'fisico' | 'overallInicial' | 'idadeLimite';
export interface RetireInput {
  age: number; overall: number; startingOverall: number; physical: number; peakPhysical: number;
  graveInjuries: number; minutes: number; temperament: string;
}
export interface FarewellInput { age: number; clubId: string; formativeClub: string | null; heartClub: string | null; done: boolean }

/** Gatilho 1: o botão "pendurar as chuteiras" só aparece a partir desta idade. */
export const canDecideToRetire = (age: number): boolean => age >= cfg.decisao.idadeMin;

/** Checagem de fim de temporada (sempre 1 sorteio). O primeiro gatilho que valer encerra a carreira. */
export function retirementCheck(s: RetireInput, rng: Prng): RetireReason | null {
  const u = rng.next();
  if (s.age >= cfg.idadeLimite) return 'idadeLimite';
  const f = cfg.fisico;
  if (s.age >= f.idadeMin && (s.graveInjuries >= f.gravesParaForcar || s.physical <= s.peakPhysical * f.fracaoDoAuge)) return 'fisico';
  if (s.age >= cfg.overallInicial.idadeMin && s.overall <= s.startingOverall) return 'overallInicial';
  // Decisão automática (simulação e ritmo Rápido); no jogo, a decisão é do jogador.
  const d = cfg.decisao;
  if (!canDecideToRetire(s.age)) return null;
  const chance = (d.chanceBase + d.porAno * (s.age - d.idadeMin) + (s.minutes < d.minutosBaixos ? d.bonusMinutosBaixos : 0))
    * ((d.temperamento as Record<string, number>)[s.temperament] ?? 1);
  return u < chance ? 'decisao' : null;
}

/** Proposta de encerrar a carreira no clube de coração ("realizar o sonho") ou no clube formador (sempre 1 sorteio). */
export function farewellOffer(s: FarewellInput, rng: Prng): { kind: 'formador' | 'coracao'; clubId: string } | null {
  const u = rng.next();
  if (s.done || s.age < cfg.despedida.idadeMin || u >= cfg.despedida.chance) return null;
  if (s.heartClub && s.heartClub !== s.clubId) return { kind: 'coracao', clubId: s.heartClub };
  if (s.formativeClub && s.formativeClub !== s.clubId) return { kind: 'formador', clubId: s.formativeClub };
  return null;
}
