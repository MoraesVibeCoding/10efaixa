import { LEVELS, ROLES, clubLevelBand, expectedMinutes, minutesBand, minutesShare, roleFor, squadLevel, updateForm, updateMorale, type MinutesInput } from './minutes';
import { CLUBS } from './clubs';
import { EUROPE, effectiveRep } from './europe';
import { createPrng } from './prng';
import europe from '../data/europe.json';

const avg = (i: MinutesInput, n = 500) => Array.from({ length: n }, (_, s) => minutesShare(i, createPrng(s))).reduce((a, b) => a + b, 0) / n;
const base: MinutesInput = { overall: 70, clubRep: 80, role: 'disputa', form: 0.5 };

describe('minutos, forma e moral (T21)', () => {
  it('nível do elenco cresce com a reputação do clube', () => {
    expect(squadLevel(95)).toBeGreaterThan(squadLevel(40));
  });

  it('minutos sempre entre 0 e 1', () => {
    for (let s = 0; s < 300; s++) {
      const m = minutesShare({ overall: s % 99 + 1, clubRep: (s * 7) % 100 + 1, role: 'titularRegular', form: (s % 10) / 10 }, createPrng(s));
      expect(m).toBeGreaterThanOrEqual(0);
      expect(m).toBeLessThanOrEqual(1);
    }
  });

  it('overall relativo maior → mais minutos (mesmo clube e papel)', () => {
    expect(avg({ ...base, overall: 85 })).toBeGreaterThan(avg({ ...base, overall: 65 }) + 0.2);
  });

  it('mesmo jogador joga mais num clube menor', () => {
    expect(avg({ ...base, clubRep: 50 })).toBeGreaterThan(avg({ ...base, clubRep: 95 }));
  });

  it('os minutos esperados seguem o Over relativo ao elenco, e o papel serve de rótulo (mais Over, mais minutos)', () => {
    const order = [{ ov: 55, role: 'composicao' }, { ov: 66, role: 'reservaImediato' }, { ov: 69, role: 'disputa' }, { ov: 74, role: 'titularRegular' }, { ov: 82, role: 'titularAbsoluto' }] as const;
    const rep = 80; // elenco ~76
    const m = order.map((o) => avg({ overall: o.ov, clubRep: rep, role: o.role, form: 0.5 }));
    for (let i = 1; i < m.length; i++) expect(m[i]!).toBeGreaterThan(m[i - 1]!);
  });

  it('forma boa dá mais minutos', () => {
    expect(avg({ ...base, form: 0.9 })).toBeGreaterThan(avg({ ...base, form: 0.1 }));
  });

  it('forma: média móvel em 0–1, sobe com overall acima do elenco', () => {
    let up = 0.5;
    let down = 0.5;
    for (let s = 0; s < 20; s++) {
      up = updateForm(up, 90, 60, createPrng(s));
      down = updateForm(down, 50, 90, createPrng(s));
    }
    expect(up).toBeGreaterThan(0.7);
    expect(down).toBeLessThan(0.3);
    expect(up).toBeLessThanOrEqual(1);
    expect(down).toBeGreaterThanOrEqual(0);
  });

  it('moral cai quando joga menos que o prometido e sobe quando joga mais', () => {
    expect(updateMorale(0.6, 0.1, 'titularRegular', 0)).toBeLessThan(0.6);
    expect(updateMorale(0.6, 0.9, 'composicao', 0)).toBeGreaterThan(0.6);
    expect(updateMorale(0.6, 0.85, 'titularRegular', 1)).toBeGreaterThan(updateMorale(0.6, 0.85, 'titularRegular', -1));
    expect(updateMorale(0.99, 1, 'composicao', 1)).toBeLessThanOrEqual(1);
    expect(updateMorale(0.01, 0, 'titularRegular', -1)).toBeGreaterThanOrEqual(0);
  });
});

