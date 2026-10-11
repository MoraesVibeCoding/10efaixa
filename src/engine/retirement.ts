import type { Prng } from './prng';
import cfg from '../data/retirement.json';

// T34 (SPEC 6.14, 6.18): gatilhos de aposentadoria. v2.85: parar por decisão é escolha na tela de propostas, a partir
// dos 34 ("Pendurar as chuteiras"); o sorteio de "decidiu parar" (a partir dos 30) e o sorteio da despedida saíram.
export type RetireReason = 'decisao' | 'fisico' | 'overallInicial' | 'idadeLimite';
export interface RetireInput {
  age: number; overall: number; startingOverall: number; physical: number; peakPhysical: number;
  graveInjuries: number;
}

const FIM = cfg.fimDeCarreira;

/** v2.85: a tela de propostas traz "Pendurar as chuteiras" (e "Voltar para casa") a partir desta idade. */
export const canDecideToRetire = (age: number): boolean => age >= FIM.idadeMin;

/** Checagem de fim de temporada (sempre 1 sorteio, mantido para não mudar a ordem dos sorteios). O primeiro gatilho forçado que valer encerra a carreira. */
export function retirementCheck(s: RetireInput, rng: Prng): Exclude<RetireReason, 'decisao'> | null {
  rng.next();
  if (s.age >= cfg.idadeLimite) return 'idadeLimite';
  const f = cfg.fisico;
  if (s.age >= f.idadeMin && (s.graveInjuries >= f.gravesParaForcar || s.physical <= s.peakPhysical * f.fracaoDoAuge)) return 'fisico';
  if (s.age >= cfg.overallInicial.idadeMin && s.overall <= s.startingOverall) return 'overallInicial';
  return null;
}

/** v2.85: a sugestão do automático no card de parar: a partir da idade do temperamento, um ano antes com poucos minutos. Sem sorteio. */
export function suggestsRetiring(s: { age: number; minutes: number; temperament: string }): boolean {
  if (!canDecideToRetire(s.age)) return false;
  const a = FIM.pararAuto;
  const idade = (a.idade as Record<string, number>)[s.temperament] ?? a.idade.frio;
  return s.age >= idade - (s.minutes < a.minutosBaixos ? a.anosAntesComMinutosBaixos : 0);
}
