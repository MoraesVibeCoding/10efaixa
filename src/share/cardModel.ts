import { ATTRIBUTES, type Attribute } from '../engine/attributes';
import type { CareerResult } from '../engine/career';
import { HONORS_ON_CARD } from '../engine/honors';
import { storyHighlights, storyOf } from '../engine/story';
import { t } from '../i18n';
import { storyText } from '../ui/screens/storyText';

// T55c (SPEC 6.15, v2.42): tudo o que as duas versões do cartão desenham, já em texto pt-BR, e o texto alternativo de cada uma.
export interface CardModel {
  nome: string; apelido: string; numero: number; posicao: string; clubeAuge: string; overall: number;
  veredito: string; rotulo: string; manchete: string; comentario: string;
  honrarias: string[]; frases: string[]; clubes: string[];
  numeros: { id: 'jogos' | 'gols' | 'assistencias' | 'titulos' | 'patrimonio'; nome: string; valor: string }[];
  radar: { id: Attribute; nome: string; valor: number }[];
  codigo: string; alt: { narrativa: string; estatistica: string };
}

const brl = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(v);

export function cardModel(r: CareerResult, codigo: string): CardModel {
  const clubes: string[] = [];
  for (const s of r.spells) if (clubes.at(-1) !== s.clubId) clubes.push(s.clubId);
  const numero = r.spells.find((s) => s.clubId === r.peakClubId)?.number ?? r.spells.at(-1)?.number ?? 10;
  const frases = storyHighlights(storyOf({ ...r, origin: r.player.origin })).map(storyText);
  const radar = ATTRIBUTES.map((id) => ({ id, nome: t(`attributes.attribute.${id}`), valor: Math.round(r.peakAttributes[id]) }));
  const n = (id: CardModel['numeros'][number]['id'], valor: string) => ({ id, nome: t(`ui.cartao.numero.${id}`), valor });
  const numeros = [
    n('jogos', r.stats.games.toLocaleString('pt-BR')), n('gols', r.stats.goals.toLocaleString('pt-BR')),
    n('assistencias', r.stats.assists.toLocaleString('pt-BR')), n('titulos', r.titles.length.toLocaleString('pt-BR')),
    n('patrimonio', brl(r.wealthBRL)),
  ];
  const base = {
    nome: r.player.name, apelido: r.nickname, numero, posicao: t(`positions.${r.finalPosition}`), clubeAuge: r.peakClubId,
    overall: r.peakOverall, veredito: t(`legacy.veredito.${r.legacy.verdict}`), rotulo: t(`legacy.rotulo.${r.legacy.labels[0]!.id}`),
    manchete: r.headline, comentario: r.comment,
    honrarias: r.honors.slice(0, HONORS_ON_CARD).map((id) => t(`legacy.honraria.${id}`)),
  };
  const alt = {
    narrativa: t('ui.cartao.altNarrativa', { nome: base.nome, apelido: base.apelido, veredito: base.veredito, rotulo: base.rotulo, manchete: base.manchete, frases: frases.join('. ') }),
    estatistica: t('ui.cartao.altEstatistica', {
      nome: base.nome, over: base.overall, numeros: numeros.map((x) => `${x.nome} ${x.valor}`).join(', '),
      atributos: radar.map((a) => `${a.nome} ${a.valor}`).join(', '),
    }),
  };
  return { ...base, frases, clubes, numeros, radar, codigo, alt };
}
