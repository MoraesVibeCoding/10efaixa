import { ageCurve } from './ageCurves';
import { ATTRIBUTES, type Attribute, type Attributes } from './attributes';
import type { Position } from './overall';
import weights from '../data/positionWeights.json';
import { FOCI, type Focus } from './evolution';
import evo from '../data/evolution.json';
import cfg from '../data/meeting.json';

// Seção 6.5. Determinística; quem chama garante uma reunião por temporada (máquina de estados, T48).

/** T52: a reunião vista como decisão da carreira. A escolha é "principal|secundário". */
export const MEETING_EVENT = 'reuniao';
export const encodeProposal = (p: { main: Focus; secondary: Focus }): string => `${p.main}|${p.secondary}`;
/** "principal|secundário" com dois focos válidos e diferentes; senão null. */
export function parseProposal(s: string): { main: Focus; secondary: Focus } | null {
  const [main, secondary, extra] = s.split('|');
  if (extra !== undefined || !main || !secondary || main === secondary) return null;
  if (!FOCI.includes(main) || !FOCI.includes(secondary)) return null;
  return { main: main as Focus, secondary: secondary as Focus };
}
export interface MeetingInput {
  proposal: { main: Focus; secondary: Focus };
  morale: number;
  coachRelation: number;
  nationalTeamStatus: number;
  /** Escondido do jogador na UI, para a contraproposta não virar estratégia dominante. */
  clubNeed: Focus;
}

export interface MeetingResult {
  response: 'aceita' | 'contrapropoe' | 'recusa';
  /** Só na recusa; a UI escolhe o texto i18n por ele. */
  reason?: 'moral' | 'relacao' | 'score';
  focus: { main?: Focus; secondary?: Focus };
  injuryRiskMultiplier: number;
}

const EPS = 1e-9;
const inUnit = (x: unknown) => typeof x === 'number' && Number.isFinite(x) && x >= 0 && x <= 1;

export function validateMeetingConfig(c: typeof cfg): string[] {
  const errors: string[] = [];
  const w = Object.values(c.weights);
  if (!w.every(inUnit) || Math.abs(w.reduce((s, x) => s + x, 0) - 1) > EPS) errors.push('weights devem somar 1');
  if (![c.hardFloor, c.refuseBelow, c.acceptFrom].every(inUnit)) errors.push('limiares devem estar em 0–1');
  if (!(c.hardFloor <= c.refuseBelow && c.refuseBelow <= c.acceptFrom)) errors.push('limiares fora de ordem');
  if (!Object.values(c.injuryRisk).every((x) => Number.isFinite(x) && x >= 0)) errors.push('injuryRisk deve ser número ≥ 0');
  if (!c.physical.every((a) => ATTRIBUTES.includes(a as Attribute))) errors.push('physical com atributo desconhecido');
  return errors;
}

const cfgErrors = validateMeetingConfig(cfg);
if (cfgErrors.length) throw new Error(`meeting.json inválido: ${cfgErrors.join('; ')}`);

function validate(i: MeetingInput) {
  for (const k of ['morale', 'coachRelation', 'nationalTeamStatus'] as const) {
    if (!inUnit(i[k])) throw new RangeError(`${k} fora de 0–1: ${i[k]}`);
  }
  for (const f of [i.proposal.main, i.proposal.secondary, i.clubNeed]) {
    if (!FOCI.includes(f)) throw new RangeError(`foco inválido: ${f}`);
  }
  if (i.proposal.main === i.proposal.secondary) throw new RangeError('foco principal igual ao secundário');
}

const risk = ({ main, secondary }: MeetingResult['focus']) =>
  1 + (main && cfg.physical.includes(main) ? cfg.injuryRisk.main : 0)
    + (secondary && cfg.physical.includes(secondary) ? cfg.injuryRisk.secondary : 0);

const result = (response: MeetingResult['response'], focus: MeetingResult['focus'], reason?: MeetingResult['reason']): MeetingResult =>
  ({ response, ...(reason && { reason }), focus, injuryRiskMultiplier: risk(focus) });

/** Pontuação da comissão (moral, relação e Seleção) que decide aceitar, contrapropor ou recusar; a dica de agrado da tela usa a mesma. */
export const meetingScore = (i: Pick<MeetingInput, 'morale' | 'coachRelation' | 'nationalTeamStatus'>): number =>
  cfg.weights.morale * i.morale + cfg.weights.coachRelation * i.coachRelation + cfg.weights.nationalTeamStatus * i.nationalTeamStatus;

export function staffMeeting(i: MeetingInput): MeetingResult {
  validate(i);
  // v2.58: a proposta que é o que o clube quer (principal = necessidade) é sempre aceita, qualquer que seja o humor da comissão
  if (i.proposal.main === i.clubNeed) return result('aceita', { main: i.proposal.main, secondary: i.proposal.secondary });
  if (i.morale < cfg.hardFloor) return result('recusa', {}, 'moral');
  if (i.coachRelation < cfg.hardFloor) return result('recusa', {}, 'relacao');
  const score = meetingScore(i);
  if (score < cfg.refuseBelow - EPS) return result('recusa', {}, 'score');
  const { main, secondary } = i.proposal;
  if (score < cfg.acceptFrom - EPS && main !== i.clubNeed) {
    // Contraproposta: necessidade do clube vira principal; o desejo principal do jogador fica como secundário.
    return result('contrapropoe', { main: i.clubNeed, secondary: main });
  }
  return result('aceita', { main, secondary });
}

/**
 * Proposta automática (simulação e ritmo Rápido): os dois atributos em que o foco rende mais overall no semestre.
 * Crescendo: peso da posição × curva × ganho do foco × espaço até o teto. Caindo: peso × queda × o que o foco segura.
 */
export function autoProposal(attrs: Attributes, caps: Attributes, position: Position, age: number): { main: Attribute; secondary: Attribute } {
  const w: Record<string, number> = weights[position];
  const gain = evo.focusGrow.main - evo.focusGrow.none;
  const saved = 1 - evo.focusDecline.main;
  const score = (a: Attribute) => {
    const c = ageCurve(a, age);
    return w[a]! * (c > 0 ? c * gain * Math.max(0, 1 - (attrs[a] / caps[a]) ** evo.k) : -c * saved);
  };
  const [main, secondary] = [...ATTRIBUTES].sort((a, b) => score(b) - score(a));
  return { main: main!, secondary: secondary! };
}
