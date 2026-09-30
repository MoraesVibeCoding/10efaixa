import { ATTRIBUTES, type Attribute } from './attributes';
import type { Focus } from './evolution';
import cfg from '../data/meeting.json';

// Seção 6.5. Determinística; quem chama garante uma reunião por temporada (máquina de estados, T48).
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
const FOCI: readonly string[] = [...ATTRIBUTES, 'bolaParada', 'pernaRuim'];
const inUnit = (x: unknown) => typeof x === 'number' && Number.isFinite(x) && x >= 0 && x <= 1;

export function validateMeetingConfig(c: typeof cfg): string[] {
  const errors: string[] = [];
  const w = Object.values(c.weights);
  if (!w.every(inUnit) || Math.abs(w.reduce((s, x) => s + x, 0) - 1) > EPS) errors.push('weights devem somar 1');
  if (!(c.hardFloor <= c.refuseBelow && c.refuseBelow <= c.acceptFrom)) errors.push('limiares fora de ordem');
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

export function staffMeeting(i: MeetingInput): MeetingResult {
  validate(i);
  if (i.morale < cfg.hardFloor) return result('recusa', {}, 'moral');
  if (i.coachRelation < cfg.hardFloor) return result('recusa', {}, 'relacao');
  const w = cfg.weights;
  const score = w.morale * i.morale + w.coachRelation * i.coachRelation + w.nationalTeamStatus * i.nationalTeamStatus;
  if (score < cfg.refuseBelow - EPS) return result('recusa', {}, 'score');
  const { main, secondary } = i.proposal;
  if (score < cfg.acceptFrom - EPS && main !== i.clubNeed) {
    // Contraproposta: necessidade do clube vira principal; o desejo principal do jogador fica como secundário.
    return result('contrapropoe', { main: i.clubNeed, secondary: main });
  }
  return result('aceita', { main, secondary });
}
