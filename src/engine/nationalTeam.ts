import type { Position } from './overall';
import { createPrng } from './prng';
import cfg from '../data/nationalTeam.json';

// T35 (SPEC 6.11): treinador por ciclo, nota de visibilidade e convocação por degrau.
export type Preference = 'europa' | 'brasileirao' | 'forma';
export type Rung = 'nenhum' | 'sub17' | 'sub20' | 'olimpica' | 'lista' | 'reserva' | 'titular';
export interface Coach { cycle: number; preference: Preference }
export interface VisibilityInput { overall: number; form: number; minutes: number; league: string; reputation: number; position?: Position }
export interface CallUpInput {
  age: number; visibility: number; position: Position; caps: number;
  /** Dupla nacionalidade (T38): deslocamento dos cortes da outra seleção (negativo = mais fácil). */
  cutOffset?: number;
}
export interface CallUp { rung: Rung; ten: boolean; captain: boolean }

export const RUNGS: Rung[] = ['nenhum', 'sub17', 'sub20', 'olimpica', 'lista', 'reserva', 'titular'];

/** Treinador fictício do ciclo (troca depois de cada Copa do Mundo); preferência estável por (semente, ciclo). */
export function coachFor(year: number, careerSeed: number): Coach {
  const t = cfg.treinador;
  const cycle = Math.floor((year - t.anoBase) / t.cicloAnos);
  const rng = createPrng(Math.imul(careerSeed + 1, 0x9e3779b1) ^ Math.imul(cycle + 101, 0xc2b2ae35));
  return { cycle, preference: t.preferencias[rng.int(0, t.preferencias.length - 1)] as Preference };
}

/** Nota de visibilidade (6.11): overall + forma + minutos + peso da liga + reputação + preferência do treinador. */
export function visibility(i: VisibilityInput, coach: Coach): number {
  const w = cfg.visibilidade;
  const liked = (coach.preference === 'europa' && w.ligasEuropa.includes(i.league))
    || (coach.preference === 'brasileirao' && w.ligasBrasileirao.includes(i.league));
  return i.overall + i.form * w.forma * (coach.preference === 'forma' ? 2 : 1) + i.minutes * w.minutos
    + ((w.pesoLiga as Record<string, number>)[i.league] ?? 0) + i.reputation * w.reputacao + (liked ? w.preferencia : 0)
    + (i.position ? (w.porPosicao as Record<string, number | string>)[i.position] as number : 0);
}

/** Convocação: principal em qualquer idade; abaixo dela, o degrau de base da idade. Segue a nota, sem sorteio. */
export function callUp(i: CallUpInput): CallUp {
  const p = cfg.principal;
  const vis = i.visibility - (i.cutOffset ?? 0);
  const none = { ten: false, captain: false };
  if (vis < p.lista) {
    const youth = cfg.base.find((y) => i.age <= y.idadeMax);
    return { rung: youth && vis >= youth.corte ? (youth.degrau as Rung) : 'nenhum', ...none };
  }
  const rung: Rung = vis >= p.titular ? 'titular' : vis >= p.reserva ? 'reserva' : 'lista';
  return {
    rung,
    ten: rung === 'titular' && vis >= p.camisa10.corte && p.camisa10.posicoes.includes(i.position),
    captain: rung === 'titular' && vis >= p.capitao.corte && i.caps >= p.capitao.convocacoesMin && i.age >= p.capitao.idadeMin,
  };
}

// T36 (SPEC 6.11): efeito Seleção por degrau e decaimento do prestígio.
export interface SelectionEffect { clubMinutes: number; meetingStatus: number; marketMultiplier: number; extraOffers: number; mentalBonus: number; injuryRisk: number; moraleDelta: number }
const PRINCIPAL: Rung[] = ['lista', 'reserva', 'titular'];
export const isPrincipal = (r: Rung) => PRINCIPAL.includes(r);

/** Nível do degrau (0–1); camisa 10 e faixa somam. */
export const rungLevel = (c: CallUp): number => {
  const e = cfg.efeito;
  return Math.min(1, e.nivel[c.rung] + (c.ten ? e.camisa10 : 0) + (c.captain ? e.capitao : 0));
};

/** Prestígio: decai a cada semestre e nunca fica abaixo do nível da convocação atual. */
export const updatePrestige = (prestige: number, c: CallUp): number =>
  Math.max(prestige * cfg.efeito.decaimentoPorSemestre, rungLevel(c));

/** Efeitos do semestre: bônus pelo prestígio; contrapartidas só com convocação ativa para a principal; corte derruba a moral. */
export function selectionEffect(prestige: number, c: CallUp, prev: Rung): SelectionEffect {
  const e = cfg.efeito;
  const active = isPrincipal(c.rung);
  return {
    clubMinutes: prestige * e.minutosNoClube - (active ? e.contrapartidas.desfalque : 0),
    meetingStatus: prestige,
    marketMultiplier: 1 + prestige * e.mercado.valor,
    extraOffers: prestige * e.mercado.propostas,
    mentalBonus: active ? 1 + prestige * e.mental : 1,
    injuryRisk: active ? 1 + e.contrapartidas.riscoLesao : 1,
    moraleDelta: isPrincipal(prev) && c.rung === 'nenhum' ? e.contrapartidas.corteMoral : 0,
  };
}
