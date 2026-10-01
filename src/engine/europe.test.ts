import { CLUBS } from './clubs';
import { FOREIGN } from './cups';
import { EUROPE, EURO_LEAGUES, areEuroRivals, effectiveRep, europeClubsIn, levelBonus, validateEurope } from './europe';
import raw from '../data/europe.json';

describe('Europa e ligas fora do eixo (T29)', () => {
  it('dados válidos', () => {
    expect(validateEurope(raw)).toEqual([]);
  });

  it.each([['ENG', 20], ['ESP', 20], ['ITA', 20], ['GER', 18], ['FRA', 18], ['POR', 18]])(
    '%s: %i clubes, igual ao número oficial, com fonte', (liga, n) => {
      expect(europeClubsIn(liga)).toHaveLength(n);
      const l = raw.ligas[liga as keyof typeof raw.ligas];
      expect(l.clubes).toBe(n);
      expect(l.fonte).toMatch(/^https:\/\//);
    });

  it('6 ligas, 114 clubes; pool UEFA com 36 e fonte da UEFA; fora do eixo com fonte por liga', () => {
    expect(EURO_LEAGUES.sort()).toEqual(['ENG', 'ESP', 'FRA', 'GER', 'ITA', 'POR']);
    expect(EUROPE).toHaveLength(114);
    expect(raw.outros.clubs).toHaveLength(36);
    expect(raw.outros.fonte.every((f) => f.includes('uefa.com'))).toBe(true);
    for (const l of Object.values(raw.foraDoEixo.ligas)) expect(l.fonte).toMatch(/^https:\/\//);
    expect(raw.foraDoEixo.ligas.CHN.verificado).toBe(false);
  });

  it('ids e siglas únicos em todas as bases de clubes (Brasil, América do Sul, Europa, fora do eixo)', () => {
    const all = [...CLUBS, ...FOREIGN, ...raw.clubs, ...raw.outros.clubs, ...raw.foraDoEixo.clubs];
    expect(new Set(all.map((c) => c.id)).size).toBe(all.length);
    expect(new Set(all.map((c) => c.sigla)).size).toBe(all.length);
  });

  it.each([
    ['real-madrid', 'barcelona'], ['inter', 'milan'], ['man-city', 'man-united'], ['arsenal', 'tottenham'],
    ['roma', 'lazio'], ['dortmund', 'schalke'], ['psg', 'marseille'], ['benfica', 'porto'], ['sevilla', 'betis'],
  ])('clássico manual: %s × %s (nos dois sentidos)', (a, b) => {
    expect(areEuroRivals(a, b)).toBe(true);
    expect(areEuroRivals(b, a)).toBe(true);
  });

  it('schema recusa rival de outra liga, rivalidade não simétrica e contagem errada', () => {
    const a = structuredClone(raw);
    a.clubs.find((c) => c.id === 'real-madrid')!.rivais.push('inter');
    expect(validateEurope(a).length).toBeGreaterThan(0);
    const b = structuredClone(raw);
    b.clubs.pop();
    expect(validateEurope(b).join()).toMatch(/clubes/);
  });

  it('bônus de nível: gigante europeu fica acima do maior brasileiro; fora do eixo abaixo', () => {
    expect(levelBonus('real-madrid')).toBe(raw.ligas.ESP.bonusNivel);
    expect(levelBonus('flamengo')).toBe(0);
    expect(effectiveRep('real-madrid')).toBeGreaterThan(effectiveRep('flamengo') + 5);
    expect(effectiveRep('al-hilal')).toBeLessThan(effectiveRep('real-madrid'));
    expect(effectiveRep('psv')).toBe(86 + raw.outros.bonusNivel);
  });
});
