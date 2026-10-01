import type { Attributes } from './attributes';
import { overall, type Position } from './overall';
import cfg from '../data/positionChange.json';

// T32 (SPEC 6.6): proposta do técnico, pedido do jogador e a troca em si. A altura nunca muda.
export interface PositionState { position: Position; archetypeId: string; originStyle: string | null; traits: string[]; heightCm: number }

const forbidden = (p: Position) => cfg.proibido.includes(p);

/** O técnico propõe a troca prevista para a posição e a idade, se o overall na nova posição compensar. */
export function coachProposal(p: { position: Position; age: number; attributes: Attributes }): Position | null {
  const rule = cfg.propostas.find((r) => r.de === p.position && p.age >= r.idadeMin);
  if (!rule) return null;
  const target = rule.para as Position;
  return overall(p.attributes, target) >= overall(p.attributes, p.position) - cfg.toleranciaProposta ? target : null;
}

/** Pedido do jogador: o técnico aceita se o overall não cai demais ou se a relação é muito boa; recusa custa moral e relação. */
export function playerRequest(p: { position: Position; target: Position; attributes: Attributes; coachRelation: number }) {
  const none = { accepted: false, moraleDelta: 0, relationDelta: 0 };
  if (p.target === p.position || forbidden(p.target) || forbidden(p.position)) return none;
  const drop = overall(p.attributes, p.position) - overall(p.attributes, p.target);
  if (drop <= cfg.pedido.toleranciaTecnico || p.coachRelation >= cfg.pedido.relacaoMin) return { ...none, accepted: true };
  return { accepted: false, moraleDelta: cfg.pedido.recusa.moral, relationDelta: cfg.pedido.recusa.relacaoTecnico };
}

/** Troca de posição: o arquétipo vira "estilo de origem" e mantém o traço; overall passa a usar os pesos da nova posição. */
export function changePosition(s: PositionState, target: Position): PositionState {
  if (target === s.position || forbidden(target) || forbidden(s.position)) throw new RangeError(`mudança inválida: ${s.position} → ${target}`);
  return { ...s, position: target, originStyle: s.originStyle ?? s.archetypeId };
}
