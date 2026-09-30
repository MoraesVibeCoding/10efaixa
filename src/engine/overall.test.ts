import { ATTRIBUTES, type Attributes } from './attributes';
import { POSITIONS, overall } from './overall';
import weights from '../data/positionWeights.json';
import ptBR from '../i18n/pt-BR/positions.json';

const flat = (v: number): Attributes =>
  Object.fromEntries(ATTRIBUTES.map((a) => [a, v])) as Attributes;

describe('overall por posição', () => {
  it('são as 6 posições da seção 6.1', () => {
    expect(POSITIONS).toEqual(['goleiro', 'zagueiro', 'lateral', 'volante', 'meia', 'atacante']);
  });

  it.each(POSITIONS)('%s: atributos todos iguais → overall igual', (pos) => {
    expect(overall(flat(70), pos)).toBe(70);
    expect(overall(flat(1), pos)).toBe(1);
    expect(overall(flat(99), pos)).toBe(99);
  });

  it('goleiro usa a tradução: mãos (Habilidade), reflexo (Velocidade), saída (Jogo aéreo)', () => {
    const paredao = { ...flat(40), habilidade: 90, velocidade: 90, jogoAereo: 85, mental: 80 };
    expect(overall(paredao, 'goleiro')).toBeGreaterThanOrEqual(75);
    expect(overall(paredao, 'atacante')).toBeLessThan(overall(paredao, 'goleiro'));
  });

  it('goleiro: Finalização não conta no overall (só com traço de cobrador)', () => {
    expect(overall({ ...flat(60), finalizacao: 99 }, 'goleiro')).toBe(60);
  });

  it('Jogo aéreo pesa mais para zagueiro e goleiro do que para meia', () => {
    const gain = (pos: (typeof POSITIONS)[number]) =>
      overall({ ...flat(50), jogoAereo: 90 }, pos) - overall(flat(50), pos);
    expect(gain('zagueiro')).toBeGreaterThan(gain('meia') + 5);
    expect(gain('goleiro')).toBeGreaterThan(gain('meia') + 5);
  });

  it('casos conhecidos: centroavante artilheiro, volante marcador, meia criativo', () => {
    const artilheiro = { ...flat(50), finalizacao: 90, forca: 80, jogoAereo: 80 };
    expect(overall(artilheiro, 'atacante')).toBeGreaterThan(overall(artilheiro, 'meia'));
    const marcador = { ...flat(50), marcacao: 88, forca: 80, fisico: 80 };
    expect(overall(marcador, 'volante')).toBeGreaterThan(overall(marcador, 'meia'));
    const criativo = { ...flat(50), passe: 88, habilidade: 88, drible: 85 };
    expect(overall(criativo, 'meia')).toBeGreaterThan(overall(criativo, 'zagueiro'));
  });

  it('dados: toda posição tem os 10 atributos, pesos ≥ 0 e soma 100', () => {
    for (const pos of POSITIONS) {
      const w = weights[pos] as Record<string, number>;
      expect(Object.keys(w).sort()).toEqual([...ATTRIBUTES].sort());
      expect(Object.values(w).every((x) => x >= 0)).toBe(true);
      expect(Object.values(w).reduce((s, x) => s + x, 0)).toBe(100);
    }
  });

  it('toda posição tem rótulo pt-BR', () => {
    for (const pos of POSITIONS) expect(ptBR[pos]).toBeTruthy();
  });
});
