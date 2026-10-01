import type { Prng } from './prng';
import cfg from '../data/agents.json';

// T26 (SPEC 6.12): 3 perfis de empresário; eventos por lealdade/influência; troca com custo e atrito.
export interface Agent { profile: string; influence: number; loyalty: number; commission: number }
type Profile = keyof typeof cfg.perfis;
export const AGENT_PROFILES = Object.keys(cfg.perfis);

export function createAgent(profile: string, rng: Prng): Agent {
  const p = cfg.perfis[profile as Profile];
  if (!p) throw new RangeError(`perfil de empresário desconhecido: ${profile}`);
  const [lo, hi] = p.lealdade as [number, number];
  return { profile, influence: p.influencia, loyalty: Math.round((lo + rng.next() * (hi - lo)) * 1000) / 1000, commission: p.comissao };
}

/** No máximo um evento por semestre, em ordem fixa; sempre 4 sorteios (determinismo estável). */
export function agentSemester(a: Agent, rng: Prng): { event: string | null; moneyLossFraction: number } {
  const e = cfg.eventos;
  const rolls = [rng.next(), rng.next(), rng.next(), rng.next()];
  const disloyal = 1 - a.loyalty;
  if (rolls[0]! < disloyal * e.forcaVenda.porDeslealdade) return { event: 'forcaVenda', moneyLossFraction: 0 };
  if (rolls[1]! < disloyal * e.someDinheiro.porDeslealdade) {
    const [lo, hi] = e.someDinheiro.perdaPatrimonio as [number, number];
    return { event: 'someDinheiro', moneyLossFraction: Math.round((lo + rolls[3]! * (hi - lo)) * 1000) / 1000 };
  }
  if (rolls[2]! < a.influence * e.brigaClube.porInfluencia) return { event: 'brigaClube', moneyLossFraction: 0 };
  return { event: null, moneyLossFraction: 0 };
}

/** Multiplicador de salário nas negociações (T28). */
export const salaryBoost = (a: Agent) => 1 + a.influence * cfg.negociacao.salarioPorInfluencia;
export const commissionOn = (amount: number, a: Agent) => Math.round(amount * a.commission);

/** Troca: multa sobre o patrimônio e queda de moral. */
export const changeAgent = (wealth: number, profile: string, rng: Prng) => ({
  agent: createAgent(profile, rng),
  cost: Math.round(Math.max(0, wealth) * cfg.troca.custoPatrimonio),
  moraleDelta: cfg.troca.moral,
});
