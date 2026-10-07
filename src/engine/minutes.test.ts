import { clubLevelBand, minutesBand, minutesShare, squadLevel, updateForm, updateMorale, type MinutesInput } from './minutes';
import { createPrng } from './prng';

const avg = (i: MinutesInput, n = 500) => Array.from({ length: n }, (_, s) => minutesShare(i, createPrng(s))).reduce((a, b) => a + b, 0) / n;
const base: MinutesInput = { overall: 70, clubRep: 80, role: 'rodizio', form: 0.5 };

describe('minutos, forma e moral (T21)', () => {
  it('nível do elenco cresce com a reputação do clube', () => {
    expect(squadLevel(95)).toBeGreaterThan(squadLevel(40));
  });

  it('minutos sempre entre 0 e 1', () => {
    for (let s = 0; s < 300; s++) {
      const m = minutesShare({ overall: s % 99 + 1, clubRep: (s * 7) % 100 + 1, role: 'titular', form: (s % 10) / 10 }, createPrng(s));
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

  it('papel prometido: titular > rodízio > reserva no mesmo overall', () => {
    const t = avg({ ...base, role: 'titular' });
    const r = avg({ ...base, role: 'rodizio' });
    const s = avg({ ...base, role: 'reserva' });
    expect(t).toBeGreaterThan(r);
    expect(r).toBeGreaterThan(s);
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
    expect(updateMorale(0.6, 0.1, 'titular', 0)).toBeLessThan(0.6);
    expect(updateMorale(0.6, 0.9, 'reserva', 0)).toBeGreaterThan(0.6);
    expect(updateMorale(0.6, 0.85, 'titular', 1)).toBeGreaterThan(updateMorale(0.6, 0.85, 'titular', -1));
    expect(updateMorale(0.99, 1, 'reserva', 1)).toBeLessThanOrEqual(1);
    expect(updateMorale(0.01, 0, 'titular', -1)).toBeGreaterThanOrEqual(0);
  });
});

// T28c (SPEC 6.12, v2.28/v2.50): minutos previstos e nível do clube numa proposta, em faixa de texto e sem número.
describe('faixas da proposta (T28c)', () => {
  it('minutos previstos: titular acima do elenco = muitos; rodízio no mesmo nível = rodízio; aposta bem abaixo = poucos', () => {
    expect(minutesBand({ overall: 80, clubRep: 40, role: 'titular' })).toBe('muitos');
    expect(minutesBand({ overall: squadLevel(60), clubRep: 60, role: 'rodizio' })).toBe('rodizio');
    expect(minutesBand({ overall: 55, clubRep: 100, role: 'aposta' })).toBe('poucos');
  });

  it('a faixa acompanha a conta de minutos sem ruído e com forma neutra (mesmo overall: papel melhor, faixa igual ou melhor)', () => {
    const order = ['poucos', 'rodizio', 'muitos'];
    for (let ov = 40; ov <= 95; ov += 5) for (const rep of [20, 50, 80, 105]) {
      const idx = (role: 'titular' | 'rodizio' | 'aposta') => order.indexOf(minutesBand({ overall: ov, clubRep: rep, role }));
      expect(idx('titular')).toBeGreaterThanOrEqual(idx('rodizio'));
      expect(idx('rodizio')).toBeGreaterThanOrEqual(idx('aposta'));
    }
  });

  it('nível do clube pela reputação: modesto, médio, grande e de elite, em ordem', () => {
    expect([20, 30, 31, 50, 51, 80, 81, 109].map(clubLevelBand)).toEqual(['modesto', 'modesto', 'medio', 'medio', 'grande', 'grande', 'elite', 'elite']);
  });
});
