import events from '../data/events.json';
import flow from '../data/flow.json';
import { autoDecide, simulateCareer } from '../engine/career';
import { MILESTONES } from '../engine/milestones';
import { PROPOSAL_EVENT } from '../engine/proposals';
import { MEETING_EVENT } from '../engine/meeting';
import type { CreationInput } from '../engine/player';
import { runUntilDecision, type Ritmo } from './careerRun';

// T53 (SPEC 6.16, v2.39): quantas decisões chegam à tela por temporada. Rápido: 1, o evento de maior importância da
// temporada; Normal: até 3, os mais importantes; Completo: todas. As outras o temperamento decide (escolha automática).
const input = (over: Partial<CreationInput> = {}): CreationInput => ({
  name: 'Jogador Teste', shirtNumber: 10, state: 'BA', position: 'meia', archetypeId: 'classico10',
  biotype: { heightCm: 176, build: 'atletico' }, temperament: 'resenha', celebration: 'aviaozinho',
  origin: 'baseGrande', foot: 'direita', heartClub: 'bahia', ...over,
});
const IMPORTANCE = new Map(events.eventos.map((e) => [e.id, (e as { importancia?: number }).importancia ?? 0]));

/** Joga a carreira no ritmo dado, escolhendo na tela o mesmo que o automático; devolve o que chegou à tela, por ano. */
function play(i: CreationInput, seed: number, ritmo: Ritmo) {
  const choices: string[] = [];
  const shown: Record<number, string[]> = {};
  for (let guard = 0; guard < 500; guard++) {
    const step = runUntilDecision(i, seed, choices, ritmo);
    if (step.kind === 'done') return { result: step.result, shown };
    if (step.eventId !== MEETING_EVENT && step.eventId !== PROPOSAL_EVENT) (shown[step.view.year] ??= []).push(step.eventId);
    choices.push(autoDecide(step.eventId, step.view.temperament, () => step.view));
  }
  throw new Error('carreira não terminou');
}

/** Todos os eventos de cada ano (sem as reuniões, que têm regra própria), com as escolhas automáticas. */
function allEvents(i: CreationInput, seed: number) {
  const byYear: Record<number, string[]> = {};
  simulateCareer(i, seed, 2026, (e, t, v) => { if (e !== MEETING_EVENT && e !== PROPOSAL_EVENT) (byYear[v().year] ??= []).push(e); return autoDecide(e, t, v); });
  return byYear;
}
/** T25c: no Rápido os marcos de clube são sempre automáticos e não ocupam a vaga da temporada. */
const CLUB_MARCOS = new Set(MILESTONES.filter((m) => m.escopo === 'clube').map((m) => m.id));
const top = (list: string[], n: number) => [...list].map((id, k) => ({ id, k })).sort((a, b) => (IMPORTANCE.get(b.id)! - IMPORTANCE.get(a.id)!) || a.k - b.k).slice(0, n).map((x) => x.id);

describe('decisões por ritmo (T53)', () => {
  it('dados: todo evento tem importância de 1 a 10; o limite por temporada de cada ritmo está no flow.json', () => {
    for (const e of events.eventos) expect((e as { importancia?: number }).importancia, e.id).toSatisfy((n: number) => Number.isInteger(n) && n >= 1 && n <= 10);
    expect(flow.decisoesPorTemporada).toEqual({ rapido: 1, normal: 3, completo: null });
  });

  for (const seed of [11, 42]) {
    it(`Rápido (semente ${seed}): no máximo 1 decisão por temporada, e é a mais importante que aconteceu nela`, () => {
      const all = allEvents(input(), seed);
      const { shown } = play(input(), seed, 'rapido');
      for (const [year, list] of Object.entries(all)) {
        expect(shown[Number(year)] ?? [], year).toEqual(top(list.filter((id) => !CLUB_MARCOS.has(id)), 1));
      }
    });

    it(`Normal (semente ${seed}): até 3 por temporada, as mais importantes`, () => {
      const all = allEvents(input(), seed);
      const { shown } = play(input(), seed, 'normal');
      for (const [year, list] of Object.entries(all)) {
        expect([...(shown[Number(year)] ?? [])].sort(), year).toEqual(top(list, 3).sort());
      }
    });
  }

  it('Completo: toda decisão chega à tela (o padrão de antes)', () => {
    const all = allEvents(input(), 11);
    const { shown } = play(input(), 11, 'completo');
    expect(shown).toEqual(all);
  });

  it('com as mesmas escolhas, qualquer ritmo termina na mesma carreira que a simulação automática', () => {
    const auto = simulateCareer(input(), 11);
    for (const ritmo of ['rapido', 'normal'] as const) expect(play(input(), 11, ritmo).result).toEqual(auto);
  });

  it('refazer do começo com as escolhas feitas dá a mesma decisão (o save funciona em qualquer ritmo)', () => {
    const a = runUntilDecision(input(), 11, [], 'rapido');
    if (a.kind !== 'decision') throw new Error('esperava decisão');
    const choices = [autoDecide(a.eventId, a.view.temperament, () => a.view)];
    const b1 = runUntilDecision(input(), 11, choices, 'rapido');
    const b2 = runUntilDecision(input(), 11, [...choices], 'rapido');
    expect(b1.kind === 'decision' && b2.kind === 'decision' && b1.eventId === b2.eventId && b1.view.year === b2.view.year).toBe(true);
  });
});
