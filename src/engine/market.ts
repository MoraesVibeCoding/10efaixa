import { salaryBoost, type Agent } from './agent';
import { CLUBS, areRivals } from './clubs';
import { FOREIGN } from './cups';
import { autoChoice } from './events';
import { EUROPE, areEuroRivals, effectiveRep } from './europe';
import { roleFor, squadLevel, type Role } from './minutes';
import type { Prng } from './prng';
import europe from '../data/europe.json';
import cfg from '../data/market.json';
import money from '../data/money.json';

// T28 (SPEC 6.12): valor de mercado, salário como % do valor por liga, propostas por janela e escolha automática.
export interface Offer {
  clubId: string; league: string; currency: 'BRL' | 'EUR'; annualSalary: number; years: number;
  role: Role; staffQuality: number;
  heartClub: boolean; rivalOfCurrent: boolean; rivalOfHeart: boolean; offAxis: boolean;
}
export interface MarketPlayer {
  overall: number; age: number; clubId: string | null; heartClub: string | null; temperament: string;
  /** Efeito Seleção (T36): multiplicador do valor e propostas extras. */
  valueMultiplier?: number; extraOffers?: number;
}
type DivOf = (id: string) => string | null;

const BR = new Map(CLUBS.map((c) => [c.id, c]));
const EU = new Map(EUROPE.map((c) => [c.id, c.liga]));
const OTHERS = new Set(europe.outros.clubs.map((c) => c.id));
const OFF = new Map(europe.foraDoEixo.clubs.map((c) => [c.id, c.liga]));
const OFF_LEAGUES = europe.foraDoEixo.ligas as Record<string, { salarioMultiplicador: number }>;
const LEAGUES = cfg.ligas as Record<string, { salarioPct: number; pisoSalarioAnual: number; moeda: string; janela: string }>;
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

/** Chave da liga para o mercado. Para clubes brasileiros, `div` informa a divisão atual (muda com acesso/rebaixamento). */
export function leagueOf(id: string, div?: DivOf): string {
  const br = BR.get(id);
  if (br) return `BRA-${(div ? div(id) : br.divisao) ?? 'E'}`;
  return EU.get(id) ?? (OTHERS.has(id) ? 'OUTROS' : OFF.get(id) ?? 'SAM');
}

function ageFactor(age: number): number {
  const pts = cfg.idade as [number, number][];
  if (age <= pts[0]![0]) return pts[0]![1];
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i]!;
    if (age <= x1) { const [x0, y0] = pts[i - 1]!; return y0 + ((y1 - y0) * (age - x0)) / (x1 - x0); }
  }
  return pts.at(-1)![1];
}

/** Valor de mercado em €: exponencial no overall × fator de idade, entre piso e teto. */
export function marketValue(overall: number, age: number): number {
  const c = cfg.curva;
  return Math.round(clamp(c.refValorEUR * Math.exp(c.k * (overall - c.refOverall)) * ageFactor(age), c.pisoEUR, c.tetoEUR));
}

/** Salário anual na moeda da liga: % do valor (ligas fora do eixo multiplicam), nunca abaixo do piso. */
export function salaryFor(valueEUR: number, league: string): number {
  const l = LEAGUES[league]!;
  const eur = valueEUR * l.salarioPct * (OFF_LEAGUES[league]?.salarioMultiplicador ?? 1);
  return Math.max(l.pisoSalarioAnual, Math.round(l.moeda === 'BRL' ? eur * money.cambio.EUR : eur));
}

const WINDOW_POOLS = {
  brasil: [...CLUBS.map((c) => c.id), ...FOREIGN.map((c) => c.id)],
  europa: [...EUROPE.map((c) => c.id), ...europe.outros.clubs.map((c) => c.id)],
};
const OFF_IDS = europe.foraDoEixo.clubs.map((c) => c.id);
/** Todo clube que o mercado pode oferecer (a tela precisa do nome de cada um). */
export const MARKET_CLUB_IDS = [...WINDOW_POOLS.brasil, ...WINDOW_POOLS.europa, ...OFF_IDS];

function makeOffer(p: MarketPlayer, id: string, agent: Agent, rng: Prng, div: DivOf | undefined, offAxis: boolean): Offer {
  const league = leagueOf(id, div);
  const pr = cfg.propostas;
  return {
    clubId: id, league, currency: LEAGUES[league]!.moeda as 'BRL' | 'EUR',
    annualSalary: Math.round(salaryFor(marketValue(p.overall, p.age) * (p.valueMultiplier ?? 1), league) * salaryBoost(agent)),
    years: rng.int(pr.anos[0]!, pr.anos[1]!),
    role: roleFor(p.overall, effectiveRep(id), p.age),
    staffQuality: clamp(0.8 + (effectiveRep(id) / 100) * 0.4, 0.8, 1.2),
    heartClub: id === p.heartClub,
    rivalOfCurrent: !!p.clubId && (areRivals(p.clubId, id) || areEuroRivals(p.clubId, id)),
    rivalOfHeart: !!p.heartClub && id !== p.heartClub && areRivals(p.heartClub, id),
    offAxis,
  };
}

