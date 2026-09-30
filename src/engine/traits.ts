import type { Focus } from './evolution';
import type { Position } from './overall';
import cfg from '../data/traitProgress.json';

// 6.1/6.2: Bola parada → Cobrador (goleiro) ou Bola parada (linha); Perna ruim → Ambidestro.
export interface TraitState {
  position: Position;
  traits: string[];
  latentTrait?: string;
  progress: Record<string, number>;
}

const traitFor = (focus: Focus | undefined, s: TraitState) =>
  focus === 'pernaRuim' ? 'ambidestro'
    : focus === 'bolaParada' ? (s.position === 'goleiro' ? 'cobrador' : 'bolaParada')
      : undefined;

/** Um semestre de treino de traços. Pura. `unlocked` lista os traços ganhos agora (viram evento narrado). */
export function progressTraits(
  s: TraitState,
  focus: { main?: Focus; secondary?: Focus },
): TraitState & { unlocked: string[] } {
  const progress = { ...s.progress };
  const traits = [...s.traits];
  const unlocked: string[] = [];
  for (const role of ['main', 'secondary'] as const) {
    const trait = traitFor(focus[role], s);
    if (!trait || traits.includes(trait)) continue;
    const slow = trait === 'cobrador' && s.latentTrait !== 'cobrador' ? cfg.goalkeeperWithoutLatentCobrador : 1;
    progress[trait] = (progress[trait] ?? 0) + cfg.perSemester[role] * slow;
    if (progress[trait]! >= 1 - 1e-9) {
      traits.push(trait);
      unlocked.push(trait);
    }
  }
  return { ...s, traits, progress, unlocked };
}
