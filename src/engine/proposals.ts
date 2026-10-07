import { salaryChange, valueChange, type Change } from './contractCard';
import { effectiveRep } from './europe';
import { toBRL, type Offer } from './market';
import { clubLevelBand, minutesBand, type ClubLevelBand, type MinutesBand } from './minutes';

// T28b (SPEC 6.12, v2.50): a decisão "proposta-clube", no mesmo molde da reunião (as opções mudam a cada temporada,
// então a escolha é um texto conferido contra as propostas mostradas, e não uma opção fixa de events.json).
export const PROPOSAL_EVENT = 'proposta-clube';
export const STAY = 'ficar';
const ACCEPT = 'aceitar:';
const LOVE = 'amor:';
const NEGOTIATE = 'negociar:';
const FORCE = 'forcar:';

export const acceptChoice = (clubId: string): string => `${ACCEPT}${clubId}`;
/** Forçar a saída para a proposta daquele clube antes do fim do contrato (custa multa, idolatria, moral e relação). */
export const forceChoice = (clubId: string): string => `${FORCE}${clubId}`;
/** Mandar o empresário negociar a proposta daquele clube (pode melhorar, ficar igual ou sumir). */
export const negotiateChoice = (clubId: string): string => `${NEGOTIATE}${clubId}`;
/** Só na proposta do clube de coração: aceitar por amor (salário menor, mais idolatria). */
export const loveChoice = (clubId: string): string => `${LOVE}${clubId}`;

/** Uma proposta como a tela a vê: o que ela mostra, sem os marcadores internos (rival, coração). */
export interface ProposalView {
  clubId: string; league: string; currency: Offer['currency']; annualSalary: number; years: number;
  role: Offer['role']; staffQuality: number; offAxis: boolean;
  /** v2.28: minutos previstos e nível do clube, só em faixa (os dois pesam na evolução). */
  minutosFaixa: MinutesBand; nivelClube: ClubLevelBand;
  /** T28e: a proposta é do clube de coração, de um rival (do clube atual ou do coração) ou comum. O coração vence o rival. */
  marca: 'coracao' | 'rival' | 'rivalCoracao' | null;
  /** T28i (v2.54): salário por mês na moeda da proposta e a variação contra o atual; valor projetado (estimativa) e a variação contra o de hoje. */
  salarioMensal: number; salarioPct: Change | null; valorProjetadoEUR: number | null; valorPct: Change | null;
}

/** O que só o motor da carreira sabe: contrato atual, valor de hoje e valor projetado naquele clube. */
export interface CardContext { currentAnnualSalaryBRL: number | null; todayValueEUR: number; projectedValueEUR: number }

/** `overall`: o do jogador agora; com o nível do elenco do clube dá os minutos previstos. */
export const proposalViewOf = (o: Offer, overall: number, card?: CardContext): ProposalView => ({
  clubId: o.clubId, league: o.league, currency: o.currency, annualSalary: o.annualSalary, years: o.years,
  role: o.role, staffQuality: o.staffQuality, offAxis: o.offAxis,
  minutosFaixa: minutesBand({ overall, clubRep: effectiveRep(o.clubId), role: o.role }), nivelClube: clubLevelBand(effectiveRep(o.clubId)),
  marca: o.heartClub ? 'coracao' : o.rivalOfHeart ? 'rivalCoracao' : o.rivalOfCurrent ? 'rival' : null,
  salarioMensal: Math.round(o.annualSalary / 12),
  salarioPct: card ? salaryChange(toBRL(o), card.currentAnnualSalaryBRL) : null,
  valorProjetadoEUR: card ? card.projectedValueEUR : null,
  valorPct: card ? valueChange(card.projectedValueEUR, card.todayValueEUR) : null,
});

export type ProposalChoice<T extends { clubId: string } = Offer> =
  { kind: 'ficar' } | { kind: 'aceitar'; offer: T } | { kind: 'amor'; offer: T } | { kind: 'negociar'; offer: T } | { kind: 'forcar'; offer: T };

/**
 * "ficar" (se há clube para ficar), "aceitar:<clube>", "negociar:<clube>", "forcar:<clube>" (só com `canForce`, contrato longo) ou "amor:<clube>" (só quando `isHeart` diz que a proposta é a do clube de
 * coração) de uma das propostas mostradas; qualquer outra coisa é null.
 */
export function parseProposalChoice<T extends { clubId: string }>(
  choice: string, shown: readonly T[], canStay: boolean, isHeart: (o: T) => boolean = () => false, canForce = false,
): ProposalChoice<T> | null {
  if (choice === STAY) return canStay ? { kind: 'ficar' } : null;
  if (choice.startsWith(ACCEPT)) {
    const offer = shown.find((o) => acceptChoice(o.clubId) === choice);
    return offer ? { kind: 'aceitar', offer } : null;
  }
  if (choice.startsWith(FORCE)) {
    const offer = shown.find((o) => forceChoice(o.clubId) === choice);
    return offer && canForce ? { kind: 'forcar', offer } : null;
  }
  if (choice.startsWith(NEGOTIATE)) {
    const offer = shown.find((o) => negotiateChoice(o.clubId) === choice);
    return offer ? { kind: 'negociar', offer } : null;
  }
  if (choice.startsWith(LOVE)) {
    const offer = shown.find((o) => loveChoice(o.clubId) === choice);
    return offer && isHeart(offer) ? { kind: 'amor', offer } : null;
  }
  return null;
}
