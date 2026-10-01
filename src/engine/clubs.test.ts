import { CLUBS, areRivals, clubsIn, rivalsOf, validateClubs } from './clubs';
import raw from '../data/clubs.json';
import creation from '../data/creation.json';
import leagues from '../data/leagues.json';

const clone = () => structuredClone(raw.clubs) as unknown as Record<string, unknown>[];

describe('clubes (T15)', () => {
  it('o JSON passa no schema', () => {
    expect(validateClubs(raw.clubs, creation.states)).toEqual([]);
  });

  it('Séries A e B com 20 clubes cada, como no formato da liga', () => {
    expect(clubsIn('A')).toHaveLength(leagues.leagues.A.clubes);
    expect(clubsIn('B')).toHaveLength(leagues.leagues.B.clubes);
  });

  it('Série C com 20 clubes (2026) e Série D com 96, com fonte oficial', () => {
    expect(clubsIn('C')).toHaveLength(leagues.leagues.C.clubes);
    expect(clubsIn('D')).toHaveLength(leagues.leagues.D.clubes);
    expect(CLUBS).toHaveLength(156);
    expect(raw.fonte.serieC).toMatch(/cbf\.com\.br/);
    expect(raw.fonte.serieD).toMatch(/cbf\.com\.br/);
    expect(leagues.fonte.serieC).toMatch(/cbf\.com\.br/);
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

  it.each([
    ['paysandu', 'remo'], ['guarani', 'ponte-preta'], ['santa-cruz', 'sport'], ['santa-cruz', 'nautico'],
    ['figueirense', 'avai'], ['caxias', 'juventude'], ['nacional-am', 'manaus-fc'], ['amazonas', 'manauara'],
    ['abc', 'america-rn'], ['sampaio-correa', 'moto-club'], ['csa', 'crb'],
  ])('rival automático por cidade (Séries C/D): %s × %s', (a, b) => {
    expect(areRivals(a, b)).toBe(true);
    expect(areRivals(b, a)).toBe(true);
  });

  it('cidade incerta (null) não gera rival automático; só C/D ganham rival por cidade', () => {
    expect(rivalsOf('decisao')).toEqual([]);
    expect(areRivals('palmeiras', 'portuguesa')).toBe(true); // Portuguesa (D) em São Paulo
    expect(areRivals('gremio', 'internacional')).toBe(true); // manual mantido
    expect(areRivals('atletico-mg', 'gremio')).toBe(false);
  });

  it('schema: cidade null só é aceita nas Séries C e D', () => {
    const c = clone();
    c[0]!.cidade = null;
    expect(validateClubs(c, creation.states).length).toBeGreaterThan(0);
    const d = clone();
    const idx = d.findIndex((x) => x.divisao === 'D');
    d[idx]!.cidade = null;
    expect(validateClubs(d, creation.states)).toEqual([]);
  });

  it('rivais manuais só nas Séries A e B (C/D são calculados)', () => {
    const c = clone();
    const idx = c.findIndex((x) => x.id === 'paysandu');
    c[idx]!.rivais = ['remo'];
    (c.find((x) => x.id === 'remo')!.rivais as string[]).push('paysandu');
    expect(validateClubs(c, creation.states).length).toBeGreaterThan(0);
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
