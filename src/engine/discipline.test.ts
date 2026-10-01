import { investmentReturn, leaderEffects, matureTemperament, offFieldFlags, semesterCards } from './discipline';
import { applyOption, autoChoice, eligibleEvents, sceneOf } from './events';
import { createPrng } from './prng';
import cfg from '../data/discipline.json';

const cards = (temperament: string, n = 3000) => {
  let y = 0, r = 0, long = 0;
  for (let s = 0; s < n; s++) { const c = semesterCards({ temperament, minutes: 1 }, createPrng(s)); y += c.yellows; r += c.reds; long += Number(c.longSuspension); }
  return { y: y / n, r: r / n, long: long / n };
};
const flagRate = (temperament: string, k: 'conviteFesta' | 'polemica', n = 3000) =>
  Array.from({ length: n }, (_, s) => offFieldFlags({ temperament, wealthBRL: 0, houseBought: false }, createPrng(s))[k]).filter(Boolean).length / n;

describe('disciplina, vida fora de campo e amadurecimento (T33)', () => {
  it('temperamento afeta cartões: Frio leva menos, Esquentado leva mais', () => {
    const [frio, neutro, esq] = [cards('frio'), cards('resenha'), cards('esquentado')];
    expect(frio.y).toBeLessThan(neutro.y);
    expect(esq.y).toBeGreaterThan(neutro.y);
    expect(esq.r).toBeGreaterThan(frio.r);
    expect(esq.long).toBeGreaterThan(frio.long);
  });

  it('sem jogar não leva cartão; vermelho e suspensão longa custam minutos', () => {
    expect(semesterCards({ temperament: 'esquentado', minutes: 0 }, createPrng(1))).toEqual({ yellows: 0, reds: 0, longSuspension: false, minutesLost: 0 });
    const rs = Array.from({ length: 3000 }, (_, s) => semesterCards({ temperament: 'esquentado', minutes: 1 }, createPrng(s)));
    const long = rs.find((c) => c.longSuspension)!;
    expect(long.minutesLost).toBeGreaterThanOrEqual(cfg.cartoes.minutosSuspensaoLonga);
    expect(rs.find((c) => c.reds === 0 && !c.longSuspension)!.minutesLost).toBe(0);
  });

  it('temperamento afeta eventos: Resenha recebe mais convite de festa; Esquentado, mais polêmica', () => {
    expect(flagRate('resenha', 'conviteFesta')).toBeGreaterThan(flagRate('frio', 'conviteFesta') + 0.15);
    expect(flagRate('esquentado', 'polemica')).toBeGreaterThan(flagRate('frio', 'polemica'));
  });

  it('casa da família só com patrimônio e uma vez; investimento só com patrimônio alto', () => {
    const f = (wealthBRL: number, houseBought: boolean) => offFieldFlags({ temperament: 'frio', wealthBRL, houseBought }, createPrng(1));
    expect(f(cfg.foraDeCampo.casa.patrimonioMin, false).podeComprarCasa).toBe(true);
    expect(f(cfg.foraDeCampo.casa.patrimonioMin, true).podeComprarCasa).toBe(false);
    expect(f(100, false).podeComprarCasa).toBe(false);
    expect(Array.from({ length: 500 }, (_, s) => offFieldFlags({ temperament: 'frio', wealthBRL: 100, houseBought: true }, createPrng(s)).conviteInvestir).some(Boolean)).toBe(false);
  });

  it('dilemas fora de campo no catálogo: cena, efeitos em patrimônio/moral/disciplina e política por temperamento', () => {
    expect(eligibleEvents({ conviteFesta: true })).toContain('festa');
    expect(sceneOf('festa')).toBe('festa');
    expect(autoChoice('festa', 'resenha')).toBe('ir');
    expect(autoChoice('festa', 'frio')).toBe('ficar-em-casa');
    const s = applyOption({ moral: 0.5, disciplina: 0.5 }, 'festa', 'ir');
    expect(s.moral).toBeGreaterThan(0.5);
    expect(s.disciplina).toBeLessThan(0.5);
    const casa = applyOption({ patrimonio: 2_000_000, moral: 0.5, casaComprada: false }, 'casa-da-familia', 'comprar');
    expect(casa).toMatchObject({ patrimonio: 1_700_000, casaComprada: true });
  });

  it('investimento: retorno dentro da faixa, pode ganhar ou perder', () => {
    const rs = Array.from({ length: 500 }, (_, s) => investmentReturn(10_000_000, createPrng(s)));
    const [lo, hi] = cfg.foraDeCampo.investir.retorno as [number, number];
    for (const r of rs) {
      expect(r).toBeGreaterThanOrEqual(10_000_000 * cfg.foraDeCampo.investir.fracao * lo - 1);
      expect(r).toBeLessThanOrEqual(10_000_000 * cfg.foraDeCampo.investir.fracao * hi + 1);
    }
    expect(rs.some((r) => r > 0) && rs.some((r) => r < 0)).toBe(true);
  });

  it('amadurecimento: Esquentado vira Líder aos 30+ ou após suspensão longa; Frio não muda', () => {
    expect(matureTemperament('esquentado', 25, false)).toBe('esquentado');
    expect(matureTemperament('esquentado', 30, false)).toBe('lider');
    expect(matureTemperament('esquentado', 22, true)).toBe('lider');
    expect(matureTemperament('resenha', 32, false)).toBe('lider');
    expect(matureTemperament('frio', 38, true)).toBe('frio');
    expect(eligibleEvents({ amadureceu: 'lider' })).toContain('amadurecimento');
  });

  it('Líder: bônus de Mental e atrito com o técnico na fase ruim', () => {
    expect(leaderEffects('lider', 0).mentalBonus).toBe(cfg.lider.bonusMental);
    expect(leaderEffects('frio', 0).mentalBonus).toBe(1);
    expect(leaderEffects('lider', -0.6).relationDelta).toBeLessThan(0);
    expect(leaderEffects('lider', 0.2).relationDelta).toBe(0);
    expect(leaderEffects('frio', -0.6).relationDelta).toBe(0);
  });
});
