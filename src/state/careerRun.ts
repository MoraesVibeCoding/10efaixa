import events from '../data/events.json';
import flow from '../data/flow.json';
import { autoDecide, simulateCareer, type CareerResult, type Decider, type DecisionView } from '../engine/career';
import { autoChoice } from '../engine/events';
import { MEETING_EVENT, parseProposal } from '../engine/meeting';
import type { CreationInput } from '../engine/player';

// T51 (a): carreira jogada pela tela. O motor é determinístico, então continuar = refazer do começo com as escolhas
// já feitas; a primeira decisão sem escolha interrompe a simulação e vira a próxima tela. Também é o formato do save
// (T54): criação + semente + ritmo + escolhas.
// T53 (SPEC 6.16, v2.39): o ritmo limita as decisões por temporada (flow.json). No primeiro evento de cada temporada,
// a temporada é simulada à frente com as escolhas automáticas; os eventos mais importantes dela (events.json,
// "importancia") vão para a tela e o resto o temperamento decide. A seleção depende só do que veio antes da
// temporada, então refazer do começo dá sempre a mesma; ela fica em cache para cada decisão custar uma simulação.
// T52 (v2.40): a reunião com a comissão também é decisão ("reuniao"); chega à tela nos semestres de reunioesNaTela.
export type CareerStep =
  | { kind: 'decision'; eventId: string; view: DecisionView; index: number }
  | { kind: 'done'; result: CareerResult };
export type Ritmo = 'rapido' | 'normal' | 'completo';

const OPTIONS = new Map(events.eventos.map((e) => [e.id, new Set(e.opcoes.map((o) => o.id))]));
const IMPORTANCE = new Map(events.eventos.map((e) => [e.id, e.importancia]));
const LIMITS = flow.decisoesPorTemporada as Record<Ritmo, number | null>;
/** T52 (v2.40): em quais semestres a reunião com a comissão chega à tela, por ritmo; as outras são automáticas. */
const MEETINGS = flow.reunioesNaTela as Record<Ritmo, number[]>;

/** Interrupção da simulação: chegou numa decisão que o jogador ainda não tomou. */
class Pending {
  constructor(readonly eventId: string, readonly view: DecisionView, readonly index: number) {}
}
/** Fim da simulação à frente: a temporada olhada acabou. */
class SeasonOver {}

/** Quantas vezes cada evento da temporada vai para a tela: os `limit` mais importantes; empate, o que veio antes. */
function select(found: string[], limit: number): Map<string, number> {
  const ranked = found.map((id, k) => ({ id, k })).sort((a, b) => (IMPORTANCE.get(b.id)! - IMPORTANCE.get(a.id)!) || a.k - b.k);
  const out = new Map<string, number>();
  for (const { id } of ranked.slice(0, limit)) out.set(id, (out.get(id) ?? 0) + 1);
  return out;
}

// cache das seleções: por carreira (criação, semente, ritmo), por temporada e pelas escolhas feitas antes dela
const CACHE = new Map<string, Map<string, Map<string, number>>>();
const CACHE_MAX = 4;
function cacheFor(input: CreationInput, seed: number, ritmo: Ritmo) {
  const key = `${JSON.stringify(input)}|${seed}|${ritmo}`;
  let c = CACHE.get(key);
  if (!c) {
    if (CACHE.size >= CACHE_MAX) CACHE.delete(CACHE.keys().next().value!);
    c = new Map();
    CACHE.set(key, c);
  }
  return c;
}

interface Run { input: CreationInput; seed: number; choices: readonly string[]; ritmo: Ritmo; cache: Map<string, Map<string, number>> }

function decider(run: Run, probe?: { year: number; found: string[] }): Decider {
  const limit = LIMITS[run.ritmo];
  const inUse = new Map<number, Map<string, number>>();
  let i = 0;
  return (eventId, temperament, view) => {
    const v = view();
    if (probe && v.year > probe.year) throw new SeasonOver();
    if (eventId === MEETING_EVENT) {
      const onScreen = !(probe && v.year === probe.year) && MEETINGS[run.ritmo].includes(Number(v.state.semestre));
      if (!onScreen) return autoDecide(eventId, temperament, () => v);
      return take(eventId, v);
    }
    if (probe && v.year === probe.year) { probe.found.push(eventId); return autoChoice(eventId, temperament); }
    if (limit !== null) {
      let sel = inUse.get(v.year);
      if (!sel) {
        const key = `${v.year}|${run.choices.slice(0, i).join(',')}`;
        let base = run.cache.get(key);
        if (!base) {
          base = select(lookAhead({ ...run, choices: run.choices.slice(0, i) }, v.year), limit);
          run.cache.set(key, base);
        }
        sel = new Map(base);
        inUse.set(v.year, sel);
      }
      const n = sel.get(eventId) ?? 0;
      if (n <= 0) return autoChoice(eventId, temperament);
      sel.set(eventId, n - 1);
    }
    return take(eventId, v);
  };

  /** A escolha do jogador para esta decisão; sem escolha ainda, a carreira para aqui (vira a próxima tela). */
  function take(eventId: string, v: DecisionView): string {
    if (i >= run.choices.length) throw new Pending(eventId, v, i);
    const choice = run.choices[i++]!;
    const valid = eventId === MEETING_EVENT ? parseProposal(choice) !== null : OPTIONS.get(eventId)?.has(choice);
    if (!valid) throw new RangeError(`escolha inválida "${choice}" para ${eventId} (decisão ${i})`);
    return choice;
  }
}

/** Os eventos da temporada `year`, com as escolhas feitas antes dela e as automáticas dentro dela. */
function lookAhead(run: Run, year: number): string[] {
  const probe = { year, found: [] as string[] };
  try {
    simulateCareer(run.input, run.seed, 2026, decider(run, probe));
  } catch (e) {
    if (!(e instanceof SeasonOver)) throw e;
  }
  return probe.found;
}

export function runUntilDecision(input: CreationInput, seed: number, choices: readonly string[], ritmo: Ritmo = 'completo'): CareerStep {
  const run: Run = { input, seed, choices, ritmo, cache: cacheFor(input, seed, ritmo) };
  try {
    return { kind: 'done', result: simulateCareer(input, seed, 2026, decider(run)) };
  } catch (e) {
    if (e instanceof Pending) return { kind: 'decision', eventId: e.eventId, view: e.view, index: e.index };
    throw e;
  }
}
