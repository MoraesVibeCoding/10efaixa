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
  /** v2.81 (Álbum, card de fim de carreira): o auge com a idade em que veio. */
  auge: { overall: number; idade: number };
  /** As duas metas do jogo respondidas: vestiu a 10 da Seleção, usou a faixa de capitão dela. */
  metas: { dez: boolean; faixa: boolean };
  /** "Do terrão do bairro à despedida no Santos": da origem ao último clube. */
  arco: string;
  /** O sonho do clube de coração: realizado se jogou nele; sem clube de coração, null. */
  sonho: { clubId: string; realizado: boolean } | null;
  /** A estante: um troféu por competição, com quantas vezes, na ordem em que vieram. */
  tacas: { id: string; n: number }[];
  /** A Seleção numa linha (jogos, gols e Copas do Mundo), só para quem jogou por ela. */
  selecaoLinha: string | null;
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
  const ultimo = clubName(r.spells.at(-1)?.clubId ?? r.peakClubId);
  const tacas: CardModel['tacas'] = [];
  for (const x of r.titles) {
    const g = tacas.find((y) => y.id === x.competition);
    if (g) g.n++; else tacas.push({ id: x.competition, n: 1 });
  }
  const copas = new Set(r.selection.tournaments.filter((x) => x.tournament === 'copaDoMundo').map((x) => x.year)).size;
  const fim = {
    // a idade do auge em anos inteiros (o motor conta em meio ano)
    auge: { overall: r.peakOverall, idade: Math.floor(r.peakAge) },
    metas: { dez: r.selection.ten > 0, faixa: r.selection.captain > 0 },
    arco: t(`ui.fim.arco.${r.player.origin}`, { prep: ultimo.prep, clube: ultimo.nome }),
    sonho: heart ? { clubId: heart, realizado: r.spells.some((s) => s.clubId === heart) } : null,
    tacas,
    selecaoLinha: r.selection.games > 0 ? t('ui.fim.selecaoLinha', { jogos: r.selection.games, gols: r.selection.goals, copas }) : null,
  };
  return { ...base, frases, clubes, numeros, radar, codigo, alt, ...fim };
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
