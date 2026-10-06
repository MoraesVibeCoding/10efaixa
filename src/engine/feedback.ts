import cfg from '../data/feedback.json';
import idolCfg from '../data/idolatry.json';
import { ATTRIBUTES, type Attribute, type Attributes } from './attributes';

// T51b (SPEC 6.13/6.18, v2.31, v2.41): o retorno do semestre e a idolatria em palavras. Puro e determinístico.
export interface Feedback { atributo: Attribute; sentido: 'sobe' | 'desce'; forte: boolean }

/** Os atributos que mais mudaram no semestre (no máximo `maxFrases`), a partir do limiar `muda`; empate pela ordem dos atributos. */
export function semesterFeedback(before: Attributes, after: Attributes): Feedback[] {
  return ATTRIBUTES
    .map((atributo, k) => ({ atributo, d: after[atributo] - before[atributo], k }))
    .filter(({ d }) => Math.abs(d) >= cfg.muda)
    .sort((a, b) => Math.abs(b.d) - Math.abs(a.d) || a.k - b.k)
    .slice(0, cfg.maxFrases)
    .map(({ atributo, d }) => ({ atributo, sentido: d > 0 ? 'sobe' : 'desce', forte: d > 0 ? d >= cfg.bastanteSobe : -d >= cfg.bastanteDesce }));
}

export type IdolBand = (typeof idolCfg.faixas)[number]['key'];

/** A faixa da idolatria (−100 a 100), pelos limites de `idolatry.json`. */
export function idolBand(value: number): IdolBand {
  if (!(value >= -100 && value <= 100)) throw new RangeError(`idolatria fora de −100..100: ${value}`);
  return idolCfg.faixas.find((f) => value <= f.max)!.key;
}
