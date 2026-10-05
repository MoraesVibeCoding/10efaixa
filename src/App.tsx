import { useState } from 'react';
import { Career } from './ui/screens/Career';
import { Creation, type CreationResult } from './ui/screens/Creation';

// T51 (b): criação → carreira jogada → resumo. Substitui a amostra fixa da T49 (aprovada; a tela segue coberta em
// Decision.test). Abertura, sorteio e ritmo da T48 ainda não têm tela: "sair" e "nova carreira" voltam à criação limpa.
type Phase = { kind: 'criacao'; round: number } | { kind: 'carreira'; round: number; created: CreationResult; seed: number };

export function App({ seed }: { seed?: number }) {
  const [phase, setPhase] = useState({ kind: 'criacao', round: 0 } as Phase);
  const restart = () => setPhase({ kind: 'criacao', round: phase.round + 1 });
  if (phase.kind === 'carreira') {
    return <Career key={phase.round} input={phase.created.input} look={phase.created.look} visual={phase.created.visual} seed={phase.seed} onRestart={restart} />;
  }
  return (
    <Creation
      key={phase.round}
      seed={seed}
      onExit={restart}
      onFinish={(created) => setPhase({ kind: 'carreira', round: phase.round, created, seed: seed ?? Date.now() })}
    />
  );
}
