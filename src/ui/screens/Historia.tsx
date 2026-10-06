import type { CareerResult } from '../../engine/career';
import { storyOf } from '../../engine/story';
import { t } from '../../i18n';
import { storyText } from './storyText';
import './Historia.css';

// T55b (SPEC 6.15, v2.31): linha do tempo em frases, antes do cartão final.

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
