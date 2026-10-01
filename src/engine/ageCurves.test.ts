import { ATTRIBUTES, type Attribute } from './attributes';
import { ageCurve } from './ageCurves';

const c = ageCurve;
const grows = (a: Attribute, age: number) => expect(c(a, age)).toBeGreaterThan(0);
const flat = (a: Attribute, age: number) => expect(c(a, age)).toBeCloseTo(0, 5);
const falls = (a: Attribute, age: number) => expect(c(a, age)).toBeLessThan(0);

describe('curvas de idade (6.4)', () => {
  it('Velocidade e Físico: crescem até ~23, platô 23–30, caem de ~31, forte após ~35', () => {
    for (const a of ['velocidade', 'fisico'] as const) {
      grows(a, 20); flat(a, 24); flat(a, 30); falls(a, 32);
      expect(c(a, 37)).toBeLessThan(2 * c(a, 32));
    }
  });

  it('Força: cresce até ~27, cai devagar após ~33', () => {
    grows('forca', 25); flat('forca', 29); flat('forca', 33); falls('forca', 35);
    expect(c('forca', 37)).toBeGreaterThan(c('velocidade', 37));
  });

  it('Técnicos crescem até ~30 e caem devagar', () => {
    for (const a of ['finalizacao', 'passe', 'habilidade', 'drible'] as const) {
      grows(a, 29); falls(a, 35);
      expect(c(a, 37)).toBeGreaterThan(c('velocidade', 37));
    }
  });

  it('Marcação cresce até ~31; Mental até ~33 e quase não cai', () => {
    grows('marcacao', 30); falls('marcacao', 35);
    grows('mental', 32);
    expect(c('mental', 38)).toBeGreaterThan(-0.15);
  });

  it('Jogo aéreo cresce até ~28, cai após ~32, mais devagar que Velocidade', () => {
    grows('jogoAereo', 27); flat('jogoAereo', 32); falls('jogoAereo', 34);
    expect(c('jogoAereo', 37)).toBeGreaterThan(c('velocidade', 37));
  });

  it('físicos não crescem a partir dos 30 (base do invariante da T10)', () => {
    for (const a of ['forca', 'velocidade', 'fisico'] as const) {
      for (let age = 30; age <= 40; age++) expect(c(a, age)).toBeLessThanOrEqual(0);
    }
  });

  it('todo atributo tem curva definida de 16 a 40, contínua', () => {
    for (const a of ATTRIBUTES) {
      for (let age = 16; age <= 40; age += 0.5) {
        expect(Number.isFinite(c(a, age))).toBe(true);
        expect(Math.abs(c(a, age + 0.5) - c(a, age))).toBeLessThanOrEqual(0.51);
      }
    }
  });
});
