import cfg from '../data/motor.json';
import market from '../data/market.json';
import { marketValue } from './market';

// v3.07 (proposta, docs/proposta-motor-decisoes.md): decisões, liga e clube pesam em tempo de jogo, evolução e valor.
// Tudo em src/data/motor.json; desligado (ligado: false) até a aprovação do usuário.
export const motorOn = (): boolean => cfg.ligado === true;

const lerp = (r: { min: number; max: number }, t: number) => r.min + (r.max - r.min) * Math.min(1, Math.max(0, t));
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

/** Pontos somados ao over para escalar: técnico, moral, disciplina e torcida, nessa ordem de peso. */
export function lineupBonus(s: { coachRelation: number; morale: number; discipline: number; idolatry: number }): number {
  const p = cfg.escalacao.pesos;
  const t = (s.coachRelation - 0.5) * 2, m = (s.morale - 0.5) * 2, d = (s.discipline - 0.5) * 2, i = clamp(s.idolatry / 100, -1, 1);
  return cfg.escalacao.pontosMax * (p.tecnico * t + p.moral * m + p.disciplina * d + p.torcida * i);
}

/** Nível da liga (1 a 8) do clube; clubes de exceção sobem de nível. */
export function leagueTier(clubId: string, league: string): string {
  const L = cfg.ligas;
  return (L.clubes as Record<string, string>)[clubId] ?? (L.porLiga as Record<string, string>)[league] ?? (league.startsWith('BRA-') ? '7' : L.padrao);
}
const tierOf = (tier: string) => (cfg.ligas.niveis as Record<string, { valor: number; evolucao: number }>)[tier]!;

/** Fatores da evolução do semestre: minutos e moral (curvas novas) e o produto das decisões, liga à parte. */
export function growthFactors(s: { minutes: number; morale: number; coachRelation: number; discipline: number; clubId: string | null; league: string | null }) {
  const e = cfg.evolucao;
  const minutes = lerp(e.minutos, s.minutes);
  const decisions = clamp(lerp(e.moral, s.morale) * lerp(e.tecnico, s.coachRelation) * lerp(e.disciplina, s.discipline), e.produtoDecisoes.min, e.produtoDecisoes.max);
  const league = s.clubId && s.league ? tierOf(leagueTier(s.clubId, s.league)).evolucao : 1;
  return { minutes, decisions, league };
}

/** Deslocamento do teto no semestre: proporcional ao produto das decisões em torno do neutro, até ±passoMax. */
export function capStep(decisions: number): number {
  const t = cfg.teto;
  return t.passoMax * clamp((decisions - t.neutro) / t.amplitude, -1, 1);
}
export const capShiftLimits = (): { up: number; down: number } => ({ up: cfg.teto.limiteSubida, down: cfg.teto.limiteQueda });

export const moraleRecovery = (): number => cfg.evolucao.recuperacaoMoral;
export const declineByDiscipline = (d: number): number => { const x = cfg.evolucao.declinioDisciplina; return x.disciplina0 + (x.disciplina1 - x.disciplina0) * clamp(d, 0, 1); };
export const cardsByDiscipline = (d: number): number => cfg.evolucao.cartoesDisciplina.base - clamp(d, 0, 1);

/** Fator do valor de mercado: crescimento do over no último ano, liga (com o clube de exceção) e Brasil por divisão, até fatorMax. */
export function valueFactor(s: { overDelta: number; clubId: string; league: string }): number {
  const v = cfg.valor;
  const growth = clamp(1 + v.crescimentoPorPonto * s.overDelta, v.crescimento.min, v.crescimento.max);
  const tier = leagueTier(s.clubId, s.league);
  const br = (cfg.ligas.valorBrasil as Record<string, number>)[s.league];
  const league = tier === '7' && br !== undefined && !(cfg.ligas.clubes as Record<string, string>)[s.clubId] ? br : tierOf(tier).valor;
  return Math.min(v.fatorMax, growth * league);
}

/** Valor de mercado do motor: valor base × fator × mult (elite, seleção), com o teto da curva (market.json, tetoEUR) sobre o valor final. */
export function motorValue(s: { overall: number; age: number; overDelta: number; clubId: string; league: string; mult?: number }): number {
  return Math.round(Math.min(market.curva.tetoEUR, marketValue(s.overall, s.age) * valueFactor(s) * (s.mult ?? 1)));
}
