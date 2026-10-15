import { capStep, motorValue, valueFactor } from './motor';
import { marketValue } from './market';
import market from '../data/market.json';
import cfg from '../data/motor.json';

// v3.07, opção A (decisão do usuário em 2026-10-15): o produto das decisões desloca o teto dos atributos.
// O neutro é o produto típico da carreira automática (medido nas 300 carreiras), não 1: a moral e a relação com o
// técnico ficam acima de 0,5 na maior parte da carreira, então o produto médio já passa de 1.
describe('passo do teto pelas decisões (v3.07, opção A)', () => {
  const { neutro, amplitude, passoMax: passo } = cfg.teto;

  it('produto no neutro não mexe no teto', () => {
    expect(capStep(neutro)).toBe(0);
  });

  it('a uma amplitude do neutro, o passo é o máximo por semestre, com sinal', () => {
    expect(capStep(neutro + amplitude)).toBeCloseTo(passo);
    expect(capStep(neutro - amplitude)).toBeCloseTo(-passo);
  });

  it('é proporcional dentro da amplitude e nunca passa do máximo', () => {
    expect(capStep(neutro + amplitude / 2)).toBeCloseTo(passo / 2);
    expect(capStep(neutro - amplitude / 2)).toBeCloseTo(-passo / 2);
    expect(capStep(neutro + 3 * amplitude)).toBeCloseTo(passo);
    expect(capStep(neutro - 3 * amplitude)).toBeCloseTo(-passo);
  });
});

// v3.07 (usuário, 2026-10-15): liga × crescimento × clube limitado a valor.fatorMax (o "bom" passava de € 240 mi aos 24).
describe('fator do valor de mercado limitado (v3.07)', () => {
  it('liga de nível 1 com crescimento máximo não passa do fator máximo', () => {
    expect(valueFactor({ overDelta: 20, clubId: 'qualquer', league: 'ENG' })).toBeCloseTo(cfg.valor.fatorMax);
  });

  it('abaixo do limite, o fator segue liga × crescimento', () => {
    expect(valueFactor({ overDelta: 0, clubId: 'qualquer', league: 'POR' })).toBeCloseTo(1.2);
  });
});

// v3.07 (usuário, 2026-10-15, opção 1): o teto da curva de valor (market.json, tetoEUR) vale sobre o valor final, depois
// de liga, crescimento e clube. Antes ele só limitava o valor base.
describe('valor final com o teto de mercado (v3.07)', () => {
  it('jogador de elite em liga de nível 1 para no teto', () => {
    expect(motorValue({ overall: 95, age: 24, overDelta: 2, clubId: 'qualquer', league: 'ENG' })).toBe(market.curva.tetoEUR);
  });

  it('abaixo do teto, é o valor base vezes o fator', () => {
    const base = marketValue(80, 24);
    expect(motorValue({ overall: 80, age: 24, overDelta: 0, clubId: 'qualquer', league: 'POR' })).toBe(Math.round(base * 1.2));
  });
});

describe('multiplicador extra no valor (v3.07: elite e seleção)', () => {
  it('entra antes do teto', () => {
    const base = Math.round(marketValue(80, 24) * 1.2);
    expect(motorValue({ overall: 80, age: 24, overDelta: 0, clubId: 'qualquer', league: 'POR', mult: 1.25 })).toBe(Math.round(marketValue(80, 24) * 1.2 * 1.25));
    expect(motorValue({ overall: 80, age: 24, overDelta: 0, clubId: 'qualquer', league: 'POR' })).toBe(base);
    expect(motorValue({ overall: 95, age: 24, overDelta: 0, clubId: 'qualquer', league: 'POR', mult: 3 })).toBe(market.curva.tetoEUR);
  });
});
