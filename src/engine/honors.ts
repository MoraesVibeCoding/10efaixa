import { holds, type Cond, type Ctx } from './events';
import { legacyFacts } from './legacy';
import type { CareerResult } from './career';
import cfg from '../data/honors.json';

// T55a (SPEC 6.15, v2.28): honrarias bem-humoradas; critérios e ordem em dados, textos no i18n.
export const HONORS = cfg.honrarias.map((h) => h.id);
export const HONORS_ON_CARD = cfg.maxNoCartao;

/** Honrarias conquistadas, da mais rara para a mais comum (ordem dos dados). */
export const honorsOf = (f: Ctx): string[] =>
  cfg.honrarias.filter((h) => (h.condicoes as Cond[]).every((c) => holds(f, c))).map((h) => h.id);

/** Fatos da nota de legado mais os que só as honrarias usam. */
export function honorFacts(r: Omit<CareerResult, 'legacy' | 'nickname' | 'headline' | 'comment' | 'honors'>): Ctx {
  return {
    ...legacyFacts(r), lesoesGraves: r.injuries.grave, vermelhos: r.cards.reds,
    mudancasPosicao: r.positionChanges, idadeFinal: r.endAge, titulos: r.titles.length,
  };
}
