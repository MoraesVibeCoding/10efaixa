import { autoDecide, simulateCareer, type Decider, type DecisionView } from '../engine/career';
import { autoChoice } from '../engine/events';
import { PROPOSAL_EVENT } from '../engine/proposals';
import { MEETING_EVENT, parseProposal } from '../engine/meeting';
import type { CreationInput } from '../engine/player';
import { runUntilDecision, type Ritmo } from './careerRun';

// T52 (SPEC 6.5, v2.40): a reunião com a comissão vira uma decisão ("reuniao", escolha "principal|secundário").
// Rápido: sempre automática; Normal: a do 2º semestre; Completo: as 2. Só com clube. A tela abre com a sugestão.
const input = (over: Partial<CreationInput> = {}): CreationInput => ({
  name: 'Jogador Teste', shirtNumber: 11, state: 'BA', position: 'meia', archetypeId: 'classico10',
  biotype: { heightCm: 176, build: 'atletico' }, temperament: 'resenha', celebration: 'aviaozinho',
  origin: 'baseGrande', foot: 'direita', heartClub: 'bahia', ...over,
});

/** Joga a carreira; nas reuniões responde `meeting(view)`, nos eventos a escolha automática. Devolve o que veio à tela. */
function play(ritmo: Ritmo, meeting: (sugestao: string, view: DecisionView) => string = (s) => s, seed = 11) {
  const choices: string[] = [];
  const shown: { eventId: string; year: number; semestre?: number; clubId: string | null; meetings: { year: number; semestre: number; response: string }[] }[] = [];
  for (let g = 0; g < 600; g++) {
    const step = runUntilDecision(input(), seed, choices, ritmo);
    if (step.kind === 'done') return { result: step.result, shown };
    const v = step.view;
    shown.push({ eventId: step.eventId, year: v.year, semestre: v.state.semestre as number | undefined, clubId: v.clubId, meetings: v.meetings });
    choices.push(step.eventId === MEETING_EVENT ? meeting(String(v.state.sugestao), v) : autoDecide(step.eventId, v.temperament, () => v));
  }
  throw new Error('carreira não terminou');
}
const meetingsByYear = (shown: ReturnType<typeof play>['shown']) => {
  const by: Record<number, number[]> = {};
  for (const s of shown) if (s.eventId === MEETING_EVENT) (by[s.year] ??= []).push(s.semestre!);
  return by;
};

describe('reunião com a comissão como decisão (T52)', () => {
  it('a reunião automática segue igual: responder sempre a sugestão dá a mesma carreira de antes', () => {
    const auto: Decider = (e, t, v) => (e === MEETING_EVENT || e === PROPOSAL_EVENT ? String(v().state.sugestao) : autoChoice(e, t));
    expect(simulateCareer(input(), 11, 2026, auto)).toEqual(simulateCareer(input(), 11));
    const played = play('completo');
    expect(played.shown.some((s) => s.eventId === MEETING_EVENT)).toBe(true);
    expect(played.result).toEqual(simulateCareer(input(), 11));
  });

  it('Completo: as 2 reuniões de cada temporada com clube; nunca sem clube (várzea)', () => {
    const { shown } = play('completo');
    const by = meetingsByYear(shown);
    expect(Object.keys(by).length).toBeGreaterThan(5);
    for (const sems of Object.values(by)) expect(sems).toEqual([1, 2]);
    for (const s of shown) if (s.eventId === MEETING_EVENT) expect(s.clubId).not.toBeNull();
  });

  it('Normal: só a do meio do ano (2º semestre); Rápido: nenhuma', () => {
    const normal = meetingsByYear(play('normal').shown);
    expect(Object.keys(normal).length).toBeGreaterThan(5);
    for (const sems of Object.values(normal)) expect(sems).toEqual([2]);
    expect(Object.keys(meetingsByYear(play('rapido').shown))).toEqual([]);
  });

  it('escolher outra proposta que não a sugestão muda a carreira', () => {
    const { shown } = play('normal');
    const sug = shown.find((s) => s.eventId === MEETING_EVENT);
    expect(sug).toBeDefined();
    // T52d: a proposta livre não existe mais; "outra" é a ideia ousada em vez da sugestão (óbvia)
    const other = play('normal', (_s, v) => `${v.reuniao!.ousada.proposal.main}|${v.reuniao!.ousada.proposal.secondary}`);
    expect(other.result).not.toEqual(play('normal').result);
  });

  it('depois de uma reunião, a próxima tela traz a resposta dela no histórico (mesmo com reuniões automáticas no meio)', () => {
    const { shown } = play('normal');
    const k = shown.findIndex((s) => s.eventId === MEETING_EVENT);
    const decided = shown[k]!;
    const found = shown[k + 1]!.meetings.find((m) => m.year === decided.year && m.semestre === decided.semestre);
    expect(found).toBeDefined();
    expect(['aceita', 'contrapropoe', 'recusa']).toContain(found!.response);
    expect(decided.meetings.some((m) => m.year === decided.year && m.semestre === decided.semestre)).toBe(false);
  });

  it('escolha de reunião inválida é recusada (foco desconhecido ou principal igual ao secundário)', () => {
    expect(parseProposal('passe|drible')).toEqual({ main: 'passe', secondary: 'drible' });
    expect(parseProposal('passe|passe')).toBeNull();
    expect(parseProposal('chute|drible')).toBeNull();
    expect(parseProposal('passe')).toBeNull();
    const first = runUntilDecision(input(), 11, [], 'completo');
    const toMeeting: string[] = [];
    let step = first;
    while (step.kind === 'decision' && step.eventId !== MEETING_EVENT) { const v = step.view; toMeeting.push(autoDecide(step.eventId, v.temperament, () => v)); step = runUntilDecision(input(), 11, toMeeting, 'completo'); }
    expect(() => runUntilDecision(input(), 11, [...toMeeting, 'passe|passe'], 'completo')).toThrow(RangeError);
  });
});
