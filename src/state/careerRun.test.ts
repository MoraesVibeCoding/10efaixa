import events from '../data/events.json';
import { simulateCareer, type Decider } from '../engine/career';
import { autoChoice } from '../engine/events';
import type { CreationInput } from '../engine/player';
import { runUntilDecision } from './careerRun';

// T51 (a): a carreira para em cada decisão e continua refazendo do começo com as escolhas já feitas (motor determinístico).
const input = (over: Partial<CreationInput> = {}): CreationInput => ({
  name: 'Jogador Teste', shirtNumber: 10, state: 'BA', position: 'meia', archetypeId: 'classico10',
  biotype: { heightCm: 176, build: 'atletico' }, temperament: 'resenha', celebration: 'aviaozinho',
  origin: 'baseGrande', foot: 'direita', heartClub: 'bahia', ...over,
});
const EVENT_IDS = new Set(events.eventos.map((e) => e.id));

/** Joga a carreira inteira escolhendo sempre a opção automática, como faria o simulador. */
function playAuto(i: CreationInput, seed: number) {
  const choices: string[] = [];
  for (let guard = 0; guard < 500; guard++) {
    const step = runUntilDecision(i, seed, choices);
    if (step.kind === 'done') return { result: step.result, choices };
    choices.push(autoChoice(step.eventId, step.view.temperament));
  }
  throw new Error('carreira não terminou');
}

describe('motor interativo (T51a)', () => {
  it('simulateCareer com um decide igual ao automático dá exatamente o mesmo resultado', () => {
    const seen: string[] = [];
    const auto: Decider = (e, temp) => { seen.push(e); return autoChoice(e, temp); };
    expect(simulateCareer(input(), 11, 2026, auto)).toEqual(simulateCareer(input(), 11));
    expect(seen.length).toBeGreaterThan(0);
    expect(seen.every((e) => EVENT_IDS.has(e))).toBe(true);
  });

  it('sem escolhas, para na primeira decisão com a foto do jogador naquele momento', () => {
    const step = runUntilDecision(input(), 11, []);
    expect(step.kind).toBe('decision');
    if (step.kind !== 'decision') return;
    expect(EVENT_IDS.has(step.eventId)).toBe(true);
    const v = step.view;
    expect(v.age).toBeGreaterThanOrEqual(16);
    expect(v.year).toBeGreaterThanOrEqual(2026);
    expect(v.overall).toBeGreaterThan(0);
    expect(typeof v.state.moral).toBe('number');
    expect(v.seasons.length).toBe(v.year - 2026); // temporadas já fechadas; a idade anda de meio em meio ano
  });

  it('respondendo sempre o automático, a carreira termina igual à simulada', () => {
    const { result, choices } = playAuto(input(), 11);
    expect(choices.length).toBeGreaterThan(0);
    expect(result).toEqual(simulateCareer(input(), 11));
  });

  it('a mesma lista de escolhas sempre leva ao mesmo ponto (dá para salvar só criação, semente e escolhas)', () => {
    const first = runUntilDecision(input(), 11, []);
    if (first.kind !== 'decision') throw new Error('sem decisão');
    const one = [autoChoice(first.eventId, first.view.temperament)];
    expect(runUntilDecision(input(), 11, one)).toEqual(runUntilDecision(input(), 11, one));
    expect(runUntilDecision(input(), 11, one)).not.toEqual(first);
  });

  it('uma escolha diferente muda a carreira dali para frente', () => {
    const first = runUntilDecision(input(), 11, []);
    if (first.kind !== 'decision') throw new Error('sem decisão');
    const opts = events.eventos.find((e) => e.id === first.eventId)!.opcoes.map((o) => o.id);
    const runs = opts.map((o) => { const { result } = playFrom(input(), 11, [o]); return JSON.stringify(result); });
    expect(new Set(runs).size).toBeGreaterThan(1);
  });

  it('escolha que não existe no evento é recusada (save corrompido não vira carreira errada)', () => {
    expect(() => runUntilDecision(input(), 11, ['opcao-que-nao-existe'])).toThrow(/escolha inválida/);
  });
});

/** Joga a partir de escolhas iniciais, depois sempre o automático. */
function playFrom(i: CreationInput, seed: number, start: string[]) {
  const choices = [...start];
  for (let guard = 0; guard < 500; guard++) {
    const step = runUntilDecision(i, seed, choices);
    if (step.kind === 'done') return { result: step.result, choices };
    choices.push(autoChoice(step.eventId, step.view.temperament));
  }
  throw new Error('carreira não terminou');
}