/** Propostas de uma janela: clubes cujo nível de elenco combina com o jogador; mais propostas com empresário influente. */
export function generateOffers(p: MarketPlayer, window: 'brasil' | 'europa', agent: Agent, rng: Prng, div?: DivOf): Offer[] {
  const pr = cfg.propostas;
  const [lo, hi] = pr.janelaNivel as [number, number];
  const pool = WINDOW_POOLS[window].filter((id) => {
    const rel = p.overall - squadLevel(effectiveRep(id));
    return id !== p.clubId && rel >= lo && rel <= hi;
  });
  const n = Math.min(pr.max, pool.length, 1 + Math.floor(rng.next() * (1 + agent.influence * pr.porInfluencia + (p.extraOffers ?? 0))));
  const offers: Offer[] = [];
  for (let i = 0; i < n; i++) {
    let roll = rng.next() * pool.reduce((s, id) => s + effectiveRep(id), 0);
    const idx = Math.max(0, pool.findIndex((id) => (roll -= effectiveRep(id)) < 0));
    offers.push(makeOffer(p, pool.splice(idx, 1)[0]!, agent, rng, div, false));
  }
  const off = pr.foraDoEixo;
  if (window === 'europa' && p.age >= off.idadeMin && p.overall >= off.overallMin && rng.next() < off.chance) {
    offers.push(makeOffer(p, OFF_IDS[rng.int(0, OFF_IDS.length - 1)]!, agent, rng, div, true));
  }
  return offers;
}

/** Mandar o empresário negociar: a proposta pode sumir, melhorar ou ficar igual; influência ajuda nos dois sentidos. */
export function negotiate(o: Offer, agent: Agent, rng: Prng): Offer | null {
  const n = cfg.propostas.negociar;
  if (rng.next() < n.sumirBase * (1 - agent.influence)) return null;
  return rng.next() < agent.influence ? { ...o, annualSalary: Math.round(o.annualSalary * (1 + n.melhora)) } : o;
}

const ROLE_SCORE = cfg.pontosPapel as Record<Role, number>;
export const toBRL = (o: Offer) => (o.currency === 'EUR' ? o.annualSalary * money.cambio.EUR : o.annualSalary);

/** Custos de forçar a saída antes do fim do contrato (T28e, v2.50); os números moram em market.json. */
export const FORCE_EXIT = cfg.propostas.forcarSaida;

/** Quantas propostas a tela mostra (T28b, v2.50). */
export const MAX_SHOWN_OFFERS = 3;

/**
 * Propostas que a tela mostra e a escolha automática. `shown`: as até 3 melhores pela pontuação do temperamento, **todas**, inclusive
 * as que o temperamento do jogador recusaria por regra (rival, traição, clube do coração): na tela a decisão é dele (T28e, v2.50).
 * `pick`: a escolha automática, que só considera as que o temperamento aceita e vence "ficar" pela margem (null = fica no clube
 * atual); sempre está entre as mostradas. Sem clube atual, não há "ficar": a melhor vence.
 */
export function rankOffers(p: MarketPlayer, offers: Offer[], current: { annualSalaryBRL: number; role: Role } | null): { shown: Offer[]; pick: Offer | null } {
  const all = cfg.politica as unknown as Record<string, { nivel: number; salario: number; papel: number; ficar: number }>;
  const w = all[p.temperament] ?? all.padrao!;
  const score = (rep: number, salaryBRL: number, role: Role) =>
    w.nivel * (rep / 10) + w.salario * Math.log10(Math.max(1, salaryBRL)) + w.papel * ROLE_SCORE[role];
  const accepts = (o: Offer) =>
    (!o.rivalOfCurrent || autoChoice('proposta-rival', p.temperament) === 'aceitar')
    && (!o.rivalOfHeart || autoChoice('traicao-coracao', p.temperament) === 'aceitar')
    && (!o.heartClub || autoChoice('proposta-coracao', p.temperament) !== 'recusar');
  // sort estável: em empate fica na frente a que o motor gerou primeiro, como no laço original
  const ranked = offers.map((o) => ({ o, s: score(effectiveRep(o.clubId), toBRL(o), o.role) })).sort((a, b) => b.s - a.s);
  // Ficar leva vantagem: o apego do temperamento e uma margem mínima para valer a mudança.
  const stay = current && p.clubId
    ? score(effectiveRep(p.clubId), current.annualSalaryBRL, current.role) + w.ficar * 0.3 + cfg.propostas.margemParaSair : -Infinity;
  const best = ranked.find((x) => accepts(x.o));
  const pick = best && best.s > stay ? best.o : null;
  const shown = ranked.slice(0, MAX_SHOWN_OFFERS).map((x) => x.o);
  if (pick && !shown.includes(pick)) shown[shown.length - 1] = pick;
  return { shown, pick };
}

/** Escolha automática por temperamento (simulação e ritmo Rápido); null = fica no clube atual. Usa os dilemas da T25. */
export function chooseOffer(p: MarketPlayer, offers: Offer[], current: { annualSalaryBRL: number; role: Role } | null): Offer | null {
  return rankOffers(p, offers, current).pick;
}
