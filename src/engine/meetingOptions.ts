import { pickWeighted, type Prng } from './prng';
import { ATTRIBUTES, type Attribute, type Attributes } from './attributes';
import { autoProposal } from './meeting';
import type { Position } from './overall';
import weights from '../data/positionWeights.json';
import cfg from '../data/meeting.json';

// T52b (SPEC 6.5, v2.53): as três ideias da reunião. Tudo calculado pelo motor com os atributos do jogador; a tela só mostra.
export interface Proposal { main: Attribute; secondary: Attribute }
export type Agrado = 'muito' | 'possivel' | 'pouco';
export interface MeetingCard { proposal: Proposal; agrado: Agrado }
export interface MeetingOptions { obvia: MeetingCard; mescla: MeetingCard; ousada: MeetingCard }
export interface MeetingOptionsInput { position: Position; attrs: Attributes; caps: Attributes; age: number; score: number }

const weightsOf = (position: Position) => weights[position] as Record<Attribute, number>;

/** Chance de o clube "precisar" deste atributo: os pesos da posição normalizados (a necessidade é sorteada por eles, T52c). */
export function needProbability(position: Position, focus: string): number {
  const w = weightsOf(position);
  const total = ATTRIBUTES.reduce((s, a) => s + w[a], 0);
  return (w[focus as Attribute] ?? 0) / total;
}

const unorderedKey = (p: Proposal) => [p.main, p.secondary].sort().join('|');

/** Faixa em palavras da chance de a comissão concordar (nunca percentual); abaixo da recusa, "pouco" sempre. */
function agradoOf(position: Position, main: Attribute, score: number): Agrado {
  if (score < cfg.refuseBelow) return 'pouco';
  const chance = score >= cfg.acceptFrom ? 1 : needProbability(position, main);
  return chance >= cfg.agrado.muito ? 'muito' : chance >= cfg.agrado.possivel ? 'possivel' : 'pouco';
}

export function meetingOptions({ position, attrs, caps, age, score }: MeetingOptionsInput): MeetingOptions {
  const w = weightsOf(position);
  const obvia = autoProposal(attrs, caps, position, age);
  const taken = new Set([unorderedKey(obvia)]);
  // mais forte primeiro; empate, o de teto maior; depois a ordem fixa dos atributos
  const strongest = [...ATTRIBUTES].sort((a, b) => attrs[b] - attrs[a] || caps[b] - caps[a] || ATTRIBUTES.indexOf(a) - ATTRIBUTES.indexOf(b));

  // mescla: o principal óbvio + o diferencial do jogador (o mais forte entre os que a posição pede menos: peso até a mediana)
  const sortedW = ATTRIBUTES.map((a) => w[a]).sort((a, b) => a - b);
  const median = sortedW[Math.floor(sortedW.length / 2)]!;
  const differential = strongest.find((a) => w[a] <= median && a !== obvia.main && a !== obvia.secondary)
    ?? strongest.find((a) => a !== obvia.main && a !== obvia.secondary)!;
  const mescla: Proposal = { main: obvia.main, secondary: differential };
  taken.add(unorderedKey(mescla));

  // ousada: os dois mais fortes; se repetir outro cartão, troca o segundo pelo próximo mais forte
  const top = strongest[0]!;
  let ousada: Proposal = { main: top, secondary: strongest[1]! };
  for (let i = 2; taken.has(unorderedKey(ousada)) && i < strongest.length; i++) ousada = { main: top, secondary: strongest[i]! };
  if (taken.has(unorderedKey(ousada))) ousada = { main: strongest[1]!, secondary: strongest[2]! };

  const card = (proposal: Proposal): MeetingCard => ({ proposal, agrado: agradoOf(position, proposal.main, score) });
  return { obvia: card(obvia), mescla: card(mescla), ousada: card(ousada) };
}

/** T52c: a necessidade do clube neste semestre, sorteada pelos pesos da posição (uma só chamada ao sorteio, como antes). */
export const drawClubNeed = (position: Position, rng: Prng): Attribute => pickWeighted(rng, weightsOf(position));

export type Idea = 'obvia' | 'mescla' | 'ousada';
/** Qual das 3 ideias é esta proposta ("principal|secundário" na ordem do cartão); null se não é nenhuma. */
export function ideaOf(options: MeetingOptions, main: string, secondary: string): Idea | null {
  for (const id of ['obvia', 'mescla', 'ousada'] as const) {
    const p = options[id].proposal;
    if (p.main === main && p.secondary === secondary) return id;
  }
  return null;
}

/** Chave que liga a reunião em 3 ideias no motor (meeting.json; só liga com a tela da T52d). */
export const MEETING_IDEAS = cfg.tresIdeias;
/** Variação da confiança do técnico por ideia aceita e na contraproposta (meeting.json). */
export const TRUST = cfg.confianca;
