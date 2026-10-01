import { ATTRIBUTES } from './attributes';
import { ARCHETYPES } from './archetypes';
import { POSITIONS, overall } from './overall';
import { runMass, simulateCareer } from './simulation';

const HEAVY = { timeout: 60_000 };

describe('simulação de carreira', () => {
  it('determinística pela semente', () => {
    expect(simulateCareer(42)).toEqual(simulateCareer(42));
    expect(simulateCareer(1)).not.toEqual(simulateCareer(2));
  });

  it('auge coerente: dentro dos tetos, overall recalculável, idade entre 16 e 35', () => {
    for (let seed = 0; seed < 200; seed++) {
      const c = simulateCareer(seed);
      expect(c.peakAge).toBeGreaterThanOrEqual(16);
      expect(c.peakAge).toBeLessThanOrEqual(35);
      const bonus = ARCHETYPES.find((a) => a.id === c.player.archetypeId)!.overallWeightBonus;
      expect(c.peakOverall).toBe(overall(c.peakAttributes, c.player.position, bonus));
      expect(c.peakOverall).toBeGreaterThanOrEqual(c.player.startingOverall - 2);
      expect(ATTRIBUTES.every((a) => c.peakAttributes[a] <= 99 && c.peakAttributes[a] >= 1)).toBe(true);
    }
  });
});

describe('relatório em massa (amostra de 6 mil)', () => {
  let report: ReturnType<typeof runMass>;
  beforeAll(() => { report = runMass(6_000, 2026); }, 60_000);

  it('cobre as 3 origens e as 6 posições', HEAVY, () => {
    expect(Object.keys(report.byOrigin).sort()).toEqual(['baseGrande', 'peneira', 'varzea']);
    for (const p of POSITIONS) expect(report.byPosition[p].n).toBeGreaterThan(0);
  });

  it('chance igual entre origens: auge médio parecido (±1,5)', () => {
    const peaks = Object.values(report.byOrigin).map((o) => o.peakOverall);
    expect(Math.max(...peaks) - Math.min(...peaks)).toBeLessThanOrEqual(1.5);
  });

  // A meta do auge (9.3) saiu daqui na T40: este simulador não tem clubes nem minutos reais, e as faixas de potencial
  // passaram a ser calibradas na carreira integrada. A meta é medida por `npm run sim:legado` e guardada em career.test.ts.

  it('várzea cresce mais em fundamentos e físico do que a base', () => {
    expect(report.growth.varzea!.fundamentosFisico).toBeGreaterThan(report.growth.baseGrande!.fundamentosFisico + 3);
  });

  it('diamante bruto entre 2% e 4% das carreiras de várzea', () => {
    expect(report.diamondRateVarzea).toBeGreaterThanOrEqual(0.02);
    expect(report.diamondRateVarzea).toBeLessThanOrEqual(0.04);
  });

  it('altura: altos dominam Jogo aéreo, baixos dominam Drible, em toda posição', () => {
    for (const p of POSITIONS) {
      const h = report.height[p];
      expect(h.alto.jogoAereo).toBeGreaterThan(h.baixo.jogoAereo);
      expect(h.baixo.drible).toBeGreaterThan(h.alto.drible);
    }
  });

  it('nenhuma faixa de altura vence o overall em todas as posições', () => {
    const winners = POSITIONS.map((p) => {
      const h = report.height[p];
      return (['baixo', 'medio', 'alto'] as const).reduce((a, b) => (h[b].overall > h[a].overall ? b : a));
    });
    expect(new Set(winners).size).toBeGreaterThan(1);
  });

  it('uma carreira em menos de 50 ms', () => {
    expect(report.msPerCareer).toBeLessThan(50);
  });
});
