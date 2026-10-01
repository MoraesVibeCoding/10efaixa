import type { Prng } from './prng';
import cfg from '../data/discipline.json';

// T33 (SPEC 6.12, 6.13, 6.17): cartões por temperamento, vida fora de campo e amadurecimento do temperamento.
export interface DisciplineSemester { yellows: number; reds: number; longSuspension: boolean; minutesLost: number }
type Temp = keyof typeof cfg.cartoes.temperamento;
const factor = (t: string) => cfg.cartoes.temperamento[t as Temp] ?? 1;

/** Cartões do semestre (sempre 3 sorteios). Vermelhos e suspensão longa custam minutos do semestre seguinte. */
export function semesterCards(p: { temperament: string; minutes: number }, rng: Prng): DisciplineSemester {
  const c = cfg.cartoes;
  const [u1, u2, u3] = [rng.next(), rng.next(), rng.next()];
  if (p.minutes <= 0) return { yellows: 0, reds: 0, longSuspension: false, minutesLost: 0 };
  const k = factor(p.temperament) * p.minutes;
  const yellows = Math.round(c.amarelosPorSemestre * k * (0.5 + u1));
  const pRed = c.vermelhosPorSemestre * k;
  const reds = u2 < pRed * pRed ? 2 : u2 < pRed ? 1 : 0;
  const longSuspension = reds >= c.suspensaoLonga.vermelhos || (p.temperament === 'esquentado' && u3 < c.suspensaoLonga.chanceEsquentado);
  return { yellows, reds, longSuspension, minutesLost: reds * c.minutosPorVermelho + (longSuspension ? c.minutosSuspensaoLonga : 0) };
}

/** Gatilhos dos dilemas fora de campo do semestre (sempre 3 sorteios). */
export function offFieldFlags(p: { temperament: string; wealthBRL: number; houseBought: boolean }, rng: Prng) {
  const f = cfg.foraDeCampo;
  const chance = (table: Record<string, number>) => table[p.temperament] ?? 0;
  const [u1, u2, u3] = [rng.next(), rng.next(), rng.next()];
  return {
    conviteFesta: u1 < chance(f.festa),
    polemica: u2 < chance(f.polemica),
    podeComprarCasa: !p.houseBought && p.wealthBRL >= f.casa.patrimonioMin,
    conviteInvestir: p.wealthBRL >= f.investir.patrimonioMin && u3 < f.investir.chance,
  };
}

/** Resultado (ganho ou perda em R$) de investir uma fração do patrimônio. */
export function investmentReturn(wealthBRL: number, rng: Prng): number {
  const i = cfg.foraDeCampo.investir;
  const [lo, hi] = i.retorno as [number, number];
  return Math.round(wealthBRL * i.fracao * (lo + rng.next() * (hi - lo)));
}

/** Amadurecimento por idade ou evento (ex.: Esquentado vira Líder aos 30+ ou após suspensão longa). */
export function matureTemperament(temperament: string, age: number, longSuspension: boolean): string {
  const rules = cfg.amadurecimento as { de: string; para: string; idadeMin?: number; evento?: string }[];
  const rule = rules.find((r) => r.de === temperament
    && ((r.idadeMin !== undefined && age >= r.idadeMin) || (r.evento === 'suspensaoLonga' && longSuspension)));
  return rule?.para ?? temperament;
}

/** Líder: bônus de crescimento em Mental; atrito com o técnico quando o time vai mal. */
export function leaderEffects(temperament: string, teamResult: number) {
  if (temperament !== 'lider') return { mentalBonus: 1, relationDelta: 0 };
  const a = cfg.lider.atrito;
  return { mentalBonus: cfg.lider.bonusMental, relationDelta: teamResult < a.resultadoAbaixo ? a.relacaoTecnico : 0 };
}
