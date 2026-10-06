import type { CareerResult } from '../../engine/career';
import { storyOf, type StoryBeat } from '../../engine/story';
import { t } from '../../i18n';
import { clubName } from './clubText';
import './Historia.css';

// T55b (SPEC 6.15, v2.31): linha do tempo em frases, antes do cartão final.
const KEYS = new Set(['selecao', 'idolo', 'lesoes']);

/** Texto de uma frase da história; com n = 1 usa a forma no singular ("uma lesão grave"). */
export function storyText(b: StoryBeat): string {
  const id = b.n === 1 && KEYS.has(b.id) ? `${b.id}_um` : b.id;
  const club = b.clubId ? clubName(b.clubId) : { nome: '', prep: '' };
  return t(`legacy.historia.${id}`, {
    idade: b.age, n: b.n ?? 0, clube: club.nome, prep: club.prep,
    competicao: b.competition ? t(`ui.titulo.${b.competition}`) : '',
  });
}

export function Historia({ result, onContinue }: { result: CareerResult; onContinue: () => void }) {
  const story = storyOf({ ...result, origin: result.player.origin });
  return (
    <main className="historia" data-tema="claro">
      <h1 className="historia__titulo">{t('ui.historia.titulo')}</h1>
      <p className="historia__nome">{result.player.name}</p>
      <ol className="historia__linha">
        {story.map((b, i) => <li key={`${b.id}-${i}`}>{storyText(b)}</li>)}
      </ol>
      <button type="button" className="historia__cartao" onClick={onContinue}>{t('ui.historia.verCartao')}</button>
    </main>
  );
}
