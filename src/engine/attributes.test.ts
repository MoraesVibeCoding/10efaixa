import { ATTRIBUTES, toBand } from './attributes';
import bands from '../data/bands.json';
import ptBR from '../i18n/pt-BR/attributes.json';

describe('atributos', () => {
  it('são exatamente os 10 da seção 6.3', () => {
    expect(ATTRIBUTES).toEqual([
      'finalizacao', 'passe', 'habilidade', 'drible',
      'forca', 'velocidade', 'fisico',
      'marcacao', 'mental', 'jogoAereo',
    ]);
  });

  it.each([
    [1, 'fraco', 1], [49, 'fraco', 1],
    [50, 'regular', 2], [64, 'regular', 2],
    [65, 'bom', 3], [74, 'bom', 3],
    [75, 'muitoBom', 4], [84, 'muitoBom', 4],
    [85, 'excelente', 4.5], [94, 'excelente', 4.5],
    [95, 'lendario', 5], [99, 'lendario', 5],
  ])('%i → %s, %f estrelas', (value, key, stars) => {
    expect(toBand(value)).toEqual({ key, stars });
  });

  it.each([0, 100, -1, 50.5, NaN])('recusa valor fora de 1–99 inteiro: %f', (value) => {
    expect(() => toBand(value)).toThrow(RangeError);
  });

  it('faixas em dados cobrem 1–99 sem buracos nem sobreposição', () => {
    expect(bands[0]!.min).toBe(1);
    expect(bands.at(-1)!.max).toBe(99);
    bands.slice(1).forEach((b, i) => expect(b.min).toBe(bands[i]!.max + 1));
  });

  it('todo atributo e toda faixa têm rótulo pt-BR', () => {
    for (const a of ATTRIBUTES) expect(ptBR.attribute[a]).toBeTruthy();
    for (const b of bands) expect(ptBR.band[b.key as keyof typeof ptBR.band]).toBeTruthy();
  });
});

describe('guarda do motor', () => {
  it('nenhum arquivo de src/engine usa Math.random', () => {
    const files = import.meta.glob<string>(['./**/*.ts', '!./**/*.test.ts'], {
      query: '?raw', import: 'default', eager: true,
    });
    expect(Object.keys(files).length).toBeGreaterThan(0);
    for (const [path, src] of Object.entries(files)) {
      expect(src.includes('Math.random'), path).toBe(false);
    }
  });
});