// T28c (SPEC 6.12, v2.28/v2.50): minutos previstos e nível do clube numa proposta, em faixa de texto e sem número.
describe('faixas da proposta (T28c)', () => {
  it('minutos previstos: titular acima do elenco = muitos; rodízio no mesmo nível = rodízio; aposta bem abaixo = poucos', () => {
    expect(minutesBand({ overall: 80, clubRep: 40, role: 'titularRegular' })).toBe('muitos');
    expect(minutesBand({ overall: squadLevel(60), clubRep: 60, role: 'disputa' })).toBe('rodizio');
    expect(minutesBand({ overall: 55, clubRep: 100, role: 'jovemPromessa' })).toBe('poucos');
  });

  it('a faixa acompanha a conta de minutos sem ruído e com forma neutra (mesmo overall: papel melhor, faixa igual ou melhor)', () => {
    const order = ['poucos', 'rodizio', 'muitos'];
    for (let ov = 40; ov <= 95; ov += 5) for (const rep of [20, 50, 80, 105]) {
      const idx = (role: 'titularRegular' | 'disputa' | 'jovemPromessa') => order.indexOf(minutesBand({ overall: ov, clubRep: rep, role }));
      expect(idx('titularRegular')).toBeGreaterThanOrEqual(idx('disputa'));
      expect(idx('disputa')).toBeGreaterThanOrEqual(idx('jovemPromessa'));
    }
  });

  it('nível do clube pela reputação: 6 níveis em ordem (T28h)', () => {
    expect(LEVELS).toEqual(['semExpressao', 'baixa', 'media', 'boa', 'alta', 'gigante']);
    const reps = Array.from({ length: 110 }, (_, i) => i + 1);
    const idx = reps.map((r) => LEVELS.indexOf(clubLevelBand(r)));
    expect(idx.every((x) => x >= 0)).toBe(true);
    for (let i = 1; i < idx.length; i++) expect(idx[i]!).toBeGreaterThanOrEqual(idx[i - 1]!);
    expect(new Set(idx).size).toBe(6);
  });

  it('cada nível tem clubes reais e os extremos fazem sentido (T28h)', () => {
    const ids = [...CLUBS.map((c) => c.id), ...EUROPE.map((c) => c.id), ...europe.outros.clubs.map((c) => c.id), ...europe.foraDoEixo.clubs.map((c) => c.id)];
    const count = new Map<string, number>();
    for (const id of ids) count.set(clubLevelBand(effectiveRep(id)), (count.get(clubLevelBand(effectiveRep(id))) ?? 0) + 1);
    for (const l of LEVELS) expect(count.get(l) ?? 0, l).toBeGreaterThanOrEqual(10);
    const reps = ids.map((id) => effectiveRep(id));
    expect(clubLevelBand(Math.min(...reps))).toBe('semExpressao');
    expect(clubLevelBand(Math.max(...reps))).toBe('gigante');
  });
});

describe('papel no elenco por faixa de idade (T28g, SPEC v2.54)', () => {
  const rep = 50;
  const sq = squadLevel(rep);

  it('tem 8 papéis, 3 até 20 anos e 5 acima', () => {
    expect(ROLES).toHaveLength(8);
    expect(new Set(ROLES).size).toBe(8);
  });

  it('até 20 anos: Jovem Promessa, Jovem em Rotação e Joia Titular, pelos cortes', () => {
    expect(roleFor(sq - 10, rep, 18)).toBe('jovemPromessa');
    expect(roleFor(sq - 3, rep, 20)).toBe('jovemRotacao');
    expect(roleFor(sq + 2, rep, 17)).toBe('jovemRotacao');
    expect(roleFor(sq + 3, rep, 20)).toBe('joiaTitular');
  });

  it('acima de 20 anos: os cinco papéis de adulto, nas bordas', () => {
    expect(roleFor(sq - 10, rep, 21)).toBe('composicao');
    expect(roleFor(sq - 3, rep, 21)).toBe('reservaImediato');
    expect(roleFor(sq, rep, 25)).toBe('disputa');
    expect(roleFor(sq + 3, rep, 30)).toBe('titularRegular');
    expect(roleFor(sq + 9, rep, 30)).toBe('titularAbsoluto');
  });

  it('todo papel tem minutos esperados entre 0 e 1 e a ordem é coerente', () => {
    // o papel vem do Over relativo (roleFor); os minutos crescem com ele: Jovem Promessa < Jovem em Rotação < Joia Titular
    const rep = 80;
    const m = (rel: number) => avg({ overall: squadLevel(rep) + rel, clubRep: rep, role: roleFor(squadLevel(rep) + rel, rep, 18), form: 0.5 });
    expect(roleFor(squadLevel(rep) - 8, rep, 18)).toBe('jovemPromessa');
    expect(roleFor(squadLevel(rep), rep, 18)).toBe('jovemRotacao');
    expect(roleFor(squadLevel(rep) + 4, rep, 18)).toBe('joiaTitular');
    expect(m(-8)).toBeLessThan(m(0));
    expect(m(0)).toBeLessThan(m(4));
  });
});

