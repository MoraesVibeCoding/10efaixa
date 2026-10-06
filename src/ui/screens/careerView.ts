import events from '../../data/events.json';
import { NATIONAL_PREFIX } from '../../art/kits';
import type { DecisionView } from '../../engine/career';
import type { CreationInput } from '../../engine/player';
import type { DecisionProps } from './Decision';
import { previewAvatar, type Look } from './look';

// T51 (b): o que o motor sabe na hora da decisão vira a ficha da tela. A carreira começa aos 16 anos, em 2026.
const START_AGE = 16;
const START_YEAR = 2026;
/** Fim de referência da barra de progresso: a aposentadoria varia, a barra só não pode passar do fim. */
const END_AGE = 40;

export function careerProgress(age: number): number {
  return Math.min(1, Math.max(0, (age - START_AGE) / (END_AGE - START_AGE)));
}

const NATIONAL_EVENTS = new Set(events.eventos.filter((e) => (e as { contexto?: string }).contexto === 'selecao').map((e) => e.id));

/** Camisa da figurinha (v2.37): nos eventos da Seleção, a do país que o jogador defende; nos demais, a do clube. */
export function uniformeFor(eventId: string, view: Pick<DecisionView, 'clubId' | 'nationality'>): string {
  return NATIONAL_EVENTS.has(eventId) ? `${NATIONAL_PREFIX}${view.nationality}` : view.clubId ?? '';
}

export function toDecisionPlayer(view: DecisionView, input: CreationInput, look: Look, visual?: string, eventId = ''): DecisionProps['player'] {
  return {
    visual, uniforme: uniformeFor(eventId, view),
    name: input.name, position: view.position, clubId: view.clubId ?? '', overall: view.overall,
    titles: view.titles.map((x) => x.competition), role: view.role,
    monthlySalary: view.monthlySalary, marketValueEUR: view.marketValueEUR, number: view.number, attributes: view.attributes,
    seasons: view.seasons.map((s) => ({ age: s.year - START_YEAR + START_AGE, clubId: s.clubId, overall: s.overall })),
    // Aparência é só visual; altura e compleição vêm da criação (as únicas que pesam no jogo).
    avatar: { ...previewAvatar(look), heightCm: input.biotype.heightCm, build: input.biotype.build, age: Math.floor(view.age) },
  };
}
