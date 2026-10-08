import cfg from '../data/seasonSummary.json';
import minutesCfg from '../data/minutes.json';
import { ATTRIBUTES, type Attribute, type Attributes } from './attributes';
import type { Feedback } from './feedback';

// v2.61 (SPEC 6.15): resumo da temporada, mostrado num card por cima da próxima tela no Normal e no Completo. Puro e determinístico:
// só números do ano (jogos, gols, assistências, Over de-para com variação em %), os atributos que mais mudaram em direção e força
// (nunca o número, CLAUDE.md) e as chaves do comentário do técnico; o texto sai de src/i18n/pt-BR.
export interface SeasonSummaryInput {
  year: number; age: number; clubId: string; division: string | null;
  games: number; goals: number; assists: number;
  /** Fração de minutos do ano (0–1). */
  minutes: number;
  overallBefore: number; overallAfter: number;
  attrsBefore: Attributes; attrsAfter: Attributes;
  /** Ids das competições ganhas no ano. */
  titles: string[];
}
export type Evolucao = 'grande' | 'boa' | 'estavel' | 'queda';
export type MinutosFaixa = 'muitos' | 'rodizio' | 'poucos';
export interface SeasonSummary {
  year: number; age: number; clubId: string; division: string | null;
  partidas: number; gols: number; assistencias: number;
  overallDe: number; overallPara: number;
  /** Variação do Over no ano, em % inteiro (pode ser negativa). */
  pct: number;
  mudancas: Feedback[];
  titulos: string[];
  /** O comentário do técnico é montado na tela a partir destas chaves. */
  comentario: { evolucao: Evolucao; minutos: MinutosFaixa; destaque: Attribute | null; titulo: boolean };
}

const evolucaoOf = (pct: number): Evolucao => (pct >= cfg.pct.grande ? 'grande' : pct >= cfg.pct.boa ? 'boa' : pct > cfg.pct.queda ? 'estavel' : 'queda');
const minutosOf = (m: number): MinutosFaixa => (m >= minutesCfg.faixas.minutos.muitos ? 'muitos' : m >= minutesCfg.faixas.minutos.rodizio ? 'rodizio' : 'poucos');

/** Os atributos que mais mudaram no ano (até `maxAtributos`), a partir de `mudaAno`; empate pela ordem dos atributos. */
function yearChanges(before: Attributes, after: Attributes): Feedback[] {
  return ATTRIBUTES
    .map((atributo, k) => ({ atributo, d: after[atributo] - before[atributo], k }))
    .filter(({ d }) => Math.abs(d) >= cfg.mudaAno)
    .sort((a, b) => Math.abs(b.d) - Math.abs(a.d) || a.k - b.k)
    .slice(0, cfg.maxAtributos)
    .map(({ atributo, d }) => ({ atributo, sentido: d > 0 ? 'sobe' : 'desce', forte: Math.abs(d) >= cfg.forteAno }));
}

export function summarizeSeason(i: SeasonSummaryInput): SeasonSummary {
  if (!(i.overallBefore > 0) || !(i.overallAfter > 0)) throw new RangeError(`Over inválido: ${i.overallBefore} → ${i.overallAfter}`);
  for (const [nome, v] of [['jogos', i.games], ['gols', i.goals], ['assistências', i.assists]] as const) {
    if (!(v >= 0) || !Number.isFinite(v)) throw new RangeError(`${nome} inválido: ${v}`);
  }
  const pct = Math.round(((i.overallAfter - i.overallBefore) / i.overallBefore) * 100);
  const mudancas = yearChanges(i.attrsBefore, i.attrsAfter);
  const subiu = mudancas.find((m) => m.sentido === 'sobe');
  return {
    year: i.year, age: i.age, clubId: i.clubId, division: i.division,
    partidas: i.games, gols: i.goals, assistencias: i.assists,
    overallDe: i.overallBefore, overallPara: i.overallAfter, pct, mudancas, titulos: [...i.titles],
    comentario: { evolucao: evolucaoOf(pct), minutos: minutosOf(i.minutes), destaque: subiu?.atributo ?? null, titulo: i.titles.length > 0 },
  };
}
