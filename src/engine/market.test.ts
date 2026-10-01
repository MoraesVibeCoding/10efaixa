import { createAgent } from './agent';
import { clubsIn } from './clubs';
import { effectiveRep, europeClubsIn } from './europe';
import { chooseOffer, generateOffers, leagueOf, marketValue, negotiate, salaryFor, type MarketPlayer, type Offer } from './market';
import { squadLevel } from './minutes';
import { createPrng } from './prng';
import cfg from '../data/market.json';

const agent = createAgent('agenteLocal', createPrng(1));
const big = createAgent('grandeAgencia', createPrng(1));
const player = (over: Partial<MarketPlayer> = {}): MarketPlayer =>
  ({ overall: 80, age: 24, clubId: 'bahia', heartClub: null, temperament: 'frio', ...over });
const offers = (p: MarketPlayer, window: 'brasil' | 'europa', n = 200, a = agent) =>
  Array.from({ length: n }, (_, s) => generateOffers(p, window, a, createPrng(s))).flat();

describe('mercado (T28)', () => {
  it('faixas com fonte (Transfermarkt) e data', () => {
    expect(cfg.fonte.every((f) => f.startsWith('https://www.transfermarkt.com.br/'))).toBe(true);
    expect(cfg.conferidoEm).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const l of Object.values(cfg.ligas)) expect(l.salarioPct).toBeGreaterThan(0);
  });

  it('liga de cada clube: Brasil por divisão, Europa por liga, pool UEFA, fora do eixo, América do Sul', () => {
    expect(leagueOf('flamengo')).toBe('BRA-A');
    expect(leagueOf('bangu')).toBe('BRA-E');
    expect(leagueOf('flamengo', () => 'B')).toBe('BRA-B');
    expect(leagueOf('real-madrid')).toBe('ESP');
    expect(leagueOf('psv')).toBe('OUTROS');
    expect(leagueOf('al-hilal')).toBe('SAU');
    expect(leagueOf('river-plate')).toBe('SAM');
  });

  it('valor de mercado cresce com o overall e cai com a idade; respeita piso e teto', () => {
    expect(marketValue(85, 24)).toBeGreaterThan(marketValue(75, 24));
    expect(marketValue(85, 24)).toBeGreaterThan(marketValue(85, 33));
    expect(marketValue(99, 24)).toBeLessThanOrEqual(cfg.curva.tetoEUR);
    expect(marketValue(20, 38)).toBeGreaterThanOrEqual(cfg.curva.pisoEUR);
  });

  it.each(['ENG', 'ESP', 'ITA', 'GER', 'FRA', 'POR'])('%s: jogador de nível médio da liga vale na ordem de grandeza da média real (÷3 a ×3)', (liga) => {
    const clubs = europeClubsIn(liga);
    const level = clubs.reduce((s, c) => s + squadLevel(effectiveRep(c.id)), 0) / clubs.length;
    const real = cfg.ligas[liga as keyof typeof cfg.ligas].valorTotalEUR / cfg.ligas[liga as keyof typeof cfg.ligas].jogadores;
    const ratio = marketValue(Math.round(level), 25) / real;
    expect(ratio).toBeGreaterThan(1 / 3);
    expect(ratio).toBeLessThan(3);
  });

  it('Série A e Série B: mesma checagem de ordem de grandeza', () => {
    for (const [div, key] of [['A', 'BRA-A'], ['B', 'BRA-B']] as const) {
      const clubs = clubsIn(div);
      const level = clubs.reduce((s, c) => s + squadLevel(c.reputacao), 0) / clubs.length;
      const real = cfg.ligas[key].valorTotalEUR / cfg.ligas[key].jogadores;
      const ratio = marketValue(Math.round(level), 25) / real;
      expect(ratio).toBeGreaterThan(1 / 3);
      expect(ratio).toBeLessThan(3);
    }
  });

  it('salário = % do valor, na moeda da liga, com piso; fora do eixo paga mais pelo mesmo valor', () => {
    expect(salaryFor(10_000_000, 'ESP')).toBe(Math.round(10_000_000 * cfg.ligas.ESP.salarioPct));
    expect(salaryFor(10_000_000, 'BRA-A')).toBe(Math.round(10_000_000 * cfg.ligas['BRA-A'].salarioPct * 6));
    expect(salaryFor(1_000, 'BRA-D')).toBe(cfg.ligas['BRA-D'].pisoSalarioAnual);
    expect(salaryFor(10_000_000, 'SAU')).toBeGreaterThan(salaryFor(10_000_000, 'ESP') * 2);
  });

  it('propostas: clube, liga, salário, papel e comissão; nunca do clube atual; dentro do limite', () => {
    for (let s = 0; s < 100; s++) {
      const os = generateOffers(player(), 'brasil', agent, createPrng(s));
      expect(os.length).toBeLessThanOrEqual(cfg.propostas.max);
      for (const o of os) {
        expect(o.clubId).not.toBe('bahia');
        expect(['titular', 'rodizio', 'aposta']).toContain(o.role);
        expect(o.annualSalary).toBeGreaterThan(0);
        expect(o.staffQuality).toBeGreaterThanOrEqual(0.8);
        expect(o.years).toBeGreaterThanOrEqual(cfg.propostas.anos[0]!);
      }
    }
  });

  it('janelas: a brasileira só traz clubes do Brasil/América do Sul; a europeia, da Europa e fora do eixo', () => {
    expect(offers(player(), 'brasil').every((o) => o.currency === 'BRL' || o.league === 'SAM')).toBe(true);
    const eu = offers(player({ overall: 88 }), 'europa');
    expect(eu.length).toBeGreaterThan(0);
    expect(eu.every((o) => o.currency === 'EUR' && o.league !== 'SAM')).toBe(true);
  });

  it('nível: craque recebe proposta de clube maior do que jogador mediano', () => {
    const avg = (p: MarketPlayer) => { const os = offers(p, 'europa'); return os.reduce((s, o) => s + effectiveRep(o.clubId), 0) / (os.length || 1); };
    expect(avg(player({ overall: 92 }))).toBeGreaterThan(avg(player({ overall: 80 })));
  });

  it('empresário influente traz mais propostas e salários maiores', () => {
    expect(offers(player(), 'brasil', 300, big).length).toBeGreaterThan(offers(player(), 'brasil', 300, agent).length);
  });

  it('marca clube de coração, rival do clube atual e rival do clube de coração', () => {
    const os = offers(player({ clubId: 'flamengo', heartClub: 'palmeiras', overall: 84 }), 'brasil', 400);
    expect(os.some((o) => o.clubId === 'palmeiras' && o.heartClub)).toBe(true);
    expect(os.filter((o) => o.clubId === 'vasco').every((o) => o.rivalOfCurrent)).toBe(true);
    expect(os.filter((o) => o.clubId === 'corinthians').every((o) => o.rivalOfHeart)).toBe(true);
  });

  it('tentação do dinheiro fácil: fora do eixo só para veteranos bons, com salário alto', () => {
    expect(offers(player({ age: 22, overall: 85 }), 'europa').some((o) => o.offAxis)).toBe(false);
    const vet = offers(player({ age: 31, overall: 84 }), 'europa', 400);
    const off = vet.filter((o) => o.offAxis);
    expect(off.length).toBeGreaterThan(0);
    const sal = (xs: Offer[]) => xs.reduce((s, o) => s + o.annualSalary, 0) / xs.length;
    expect(sal(off)).toBeGreaterThan(sal(vet.filter((o) => !o.offAxis && o.league !== 'ENG')));
  });

  it('mandar negociar: pode melhorar o salário ou a proposta sumir; influência ajuda', () => {
    const o = generateOffers(player(), 'brasil', agent, createPrng(3))[0]!;
    const rs = Array.from({ length: 500 }, (_, s) => negotiate(o, agent, createPrng(s)));
    expect(rs.some((r) => r === null)).toBe(true);
    expect(rs.some((r) => r !== null && r.annualSalary > o.annualSalary)).toBe(true);
    const gone = (a: typeof agent) => Array.from({ length: 500 }, (_, s) => negotiate(o, a, createPrng(s))).filter((r) => r === null).length;
    expect(gone(big)).toBeLessThan(gone(agent));
  });

  it('escolha automática: Frio prioriza o nível do clube; Resenha, o dinheiro; sem proposta melhor, fica', () => {
    const base = { years: 3, role: 'rodizio' as const, staffQuality: 1, heartClub: false, rivalOfCurrent: false, rivalOfHeart: false, offAxis: false };
    const top: Offer = { ...base, clubId: 'real-madrid', league: 'ESP', currency: 'EUR', annualSalary: 2_000_000 };
    const rich: Offer = { ...base, clubId: 'al-hilal', league: 'SAU', currency: 'EUR', annualSalary: 12_000_000, offAxis: true };
    const cur = { annualSalaryBRL: 3_000_000, role: 'titular' };
    expect(chooseOffer(player({ temperament: 'frio', overall: 90 }), [top, rich], cur)?.clubId).toBe('real-madrid');
    expect(chooseOffer(player({ temperament: 'resenha', overall: 90 }), [top, rich], cur)?.clubId).toBe('al-hilal');
    const weak: Offer = { ...base, clubId: 'athletic-mg', league: 'BRA-B', currency: 'BRL', annualSalary: 200_000, role: 'aposta' };
    expect(chooseOffer(player({ temperament: 'lider' }), [weak], cur)).toBeNull();
  });

  it('dilemas da T25 na escolha: Frio recusa o rival; Esquentado aceita', () => {
    const o: Offer = { clubId: 'vitoria', league: 'BRA-A', currency: 'BRL', annualSalary: 9_000_000, years: 3, role: 'titular', staffQuality: 1, heartClub: false, rivalOfCurrent: true, rivalOfHeart: false, offAxis: false };
    const cur = { annualSalaryBRL: 1_000_000, role: 'aposta' };
    expect(chooseOffer(player({ temperament: 'esquentado' }), [o], cur)?.clubId).toBe('vitoria');
    expect(chooseOffer(player({ temperament: 'frio' }), [o], cur)).toBeNull();
  });
});
