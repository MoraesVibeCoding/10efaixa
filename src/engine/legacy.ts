import { holds, type Cond, type Ctx } from './events';
import type { CareerResult } from './career';
import idolatry from '../data/idolatry.json';
import cfg from '../data/legacy.json';

// T40 (SPEC 6.15): nota de legado (0–100), veredito (8 faixas) e rótulos por raridade.
export type Component = keyof typeof cfg.pesos;
export interface Legacy { score: number; components: Record<Component, number>; verdict: string; labels: { id: string; rarity: string }[] }
export const VERDICTS = cfg.veredito.map((v) => v.id);
export const LABELS = cfg.rotulos.map((l) => l.id);


/** A última faixa precisa aceitar qualquer carreira (invariante 9.2: toda carreira termina com veredito válido). */
export function validateLegacyConfig(c: { pesos: Record<string, number>; veredito: { notaMin: number; condicoes: unknown[] }[] }): string[] {
  const errors: string[] = [];
  if (Object.values(c.pesos).reduce((a, b) => a + b, 0) !== 100) errors.push('pesos devem somar 100');
  const last = c.veredito.at(-1);
  if (!last || last.notaMin > 0 || last.condicoes.length) errors.push('a última faixa de veredito não pode ter nota mínima nem requisito');
  return errors;
}
const cfgErrors = validateLegacyConfig(cfg);
if (cfgErrors.length) throw new Error(`legacy.json inválido: ${cfgErrors.join('; ')}`);

const num = (f: Ctx, k: string) => (typeof f[k] === 'number' ? (f[k] as number) : 0);
const cap = (x: number) => Math.min(1, Math.max(0, x));
const points = (f: Ctx, prefix: string, table: Record<string, number>) =>
  Object.entries(table).reduce((sum, [k, pts]) => sum + num(f, prefix + k) * pts, 0);

/** Nota de legado: cada componente vai de 0 a 1 e entra com o peso da SPEC. */
export function legacyScore(f: Ctx): { score: number; components: Record<Component, number> } {
  const s = cfg.selecao;
  const refs = { jogos: cfg.numeros.jogos, ...(cfg.numeros.porPosicao as Record<string, Record<string, number>>)[f.posicao as string] };
  const stats = Object.entries(refs).map(([k, ref]) => cap(num(f, k) / ref));
  const l = cfg.longevidade;
  const components: Record<Component, number> = {
    selecao: cap((num(f, 'convocacoes') * s.convocacao + num(f, 'semestresTitular') * s.titular + num(f, 'semestresCamisa10Selecao') * s.camisa10
      + num(f, 'semestresCapitaoSelecao') * s.capitao + points(f, 'base_', s.base) + points(f, 'titulo_', s.titulos)) / s.teto),
    titulos: cap(points(f, 'titulo_', cfg.titulos.pontos) / cfg.titulos.teto),
    premios: cap(points(f, 'premio_', cfg.premios.pontos) / cfg.premios.teto),
    numeros: stats.reduce((a, b) => a + b, 0) / stats.length,
    idolatria: cap(num(f, 'idolatriaMax') / 100),
    longevidade: 0.5 * cap(num(f, 'anos') / l.anosRef) + 0.5 * cap(num(f, 'patrimonioBRL') / l.patrimonioRefBRL),
  };
  const total = (Object.keys(cfg.pesos) as Component[]).reduce((sum, k) => sum + cfg.pesos[k] * components[k], 0);
  return { score: Math.round(total * 10) / 10, components };
}

const all = (f: Ctx, conds: unknown) => (conds as Cond[]).every((c) => holds(f, c));

/** Primeira faixa (da maior para a menor) com nota e requisitos atendidos; a última não tem requisito. */
export const verdictOf = (f: Ctx, score: number): string =>
  cfg.veredito.find((v) => score >= v.notaMin && all(f, v.condicoes))!.id;

/** Rótulos conquistados, do mais raro ao mais comum; o primeiro é o principal do cartão. */
export const labelsOf = (f: Ctx): { id: string; rarity: string }[] =>
  cfg.rotulos.filter((l) => all(f, l.condicoes)).map((l) => ({ id: l.id, rarity: l.raridade }));

const count = (xs: string[]) => xs.reduce<Record<string, number>>((m, x) => ({ ...m, [x]: (m[x] ?? 0) + 1 }), {});
const prefixed = (prefix: string, m: Record<string, number>) => Object.fromEntries(Object.entries(m).map(([k, v]) => [prefix + k, v]));

/** Fatos da carreira usados pela nota, pelo veredito e pelos rótulos (um contexto plano, como o dos eventos). */
export function legacyFacts(r: Omit<CareerResult, 'legacy' | 'nickname' | 'headline' | 'comment'>): Ctx {
  const sel = r.selection;
  const played = r.seasons.filter((s) => s.minutes >= cfg.elite.minutosMin);
  const worldCups = sel.tournaments.filter((t) => t.tournament === 'copaDoMundo');
  const titles = count(r.titles.map((t) => t.competition));
  const awards = count(r.awards.map((a) => a.award));
  const heart = r.player.heartClub;
  return {
    posicao: r.finalPosition, origem: r.player.origin, pico: r.peakOverall, anos: r.endAge - 16, aposentadoria: r.retirement,
    convocacoes: sel.caps, semestresTitular: sel.callUps.titular, semestresCamisa10Selecao: sel.ten, semestresCapitaoSelecao: sel.captain,
    convocacoesBase: sel.callUps.sub17 + sel.callUps.sub20 + sel.callUps.olimpica,
    base_sub17: sel.callUps.sub17, base_sub20: sel.callUps.sub20, base_olimpica: sel.callUps.olimpica,
    ...prefixed('titulo_', titles), ...prefixed('premio_', awards),
    jogos: r.stats.games, gols: r.stats.goals, assistencias: r.stats.assists, desarmes: r.stats.tackles, semSofrerGol: r.stats.cleanSheets,
    idolatriaMax: Math.max(0, ...Object.values(r.idolatry)), idoloNoCoracao: !!heart && (r.idolatry[heart] ?? 0) >= idolatry.limites.idolo,
    patrimonioBRL: r.wealthBRL, ganhoBRL: r.earnedBRL, fracaoGuardada: r.earnedBRL > 0 ? r.wealthBRL / r.earnedBRL : 1, casaComprada: r.houseBought,
    clubes: new Set(r.spells.map((s) => s.clubId)).size, classicosDecisivos: r.decisiveDerbies,
    temporadasElite: played.filter((s) => cfg.elite.ligas.includes(s.division ?? '')).length,
    grandeNoMundo: (titles.copaDoMundo ?? 0) > 0 || (awards.melhorDoMundo ?? 0) > 0,
    heroiDaCopa: worldCups.some((t) => t.hero), vilaoDaCopa: worldCups.some((t) => t.villain), oriundoCampeao: sel.oriundoCampeao,
    diamante: r.player.isDiamond && r.player.origin === 'varzea',
  };
}

export function legacyOf(r: Omit<CareerResult, 'legacy' | 'nickname' | 'headline' | 'comment'>): Legacy {
  const facts = legacyFacts(r);
  const { score, components } = legacyScore(facts);
  return { score, components, verdict: verdictOf(facts, score), labels: labelsOf(facts) };
}
