import { ATTRIBUTES } from './attributes';
import { applyBiotype } from './biotype';
import { overall } from './overall';
import { createPlayer, type CreationInput, type Player } from './player';
import { createPrng } from './prng';
import data from '../data/creation.json';

const base: CreationInput = {
  name: 'Zé Pequeno da Silva', shirtNumber: 10, state: 'BA', position: 'atacante',
  archetypeId: 'matador', biotype: { heightCm: 172, build: 'atletico' },
  temperament: 'frio', celebration: 'aviaozinho', origin: 'varzea', foot: 'esquerda', heartClub: 'bahia',
};

const make = (input: Partial<CreationInput> = {}, seed = 1): Player => {
  const r = createPlayer({ ...base, ...input }, createPrng(seed));
  if (!r.ok) throw new Error(r.errors.join(','));
  return r.player;
};

// Testes estatísticos (critério da T07: 100 mil sorteios) fazem trabalho pesado de propósito.
const HEAVY = { timeout: 30_000 };

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

  it('clube de coração: guardado no jogador; "Nenhum" (null) é aceito', () => {
    expect(make().heartClub).toBe('bahia');
    expect(make({ heartClub: null }).heartClub).toBeNull();
  });

  it('mesma semente, mesmo jogador', () => {
    expect(make({}, 7)).toEqual(make({}, 7));
  });

  it.each(Object.entries(data.origins))('%s: overall inicial na faixa 6.1 e teto (potencial) entre 80 e 99', HEAVY, (origin, o) => {
    const bad = many(2_000, { origin }).filter((p) =>
      p.startingOverall < o.overall[0]! || p.startingOverall > o.overall[1]!
      || p.potential < 80 || p.potential > 99
      || Math.abs(overall(p.attributes, p.position) - p.startingOverall) > 2);
    expect(bad.map((p) => [p.startingOverall, p.potential])).toEqual([]);
  });

  it('teto efetivo tem overall igual ao potencial sorteado (±1)', () => {
    const bad = many(2_000, { origin: 'peneira' }).filter((p) => Math.abs(overall(p.caps, p.position) - p.potential) > 1);
    expect(bad.map((p) => [p.potential, overall(p.caps, p.position)])).toEqual([]);
  });

  it('chance igual de teto entre origens: mesma distribuição por faixa (±2 p.p.), sem contar diamantes', HEAVY, () => {
    const tiers = (origin: string) => {
      const ps = many(20_000, { origin }).filter((p) => !p.isDiamond);
      const share = (lo: number, hi: number) => ps.filter((p) => p.potential >= lo && p.potential <= hi).length / ps.length;
      return [share(95, 99), share(90, 94), share(85, 89), share(80, 84)];
    };
    const [b, pe, v] = [tiers('baseGrande'), tiers('peneira'), tiers('varzea')];
    for (let i = 0; i < 4; i++) {
      expect(Math.abs(b[i]! - pe[i]!)).toBeLessThanOrEqual(0.02);
      expect(Math.abs(b[i]! - v[i]!)).toBeLessThanOrEqual(0.02);
    }
  });

  it('perfil por origem: base forte em físico e fundamentos, peneira em mental e físico, várzea em mental e técnica', HEAVY, () => {
    const avg = (origin: string, keys: (keyof Player['caps'])[]) => {
      const ps = many(3_000, { origin });
      return ps.reduce((s, p) => s + keys.reduce((t, k) => t + p.caps[k], 0) / keys.length - p.potential, 0) / ps.length;
    };
    const fund = ['passe', 'finalizacao', 'jogoAereo', 'forca', 'velocidade', 'fisico'] as const;
    const tec = ['habilidade', 'drible', 'mental'] as const;
    const menFis = ['mental', 'forca', 'fisico'] as const;
    expect(avg('baseGrande', [...fund])).toBeGreaterThan(avg('varzea', [...fund]) + 2);
    expect(avg('varzea', [...tec])).toBeGreaterThan(avg('baseGrande', [...tec]) + 2);
    expect(avg('peneira', [...menFis])).toBeGreaterThan(avg('varzea', [...menFis]));
    expect(avg('peneira', ['mental'])).toBeGreaterThan(avg('baseGrande', ['mental']) + 2);
  });

  // Um lote só de 100 mil (gerar duas vezes estourava o timeout com a suíte em paralelo).
  let lot: Player[] | undefined;
  const lot100k = () => (lot ??= many(100_000));

  it('várzea: 3% ±0,5% de diamante bruto em 100 mil sorteios, com bônus de teto; nunca fora da várzea', HEAVY, () => {
    const ps = lot100k();
    const rate = ps.filter((p) => p.isDiamond).length / 100_000;
    const mean = (xs: Player[]) => xs.reduce((s, p) => s + p.potential, 0) / xs.length;
    expect(mean(ps.filter((p) => p.isDiamond))).toBeGreaterThan(mean(ps.filter((p) => !p.isDiamond)) + 3);
    expect(Math.abs(rate - 0.03)).toBeLessThanOrEqual(0.005);
    expect(many(5_000, { origin: 'peneira' }).some((p) => p.isDiamond)).toBe(false);
  });

  it('~5% ±0,5% de dupla nacionalidade; Itália/Portugal mais comuns que Espanha/Alemanha', HEAVY, () => {
    const ps = lot100k();
    const dual = ps.filter((p) => p.dualNationality);
    expect(Math.abs(dual.length / 100_000 - 0.05)).toBeLessThanOrEqual(0.005);
    const count = (c: string) => dual.filter((p) => p.dualNationality === c).length;
    expect(Math.min(count('italia'), count('portugal'))).toBeGreaterThan(3 * Math.max(count('espanha'), count('alemanha')));
  });

  it('atributos inteiros em 1–99 e nunca acima do teto', () => {
    const bad = many(5_000, { origin: 'baseGrande', biotype: { heightCm: 195, build: 'forte' } }).flatMap((p) =>
      ATTRIBUTES.filter((a) => !Number.isInteger(p.attributes[a]) || p.attributes[a] < 1
        || p.attributes[a] > p.caps[a] || p.caps[a] > 99));
    expect(bad).toEqual([]);
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
    [{ heartClub: 'barcelona' }, 'heartClub.invalid'],
    [{ biotype: { heightCm: 172, build: 'gigante' as never } }, 'build.invalid'],
  ])('recusa entrada inválida %j → %s', (input, error) => {
    const r = createPlayer({ ...base, ...input }, createPrng(1));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors).toContain(error);
  });
});
