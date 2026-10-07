import { createAgent } from './agent';
import { clubLevelOf, ELITE_CLUBS, eliteValueFactor, generateOffers, isEliteClub, rankOffers, toBRL, type MarketPlayer, type Offer } from './market';
import { LEVELS } from './minutes';
import { createPrng } from './prng';
import cfg from '../data/market.json';

// v2.59: os 7 clubes mais fortes do mundo formam um nível acima de "gigante": salário maior, valor projetado maior e peso na escolha.
const player = (over: Partial<MarketPlayer> = {}): MarketPlayer => ({ overall: 90, age: 24, clubId: 'bahia', heartClub: null, temperament: 'frio', ...over });
const agent = createAgent('agenteLocal', createPrng(1));
const mk = (clubId: string, annualSalary: number): Offer => ({
  clubId, league: 'ESP', currency: 'EUR', annualSalary, years: 3, role: 'titularRegular', staffQuality: 1, heartClub: false,
  rivalOfCurrent: false, rivalOfHeart: false, offAxis: false,
});

describe('clubes de elite (v2.59)', () => {
  it('são exatamente os 7 da lista, todos com fonte e data no arquivo de dados', () => {
    expect([...ELITE_CLUBS].sort()).toEqual(['arsenal', 'barcelona', 'bayern', 'liverpool', 'man-city', 'psg', 'real-madrid']);
    expect(cfg.elite.conferidoEm).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(cfg.elite.fonte.length).toBeGreaterThan(0);
    expect(isEliteClub('real-madrid')).toBe(true);
    expect(isEliteClub('flamengo')).toBe(false);
  });

  it('o nível "elite" fica acima de "gigante"; os demais níveis seguem pela reputação', () => {
    expect(LEVELS.at(-1)).toBe('elite');
    expect(LEVELS.at(-2)).toBe('gigante');
    expect(clubLevelOf('real-madrid', 99)).toBe('elite');
    expect(clubLevelOf('flamengo', 99)).toBe('gigante');
    expect(clubLevelOf('sport', 50)).toBe('media');
  });

  it('o salário da proposta de um clube de elite é maior que o de um clube normal da mesma liga', () => {
    const p = player({ clubId: 'bahia' });
    const salary = (id: string) => {
      const all = Array.from({ length: 400 }, (_, s) => generateOffers(p, 'europa', agent, createPrng(s))).flat().filter((o) => o.clubId === id);
      return all.length ? all[0]!.annualSalary : null;
    };
    const elite = salary('real-madrid');
    const normal = salary('atletico-madrid'); // mesma liga (ESP)
    expect(elite).not.toBeNull();
    expect(normal).not.toBeNull();
    expect(elite!).toBeGreaterThan(normal! * (cfg.elite.salarioMultiplicador * 0.9));
  });

  it('valor projetado: só clube de elite multiplica (fator em dados); os demais valem 1', () => {
    expect(eliteValueFactor('barcelona')).toBe(cfg.elite.valorMultiplicador);
    expect(cfg.elite.valorMultiplicador).toBeGreaterThan(1);
    expect(eliteValueFactor('sport')).toBe(1);
  });

  it('na escolha, o clube de elite vence um gigante com salário igual; o peso é bônus, não garantia (salário muito menor perde)', () => {
    const cur = { annualSalaryBRL: 100_000, role: 'composicao' as const };
    const igual = rankOffers(player(), [mk('inter', 5_000_000), mk('real-madrid', 5_000_000)], cur);
    expect(igual.shown[0]!.clubId).toBe('real-madrid');
    const baixo = rankOffers(player(), [mk('inter', 30_000_000), mk('real-madrid', 300_000)], cur);
    expect(baixo.shown[0]!.clubId).toBe('inter');
    expect(toBRL(igual.shown[0]!)).toBeGreaterThan(0);
  });
});
