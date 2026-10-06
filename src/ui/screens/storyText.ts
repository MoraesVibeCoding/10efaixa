import type { StoryBeat } from '../../engine/story';
import { t } from '../../i18n';
import { clubName } from './clubText';

// T55b: texto de uma frase de "Sua história" (tela e cartão narrativo).
const SINGULAR = new Set(['selecao', 'idolo', 'lesoes']);

/** Texto de uma frase da história; com n = 1 usa a forma no singular ("uma lesão grave"). */
export function storyText(b: StoryBeat): string {
  const id = b.n === 1 && SINGULAR.has(b.id) ? `${b.id}_um` : b.id;
  const club = b.clubId ? clubName(b.clubId) : { nome: '', prep: '' };
  return t(`legacy.historia.${id}`, {
    idade: b.age, n: b.n ?? 0, clube: club.nome, prep: club.prep,
    competicao: b.competition ? t(`ui.titulo.${b.competition}`) : '',
  });
}
