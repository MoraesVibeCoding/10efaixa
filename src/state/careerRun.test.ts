import events from '../data/events.json';
import { autoDecide, simulateCareer, type Decider } from '../engine/career';
import { MEETING_EVENT } from '../engine/meeting';
import { marketValue } from '../engine/market';
import type { CreationInput } from '../engine/player';
import { runUntilDecision, type CareerStep, type Ritmo } from './careerRun';

/** A resposta automática da tela: na reunião, a sugestão do preparador; nos eventos, o temperamento (T52). */
const auto = (step: Extract<CareerStep, { kind: 'decision' }>) => autoDecide(step.eventId, step.view.temperament, () => step.view);

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
    choices.push(auto(step));
  }
  throw new Error('carreira não terminou');
}

describe('motor interativo (T51a)', () => {
  it('simulateCareer com um decide igual ao automático dá exatamente o mesmo resultado', () => {
    const seen: string[] = [];
    const decide: Decider = (e, temp, view) => { seen.push(e); return autoDecide(e, temp, view); };
    expect(simulateCareer(input(), 11, 2026, decide)).toEqual(simulateCareer(input(), 11));
    expect(seen.length).toBeGreaterThan(0);
    expect(seen.every((e) => EVENT_IDS.has(e) || e === MEETING_EVENT)).toBe(true);
  });

  it('sem escolhas, para na primeira decisão com a foto do jogador naquele momento', () => {
    const step = runUntilDecision(input(), 11, []);
    expect(step.kind).toBe('decision');
    if (step.kind !== 'decision') return;
    expect(EVENT_IDS.has(step.eventId) || step.eventId === MEETING_EVENT).toBe(true);
    const v = step.view;
    expect(v.age).toBeGreaterThanOrEqual(16);
    expect(v.year).toBeGreaterThanOrEqual(2026);
    expect(v.overall).toBeGreaterThan(0);
    expect(typeof v.state.moral).toBe('number');
    expect(v.seasons.length).toBe(v.year - 2026); // temporadas já fechadas; a idade anda de meio em meio ano
    // valor de mercado em € (v2.33): a mesma regra do mercado, com o efeito Seleção (que só aumenta)
    expect(v.marketValueEUR).toBeGreaterThanOrEqual(marketValue(v.overall, v.age));
    // T51 (b): o que a tela mostra vem daqui — salário do mês, número da camisa e atributos (na tela, só em faixas)
    expect(v.monthlySalary.amount).toBeGreaterThanOrEqual(0);
    expect(['BRL', 'EUR']).toContain(v.monthlySalary.currency);
    expect(v.number).toBeGreaterThanOrEqual(1);
    expect(Object.keys(v.attributes)).toHaveLength(10);
  });

  it('respondendo sempre o automático, a carreira termina igual à simulada', () => {
    const { result, choices } = playAuto(input(), 11);
    expect(choices.length).toBeGreaterThan(0);
    expect(result).toEqual(simulateCareer(input(), 11));
  });

  it('a mesma lista de escolhas sempre leva ao mesmo ponto (dá para salvar só criação, semente e escolhas)', () => {
    const first = runUntilDecision(input(), 11, []);
    if (first.kind !== 'decision') throw new Error('sem decisão');
    const one = [auto(first)];
    expect(runUntilDecision(input(), 11, one)).toEqual(runUntilDecision(input(), 11, one));
    expect(runUntilDecision(input(), 11, one)).not.toEqual(first);
  });

  it('uma escolha diferente muda a carreira dali para frente', () => {
    // o primeiro evento da carreira; as reuniões antes dele recebem a sugestão do preparador
    const before: string[] = [];
    let first = runUntilDecision(input(), 11, before);
    while (first.kind === 'decision' && first.eventId === MEETING_EVENT) { before.push(auto(first)); first = runUntilDecision(input(), 11, before); }
    if (first.kind !== 'decision') throw new Error('sem decisão');
    const opts = events.eventos.find((e) => e.id === first.eventId)!.opcoes.map((o) => o.id);
    const runs = opts.map((o) => { const { result } = playFrom(input(), 11, [...before, o]); return JSON.stringify(result); });
    expect(new Set(runs).size).toBeGreaterThan(1);
  });

  it('escolha que não existe no evento é recusada (save corrompido não vira carreira errada)', () => {
    expect(() => runUntilDecision(input(), 11, ['opcao-que-nao-existe'])).toThrow(/escolha inválida/);
  });
});

/** Joga a partir de escolhas iniciais, depois sempre o automático. */
function playFrom(i: CreationInput, seed: number, start: string[], ritmo: Ritmo = 'completo') {
  const choices = [...start];
  for (let guard = 0; guard < 500; guard++) {
    const step = runUntilDecision(i, seed, choices, ritmo);
    if (step.kind === 'done') return { result: step.result, choices };
    choices.push(auto(step));
  }
  throw new Error('carreira não terminou');
}

describe('retorno do semestre e idolatria na visão (T51b)', () => {
  /** Todas as visões da carreira, respondendo o automático. */
  function views() {
    const out: Extract<CareerStep, { kind: 'decision' }>['view'][] = [];
    const choices: string[] = [];
    for (let guard = 0; guard < 600; guard++) {
      const step = runUntilDecision(input(), 11, choices);
      if (step.kind === 'done') return out;
      out.push(step.view);
      choices.push(auto(step));
    }
    throw new Error('carreira não terminou');
  }

  it('cada decisão traz o último semestre fechado (ano, semestre e até 2 frases) e ele avança com a carreira', () => {
    const vs = views();
    const withSem = vs.filter((v) => v.ultimoSemestre);
    expect(withSem.length).toBeGreaterThan(10);
    for (const v of withSem) {
      expect(v.ultimoSemestre!.frases.length).toBeLessThanOrEqual(2);
      expect([1, 2]).toContain(v.ultimoSemestre!.semestre);
    }
    expect(withSem.some((v) => v.ultimoSemestre!.frases.length > 0)).toBe(true);
    const keys = withSem.map((v) => v.ultimoSemestre!.year * 10 + v.ultimoSemestre!.semestre);
    expect(keys).toEqual([...keys].sort((a, b) => a - b));
  });

  it('cada decisão traz a idolatria de cada clube por onde passou (−100 a 100)', () => {
    const vs = views();
    const last = vs.at(-1)!;
    expect(Object.keys(last.idolatrias).length).toBeGreaterThan(0);
    for (const v of Object.values(last.idolatrias)) expect(v).toBeGreaterThanOrEqual(-100);
    if (last.clubId) expect(last.idolatrias).toHaveProperty(last.clubId);
  });
});
