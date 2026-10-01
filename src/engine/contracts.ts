import { CLUBS } from './clubs';
import type { Agent } from './agent';
import cfg from '../data/money.json';

// T27 (SPEC 6.12): contrato na moeda do clube (R$ no Brasil, € fora); patrimônio sempre em R$; € 1 = R$ 6,00 configurável.
export type Currency = 'BRL' | 'EUR';
export interface Contract {
  clubId: string; currency: Currency; annualSalary: number; years: number;
  signingBonus: number; winBonus: number; releaseDomestic: number; releaseAbroad: number;
}

const BRAZILIAN = new Set(CLUBS.map((c) => c.id));
export const currencyOf = (clubId: string): Currency => (BRAZILIAN.has(clubId) ? 'BRL' : 'EUR');
export const toBRL = (amount: number, currency: Currency, eurRate = cfg.cambio.EUR) =>
  Math.round(currency === 'EUR' ? amount * eurRate : amount);

/** Luvas pela influência do empresário; bicho por vitória (fração do salário mensal); multa nacional e exterior. */
export function makeContract(p: { clubId: string; annualSalary: number; years: number; agent: Agent }): Contract {
  const s = p.annualSalary;
  return {
    clubId: p.clubId,
    currency: currencyOf(p.clubId),
    annualSalary: Math.round(s),
    years: p.years,
    signingBonus: Math.round(s * (cfg.luvas.base + p.agent.influence * cfg.luvas.porInfluencia)),
    winBonus: Math.round((s / 12) * cfg.bicho.fracaoSalarioMensal),
    releaseDomestic: Math.round(s * p.years * cfg.multa.nacional),
    releaseAbroad: Math.round(s * p.years * cfg.multa.exterior),
  };
}

export const seasonEarnings = (c: Contract, wins: number) => c.annualSalary + wins * c.winBonus;

/** Soma ganhos ao patrimônio (R$), já descontada a comissão do empresário. */
export const addToWealth = (wealthBRL: number, amount: number, currency: Currency, agent: Agent) =>
  wealthBRL + Math.round(toBRL(amount, currency) * (1 - agent.commission));

/** Renovação: novos anos; aumento pela evolução do overall, com extra se o jogador pedir. */
export function renew(c: Contract, overallGain: number, askedRaise: boolean): Contract {
  const r = cfg.renovacao;
  const raise = Math.min(r.aumentoMax, Math.max(r.aumentoMin, overallGain * r.aumentoPorPonto)) + (askedRaise ? r.pedirAumentoExtra : 0);
  const annualSalary = Math.round(c.annualSalary * (1 + raise));
  return {
    ...c, annualSalary, years: r.anos,
    winBonus: Math.round((annualSalary / 12) * cfg.bicho.fracaoSalarioMensal),
    releaseDomestic: Math.round(annualSalary * r.anos * cfg.multa.nacional),
    releaseAbroad: Math.round(annualSalary * r.anos * cfg.multa.exterior),
  };
}
