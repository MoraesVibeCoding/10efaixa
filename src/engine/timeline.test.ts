import { simulateCareer } from './career';
import { createPrng } from './prng';
import { randomInput } from './simulation';
import { timelineOf, type TimelineInput } from './timeline';

// T55g (SPEC 6.15, v2.51): o modelo da tela "Sua carreira": uma linha por temporada, em ordem de idade.
const row = (age: number, clubId: string, overall: number, division: string | null = 'BRA-A') => ({ year: 2026 + age - 16, age, clubId, division, minutes: 0.8, overall, games: age + 10, goals: age - 10, assists: age - 14, cleanSheets: 0 });
const input = (over: Partial<TimelineInput> = {}): TimelineInput => ({
  seasons: [row(16, 'santos', 60), row(17, 'santos', 66), row(18, 'santos', 72), row(19, 'benfica', 72, 'POR'), row(20, 'benfica', 70, 'POR')],
  titles: [], ...over,
});

describe('linha do tempo por idade (T55g)', () => {
  it('uma linha por temporada, com idade, clube, divisão e Over, na ordem', () => {
    const rows = timelineOf(input());
    expect(rows.map((r) => r.age)).toEqual([16, 17, 18, 19, 20]);
    expect(rows[3]).toMatchObject({ age: 19, clubId: 'benfica', division: 'POR', overall: 72 });
  });

  it('títulos entram na linha do ano em que foram conquistados, e só nela', () => {
    const rows = timelineOf(input({ titles: [{ year: 2028, competition: 'estadual', clubId: 'santos' }, { year: 2028, competition: 'copaDoBrasil', clubId: 'santos' }, { year: 2030, competition: 'ligaNacional', clubId: 'benfica' }] }));
    expect(rows.map((r) => r.titles)).toEqual([[], [], ['estadual', 'copaDoBrasil'], [], ['ligaNacional']]);
  });

  it('marca como auge só a primeira temporada de maior Over', () => {
    const rows = timelineOf(input());
    expect(rows.map((r) => r.peak)).toEqual([false, false, true, false, false]);
  });

  it('marca a troca de clube (e a estreia não conta como troca)', () => {
    const rows = timelineOf(input());
    expect(rows.map((r) => r.newClub)).toEqual([false, false, false, true, false]);
  });

  it('cada linha leva os gols e as assistências da temporada (v2.60)', () => {
    const rows = timelineOf(input());
    expect(rows.map((r) => r.goals)).toEqual([6, 7, 8, 9, 10]);
    expect(rows.map((r) => r.assists)).toEqual([2, 3, 4, 5, 6]);
  });

  it('cada linha leva também os jogos da temporada (v2.62)', () => {
    expect(timelineOf(input()).map((r) => r.games)).toEqual([26, 27, 28, 29, 30]);
  });

  it('numa carreira simulada, a soma dos gols e das assistências por temporada é a da carreira', () => {
    for (const seed of [1, 2, 3, 4]) {
      const r = simulateCareer(randomInput(createPrng(seed)), seed);
      const rows = timelineOf(r);
      expect(rows.reduce((n, x) => n + x.goals, 0), `gols ${seed}`).toBe(r.stats.goals);
      expect(rows.reduce((n, x) => n + x.assists, 0), `assistências ${seed}`).toBe(r.stats.assists);
      expect(rows.reduce((n, x) => n + x.games, 0), `jogos ${seed}`).toBe(r.stats.games);
    }
  });

  it('sem temporadas, sem linhas', () => {
    expect(timelineOf(input({ seasons: [] }))).toEqual([]);
  });

  it('numa carreira simulada de verdade: idade crescente, auge único e cada título aparece em alguma linha', () => {
    for (const seed of [1, 2, 3]) {
      const r = simulateCareer(randomInput(createPrng(seed)), seed);
      const rows = timelineOf(r);
      expect(rows).toHaveLength(r.seasons.length);
      expect(rows.filter((x) => x.peak)).toHaveLength(1);
      expect(rows.reduce((n, x) => n + x.titles.length, 0)).toBe(r.titles.length);
    }
  });
});
