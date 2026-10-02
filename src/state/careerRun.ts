import events from '../data/events.json';
import { simulateCareer, type CareerResult, type Decider, type DecisionView } from '../engine/career';
import type { CreationInput } from '../engine/player';

// T51 (a): carreira jogada pela tela. O motor é determinístico, então continuar = refazer do começo com as escolhas
// já feitas; a primeira decisão sem escolha interrompe a simulação e vira a próxima tela. Também é o formato do save
// (T54): criação + semente + escolhas.
export type CareerStep =
  | { kind: 'decision'; eventId: string; view: DecisionView; index: number }
  | { kind: 'done'; result: CareerResult };

const OPTIONS = new Map(events.eventos.map((e) => [e.id, new Set(e.opcoes.map((o) => o.id))]));

/** Interrupção da simulação: chegou numa decisão que o jogador ainda não tomou. */
class Pending {
  constructor(readonly eventId: string, readonly view: DecisionView, readonly index: number) {}
}

export function runUntilDecision(input: CreationInput, seed: number, choices: readonly string[]): CareerStep {
  let i = 0;
  const decide: Decider = (eventId, _temperament, view) => {
    if (i >= choices.length) throw new Pending(eventId, view(), i);
    const choice = choices[i++]!;
    if (!OPTIONS.get(eventId)?.has(choice)) throw new RangeError(`escolha inválida "${choice}" para ${eventId} (decisão ${i})`);
    return choice;
  };
  try {
    return { kind: 'done', result: simulateCareer(input, seed, 2026, decide) };
  } catch (e) {
    if (e instanceof Pending) return { kind: 'decision', eventId: e.eventId, view: e.view, index: e.index };
    throw e;
  }
}
