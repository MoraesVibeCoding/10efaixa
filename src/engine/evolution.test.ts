import { ATTRIBUTES, type Attributes } from './attributes';
import { applyBiotype } from './biotype';
import { evolveSemester, type EvoState, type SemesterContext } from './evolution';
import { createPrng } from './prng';
import cfg from '../data/evolution.json';

const flat = (v: number): Attributes =>
  Object.fromEntries(ATTRIBUTES.map((a) => [a, v])) as Attributes;

const state = (over: Partial<EvoState> = {}): EvoState => {
  const s: EvoState = {
    age: 18, attributes: flat(50), baseCaps: flat(85), caps: flat(85),
    predictedHeightCm: 180, growth: { deltaCm: 0, big: false },
    build: 'atletico', originalBuild: 'atletico', buildPush: 0, ...over,
  };
  return { ...s, caps: applyBiotype(s.baseCaps, { heightCm: s.predictedHeightCm + s.growth.deltaCm, build: s.build }) };
};

const ctx = (over: Partial<SemesterContext> = {}): SemesterContext =>
  ({ focus: {}, staffQuality: 1, minutes: 1, morale: 0.5, ...over });

const PHYSICAL = ['forca', 'velocidade', 'fisico'] as const;

/** Média da variação de um atributo em n semestres independentes (sementes diferentes). */
const meanDelta = (s: EvoState, c: SemesterContext, a: keyof Attributes, n = 2_000) => {
  let sum = 0;
  for (let seed = 0; seed < n; seed++) sum += evolveSemester(s, c, createPrng(seed)).attributes[a] - s.attributes[a];
  return sum / n;
};

