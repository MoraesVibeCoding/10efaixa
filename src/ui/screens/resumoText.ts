import type { SeasonSummary } from '../../engine/seasonSummary';
import { t } from '../../i18n';

// v2.61: textos do card do resumo da temporada (em .ts: as comparações ficam fora do JSX).
export function direction(pct: number): 'sobe' | 'desce' | 'igual' {
  const sign = Math.sign(pct);
  return sign === 1 ? 'sobe' : sign === -1 ? 'desce' : 'igual';
}

/** A variação do Over no ano, com sinal e em palavras. */
export function variation(pct: number): string {
  const d = direction(pct);
  if (d === 'sobe') return t('ui.resumoTemporada.variacaoSobe', { pct });
  if (d === 'desce') return t('ui.resumoTemporada.variacaoDesce', { pct: -pct });
  return t('ui.resumoTemporada.variacaoEstavel');
}

/** O comentário do técnico: evolução, minutos e, se houver, o título (senão o destaque). Até 3 frases. */
export function coachComment(c: SeasonSummary['comentario']): string[] {
  const out = [t(`ui.resumoTemporada.comentario.evolucao.${c.evolucao}`), t(`ui.resumoTemporada.comentario.minutos.${c.minutos}`)];
  if (c.titulo) out.push(t('ui.resumoTemporada.comentario.titulo'));
  else if (c.destaque) out.push(t('ui.resumoTemporada.comentario.destaque', { atributo: t(`ui.evolucao.atributo.${c.destaque}`) }));
  return out;
}
