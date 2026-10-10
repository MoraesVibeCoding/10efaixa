import { simulateCareer } from './career';
import { createPrng } from './prng';
import { randomInput } from './simulation';
import { summarizeSeason } from './seasonSummary';
import { timelineOf } from './timeline';

// Revisão das telas: o goleiro via "0 gols" no resumo e em "Sua carreira". Os jogos sem sofrer gol já saem do motor
// (stats.cleanSheets); agora vão para cada temporada, para o resumo do ano e para a linha do tempo.
const GOLEIROS = [7, 19, 23].map((s) => simulateCareer(randomInput(createPrng(s)), s));

describe('goleiro: jogos sem sofrer gol por temporada', () => {
  it('as temporadas somam os jogos sem sofrer gol da carreira', () => {
    for (const r of GOLEIROS) {
      expect(r.player.position).toBe('goleiro');
      expect(r.seasons.reduce((n, s) => n + s.cleanSheets, 0)).toBe(r.stats.cleanSheets);
      expect(r.stats.cleanSheets).toBeGreaterThan(0);
    }
  });

  it('a linha do tempo traz o número de cada ano', () => {
    for (const r of GOLEIROS) {
      const rows = timelineOf(r);
      expect(rows.reduce((n, x) => n + x.cleanSheets, 0)).toBe(r.stats.cleanSheets);
    }
  });

  it('o resumo do ano diz que é goleiro e traz os jogos sem sofrer gol', () => {
    const base = { year: 2030, age: 22, clubId: 'santos', division: 'BRA-A', games: 30, goals: 0, assists: 1, minutes: 0.9, overallBefore: 70, overallAfter: 72, attrsBefore: GOLEIROS[0]!.peakAttributes, attrsAfter: GOLEIROS[0]!.peakAttributes, titles: [] };
    expect(summarizeSeason({ ...base, cleanSheets: 12, goleiro: true })).toMatchObject({ goleiro: true, semSofrerGol: 12 });
    expect(summarizeSeason({ ...base, cleanSheets: 0, goleiro: false }).goleiro).toBe(false);
  });
});
