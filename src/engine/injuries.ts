import type { Build } from './biotype';
import type { Prng } from './prng';
import cfg from '../data/injuries.json';

// T31 (SPEC 6.13, 6.17): risco de lesão por semestre e decisão de lesão grave (três opções).
export type Severity = 'nenhuma' | 'leve' | 'media' | 'grave';
export interface InjuryInput { age: number; build: Build; minutes: number; riskMultiplier: number; relapseRisk: number }
type GraveOption = keyof typeof cfg.grave;
export const GRAVE_OPTIONS = Object.keys(cfg.grave);

/** Multiplicador de risco: compleição, idade, exposição (minutos), foco físico da reunião e recaída. */
export function injuryRisk(i: InjuryInput): number {
  const age = 1 + Math.max(0, i.age - cfg.idade.apartirDe) * cfg.idade.porAno;
  const exposure = cfg.exposicao.min + cfg.exposicao.porMinuto * i.minutes;
  return cfg.compleicao[i.build] * age * exposure * i.riskMultiplier * (1 + i.relapseRisk);
}

/** No máximo uma lesão por semestre (um sorteio); a mais grave tem prioridade na faixa do sorteio. */
export function semesterInjury(i: InjuryInput, rng: Prng): { severity: Severity; minutesLost: number } {
  const k = injuryRisk(i);
  const u = rng.next();
  let acc = 0;
  for (const s of ['grave', 'media', 'leve'] as const) {
    acc += cfg.base[s] * k;
    if (u < acc) return { severity: s, minutesLost: cfg.minutosFora[s] };
  }
  return { severity: 'nenhuma', minutesLost: 0 };
}

/** Consequências da opção escolhida na lesão grave. */
export function graveDecision(option: string) {
  const o = cfg.grave[option as GraveOption];
  if (!o) throw new RangeError(`opção de lesão grave desconhecida: ${option}`);
  return { semestersOut: o.semestresFora, relapseRisk: o.recaida, physicalLoss: o.perdaFisica, attributes: cfg.atributosAfetados };
}

export const decayRelapse = (relapseRisk: number) => relapseRisk * cfg.recaida.reducaoPorSemestre;
