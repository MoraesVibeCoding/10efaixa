import { capStep } from './motor';
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
