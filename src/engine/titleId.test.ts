import { describe, expect, it } from 'vitest';
import { titleBase, titleCountry, titleId } from './titleId';

describe('titleId (v2.90): liga e copa nacional levam o país do clube', () => {
  it('liga e copa da Europa: país da liga', () => {
    expect(titleId({ competition: 'ligaNacional', clubId: 'man-city' })).toBe('ligaNacional:ENG');
    expect(titleId({ competition: 'copaNacional', clubId: 'man-city' })).toBe('copaNacional:ENG');
  });

  it('liga simplificada: país do clube sul-americano, de fora do eixo e dos outros europeus', () => {
    expect(titleId({ competition: 'ligaNacional', clubId: 'boca-juniors' })).toBe('ligaNacional:ARG');
    expect(titleId({ competition: 'ligaNacional', clubId: 'al-hilal' })).toBe('ligaNacional:SAU');
    expect(titleId({ competition: 'ligaNacional', clubId: 'club-brugge' })).toBe('ligaNacional:BEL');
  });

  it('as outras competições e clube desconhecido ficam como estão', () => {
    expect(titleId({ competition: 'serieA', clubId: 'flamengo' })).toBe('serieA');
    expect(titleId({ competition: 'champions', clubId: 'man-city' })).toBe('champions');
    expect(titleId({ competition: 'ligaNacional', clubId: 'nao-existe' })).toBe('ligaNacional');
  });

  it('base e país saem do id (saves antigos guardam só a base)', () => {
    expect(titleBase('ligaNacional:ENG')).toBe('ligaNacional');
    expect(titleCountry('ligaNacional:ENG')).toBe('ENG');
    expect(titleBase('serieA')).toBe('serieA');
    expect(titleCountry('serieA')).toBeUndefined();
  });
});
