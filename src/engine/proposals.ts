import type { Offer } from './market';

// T28b (SPEC 6.12, v2.50): a decisão "proposta-clube", no mesmo molde da reunião (as opções mudam a cada temporada,
// então a escolha é um texto conferido contra as propostas mostradas, e não uma opção fixa de events.json).
export const PROPOSAL_EVENT = 'proposta-clube';
export const STAY = 'ficar';
const ACCEPT = 'aceitar:';

export const acceptChoice = (clubId: string): string => `${ACCEPT}${clubId}`;

/** Uma proposta como a tela a vê: o que ela mostra, sem os marcadores internos (rival, coração). */
export interface ProposalView {
  clubId: string; league: string; currency: Offer['currency']; annualSalary: number; years: number;
  role: Offer['role']; staffQuality: number; offAxis: boolean;
}

export const proposalViewOf = (o: Offer): ProposalView => ({
  clubId: o.clubId, league: o.league, currency: o.currency, annualSalary: o.annualSalary, years: o.years,
  role: o.role, staffQuality: o.staffQuality, offAxis: o.offAxis,
});

export type ProposalChoice<T extends { clubId: string } = Offer> = { kind: 'ficar' } | { kind: 'aceitar'; offer: T };

/** "ficar" (se há clube para ficar) ou "aceitar:<clube>" de uma das propostas mostradas; qualquer outra coisa é null. */
export function parseProposalChoice<T extends { clubId: string }>(choice: string, shown: readonly T[], canStay: boolean): ProposalChoice<T> | null {
  if (choice === STAY) return canStay ? { kind: 'ficar' } : null;
  if (!choice.startsWith(ACCEPT)) return null;
  const offer = shown.find((o) => acceptChoice(o.clubId) === choice);
  return offer ? { kind: 'aceitar', offer } : null;
}
