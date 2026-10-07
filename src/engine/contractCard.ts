import { evolveSemester, type EvoState } from './evolution';
import { marketValue } from './market';
import { expectedMinutes, type Role } from './minutes';
import { overall as overallOf, type Position } from './overall';
import type { Attributes } from './attributes';
import type { Prng } from './prng';
import cfg from '../data/contractCard.json';

// T28i (SPEC 6.12, v2.54): números do cartão de contrato. Tudo puro; a projeção de valor é uma estimativa, não uma promessa.
export type Sentido = 'sobe' | 'cai' | 'igual';
export interface Change { pct: number; sentido: Sentido }

/** Sorteio neutro: nunca desloca a evolução para cima nem para baixo (ruído zero; arredonda para cima só acima de 50%). */
const NEUTRAL: Prng = { next: () => 0.5, int: (min, max) => Math.floor((min + max) / 2), state: () => 0 };

const change = (now: number, before: number | null): Change | null => {
  if (!before || before <= 0) return null;
  const pct = Math.round(((now - before) / before) * 100);
  return { pct, sentido: Math.abs(((now - before) / before) * 100) < cfg.igualAtePct ? 'igual' : pct > 0 ? 'sobe' : pct < 0 ? 'cai' : 'igual' };
};

/** Salário contra o atual (mesma moeda e período); sem contrato atual não há comparação. */
export const salaryChange = (offer: number, current: number | null): Change | null => {
  const c = change(offer, current);
  return c && c.sentido === 'igual' ? { pct: 0, sentido: 'igual' } : c;
};

/** Valor projetado contra o valor de hoje. */
export const valueChange = (projected: number, today: number): Change | null => change(projected, today);

export interface ProjectionInput {
  evo: EvoState; position: Position; bonus?: Partial<Attributes>;
  clubRep: number; role: Role; staffQuality: number; morale: number;
}

/**
 * Overall e valor de mercado depois de uma temporada no clube: as mesmas regras de evolução, com minutos do papel (forma neutra),
 * qualidade da comissão do clube e sorteio neutro. Não altera o estado.
 */
export function projectValue(i: ProjectionInput): { overall: number; valueEUR: number } {
  let s = i.evo;
  for (let k = 0; k < cfg.semestresProjecao; k++) {
    const minutes = expectedMinutes(overallOf(s.attributes, i.position, i.bonus), i.clubRep, i.role);
    s = evolveSemester(s, { focus: {}, staffQuality: i.staffQuality, minutes, morale: i.morale }, NEUTRAL);
  }
  const overall = overallOf(s.attributes, i.position, i.bonus);
  return { overall, valueEUR: marketValue(overall, s.age) };
}
