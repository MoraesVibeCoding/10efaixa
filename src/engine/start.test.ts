import { CLUBS } from './clubs';
import { baseOffers, copinha, eligibleClubs, firstContract, promotion, runPeneira, runVarzea } from './start';
import { createPrng } from './prng';
import neighbors from '../data/neighbors.json';
import start from '../data/start.json';
import ptBR from '../i18n/pt-BR/start.json';

const byId = new Map(CLUBS.map((c) => [c.id, c]));
const N = neighbors.vizinhos as Record<string, string[]>;
const near = (uf: string, id: string) => byId.get(id)!.uf === uf || N[uf]!.includes(byId.get(id)!.uf);

describe('início por origem (T20)', () => {
  it('vizinhos simétricos para os 27 estados', () => {
    expect(Object.keys(N)).toHaveLength(27);
    for (const [a, list] of Object.entries(N)) for (const b of list) expect(N[b]).toContain(a);
  });

  it('clubes elegíveis: do estado; se faltar, completa com vizinhos', () => {
    expect(eligibleClubs('SP', ['A'], 3).every((id) => byId.get(id)!.uf === 'SP')).toBe(true);
    const ap = eligibleClubs('AP', ['A', 'B'], 3);
    expect(ap.length).toBeGreaterThanOrEqual(3);
    expect(ap.every((id) => near('AP', id) || ['A', 'B'].includes(byId.get(id)!.divisao!))).toBe(true);
  });

  it('base: 3 ofertas distintas de clubes grandes do estado ou vizinhos, com prós e contras', () => {
    for (const state of ['SP', 'BA', 'AP', 'RS']) {
      const offers = baseOffers({ state, heartClub: null }, createPrng(1));
      expect(offers).toHaveLength(start.base.ofertas);
      expect(new Set(offers.map((o) => o.clubId)).size).toBe(3);
      for (const o of offers) {
        expect(['alto', 'medio', 'baixo']).toContain(o.minutes);
        expect(o.structure).toBeGreaterThan(0);
      }
    }
    expect(baseOffers({ state: 'SP', heartClub: null }, createPrng(1)).every((o) => near('SP', o.clubId))).toBe(true);
  });

  it('clube de coração elegível aparece em destaque nas ofertas da base (6.18)', () => {
    const offers = baseOffers({ state: 'RJ', heartClub: 'vasco' }, createPrng(2));
    expect(offers.find((o) => o.clubId === 'vasco')?.heartClub).toBe(true);
    expect(offers.filter((o) => o.heartClub)).toHaveLength(1);
    expect(baseOffers({ state: 'RJ', heartClub: 'paysandu' }, createPrng(2)).some((o) => o.heartClub)).toBe(false);
  });

  it('peneira: os três desfechos acontecem; overall maior aprova mais; clube do estado ou vizinho', () => {
    const run = (ov: number) => Array.from({ length: 2000 }, (_, i) => runPeneira({ state: 'MG', startingOverall: ov }, createPrng(i)));
    const all = run(44);
    expect(new Set(all.map((r) => r.outcome))).toEqual(new Set(['aprovado', 'novaChance', 'clubeMenor']));
    const rate = (rs: { outcome: string }[]) => rs.filter((r) => r.outcome === 'aprovado').length / rs.length;
    expect(rate(run(50))).toBeGreaterThan(rate(run(38)));
    expect(all.every((r) => near('MG', r.clubId))).toBe(true);
    for (const k of ['aprovado', 'novaChance', 'clubeMenor']) expect(ptBR.peneira[k as keyof typeof ptBR.peneira]).toBeTruthy();
  });

  it('várzea: 1 a 3 semestres no time do bairro; olheiro leva a clube pequeno/médio do estado ou vizinho', () => {
    const rs = Array.from({ length: 500 }, (_, i) => runVarzea({ state: 'PE', startingOverall: 34 }, createPrng(i)));
    for (const r of rs) {
      expect(r.semesters).toBeGreaterThanOrEqual(1);
      expect(r.semesters).toBeLessThanOrEqual(start.varzea.semestresMax);
      expect(ptBR.varzeaTeams[r.teamKey]).toBeTruthy();
      expect(near('PE', r.clubId)).toBe(true);
      expect(['C', 'D', null]).toContain(byId.get(r.clubId)!.divisao);
    }
  });

  it('Copinha: clube forte e jogador bom vão mais longe; fase sempre válida', () => {
    const stage = (rep: number, ov: number) => start.copinha.fases.indexOf(copinha(rep, ov, createPrng(rep * 100 + ov)).stage);
    const avg = (rep: number, ov: number) => Array.from({ length: 300 }, (_, i) =>
      start.copinha.fases.indexOf(copinha(rep, ov, createPrng(i)).stage)).reduce((a, b) => a + b, 0) / 300;
    expect(stage(90, 50)).toBeGreaterThanOrEqual(0);
    expect(avg(92, 54)).toBeGreaterThan(avg(40, 38));
  });

  it('promoção: aos 17–20 com overall suficiente gera primeiro contrato; aos 20 sem nível é dispensado', () => {
    const ok = promotion({ age: 18, overall: 60, clubId: 'flamengo', highlight: true });
    expect(ok.promoted).toBe(true);
    expect(ok.contract).toEqual({ clubId: 'flamengo', years: start.promocao.anosContrato.destaque, role: 'promessa' });
    expect(promotion({ age: 16, overall: 99, clubId: 'flamengo', highlight: false }).promoted).toBe(false);
    expect(promotion({ age: 20, overall: 30, clubId: 'flamengo', highlight: false })).toMatchObject({ promoted: false, released: true });
  });

  it('primeiro contrato direto (peneira/várzea)', () => {
    expect(firstContract('ituano')).toEqual({ clubId: 'ituano', years: 2, role: 'promessa' });
  });
});
