import { CLUBS, areRivals, clubsIn, validateClubs } from './clubs';
import raw from '../data/clubs.json';
import creation from '../data/creation.json';
import leagues from '../data/leagues.json';

const clone = () => structuredClone(raw.clubs) as unknown as Record<string, unknown>[];

describe('clubes (T15)', () => {
  it('o JSON passa no schema', () => {
    expect(validateClubs(raw.clubs, creation.states)).toEqual([]);
  });

  it('40 clubes: 20 na Série A e 20 na Série B, como no formato da liga', () => {
    expect(CLUBS).toHaveLength(40);
    expect(clubsIn('A')).toHaveLength(leagues.leagues.A.clubes);
    expect(clubsIn('B')).toHaveLength(leagues.leagues.B.clubes);
  });

  it('dados oficiais com fonte e data', () => {
    expect(raw.fonte.serieA).toMatch(/^https:\/\/www\.cbf\.com\.br\//);
    expect(raw.fonte.serieB).toMatch(/^https:\/\/www\.cbf\.com\.br\//);
    expect(raw.conferidoEm).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(leagues.fonte.serieB).toMatch(/cbf\.com\.br/);
  });

  it.each([
    ['id repetido', (c: Record<string, unknown>[]) => { c[1]!.id = c[0]!.id; }],
    ['sigla repetida', (c: Record<string, unknown>[]) => { c[1]!.sigla = c[0]!.sigla; }],
    ['UF inexistente', (c: Record<string, unknown>[]) => { c[0]!.uf = 'XX'; }],
    ['cor que não é hex', (c: Record<string, unknown>[]) => { c[0]!.cores = ['vermelho', '#000000']; }],
    ['reputação fora de 1–100', (c: Record<string, unknown>[]) => { c[0]!.reputacao = 120; }],
    ['divisão desconhecida', (c: Record<string, unknown>[]) => { c[0]!.divisao = 'Z'; }],
    ['rival inexistente', (c: Record<string, unknown>[]) => { c[0]!.rivais = ['clube-fantasma']; }],
    ['rivalidade não simétrica', (c: Record<string, unknown>[]) => { c[0]!.rivais = [...(c[0]!.rivais as string[]), c[39]!.id as string]; }],
    ['item nulo', (c: Record<string, unknown>[]) => { c[0] = null as never; }],
  ])('schema recusa %s', (_, mutate) => {
    const c = clone();
    mutate(c);
    expect(validateClubs(c, creation.states).length).toBeGreaterThan(0);
  });

  it.each([
    ['flamengo', 'fluminense'], ['flamengo', 'vasco'], ['botafogo', 'vasco'],
    ['corinthians', 'palmeiras'], ['sao-paulo', 'santos'], ['atletico-mg', 'cruzeiro'],
    ['gremio', 'internacional'], ['athletico-pr', 'coritiba'], ['bahia', 'vitoria'],
    ['fortaleza', 'ceara'], ['sport', 'nautico'], ['goias', 'vila-nova'],
  ])('clássico manual definido: %s × %s (nos dois sentidos)', (a, b) => {
    expect(areRivals(a, b)).toBe(true);
    expect(areRivals(b, a)).toBe(true);
  });

  it('times sem rivalidade não são rivais', () => {
    expect(areRivals('flamengo', 'gremio')).toBe(false);
    expect(areRivals('flamengo', 'flamengo')).toBe(false);
  });

  it('reputação reflete o tamanho: grandes acima dos médios', () => {
    const rep = (id: string) => CLUBS.find((c) => c.id === id)!.reputacao;
    expect(rep('flamengo')).toBeGreaterThan(rep('mirassol'));
    expect(Math.min(...clubsIn('A').map((c) => c.reputacao))).toBeGreaterThanOrEqual(55);
  });
});
