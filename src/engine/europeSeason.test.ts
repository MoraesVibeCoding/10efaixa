import { EURO_LEAGUES, effectiveRep, europeClubsIn } from './europe';
import { initialEuroTables, simulateEuropeSeason, uefaEntrants } from './europeSeason';
import raw from '../data/europe.json';

const club = (id: string) => ({ strength: effectiveRep(id), uf: '' });
const run = (seed: number) => simulateEuropeSeason(initialEuroTables(), club, seed);

describe('temporada europeia (T30)', () => {
  it('determinística pela semente', () => {
    expect(run(4)).toEqual(run(4));
    expect(run(1).champions).not.toEqual(run(77).champions);
  });

  it('6 ligas: tabela completa, turno e returno, campeão é o 1º', () => {
    const r = run(2);
    for (const liga of EURO_LEAGUES) {
      const n = europeClubsIn(liga).length;
      expect(r.leagues[liga]).toHaveLength(n);
      expect(new Set(r.leagues[liga]!.map((x) => x.wins + x.draws + x.losses))).toEqual(new Set([2 * (n - 1)]));
      expect(r.champions[liga]).toBe(r.leagues[liga]![0]!.id);
    }
  });

  it('copa nacional: campeão é clube da liga; mata-mata até a final', () => {
    const r = run(3);
    for (const liga of EURO_LEAGUES) {
      expect(europeClubsIn(liga).map((c) => c.id)).toContain(r.cups[liga]!.champion);
      expect(r.cups[liga]!.rounds.at(-1)).toHaveLength(1);
      expect(r.cups[liga]!.rounds.at(-2)).toHaveLength(2);
    }
  });

  it('vagas UEFA: 36 clubes em cada copa, sem repetir entre elas, pelas cotas de cada liga', () => {
    const e = uefaEntrants(initialEuroTables(), 1);
    expect(e.ucl).toHaveLength(36);
    expect(e.uel).toHaveLength(36);
    expect(new Set([...e.ucl, ...e.uel]).size).toBe(72);
    const eng = europeClubsIn('ENG').map((c) => c.id);
    expect(e.ucl.filter((id) => eng.includes(id))).toHaveLength(raw.copasUEFA.vagasChampions.ENG);
    expect(e.uel.filter((id) => eng.includes(id))).toHaveLength(raw.copasUEFA.vagasEuropaLeague.ENG);
    expect(e.ucl).toContain('real-madrid');
  });

  it('Champions e Europa League: 8 jogos na fase de liga; playoffs 9º–24º; oitavas até a final; campeão definido', () => {
    const r = run(5);
    for (const cup of [r.ucl, r.uel]) {
      expect(cup.leaguePhase).toHaveLength(36);
      expect(new Set(cup.leaguePhase.map((x) => x.wins + x.draws + x.losses))).toEqual(new Set([8]));
      expect(cup.playoffs).toHaveLength(8);
      const ranks = cup.leaguePhase.map((x) => x.id);
      expect(cup.playoffs.flatMap((t) => [t.a, t.b]).sort()).toEqual(ranks.slice(8, 24).sort());
      expect(cup.knockout.map((k) => k.length)).toEqual([8, 4, 2, 1]);
      expect(cup.champion).toBe(cup.knockout.at(-1)![0]!.winner);
      expect(ranks).toContain(cup.champion);
    }
  });

  it('classificação coerente com a força: Spearman médio ≥ 0,5 na Premier League', () => {
    let sum = 0;
    const n = 60;
    for (let s = 0; s < n; s++) {
      const t = run(s).leagues.ENG!.map((x) => x.id);
      const by = [...t].sort((a, b) => effectiveRep(b) - effectiveRep(a));
      const d2 = t.reduce((acc, id, i) => acc + (i - by.indexOf(id)) ** 2, 0);
      sum += 1 - (6 * d2) / (20 * 399);
    }
    expect(sum / n).toBeGreaterThanOrEqual(0.5);
  });

  it('tabelas da temporada alimentam as vagas da seguinte', () => {
    const r = run(6);
    expect(r.next.ENG).toEqual(r.leagues.ENG!.map((x) => x.id));
    const e = uefaEntrants(r.next, 7);
    expect(e.ucl).toContain(r.leagues.ENG![0]!.id);
    expect(e.ucl).not.toContain(r.leagues.ENG![19]!.id);
  });

  it('20 temporadas europeias em menos de 150 ms', () => {
    let t = initialEuroTables();
    const t0 = performance.now();
    for (let s = 0; s < 20; s++) t = simulateEuropeSeason(t, club, s).next;
    expect(performance.now() - t0).toBeLessThan(150);
  });
});
