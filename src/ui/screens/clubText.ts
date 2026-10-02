import { CLUBS } from '../../engine/clubs';
import { t } from '../../i18n';

/** Nome, sigla e a preposição certa ("do Flamengo", "da Portuguesa"), pelo artigo de clubs.json (T49c). */
export function clubName(clubId: string): { nome: string; sigla: string; prep: string } {
  const club = CLUBS.find((c) => c.id === clubId);
  return { nome: club?.nome ?? '', sigla: club?.sigla ?? '', prep: t(`ui.figurinha.prep.${club?.artigo ?? 'o'}`) };
}
