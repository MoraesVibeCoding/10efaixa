import { createAgent } from './agent';
import { addToWealth, currencyOf, makeContract, renew, seasonEarnings, toBRL } from './contracts';
import { eligibleEvents } from './events';
import { createPrng } from './prng';
import money from '../data/money.json';

const pai = createAgent('paiTio', createPrng(1));
const big = createAgent('grandeAgencia', createPrng(1));

describe('contratos, bicho, multa e renovação (T27)', () => {
  it('moeda do clube: R$ no Brasil, € no exterior', () => {
    expect(currencyOf('flamengo')).toBe('BRL');
    expect(currencyOf('ceara')).toBe('BRL');
    expect(currencyOf('river-plate')).toBe('EUR');
  });

  it('câmbio € 1 = R$ 6,00, configurável; real fica igual', () => {
    expect(money.cambio.EUR).toBe(6);
    expect(toBRL(1_000, 'EUR')).toBe(6_000);
    expect(toBRL(1_000, 'EUR', 5.5)).toBe(5_500);
    expect(toBRL(1_000, 'BRL')).toBe(1_000);
  });

  it('contrato: luvas crescem com a influência do empresário; bicho por vitória; multa maior para o exterior', () => {
    const a = makeContract({ clubId: 'flamengo', annualSalary: 1_200_000, years: 3, agent: pai });
    const b = makeContract({ clubId: 'flamengo', annualSalary: 1_200_000, years: 3, agent: big });
    expect(a.currency).toBe('BRL');
    expect(b.signingBonus).toBeGreaterThan(a.signingBonus);
    expect(a.winBonus).toBe(10_000);
    expect(a.releaseAbroad).toBeGreaterThan(a.releaseDomestic);
  });

  it('ganhos da temporada: salário + bicho × vitórias, na moeda do contrato', () => {
    const c = makeContract({ clubId: 'flamengo', annualSalary: 1_200_000, years: 3, agent: pai });
    expect(seasonEarnings(c, 20)).toBe(1_200_000 + 20 * 10_000);
  });

  it('patrimônio sempre em R$, já descontada a comissão do empresário', () => {
    expect(addToWealth(0, 100_000, 'EUR', pai)).toBe(Math.round(600_000 * (1 - pai.commission)));
    expect(addToWealth(50_000, 100_000, 'BRL', pai)).toBe(50_000 + Math.round(100_000 * (1 - pai.commission)));
  });

  it('renovação: novos anos e aumento pela evolução; pedir aumento rende mais', () => {
    const c = makeContract({ clubId: 'bahia', annualSalary: 500_000, years: 1, agent: pai });
    const r = renew(c, 5, false);
    expect(r.years).toBe(money.renovacao.anos);
    expect(r.annualSalary).toBeGreaterThan(c.annualSalary);
    expect(renew(c, 5, true).annualSalary).toBeGreaterThan(r.annualSalary);
    expect(renew(c, -10, false).annualSalary).toBe(c.annualSalary);
  });

  it('renovação é evento do catálogo (com cena) quando falta 1 ano', () => {
    expect(eligibleEvents({ contratoAnosRestantes: 1 })).toContain('renovacao');
    expect(eligibleEvents({ contratoAnosRestantes: 3 })).not.toContain('renovacao');
  });
});
