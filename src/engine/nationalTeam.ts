import type { Position } from './overall';
import { createPrng } from './prng';
import cfg from '../data/nationalTeam.json';

// T35 (SPEC 6.11): treinador por ciclo, nota de visibilidade e convocação por degrau.
export type Preference = 'europa' | 'brasileirao' | 'forma';
export type Rung = 'nenhum' | 'sub17' | 'sub20' | 'olimpica' | 'lista' | 'reserva' | 'titular';
export interface Coach { cycle: number; preference: Preference }
export interface VisibilityInput { overall: number; form: number; minutes: number; league: string; reputation: number }
export interface CallUpInput { age: number; visibility: number; position: Position; caps: number }
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
    + ((w.pesoLiga as Record<string, number>)[i.league] ?? 0) + i.reputation * w.reputacao + (liked ? w.preferencia : 0);
}

/** Convocação: principal em qualquer idade; abaixo dela, o degrau de base da idade. Segue a nota, sem sorteio. */
export function callUp(i: CallUpInput): CallUp {
  const p = cfg.principal;
  const none = { ten: false, captain: false };
  if (i.visibility < p.lista) {
    const youth = cfg.base.find((b) => i.age <= b.idadeMax);
    return { rung: youth && i.visibility >= youth.corte ? (youth.degrau as Rung) : 'nenhum', ...none };
  }
  const rung: Rung = i.visibility >= p.titular ? 'titular' : i.visibility >= p.reserva ? 'reserva' : 'lista';
  return {
    rung,
    ten: rung === 'titular' && i.visibility >= p.camisa10.corte && p.camisa10.posicoes.includes(i.position),
    captain: rung === 'titular' && i.visibility >= p.capitao.corte && i.caps >= p.capitao.convocacoesMin && i.age >= p.capitao.idadeMin,
  };
}
