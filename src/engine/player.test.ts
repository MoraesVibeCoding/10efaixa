import { ATTRIBUTES } from './attributes';
import { applyBiotype } from './biotype';
import { overall } from './overall';
import { createPlayer, type CreationInput, type Player } from './player';
import { createPrng } from './prng';
import data from '../data/creation.json';

const base: CreationInput = {
  name: 'Zé Pequeno da Silva', shirtNumber: 10, state: 'BA', position: 'atacante',
  archetypeId: 'matador', biotype: { heightCm: 172, build: 'atletico' },
  temperament: 'frio', celebration: 'aviaozinho', origin: 'varzea', foot: 'esquerda',
};

const make = (input: Partial<CreationInput> = {}, seed = 1): Player => {
  const r = createPlayer({ ...base, ...input }, createPrng(seed));
  if (!r.ok) throw new Error(r.errors.join(','));
  return r.player;
};

const many = (n: number, input: Partial<CreationInput> = {}) => {
  const rng = createPrng(2026);
  return Array.from({ length: n }, () => {
    const r = createPlayer({ ...base, ...input }, rng);
    if (!r.ok) throw new Error(r.errors.join(','));
    return r.player;
  });
};

describe('criação do jogador', () => {
  it('estirão sorteado na criação e guardado no jogador', () => {
    const ps = many(2_000);
    expect(ps.every((p) => p.growth.deltaCm >= -3 && p.growth.deltaCm <= 10)).toBe(true);
    expect(new Set(ps.map((p) => p.growth.deltaCm)).size).toBeGreaterThan(5);
  });

  it('guarda os tetos antes do biotipo (baseCaps) para a evolução recalcular', () => {
    const p = make({ biotype: { heightCm: 190, build: 'forte' } });
    expect(applyBiotype(p.baseCaps, p.biotype)).toEqual(p.caps);
  });

  it('mesma semente, mesmo jogador', () => {
    expect(make({}, 7)).toEqual(make({}, 7));
  });

  it.each(Object.entries(data.origins))('%s: overall e teto sorteados dentro da faixa 6.1', (origin, o) => {
    for (const p of many(2_000, { origin })) {
      expect(p.startingOverall).toBeGreaterThanOrEqual(o.overall[0]!);
      expect(p.startingOverall).toBeLessThanOrEqual(o.overall[1]!);
      const [lo, hi] = p.isDiamond ? data.origins.varzea.diamond.potential : o.potential;
      expect(p.potential).toBeGreaterThanOrEqual(lo!);
      expect(p.potential).toBeLessThanOrEqual(hi!);
      expect(Math.abs(overall(p.attributes, p.position) - p.startingOverall)).toBeLessThanOrEqual(2);
    }
  });

  it('várzea: 3% ±0,5% de diamante bruto em 100 mil sorteios; nunca fora da várzea', () => {
    const rate = many(100_000).filter((p) => p.isDiamond).length / 100_000;
    expect(Math.abs(rate - 0.03)).toBeLessThanOrEqual(0.005);
    expect(many(5_000, { origin: 'peneira' }).some((p) => p.isDiamond)).toBe(false);
  });

  it('~5% ±0,5% de dupla nacionalidade; Itália/Portugal mais comuns que Espanha/Alemanha', () => {
    const ps = many(100_000);
    const dual = ps.filter((p) => p.dualNationality);
    expect(Math.abs(dual.length / 100_000 - 0.05)).toBeLessThanOrEqual(0.005);
    const count = (c: string) => dual.filter((p) => p.dualNationality === c).length;
    expect(Math.min(count('italia'), count('portugal'))).toBeGreaterThan(3 * Math.max(count('espanha'), count('alemanha')));
  });

  it('atributos inteiros em 1–99 e nunca acima do teto', () => {
    for (const p of many(5_000, { origin: 'baseGrande', biotype: { heightCm: 195, build: 'forte' } })) {
      for (const a of ATTRIBUTES) {
        expect(Number.isInteger(p.attributes[a])).toBe(true);
        expect(p.attributes[a]).toBeGreaterThanOrEqual(1);
        expect(p.attributes[a]).toBeLessThanOrEqual(p.caps[a]);
        expect(p.caps[a]).toBeLessThanOrEqual(99);
      }
    }
  });

  it('distribuição do arquétipo: destaques do matador acima da média dele', () => {
    const p = make({ origin: 'baseGrande' });
    const avg = ATTRIBUTES.reduce((s, a) => s + p.attributes[a], 0) / ATTRIBUTES.length;
    expect(p.attributes.finalizacao).toBeGreaterThan(avg);
    expect(p.attributes.mental).toBeGreaterThan(avg);
  });

  it.each([
    [{ name: 'Porra Silva' }, 'name.blocked'],
    [{ name: '' }, 'name.empty'],
    [{ biotype: { heightCm: 150, build: 'atletico' as const } }, 'height.outOfRange'],
    [{ archetypeId: 'paredao' }, 'archetype.invalid'],
    [{ state: 'XX' }, 'state.invalid'],
    [{ origin: 'europa' }, 'origin.invalid'],
    [{ temperament: 'bravo' }, 'temperament.invalid'],
    [{ celebration: 'nada' }, 'celebration.invalid'],
    [{ foot: 'ambas' }, 'foot.invalid'],
    [{ shirtNumber: 100 }, 'shirtNumber.invalid'],
    [{ biotype: { heightCm: 172, build: 'gigante' as never } }, 'build.invalid'],
  ])('recusa entrada inválida %j → %s', (input, error) => {
    const r = createPlayer({ ...base, ...input }, createPrng(1));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors).toContain(error);
  });
});
