import { ATTRIBUTES, type Attribute } from '../engine/attributes';
import type { CareerResult } from '../engine/career';
import { HONORS_ON_CARD } from '../engine/honors';
import { status } from '../engine/idolatry';
import { storyHighlights, storyOf } from '../engine/story';
import { t } from '../i18n';
import { clubName } from '../ui/screens/clubText';
import { storyText } from '../ui/screens/storyText';

// T55c (SPEC 6.15, v2.42): tudo o que as duas versões do cartão desenham, já em texto pt-BR, e o texto alternativo de cada uma.
export interface CardModel {
  nome: string; apelido: string; posicao: string; clubeAuge: string; overall: number;
  /** v2.62: a figurinha veste o último clube profissional; `numero` é a camisa nele. */
  clubeFigurinha: string; numero: number;
  /** v2.62: clubes onde virou ídolo, o de coração primeiro (marcado), depois do maior para o menor. */
  idolos: { clubId: string; nome: string; coracao: boolean }[];
  veredito: string; rotulo: string; manchete: string; comentario: string;
  honrarias: string[]; frases: string[]; clubes: string[];
  numeros: { id: 'jogos' | 'gols' | 'assistencias' | 'semSofrerGol' | 'titulos' | 'selecao' | 'patrimonio'; nome: string; valor: string }[];
  radar: { id: Attribute; nome: string; valor: number }[];
  codigo: string; alt: { narrativa: string; estatistica: string };
}

const brl = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(v);

export function cardModel(r: CareerResult, codigo: string): CardModel {
  const clubes: string[] = [];
  for (const s of r.spells) if (clubes.at(-1) !== s.clubId) clubes.push(s.clubId);
  const clubeFigurinha = figurinhaClub(r);
  const numero = r.spells.filter((s) => s.clubId === clubeFigurinha).at(-1)?.number ?? r.spells.at(-1)?.number ?? 10;
  const heart = r.player.heartClub;
  const idolos = Object.entries(r.idolatry)
    .filter(([, v]) => status(v) === 'idolo')
    .sort(([a, va], [b, vb]) => Number(b === heart) - Number(a === heart) || vb - va)
    .map(([clubId]) => ({ clubId, nome: clubName(clubId).nome, coracao: clubId === heart }));
  const frases = storyHighlights(storyOf({ ...r, origin: r.player.origin })).map(storyText);
  const radar = ATTRIBUTES.map((id) => ({ id, nome: t(`attributes.attribute.${id}`), valor: Math.round(r.peakAttributes[id]) }));
  const n = (id: CardModel['numeros'][number]['id'], valor: string) => ({ id, nome: t(`ui.cartao.numero.${id}`), valor });
  const numeros = [
    n('jogos', r.stats.games.toLocaleString('pt-BR')),
    // revisão das telas: o goleiro mostra os jogos sem sofrer gol no lugar de gols e assistências
    ...(r.player.position === 'goleiro'
      ? [n('semSofrerGol', r.stats.cleanSheets.toLocaleString('pt-BR'))]
      : [n('gols', r.stats.goals.toLocaleString('pt-BR')), n('assistencias', r.stats.assists.toLocaleString('pt-BR'))]),
    n('titulos', r.titles.length.toLocaleString('pt-BR')),
    // v2.65: jogos e gols pela Seleção (base inclusive), só para quem jogou por ela
    ...(r.selection.games > 0 ? [n('selecao', t('ui.cartao.selecaoValor', { jogos: r.selection.games, gols: r.selection.goals }))] : []),
    n('patrimonio', brl(r.wealthBRL)),
  ];
  const base = {
    nome: r.player.name, apelido: r.nickname, numero, clubeFigurinha, idolos, posicao: t(`positions.${r.finalPosition}`), clubeAuge: r.peakClubId,
    overall: r.peakOverall, veredito: t(`legacy.veredito.${r.legacy.verdict}`), rotulo: t(`legacy.rotulo.${r.legacy.labels[0]!.id}`),
    manchete: r.headline, comentario: r.comment,
    honrarias: r.honors.slice(0, HONORS_ON_CARD).map((id) => t(`legacy.honraria.${id}`)),
  };
  const alt = {
    narrativa: t('ui.cartao.altNarrativa', { nome: base.nome, apelido: base.apelido, veredito: base.veredito, rotulo: base.rotulo, manchete: base.manchete, frases: frases.join('. ') })
      + (idolos.length ? ` ${idolLine(idolos)}.` : ''),
    estatistica: t('ui.cartao.altEstatistica', {
      nome: base.nome, over: base.overall, numeros: numeros.map((x) => `${x.nome} ${x.valor}`).join(', '),
      atributos: radar.map((a) => `${a.nome} ${a.valor}`).join(', '),
    }),
  };
  return { ...base, frases, clubes, numeros, radar, codigo, alt };
}

/** v2.62: o clube da figurinha do cartão: o da última temporada profissional (sem nenhuma, o do auge). */
export function figurinhaClub(r: Pick<CareerResult, 'seasons' | 'peakClubId'>): string {
  return r.seasons.filter((s) => s.division !== null).at(-1)?.clubId ?? r.peakClubId;
}

/** v2.62: "Ídolo do clube de coração: X" e/ou "Ídolo: Y, Z", numa linha (cartão e texto alternativo). */
export function idolLine(idolos: CardModel['idolos']): string {
  const heart = idolos.find((i) => i.coracao);
  const others = idolos.filter((i) => !i.coracao).map((i) => i.nome);
  const parts = [];
  if (heart) parts.push(t('ui.cartao.idoloCoracao', { clube: heart.nome }));
  if (others.length) parts.push(t(heart ? 'ui.cartao.idoloTambem' : 'ui.cartao.idolo', { clubes: others.join(', ') }));
  return parts.join(' · ');
}
