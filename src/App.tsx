import { useState } from 'react';
import { Abertura } from './ui/screens/Abertura';
import { Career } from './ui/screens/Career';
import { Creation, type CreationResult } from './ui/screens/Creation';
import { Revelacao } from './ui/screens/Revelacao';
import { revealOf } from './ui/screens/revealView';
import { Ritmo, type RitmoId } from './ui/screens/Ritmo';

// T51 (b), T48: abertura → criação → revelação (T49i) → ritmo (T53a) → carreira jogada → resumo. A amostra fixa da T49
// segue coberta em Decision.test. "Continuar" na abertura entra com o save (T54).
type Created = { round: number; created: CreationResult; seed: number };
type Phase =
  | { kind: 'abertura'; round: number }
  | { kind: 'criacao'; round: number }
  | ({ kind: 'revelacao' } & Created)
  | ({ kind: 'ritmo' } & Created)
  | ({ kind: 'carreira'; ritmo: RitmoId } & Created);

export function App({ seed }: { seed?: number }) {
  const [phase, setPhase] = useState({ kind: 'abertura', round: 0 } as Phase);
  const next = phase.round + 1;
  if (phase.kind === 'abertura') {
    return <Abertura onNew={() => setPhase({ kind: 'criacao', round: next })} />;
  }
  if (phase.kind === 'revelacao') {
    const { input, visual } = phase.created;
    // mesma semente da carreira: o Over revelado é o do jogador que vai jogar
    return <Revelacao key={phase.round} name={input.name} number={input.shirtNumber} visual={visual} reveal={revealOf(input, phase.seed)} onContinue={() => setPhase({ ...phase, kind: 'ritmo' })} />;
  }
  if (phase.kind === 'ritmo') {
    return <Ritmo onChoose={(ritmo) => setPhase({ ...phase, kind: 'carreira', ritmo })} onBack={() => setPhase({ ...phase, kind: 'revelacao' })} />;
  }
  if (phase.kind === 'carreira') {
    return (
      <Career key={phase.round} input={phase.created.input} look={phase.created.look} visual={phase.created.visual} seed={phase.seed}
        ritmo={phase.ritmo} onRestart={() => setPhase({ kind: 'criacao', round: next })} />
    );
  }
  return (
    <Creation
      key={phase.round}
      seed={seed}
      onExit={() => setPhase({ kind: 'abertura', round: next })}
      onFinish={(created) => setPhase({ kind: 'revelacao', round: phase.round, created, seed: seed ?? Date.now() })}
    />
  );
}
