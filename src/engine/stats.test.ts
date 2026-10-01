import { POSITIONS } from './overall';
import { createPrng } from './prng';
import { addStats, leagueGroup, leagueLevel, seasonStats, type StatsInput } from './stats';
import cfg from '../data/stats.json';

const i = (over: Partial<StatsInput> = {}): StatsInput => ({ position: 'atacante', overall: 82, minutes: 0.8, league: 'BRA-A', teamResult: 0, ...over });
const mean = (input: StatsInput, key: 'goals' | 'assists' | 'cleanSheets' | 'tackles' | 'games') =>
  Array.from({ length: 300 }, (_, s) => seasonStats(input, createPrng(s))[key]).reduce((a, b) => a + b, 0) / 300;

describe('números da temporada (T39, SPEC 6.15)', () => {
  it('grupo e nível da liga', () => {
    expect(leagueGroup('BRA-B')).toBe('BRA');
    expect(leagueGroup('ESP')).toBe('EUR');
    expect(leagueGroup('SAU')).toBe('padrao');
    expect(leagueLevel('ENG')).toBe(cfg.nivelLiga.ENG);
    expect(leagueLevel('SAU')).toBe(cfg.nivelLiga.padrao);
  });

  it('jogos proporcionais aos minutos; sem minutos, tudo zero', () => {
    expect(seasonStats(i({ minutes: 1 }), createPrng(1)).games).toBe(cfg.jogosPorTemporada.BRA);
    expect(seasonStats(i({ minutes: 0.5 }), createPrng(1)).games).toBe(cfg.jogosPorTemporada.BRA / 2);
    expect(seasonStats(i({ minutes: 0 }), createPrng(1))).toEqual({ games: 0, goals: 0, assists: 0, cleanSheets: 0, tackles: 0 });
  });

  it('cada posição tem o seu número forte', () => {
    expect(mean(i(), 'goals')).toBeGreaterThan(mean(i({ position: 'zagueiro' }), 'goals') * 4);
    expect(mean(i({ position: 'meia' }), 'assists')).toBeGreaterThan(mean(i(), 'assists'));
    expect(mean(i({ position: 'volante' }), 'tackles')).toBeGreaterThan(mean(i(), 'tackles'));
    expect(mean(i({ position: 'goleiro' }), 'goals')).toBe(0);
    expect(mean(i({ position: 'goleiro' }), 'cleanSheets')).toBeGreaterThan(0);
    expect(mean(i(), 'cleanSheets')).toBe(0);
  });

  it('jogador acima do nível da liga produz mais; time bem na tabela sofre menos gols', () => {
    expect(mean(i({ overall: 92 }), 'goals')).toBeGreaterThan(mean(i({ overall: 78 }), 'goals'));
    expect(mean(i({ overall: 82, league: 'BRA-C' }), 'goals')).toBeGreaterThan(mean(i({ overall: 82, league: 'ENG' }), 'goals'));
    expect(mean(i({ position: 'goleiro', teamResult: 1 }), 'cleanSheets')).toBeGreaterThan(mean(i({ position: 'goleiro', teamResult: -1 }), 'cleanSheets'));
  });

  it('determinístico, inteiros não negativos, sempre 3 sorteios', () => {
    for (const position of POSITIONS) {
      const [a, b] = [createPrng(5), createPrng(5)];
      const r = seasonStats(i({ position }), a);
      b.next(); b.next(); b.next();
      expect(a.next()).toBe(b.next());
      for (const v of Object.values(r)) { expect(Number.isInteger(v)).toBe(true); expect(v).toBeGreaterThanOrEqual(0); }
    }
  });

  it('soma de temporadas', () => {
    const x = { games: 1, goals: 2, assists: 3, cleanSheets: 4, tackles: 5 };
    expect(addStats(x, x)).toEqual({ games: 2, goals: 4, assists: 6, cleanSheets: 8, tackles: 10 });
  });
});
