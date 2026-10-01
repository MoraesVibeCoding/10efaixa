import { CLUBS } from './clubs';
import { simulateCareer } from './career';
import type { CreationInput } from './player';
import cfg from '../data/career.json';

const input = (over: Partial<CreationInput> = {}): CreationInput => ({
  name: 'Jogador Teste', shirtNumber: 9, state: 'SP', position: 'atacante', archetypeId: 'matador',
  biotype: { heightCm: 180, build: 'atletico' }, temperament: 'frio', celebration: 'aviaozinho',
  origin: 'baseGrande', foot: 'direita', heartClub: null, ...over,
});
const ids = new Set(CLUBS.map((c) => c.id));

describe('integração da carreira (T24b)', () => {
  it('determinística pela semente', () => {
    expect(simulateCareer(input(), 7)).toEqual(simulateCareer(input(), 7));
  });

  it('vai dos 16 anos à idade final provisória, uma temporada por ano', () => {
    const r = simulateCareer(input(), 3);
    expect(r.endAge).toBe(cfg.idadeFinalProvisoria);
    expect(r.seasons.length).toBe(cfg.idadeFinalProvisoria - 16);
    expect(r.seasons[0]!.year).toBe(2026);
  });

  it('histórico de clubes consistente: clubes existem, passagens encadeadas sem sobreposição', () => {
    for (const origin of ['baseGrande', 'peneira', 'varzea']) {
      const r = simulateCareer(input({ origin }), 11);
      expect(r.spells.length).toBeGreaterThan(0);
      for (const s of r.spells) expect(ids.has(s.clubId)).toBe(true);
      for (let i = 1; i < r.spells.length; i++) expect(r.spells[i]!.fromAge).toBe(r.spells[i - 1]!.toAge);
      for (const s of r.spells) expect(s.number).not.toBe(0);
    }
  });

  it('títulos só do clube do jogador naquela temporada', () => {
    for (let seed = 0; seed < 10; seed++) {
      const r = simulateCareer(input({ origin: 'baseGrande' }), seed);
      for (const t of r.titles) {
        const season = r.seasons.find((s) => s.year === t.year)!;
        expect(t.clubId).toBe(season.clubId);
        expect(season.minutes).toBeGreaterThanOrEqual(cfg.minutosParaTitulo);
      }
    }
  });

  it('clube de coração entre as ofertas da base: começa nele', () => {
    const r = simulateCareer(input({ state: 'RJ', heartClub: 'vasco' }), 4);
    expect(r.spells[0]!.clubId).toBe('vasco');
  });

  it('auge coerente e dentro de 1–99', () => {
    const r = simulateCareer(input(), 5);
    expect(r.peakOverall).toBeGreaterThanOrEqual(r.player.startingOverall - 2);
    expect(r.peakOverall).toBeLessThanOrEqual(99);
    expect(r.peakAge).toBeGreaterThanOrEqual(16);
  });

  it('uma carreira em menos de 150 ms no teste (meta do SPEC: 50 ms no CI, medida no relatório)', () => {
    const t0 = performance.now();
    simulateCareer(input(), 1);
    expect(performance.now() - t0).toBeLessThan(150);
  });
});
