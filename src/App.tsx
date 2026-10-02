import { useState } from 'react';
import type { Ctx } from './engine/events';
import { t } from './i18n';
import { Decision } from './ui/screens/Decision';
import scene from './assets/amostra/assinatura-contrato.webp';

// T49: amostra para aprovar o visual. Eventos, jogador e cena são fixos aqui; a T51 liga a tela à carreira de verdade.
const SAMPLE = {
  events: ['proposta-coracao', 'salario-atrasado', 'casa-da-familia', 'festa', 'polemica-redes'],
  age: 24, careerYears: 20,
  player: {
    name: 'Dudu Maestro', position: 'meia', clubId: 'flamengo', overall: 78, titles: ['estadual', 'estadual', 'copaDoBrasil'],
    role: 'titular', monthlySalary: { amount: 180_000, currency: 'BRL' as const },
  },
  state: { moral: 0.6, relacaoTecnico: 0.6, idolatria: 40, idolatriaCoracao: 55, disciplina: 0.7, patrimonio: 2_000_000, salarioFator: 1 } as Ctx,
};

export function App() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState(SAMPLE.state);
  const age = SAMPLE.age + Math.floor(step / 2);
  return (
    <Decision
      key={step}
      eventId={SAMPLE.events[step % SAMPLE.events.length]!}
      age={age}
      player={SAMPLE.player}
      state={state}
      progress={(age - 16 + 0.5) / SAMPLE.careerYears}
      scene={{ src: scene, alt: t('scenes.alt.assinatura-contrato', { nome: t('scenes.jogadorPadrao'), clube: t('ui.amostra.clube') }) }}
      onContinue={(_, next) => { setState(next); setStep(step + 1); }}
    />
  );
}