describe('textos dos papéis (T28g)', () => {
  it('os 8 papéis têm rótulo na decisão, na proposta e na prévia, e estrelas de minutos', async () => {
    const { t } = await import('../i18n');
    const preview = (await import('../data/preview.json')).default.papel as Record<string, number>;
    for (const r of ROLES) {
      expect(t(`ui.papel.${r}`)).not.toContain('ui.papel');
      expect(t(`ui.proposta.papel.${r}`)).not.toContain('ui.proposta');
      expect(t(`preview.papel.${r}`)).not.toContain('preview.papel');
      expect(preview[r]).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('curva de minutos contínua, com piso (T28l, SPEC v2.55)', () => {
  const GROUPS = [{ nome: 'adulto', roles: ['composicao', 'reservaImediato', 'disputa', 'titularRegular', 'titularAbsoluto'] as const }, { nome: 'jovem', roles: ['jovemPromessa', 'jovemRotacao', 'joiaTitular'] as const }];
  const at = (rel: number, role: (typeof GROUPS)[number]['roles'][number]) => expectedMinutes(squadLevel(80) + rel, 80, role);

  it('sem degrau: um ponto de Over a mais nunca muda os minutos em mais de 0,12 (antes chegava a 0,44)', () => {
    for (const g of GROUPS) {
      const role = g.roles[0]!;
      for (let rel = -20; rel < 20; rel += 0.5) expect(Math.abs(at(rel + 1, role) - at(rel, role)), `${g.nome} ${rel}`).toBeLessThanOrEqual(0.12);
    }
  });

  it('o caso do Coritiba: Over 69 e 68 contra elenco 72 ficam próximos (antes 46% × 2%)', () => {
    const rep = 72; // elenco ~72
    const a = expectedMinutes(squadLevel(rep) - 3, rep, roleFor(squadLevel(rep) - 3, rep, 20));
    const b = expectedMinutes(squadLevel(rep) - 4, rep, roleFor(squadLevel(rep) - 4, rep, 20));
    expect(a - b).toBeLessThanOrEqual(0.12);
  });

  it('só cresce com o Over e tem piso: quem está no elenco joga pelo menos ~5%, no máximo 100%', () => {
    for (const g of GROUPS) {
      let prev = -1;
      for (let rel = -30; rel <= 30; rel += 0.5) {
        const m = at(rel, g.roles[0]!);
        expect(m).toBeGreaterThanOrEqual(prev);
        expect(m).toBeGreaterThanOrEqual(0.05);
        expect(m).toBeLessThanOrEqual(1);
        prev = m;
      }
    }
  });

  it('jovem e adulto: o mesmo Over relativo dá minutos parecidos nos extremos (titular joga quase tudo, reserva quase nada)', () => {
    expect(at(15, 'titularAbsoluto')).toBeGreaterThan(0.95);
    expect(at(15, 'joiaTitular')).toBeGreaterThan(0.95);
    expect(at(-15, 'composicao')).toBeLessThan(0.15);
    expect(at(-15, 'jovemPromessa')).toBeLessThan(0.15);
  });
});
