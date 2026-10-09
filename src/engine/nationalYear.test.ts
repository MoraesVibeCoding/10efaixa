import { simulateCareer, type CareerResult } from './career';
import { createPrng } from './prng';
import { randomInput } from './simulation';

// v2.65 (docs/proposta-selecao-e-camisa10.md, aprovado em 2026-10-09): a Seleção ano a ano. Cada convocação gera jogos da data FIFA,
// os torneios somam os jogos das fases e gols e assistências seguem a taxa da posição; as seleções de base contam no total.
const careers: CareerResult[] = Array.from({ length: 300 }, (_, i) => simulateCareer(randomInput(createPrng(i + 1)), i + 1));
const RUNGS = ['sub17', 'sub20', 'olimpica', 'lista', 'reserva', 'titular'];

describe('Seleção ano a ano (v2.65)', () => {
  it('a soma dos anos bate com os totais da carreira (jogos, gols, assistências e jogos pela principal)', () => {
    for (const r of careers) {
      const years = r.seasons.flatMap((s) => (s.selecao ? [s.selecao] : []));
      const sum = (k: 'games' | 'goals' | 'assists' | 'mainGames') => years.reduce((n, y) => n + y[k], 0);
      expect(sum('games')).toBe(r.selection.games);
      expect(sum('goals')).toBe(r.selection.goals);
      expect(sum('assists')).toBe(r.selection.assists);
      expect(sum('mainGames')).toBe(r.selection.mainGames);
    }
  });

  it('só há bloco da Seleção no ano com convocação; quem nunca foi convocado não tem nenhum', () => {
    let com = 0;
    for (const r of careers) {
      const called = Object.values(r.selection.callUps).some((n) => n > 0);
      const years = r.seasons.filter((s) => s.selecao);
      expect(years.length > 0).toBe(called);
      for (const s of years) {
        expect(RUNGS).toContain(s.selecao!.rung);
        expect(s.selecao!.games).toBeGreaterThanOrEqual(s.selecao!.mainGames);
        expect(s.selecao!.games).toBeGreaterThan(0);
      }
      if (called) com++;
    }
    expect(com).toBeGreaterThan(30);
  });

  it('o torneio do ano aparece no ano em que foi jogado, com a fase alcançada', () => {
    for (const r of careers) {
      for (const tr of r.selection.tournaments) {
        const s = r.seasons.find((x) => x.year === tr.year);
        expect(s?.selecao?.tournaments).toContainEqual({ tournament: tr.tournament, stage: tr.stage });
      }
    }
  });

  it('gols por jogo pela Seleção plausíveis por posição: atacante marca mais que zagueiro; goleiro quase nunca', () => {
    const rate = (pos: string) => {
      const sel = careers.filter((r) => r.player.position === pos).map((r) => r.selection);
      const games = sel.reduce((n, s) => n + s.games, 0);
      return games ? sel.reduce((n, s) => n + s.goals, 0) / games : 0;
    };
    expect(rate('atacante')).toBeGreaterThan(0.15);
    expect(rate('atacante')).toBeLessThan(0.8);
    expect(rate('atacante')).toBeGreaterThan(rate('zagueiro'));
    expect(rate('goleiro')).toBeLessThan(0.02);
  });

  it('o marco "primeiro gol pela Seleção" só acontece num ano com gol pela principal', () => {
    for (const r of careers) {
      const m = r.marcos.find((x) => x.id === 'primeiro-gol-selecao');
      if (!m) continue;
      // o marco sai na decisão do fim da temporada: o gol é da temporada fechada antes dele
      const s = r.seasons.find((x) => x.year === m.year) ?? r.seasons.find((x) => x.year === m.year - 1);
      expect(s?.selecao?.mainGoals ?? 0, `${r.player.name} ${m.year}`).toBeGreaterThan(0);
    }
  });

  it('determinístico', () => {
    expect(simulateCareer(randomInput(createPrng(9)), 9).seasons).toEqual(careers[8]!.seasons);
  });
});
