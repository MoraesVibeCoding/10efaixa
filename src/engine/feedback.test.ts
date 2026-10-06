import cfg from '../data/feedback.json';
import idolCfg from '../data/idolatry.json';
import { ATTRIBUTES, type Attributes } from './attributes';
import { idolBand, semesterFeedback } from './feedback';

// T51b (SPEC 6.13/6.18, v2.31, v2.41): o que mudou no semestre, em até duas frases sem número; a idolatria em faixas.
const base = Object.fromEntries(ATTRIBUTES.map((a) => [a, 60])) as Attributes;
const after = (d: Partial<Attributes>) => ({ ...base, ...Object.fromEntries(Object.entries(d).map(([k, v]) => [k, 60 + (v as number)])) }) as Attributes;

describe('retorno da evolução (T51b)', () => {
  it('limiares em dados: muda a partir de 2; bastante a partir de +5 ou −4; no máximo 2 frases', () => {
    expect(cfg).toMatchObject({ muda: 2, bastanteSobe: 5, bastanteDesce: 4, maxFrases: 2 });
  });

  it('nada passou de ±1: nenhuma frase (o ruído do semestre não vira notícia)', () => {
    expect(semesterFeedback(base, after({ passe: 1, drible: -1 }))).toEqual([]);
  });

  it('as duas maiores mudanças, com sentido e força; quem mudou mais vem primeiro', () => {
    expect(semesterFeedback(base, after({ passe: 6, velocidade: 2, fisico: -3 }))).toEqual([
      { atributo: 'passe', sentido: 'sobe', forte: true },
      { atributo: 'fisico', sentido: 'desce', forte: false },
    ]);
    expect(semesterFeedback(base, after({ fisico: -4 }))).toEqual([{ atributo: 'fisico', sentido: 'desce', forte: true }]);
  });

  it('empate: a ordem dos atributos decide (determinístico)', () => {
    expect(semesterFeedback(base, after({ drible: 3, passe: 3, mental: 3 })).map((f) => f.atributo)).toEqual(['passe', 'drible']);
  });
});

describe('idolatria em faixas (T51b)', () => {
  it('as faixas cobrem −100 a 100, em ordem, e casam com os limites de ídolo e vilão', () => {
    const f = idolCfg.faixas;
    expect(f.map((x) => x.key)).toEqual(['vilao', 'contestado', 'desconhecido', 'promessa', 'conhecido', 'querido', 'idolo', 'lenda']);
    expect(f.at(-1)!.max).toBe(100);
    expect(idolBand(idolCfg.limites.vilao)).toBe('vilao');
    expect(idolBand(idolCfg.limites.vilao + 1)).toBe('contestado');
    expect(idolBand(idolCfg.limites.idolo)).toBe('idolo');
    expect(idolBand(idolCfg.limites.idolo - 1)).toBe('querido');
  });

  it('pontos de cada faixa', () => {
    expect([-100, -20, 0, 15, 40, 60, 80, 95, 100].map(idolBand)).toEqual(['vilao', 'contestado', 'desconhecido', 'promessa', 'conhecido', 'querido', 'idolo', 'lenda', 'lenda']);
  });

  it('fora de −100..100 é erro', () => {
    expect(() => idolBand(101)).toThrow(RangeError);
    expect(() => idolBand(-101)).toThrow(RangeError);
  });
});
