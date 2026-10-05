import { CLUBS, clubsIn } from '../engine/clubs';
import { GOALKEEPER_KIT, PATTERNS, kitOf, validateKits } from './kits';
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
