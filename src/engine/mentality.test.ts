import { ATTRIBUTES } from './attributes';
import { evolveSemester, type EvoState } from './evolution';
import { MENTALITIES, mentalityEffects } from './mentality';
import { createPlayer, type CreationInput } from './player';
import { createPrng } from './prng';
import cfg from '../data/mentality.json';
import creation from '../i18n/pt-BR/creation.json';

const input = (mentality?: string): CreationInput => ({
  name: 'Jogador Teste', shirtNumber: 9, state: 'SP', position: 'atacante', archetypeId: 'matador', biotype: { heightCm: 180, build: 'atletico' },
  temperament: 'frio', celebration: 'aviaozinho', origin: 'varzea', foot: 'direita', heartClub: null, ...(mentality ? { mentality } : {}),
});
const evoOf = (mentality?: string): EvoState => {
  const r = createPlayer(input(mentality), createPrng(3));
  if (!r.ok) throw new Error(r.errors.join());
  const p = r.player;
  return { age: 16, attributes: p.attributes, baseCaps: p.baseCaps, caps: p.caps, predictedHeightCm: 180, growth: p.growth, build: 'atletico', originalBuild: 'atletico', buildPush: 0, growthBonus: p.growthBonus, ...mentalityEffects(mentality).evo };
};

describe('mentalidade (SPEC 6.17, proposta Fominha · Capitão · Professor · Máquina)', () => {
  it('4 opções, todas com texto pt-BR; sem mentalidade o jogador é neutro', () => {
    expect(MENTALITIES).toEqual(['fominha', 'capitao', 'professor', 'maquina']);
    for (const m of MENTALITIES) expect((creation.mentality as Record<string, string>)[m]).toBeTruthy();
    expect(creation.error['mentality.invalid' as keyof typeof creation.error]).toBeTruthy();
    expect(mentalityEffects(undefined)).toEqual({ growth: {}, evo: {} });
  });

  it('valida a escolha na criação', () => {
    expect(createPlayer(input('fominha'), createPrng(1)).ok).toBe(true);
    const bad = createPlayer(input('chefe'), createPrng(1));
    expect(bad.ok ? [] : bad.errors).toContain('mentality.invalid');
  });

  it('efeitos moderados (±30%) e sem mexer no teto de potencial', () => {
    for (const m of MENTALITIES) for (const v of Object.values(cfg[m].crescimento)) expect(Math.abs(v - 1)).toBeLessThanOrEqual(0.3 + 1e-9);
    const [a, b] = [createPlayer(input(), createPrng(7)), createPlayer(input('professor'), createPrng(7))];
    if (!a.ok || !b.ok) throw new Error('criação');
    expect(b.player.caps).toEqual(a.player.caps);
    expect(b.player.potential).toBe(a.player.potential);
  });

  it('o crescimento por atributo multiplica o da origem', () => {
    const bonus = (m?: string) => {
      const r = createPlayer(input(m), createPrng(1));
      if (!r.ok) throw new Error('criação');
      return r.player.growthBonus;
    };
    expect(bonus('capitao').mental).toBeCloseTo((bonus().mental ?? 1) * cfg.capitao.crescimento.mental);
    expect(bonus('capitao').forca).toBe(bonus().forca);
  });

  it('Professor perde menos com a idade; Máquina oscila menos; Fominha oscila mais', () => {
    const decay = (m?: string) => {
      let s: EvoState = { ...evoOf(m), age: 33 };
      const start = ATTRIBUTES.reduce((t, a) => t + s.attributes[a], 0);
      const rng = createPrng(9);
      for (let i = 0; i < 6; i++) s = evolveSemester(s, { focus: {}, staffQuality: 1, minutes: 1, morale: 0.5 }, rng);
      return start - ATTRIBUTES.reduce((t, a) => t + s.attributes[a], 0);
    };
    expect(decay('professor')).toBeLessThan(decay());
    const spread = (m?: string) => {
      const xs = Array.from({ length: 60 }, (_, i) => {
        const s = evolveSemester(evoOf(m), { focus: { main: 'passe' }, staffQuality: 1, minutes: 1, morale: 0.5 }, createPrng(i));
        return ATTRIBUTES.reduce((t, a) => t + s.attributes[a], 0);
      });
      const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
      return xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length;
    };
    expect(spread('fominha')).toBeGreaterThan(spread('maquina'));
  });
});
