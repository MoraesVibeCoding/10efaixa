import { useState } from 'react';
import { Career } from './ui/screens/Career';
import { Creation, type CreationResult } from './ui/screens/Creation';
import { Revelacao } from './ui/screens/Revelacao';
import { revealOf } from './ui/screens/revealView';

// T51 (b): criação → revelação (T49i) → carreira jogada → resumo. Substitui a amostra fixa da T49 (aprovada; a tela segue
// coberta em Decision.test). Abertura e ritmo da T48 ainda não têm tela: "sair" e "nova carreira" voltam à criação limpa.
type Created = { round: number; created: CreationResult; seed: number };
type Phase = { kind: 'criacao'; round: number } | ({ kind: 'revelacao' } & Created) | ({ kind: 'carreira' } & Created);

export function App({ seed }: { seed?: number }) {
  const [phase, setPhase] = useState({ kind: 'criacao', round: 0 } as Phase);
  const restart = () => setPhase({ kind: 'criacao', round: phase.round + 1 });
  if (phase.kind === 'revelacao') {
    const { input, visual } = phase.created;
    // mesma semente da carreira: o Over revelado é o do jogador que vai jogar
    return <Revelacao key={phase.round} name={input.name} number={input.shirtNumber} visual={visual} reveal={revealOf(input, phase.seed)} onContinue={() => setPhase({ ...phase, kind: 'carreira' })} />;
  }
  if (phase.kind === 'carreira') {
    return <Career key={phase.round} input={phase.created.input} look={phase.created.look} visual={phase.created.visual} seed={phase.seed} onRestart={restart} />;
  }
  return (
    <Creation
      key={phase.round}
      seed={seed}
      onExit={restart}
      onFinish={(created) => setPhase({ kind: 'revelacao', round: phase.round, created, seed: seed ?? Date.now() })}
    />
  );
}
