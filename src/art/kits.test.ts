import { CLUBS, clubsIn } from '../engine/clubs';
import { GOALKEEPER_KIT, PATTERNS, kitOf, shirtPaint, validateKits } from './kits';
import europe from '../data/europe.json';
import foreign from '../data/foreignClubs.json';
import data from '../data/kits.json';

describe('uniformes dos clubes (arte, SPEC 6.17)', () => {
  it('os 20 clubes da Série A têm uniforme próprio, com padrão válido e cores em hex', () => {
    expect(validateKits(data, CLUBS.map((c) => c.id))).toEqual([]);
    for (const c of clubsIn('A')) expect(data.clubes, c.id).toHaveProperty(c.id);
    expect(Object.keys(data.clubes)).toHaveLength(20);
  });

  it('clube sem cadastro usa camisa lisa nas cores do clube', () => {
    const other = CLUBS.find((c) => !(c.id in data.clubes))!;
    expect(kitOf(other.id)).toEqual({ padrao: 'lisa', camisa: [other.cores[0]], detalhe: other.cores[1], calcao: other.cores[1], meiao: other.cores[0] });
  });

  it('padrões listrados têm pelo menos duas cores na camisa; lisa tem uma', () => {
    for (const id of Object.keys(data.clubes)) {
      const k = kitOf(id);
      expect(PATTERNS).toContain(k.padrao);
      expect(k.camisa.length).toBeGreaterThanOrEqual(k.padrao === 'lisa' ? 1 : 2);
    }
    expect(kitOf('flamengo').padrao).toBe('faixas-horizontais');
    expect(kitOf('vasco').padrao).toBe('faixa-diagonal');
  });

  it('goleiro: um uniforme só para todos os clubes, de manga longa e com luvas', () => {
    expect(GOALKEEPER_KIT.mangaLonga).toBe(true);
    expect(GOALKEEPER_KIT.luvas).toMatch(/^#[0-9A-F]{6}$/i);
    expect(GOALKEEPER_KIT.camisa).toHaveLength(1);
  });

  it('configuração inválida é recusada', () => {
    const ids = CLUBS.map((c) => c.id);
    expect(validateKits({ ...data, clubes: { fantasma: data.clubes.flamengo } }, ids)).not.toEqual([]);
    expect(validateKits({ ...data, clubes: { flamengo: { ...data.clubes.flamengo, padrao: 'xadrez' } } }, ids)).not.toEqual([]);
    expect(validateKits({ ...data, clubes: { flamengo: { ...data.clubes.flamengo, camisa: ['vermelho'] } } }, ids)).not.toEqual([]);
  });
});

describe('camisa da figurinha (T50i, SPEC v2.37)', () => {
  it('clubes de fora usam as cores do próprio cadastro, não o cinza neutro', () => {
    for (const c of [europe.clubs[0]!, europe.outros.clubs[0]!, europe.foraDoEixo.clubs[0]!, foreign.clubs[0]!]) {
      expect(kitOf(c.id).camisa[0], c.id).toBe(c.cores[0]);
      expect(kitOf(c.id).padrao, c.id).toBe('lisa');
    }
  });

  it('lisa: o desenho é a cor única da camisa', () => {
    expect(shirtPaint({ padrao: 'lisa', camisa: ['#C8102E'], detalhe: '#000000', calcao: '#000000', meiao: '#000000' })).toBe('linear-gradient(#C8102E, #C8102E)');
  });

  it('cada padrão vira um desenho próprio, com todas as cores da camisa', () => {
    const kit = (padrao: string) => ({ padrao, camisa: ['#C8102E', '#000000', '#0057B8'], detalhe: '#000000', calcao: '#000000', meiao: '#000000' });
    const paints = PATTERNS.filter((p) => p !== 'lisa').map((p) => shirtPaint(kit(p)));
    expect(new Set(paints).size).toBe(paints.length);
    for (const paint of paints) for (const c of ['#C8102E', '#000000', '#0057B8']) expect(paint).toContain(c);
  });

  it('listras verticais correm em pé, faixas horizontais deitadas; a faixa diagonal é uma só', () => {
    const k = (padrao: string) => shirtPaint({ padrao, camisa: ['#000000', '#FFFFFF'], detalhe: '#000000', calcao: '#000000', meiao: '#000000' });
    expect(k('listras-verticais')).toMatch(/^repeating-linear-gradient\(90deg,/);
    expect(k('listras-finas')).toMatch(/^repeating-linear-gradient\(90deg,/);
    expect(k('faixas-horizontais')).toMatch(/^repeating-linear-gradient\(180deg,/);
    expect(k('listras-diagonais')).toMatch(/^repeating-linear-gradient\(\d+deg,/);
    expect(k('faixa-diagonal')).toMatch(/^linear-gradient\(\d+deg,/);
    expect(k('faixa-no-peito')).toMatch(/^linear-gradient\(180deg,/);
  });

  it('os 20 clubes da Série A têm desenho (padrão do kits.json)', () => {
    for (const id of Object.keys(data.clubes)) expect(shirtPaint(kitOf(id)), id).toMatch(/gradient\(/);
  });
});
