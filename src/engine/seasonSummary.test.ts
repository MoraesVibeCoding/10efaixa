import { ATTRIBUTES, type Attributes } from './attributes';
import { autoDecide, simulateCareer } from './career';
import { createPrng } from './prng';
import { randomInput } from './simulation';
import { summarizeSeason, type SeasonSummaryInput } from './seasonSummary';

// v2.61 (SPEC 6.15): resumo da temporada. Puro: números do ano, Over de-para com %, atributos só em direção, e as chaves do comentário do técnico.
const attrs = (v: number): Attributes => Object.fromEntries(ATTRIBUTES.map((a) => [a, v])) as Attributes;
const base: SeasonSummaryInput = {
  year: 2030, age: 22, clubId: 'santos', division: 'BRA-A', games: 34, goals: 9, assists: 5, minutes: 0.82,
  overallBefore: 70, overallAfter: 74, attrsBefore: attrs(60), attrsAfter: { ...attrs(60), passe: 66, fisico: 59 }, titles: ['estadual'],
};

describe('resumo da temporada (v2.61)', () => {
  it('leva os números do ano e o Over de-para com a variação em %', () => {
    const s = summarizeSeason(base);
    expect(s).toMatchObject({ year: 2030, partidas: 34, gols: 9, assistencias: 5, overallDe: 70, overallPara: 74, pct: 6 });
    expect(summarizeSeason({ ...base, overallBefore: 80, overallAfter: 76 }).pct).toBe(-5);
    expect(summarizeSeason({ ...base, overallBefore: 70, overallAfter: 70 }).pct).toBe(0);
  });

  it('atributos que mais mudaram só em sentido e força, do que mais mudou ao que menos, sem número', () => {
    const s = summarizeSeason({ ...base, attrsAfter: { ...attrs(60), passe: 68, drible: 64, fisico: 55, finalizacao: 61 } });
    expect(s.mudancas.map((m) => m.atributo)).toEqual(['passe', 'fisico', 'drible']);
    expect(s.mudancas[0]).toMatchObject({ sentido: 'sobe', forte: true });
    expect(s.mudancas.find((m) => m.atributo === 'fisico')).toMatchObject({ sentido: 'desce' });
    expect(JSON.stringify(s.mudancas)).not.toMatch(/\d/);
    expect(summarizeSeason({ ...base, attrsAfter: attrs(61) }).mudancas).toEqual([]);
  });

  it('chaves do comentário: evolução pela variação, minutos pela faixa, destaque no que mais subiu, título quando houve', () => {
    expect(summarizeSeason(base).comentario).toEqual({ evolucao: 'grande', minutos: 'muitos', destaque: 'passe', titulo: true });
    expect(summarizeSeason({ ...base, overallAfter: 72, titles: [], minutes: 0.5 }).comentario).toMatchObject({ evolucao: 'boa', minutos: 'rodizio', titulo: false });
    expect(summarizeSeason({ ...base, overallAfter: 70, minutes: 0.2, attrsAfter: attrs(60) }).comentario).toMatchObject({ evolucao: 'estavel', minutos: 'poucos', destaque: null });
    expect(summarizeSeason({ ...base, overallAfter: 66 }).comentario.evolucao).toBe('queda');
  });

  it('entrada inválida falha cedo', () => {
    expect(() => summarizeSeason({ ...base, overallBefore: 0 })).toThrow();
    expect(() => summarizeSeason({ ...base, games: -1 })).toThrow();
  });

  it('na carreira simulada, a visão da decisão traz o resumo da última temporada profissional, com os números do ano', () => {
    const seen: { year: number; partidas: number; gols: number }[] = [];
    for (const seed of [1, 2]) {
      const input = randomInput(createPrng(seed));
      const r = simulateCareer(input, seed, 2026, (eventId, temperament, view) => {
        const u = view().ultimaTemporada;
        if (u && !seen.some((x) => x.year === u.year)) seen.push({ year: u.year, partidas: u.partidas, gols: u.gols });
        return autoDecide(eventId, temperament, view);
      });
      expect(r.seasons.length).toBeGreaterThan(5);
    }
    expect(seen.length).toBeGreaterThan(5);
    for (const u of seen) { expect(u.partidas).toBeGreaterThanOrEqual(0); expect(u.gols).toBeGreaterThanOrEqual(0); }
    expect(seen.some((u) => u.partidas > 0)).toBe(true);
  });
});
