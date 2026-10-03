import europe from '../../data/europe.json';
import { CLUBS } from '../../engine/clubs';
import { FOREIGN } from '../../engine/cups';
import { EUROPE } from '../../engine/europe';
import { t } from '../../i18n';

// Todo clube em que o jogador pode jogar (mercado: Brasil, sul-americanos, Europa e fora do eixo). Só os brasileiros
// têm artigo em dados; os de fora usam "do" ("do Benfica", "do Boca Juniors").
const SOURCES: { id: string; nome: string; sigla: string; artigo?: string }[][] =
  [FOREIGN, EUROPE, europe.outros.clubs, europe.foraDoEixo.clubs, CLUBS];
const ALL = new Map(SOURCES.flat().map((c) => [c.id, c]));

/** Nome, sigla e a preposição certa ("do Flamengo", "da Portuguesa"), pelo artigo de clubs.json (T49c). */
export function clubName(clubId: string): { nome: string; sigla: string; prep: string } {
  const club = ALL.get(clubId);
  return { nome: club?.nome ?? '', sigla: club?.sigla ?? '', prep: t(`ui.figurinha.prep.${club?.artigo ?? 'o'}`) };
}