describe('evolução por semestre', () => {
  it('idade avança meio ano e o estado de entrada não é alterado', () => {
    const s = state();
    const frozen = structuredClone(s);
    expect(evolveSemester(s, ctx(), createPrng(1)).age).toBe(18.5);
    expect(s).toEqual(frozen);
  });

  it('mesma semente + mesmo contexto = mesmo resultado', () => {
    expect(evolveSemester(state(), ctx(), createPrng(9))).toEqual(evolveSemester(state(), ctx(), createPrng(9)));
  });

  it('jovem com minutos evolui', () => {
    expect(meanDelta(state(), ctx(), 'passe')).toBeGreaterThan(1);
  });

  it('invariante: atributos inteiros em 1–99 e nunca acima do teto (carreiras aleatórias)', () => {
    const rng = createPrng(77);
    const violations: string[] = [];
    for (let run = 0; run < 200; run++) {
      let s = state({ age: 16, attributes: flat(40 + rng.int(0, 30)), baseCaps: flat(55 + rng.int(0, 44)),
        growth: { deltaCm: rng.int(-3, 10), big: false } });
      s = { ...s, attributes: Object.fromEntries(ATTRIBUTES.map((a) => [a, Math.min(s.attributes[a], s.caps[a])])) as Attributes };
      while (s.age < 40) {
        s = evolveSemester(s, ctx({ minutes: rng.next(), morale: rng.next(), focus: { main: 'forca', secondary: 'passe' } }), rng);
        for (const a of ATTRIBUTES) {
          const v = s.attributes[a];
          if (!Number.isInteger(v) || v < 1 || v > s.caps[a]) violations.push(`run ${run} idade ${s.age} ${a}=${v} teto=${s.caps[a]}`);
        }
      }
    }
    expect(violations).toEqual([]); // uma asserção só: ~290 mil expect() estouravam o timeout com a suíte em paralelo
  });

  it('invariante: sem minutos e sem foco, 30+ não evolui fisicamente', () => {
    for (let seed = 0; seed < 300; seed++) {
      for (const age of [30, 31.5, 33, 36, 39.5]) {
        const s = state({ age, attributes: flat(60) });
        const next = evolveSemester(s, ctx({ minutes: 0, focus: {} }), createPrng(seed));
        for (const a of PHYSICAL) expect(next.attributes[a]).toBeLessThanOrEqual(60);
      }
    }
  });

  it('retorno decrescente: perto do teto ganha menos', () => {
    expect(meanDelta(state({ attributes: flat(80) }), ctx(), 'passe'))
      .toBeLessThan(meanDelta(state({ attributes: flat(45) }), ctx(), 'passe') / 2);
  });

  it('foco principal > secundário > sem foco no crescimento', () => {
    const main = meanDelta(state(), ctx({ focus: { main: 'passe' } }), 'passe');
    const sec = meanDelta(state(), ctx({ focus: { main: 'forca', secondary: 'passe' } }), 'passe');
    const none = meanDelta(state(), ctx(), 'passe');
    expect(main).toBeGreaterThan(sec);
    expect(sec).toBeGreaterThan(none);
  });

  it('minutos, moral e comissão aumentam o crescimento', () => {
    const base = meanDelta(state(), ctx({ minutes: 0, morale: 0, staffQuality: 0.8 }), 'passe');
    expect(meanDelta(state(), ctx({ minutes: 1, morale: 0, staffQuality: 0.8 }), 'passe')).toBeGreaterThan(base);
    expect(meanDelta(state(), ctx({ minutes: 0, morale: 1, staffQuality: 0.8 }), 'passe')).toBeGreaterThan(base);
    expect(meanDelta(state(), ctx({ minutes: 0, morale: 0, staffQuality: 1.2 }), 'passe')).toBeGreaterThan(base);
  });

  it('queda: média preservada pelo arredondamento estocástico e amortecida pelo foco', () => {
    const s = state({ age: 34, attributes: flat(70) });
    const none = meanDelta(s, ctx(), 'velocidade');
    expect(none).toBeCloseTo(cfg.basePerSemester * -1.2, 0); // curva de Velocidade aos 34 = −1,2
    expect(meanDelta(s, ctx({ focus: { main: 'velocidade' } }), 'velocidade')).toBeGreaterThan(none);
  });

  it('altura cresce até os 18 e os tetos acompanham (semestre usa a altura da idade em que começa)', () => {
    let s = state({ age: 16, growth: { deltaCm: 10, big: true } });
    s = { ...s, caps: applyBiotype(s.baseCaps, { heightCm: 180, build: 'atletico' }) };
    const before = s.caps.jogoAereo;
    for (let i = 0; i < 5; i++) s = evolveSemester(s, ctx(), createPrng(i)); // semestres dos 16 aos 18
    expect(s.caps.jogoAereo).toBe(before + 5);
    expect(evolveSemester(s, ctx(), createPrng(9)).caps.jogoAereo).toBe(before + 5);
  });

  describe('compleição', () => {
    const push = (s: EvoState, main: 'forca' | 'velocidade', n: number) => {
      for (let i = 0; i < n; i++) s = evolveSemester(s, ctx({ focus: { main } }), createPrng(i));
      return s;
    };

    it('foco longo em Força: atlético → forte após 4 semestres', () => {
      expect(push(state(), 'forca', 3).build).toBe('atletico');
      expect(push(state(), 'forca', 4).build).toBe('forte');
    });

    it('pode ir e voltar: forte → atlético → franzino, todos a um degrau do atlético original', () => {
      const forte = push(state(), 'forca', 4);
      const volta = push(forte, 'velocidade', 4);
      expect(volta.build).toBe('atletico');
      expect(push(volta, 'velocidade', 4).build).toBe('franzino');
    });

    it('nunca a mais de um degrau da compleição original: franzino nunca vira forte', () => {
      const s = push(state({ build: 'franzino', originalBuild: 'franzino' }), 'forca', 40);
      expect(s.build).toBe('atletico');
      expect(s.originalBuild).toBe('franzino');
    });

    it('foco em Velocidade leva a franzino antes dos 30, mas nunca a partir dos 30', () => {
      expect(push(state({ age: 26 }), 'velocidade', 4).build).toBe('franzino');
      expect(push(state({ age: 28.5 }), 'velocidade', 4).build).toBe('atletico');
    });

    it('contador não acumula além do limiar', () => {
      const s = push(state({ age: 32 }), 'velocidade', 20);
      expect(s.buildPush).toBeGreaterThanOrEqual(-4);
      expect(push(s, 'forca', 4).build).toBe('atletico');
      expect(push(s, 'forca', 8).build).toBe('forte');
    });

    it('troca de compleição recalcula os tetos', () => {
      const s = push(state(), 'forca', 4);
      expect(s.caps.forca).toBeGreaterThan(state().caps.forca);
    });
  });

  it.each([
    ['minutos NaN', { minutes: NaN }],
    ['minutos > 1', { minutes: 1.5 }],
    ['moral < 0', { morale: -0.1 }],
    ['comissão fora da faixa', { staffQuality: 2 }],
    ['foco principal = secundário', { focus: { main: 'passe' as const, secondary: 'passe' as const } }],
    ['foco desconhecido', { focus: { main: 'chute' as never } }],
    ['secundário desconhecido', { focus: { main: 'passe' as const, secondary: 'raça' as never } }],
  ])('recusa contexto inválido: %s', (_, over) => {
    expect(() => evolveSemester(state(), ctx(over), createPrng(1))).toThrow(RangeError);
  });
});
