import { AWARDS, seasonAwards, type Award, type AwardsInput } from './awards';
import { createPrng } from './prng';
import cfg from '../data/awards.json';
import ptBR from '../i18n/pt-BR/awards.json';

const i = (over: Partial<AwardsInput> = {}): AwardsInput => ({ age: 27, overall: 85, form: 0.6, minutes: 0.9, league: 'BRA-A', goals: 10, titles: [], worldCup: null, ...over });
const count = (input: AwardsInput, a: Award, n = 400) => Array.from({ length: n }, (_, s) => seasonAwards(input, createPrng(s))).filter((r) => r.includes(a)).length;
const god = { overall: 99, form: 1, minutes: 1, goals: 60 };

describe('prêmios (T39, SPEC 6.15)', () => {
  it('os 7 prêmios da SPEC, com nome descritivo em pt-BR e sem marca registrada', () => {
    expect([...AWARDS].sort()).toEqual(['artilheiro', 'craqueDaCopa', 'craqueDoBrasileirao', 'craqueDoEstadual', 'melhorDoMundo', 'revelacao', 'selecaoDoCampeonato']);
    for (const a of AWARDS) {
      expect((ptBR as Record<string, string>)[a]).toBeTruthy();
      expect((ptBR as Record<string, string>)[a]).not.toMatch(/bola de (ouro|prata)|ballon|the best|pusk[aá]s|golden|fifa|chuteira de ouro/i);
    }
  });

  it('sem minutos suficientes não há prêmio', () => {
    for (let s = 0; s < 50; s++) expect(seasonAwards(i({ ...god, minutes: cfg.minutosMin - 0.01 }), createPrng(s))).toEqual([]);
  });

  it('Artilheiro: pelos gols, comparados com a referência da liga', () => {
    const { golsRef, ruidoGols } = cfg.premios.artilheiro;
    expect(count(i({ goals: golsRef.BRA + ruidoGols + 1 }), 'artilheiro')).toBe(400);
    expect(count(i({ goals: golsRef.BRA - ruidoGols - 1 }), 'artilheiro')).toBe(0);
    expect(count(i({ goals: golsRef.BRA + 2 }), 'artilheiro')).toBeGreaterThan(count(i({ goals: golsRef.BRA - 2 }), 'artilheiro'));
  });

  it('Seleção do Campeonato e Revelação medem contra o nível da liga; Revelação tem idade máxima', () => {
    expect(count(i({ overall: 80, league: 'BRA-C' }), 'selecaoDoCampeonato')).toBeGreaterThan(count(i({ overall: 80, league: 'ENG' }), 'selecaoDoCampeonato'));
    expect(count(i({ ...god, age: 19 }), 'revelacao')).toBe(400);
    expect(count(i({ ...god, age: cfg.premios.revelacao.idadeMax + 1 }), 'revelacao')).toBe(0);
  });

  it('Craque do Brasileirão só na Série A; Craque do Estadual só em clube brasileiro, com bônus pelo título', () => {
    expect(count(i(god), 'craqueDoBrasileirao')).toBe(400);
    expect(count(i({ ...god, league: 'BRA-B' }), 'craqueDoBrasileirao')).toBe(0);
    expect(count(i({ ...god, league: 'ESP' }), 'craqueDoEstadual')).toBe(0);
    const base = i({ overall: cfg.premios.craqueDoEstadual.corte - 4 });
    expect(count({ ...base, titles: ['estadual'] }, 'craqueDoEstadual')).toBeGreaterThan(count(base, 'craqueDoEstadual'));
  });

  it('Melhor do Mundo: raríssimo; títulos grandes ajudam', () => {
    expect(count(i({ overall: 88, league: 'ESP' }), 'melhorDoMundo')).toBe(0);
    const base = i({ overall: 95, league: 'ESP', form: 0.8 });
    expect(count({ ...base, titles: ['champions', 'copaDoMundo'] }, 'melhorDoMundo')).toBeGreaterThan(count(base, 'melhorDoMundo'));
  });

  it('Craque da Copa: só titular que chegou à semifinal; campeão e herói pesam', () => {
    const wc = (stage: string, titular = true, hero = false) => i({ overall: 94, worldCup: { stage, titular, hero } });
    expect(count(i({ ...god }), 'craqueDaCopa')).toBe(0);
    expect(count({ ...wc('quartas'), ...god }, 'craqueDaCopa')).toBe(0);
    expect(count({ ...wc('campeao', false), ...god }, 'craqueDaCopa')).toBe(0);
    expect(count(wc('campeao', true, true), 'craqueDaCopa')).toBeGreaterThan(count(wc('semifinal'), 'craqueDaCopa'));
  });

  it('determinístico e sempre um sorteio por prêmio', () => {
    const [a, b] = [createPrng(3), createPrng(3)];
    seasonAwards(i({ minutes: 0 }), a);
    for (const _ of AWARDS) b.next();
    expect(a.next()).toBe(b.next());
    expect(seasonAwards(i(god), createPrng(8))).toEqual(seasonAwards(i(god), createPrng(8)));
  });
});
