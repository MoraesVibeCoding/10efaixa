import { useCallback, useState } from 'react';
import { dailySeed, dayKeyBR } from './engine/daily';
import { clearSave, peekSave, readSave, validateSave, writeSave, type SaveStorage } from './state/save';
import { Abertura } from './ui/screens/Abertura';
import { Career } from './ui/screens/Career';
import { Creation, type CreationResult } from './ui/screens/Creation';
import { Revelacao } from './ui/screens/Revelacao';
import { revealOf } from './ui/screens/revealView';
import { Ritmo, type RitmoId } from './ui/screens/Ritmo';
import { SaveInvalido } from './ui/screens/SaveInvalido';

// T51 (b), T48, T54: abertura → criação → revelação (T49i) → ritmo (T53a) → carreira jogada → resumo. A carreira é salva
// no aparelho ao começar e a cada decisão (v2.39); "Continuar" refaz a carreira até a decisão em que parou.
// `desafio` = dia "AAAA-MM-DD" do desafio (T57c, v2.49); ausente = carreira livre. A semente nasce no toque, não no render.
type Created = { round: number; created: CreationResult; seed: number; desafio?: string };
type Phase =
  | { kind: 'abertura'; round: number }
  | { kind: 'saveInvalido'; round: number; reason: 'danificado' | 'versao' }
  | { kind: 'criacao'; round: number; seed: number; desafio?: string }
  | ({ kind: 'revelacao' } & Created)
  | ({ kind: 'ritmo' } & Created)
  | ({ kind: 'carreira'; ritmo: RitmoId; choices: string[] } & Created);

/** O localStorage do navegador; se o próprio acesso falhar (armazenamento bloqueado), um que não guarda nada. */
function browserStorage(): SaveStorage {
  try {
    return window.localStorage;
  } catch {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  }
}

export function App({ seed, storage = browserStorage(), now = () => new Date() }: { seed?: number; storage?: SaveStorage; now?: () => Date }) {
  const [phase, setPhase] = useState({ kind: 'abertura', round: 0 } as Phase);
  const next = phase.round + 1;
  // salva a cada decisão; carreira terminada não é mais "ativa" (uma por vez), então o save sai.
  // Durante a carreira o objeto da fase não muda (as escolhas vivem no Career), então a função fica estável.
  const onProgress = useCallback((choices: string[], done: boolean) => {
    if (phase.kind !== 'carreira') return;
    if (done) clearSave(storage);
    else writeSave(storage, { created: phase.created, seed: phase.seed, ritmo: phase.ritmo, choices, ...(phase.desafio === undefined ? {} : { desafio: phase.desafio }) });
  }, [phase, storage]);

  /** Nova carreira livre (semente injetada ou do relógio) ou desafio do dia (semente da data de Brasília). */
  function startNew(desafio?: string) {
    clearSave(storage);
    setPhase({ kind: 'criacao', round: next, seed: desafio === undefined ? (seed ?? Date.now()) : dailySeed(desafio), ...(desafio === undefined ? {} : { desafio }) });
  }

  function continueSaved() {
    const read = readSave(storage);
    const checked = read.ok ? validateSave(read.save) : read;
    if (!checked.ok) {
      setPhase({ kind: 'saveInvalido', round: next, reason: checked.reason === 'versao' ? 'versao' : 'danificado' });
      return;
    }
    const { created: c, seed: s, ritmo, choices, desafio } = checked.save;
    setPhase({ kind: 'carreira', round: next, created: c as CreationResult, seed: s, ritmo, choices, ...(desafio === undefined ? {} : { desafio }) });
  }

  if (phase.kind === 'abertura') {
    const dia = dayKeyBR(now());
    return <Abertura saved={peekSave(storage)} dia={dia} onNew={() => { startNew(); }} onDesafio={() => { startNew(dia); }} onContinue={continueSaved} />;
  }
  if (phase.kind === 'saveInvalido') {
    return <SaveInvalido reason={phase.reason} onRestart={() => { startNew(); }} onBack={() => setPhase({ kind: 'abertura', round: next })} />;
  }
  if (phase.kind === 'revelacao') {
    const { input, visual } = phase.created;
    // mesma semente da carreira: o Over revelado é o do jogador que vai jogar
    return <Revelacao key={phase.round} name={input.name} number={input.shirtNumber} visual={visual} reveal={revealOf(input, phase.seed)} onContinue={() => setPhase({ ...phase, kind: 'ritmo' })} />;
  }
  if (phase.kind === 'ritmo') {
    return <Ritmo onChoose={(ritmo) => setPhase({ ...phase, kind: 'carreira', ritmo, choices: [] })} onBack={() => setPhase({ ...phase, kind: 'revelacao' })} />;
  }
  if (phase.kind === 'carreira') {
    return (
      <Career key={phase.round} input={phase.created.input} look={phase.created.look} visual={phase.created.visual} seed={phase.seed}
        ritmo={phase.ritmo} initialChoices={phase.choices} onProgress={onProgress} desafio={phase.desafio} onRestart={() => { startNew(); }} />
    );
  }
  return (
    <Creation
      key={phase.round}
      seed={phase.seed}
      onExit={() => setPhase({ kind: 'abertura', round: next })}
      onFinish={(c) => setPhase({ kind: 'revelacao', round: phase.round, created: c, seed: phase.seed, ...(phase.desafio === undefined ? {} : { desafio: phase.desafio }) })}
    />
  );
}
