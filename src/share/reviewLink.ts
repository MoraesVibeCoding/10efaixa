import type { CareerResult } from '../engine/career';
import type { CreationInput } from '../engine/player';
import { runUntilDecision } from '../state/careerRun';
import type { CareerLinkData } from './careerLink';

// T57d (SPEC 6.15, v2.49): rever a carreira de um link. O motor é determinístico, então o link só precisa das escolhas;
// aqui elas são conferidas de verdade: têm de ser aceitas pelo motor e fechar a carreira inteira, sem decisão faltando
// nem escolha sobrando (o link vem de um cartão final). `name` é o nome genérico (texto pt-BR, escolhido por quem chama).
export type ReviewResult = { ok: true; input: CreationInput; result: CareerResult } | { ok: false };

export function reviewLink(data: CareerLinkData, name: string): ReviewResult {
  const input: CreationInput = { ...data.input, name };
  try {
    const step = runUntilDecision(input, data.seed, data.choices, data.ritmo);
    if (step.kind !== 'done') return { ok: false };
    // minimalidade: sem a última escolha a carreira ainda precisa parar numa decisão, senão sobrou escolha
    if (data.choices.length > 0 && runUntilDecision(input, data.seed, data.choices.slice(0, -1), data.ritmo).kind === 'done') return { ok: false };
    return { ok: true, input, result: step.result };
  } catch {
    return { ok: false };
  }
}
