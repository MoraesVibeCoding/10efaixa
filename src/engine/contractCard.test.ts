import { ATTRIBUTES, type Attributes } from './attributes';
import { applyBiotype } from './biotype';
import { projectValue, salaryChange, valueChange } from './contractCard';
import type { EvoState } from './evolution';
import { expectedMinutes } from './minutes';

const flat = (v: number): Attributes => Object.fromEntries(ATTRIBUTES.map((a) => [a, v])) as Attributes;
const evo = (age: number, v = 60): EvoState => {
  const s: EvoState = {
    age, attributes: flat(v), baseCaps: flat(90), caps: flat(90), predictedHeightCm: 180,
    growth: { deltaCm: 0, big: false }, build: 'atletico', originalBuild: 'atletico', buildPush: 0,
  };
  return { ...s, caps: applyBiotype(s.baseCaps, { heightCm: 180, build: 'atletico' }) };
};
const base = { evo: evo(19), position: 'meia' as const, clubRep: 50, role: 'joiaTitular' as const, staffQuality: 1, morale: 0.6 };

describe('minutos esperados (T28i)', () => {
  it('crescem com o papel e com o overall acima do elenco, sempre entre 0 e 1', () => {
    expect(expectedMinutes(70, 50, 'titularRegular')).toBeGreaterThan(expectedMinutes(70, 50, 'composicao'));
    expect(expectedMinutes(80, 50, 'disputa')).toBeGreaterThan(expectedMinutes(60, 50, 'disputa'));
    for (const ov of [1, 50, 99]) for (const rep of [20, 109]) {
      const m = expectedMinutes(ov, rep, 'titularAbsoluto');
      expect(m).toBeGreaterThanOrEqual(0);
      expect(m).toBeLessThanOrEqual(1);
    }
  });
});

describe('projeção de valor em uma temporada (T28i, estimativa)', () => {
  it('é determinística: mesma entrada, mesmo resultado', () => {
    expect(projectValue(base)).toEqual(projectValue(base));
  });

  it('não altera o estado do jogador e devolve valor e overall válidos', () => {
    const before = JSON.stringify(base.evo);
    const p = projectValue(base);
    expect(JSON.stringify(base.evo)).toBe(before);
    expect(p.valueEUR).toBeGreaterThan(0);
    expect(p.overall).toBeGreaterThanOrEqual(1);
    expect(p.overall).toBeLessThanOrEqual(99);
  });

  it('jovem que joga muito tende a valer mais que o mesmo jovem sem minutos', () => {
    const joga = projectValue({ ...base, role: 'joiaTitular' });
    const banco = projectValue({ ...base, role: 'jovemPromessa' });
    expect(joga.overall).toBeGreaterThanOrEqual(banco.overall);
    expect(joga.valueEUR).toBeGreaterThanOrEqual(banco.valueEUR);
  });

  it('veterano em queda não projeta valor maior que o de hoje com o mesmo overall', () => {
    const old = projectValue({ ...base, evo: evo(35, 75), role: 'titularRegular' });
    expect(old.overall).toBeLessThanOrEqual(75);
  });
});

describe('variação do salário e do valor (T28i)', () => {
  it('salário: % contra o atual, com sentido; zero quando igual; sem contrato não há %', () => {
    expect(salaryChange(38_000, 30_000)).toEqual({ pct: 27, sentido: 'sobe' });
    expect(salaryChange(20_000, 40_000)).toEqual({ pct: -50, sentido: 'cai' });
    expect(salaryChange(30_000, 30_000)).toEqual({ pct: 0, sentido: 'igual' });
    expect(salaryChange(30_100, 30_000)).toEqual({ pct: 0, sentido: 'igual' });
    expect(salaryChange(30_000, null)).toBeNull();
    expect(salaryChange(30_000, 0)).toBeNull();
  });

  it('valor: % contra o valor de hoje, arredondado', () => {
    expect(valueChange(11_500_000, 10_000_000)).toEqual({ pct: 15, sentido: 'sobe' });
    expect(valueChange(8_000_000, 10_000_000)).toEqual({ pct: -20, sentido: 'cai' });
    expect(valueChange(1, 0)).toBeNull();
  });
});
