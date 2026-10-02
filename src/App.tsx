import { t } from './i18n';
import { Decision } from './ui/screens/Decision';
import scene from './assets/amostra/assinatura-contrato.webp';

// T49: tela de amostra para aprovar o visual. Evento, idade, temperamento e cena são fixos aqui; a T51 liga a tela à carreira de verdade.
const SAMPLE = { eventId: 'proposta-coracao', age: 24, careerYears: 20, temperament: 'lider' };

export function App() {
  return (
    <Decision
      eventId={SAMPLE.eventId}
      age={SAMPLE.age}
      temperament={SAMPLE.temperament}
      progress={(SAMPLE.age - 16 + 0.5) / SAMPLE.careerYears}
      scene={{ src: scene, alt: t('scenes.alt.assinatura-contrato', { nome: t('scenes.jogadorPadrao'), clube: t('ui.amostra.clube') }) }}
    />
  );
}
