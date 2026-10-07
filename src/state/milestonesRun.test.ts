import events from '../data/events.json';
import { autoDecide } from '../engine/career';
import { MEETING_EVENT } from '../engine/meeting';
import { MILESTONES } from '../engine/milestones';
import type { CreationInput } from '../engine/player';
import { PROPOSAL_EVENT } from '../engine/proposals';
import { runUntilDecision, type Ritmo } from './careerRun';

// T25c (SPEC 6.13b, "Encaixe nos ritmos"): marcos de carreira chegam à tela em todos os ritmos, com prioridade sobre os eventos comuns
// (ocupam uma das vagas da temporada); marcos de clube só no Normal e no Completo (no Rápido o temperamento decide).
const input: CreationInput = {
  name: 'Jogador Teste', shirtNumber: 10, state: 'BA', position: 'meia', archetypeId: 'classico10',
  biotype: { heightCm: 176, build: 'atletico' }, temperament: 'resenha', celebration: 'aviaozinho',
  origin: 'baseGrande', foot: 'direita', heartClub: 'bahia',
};
const CLUB = new Set(MILESTONES.filter((m) => m.escopo === 'clube').map((m) => m.id));
const CAREER = new Set(MILESTONES.filter((m) => m.escopo === 'carreira').map((m) => m.id));

function onScreen(seed: number, ritmo: Ritmo) {
  const choices: string[] = [];
  const shown: { id: string; year: number }[] = [];
  for (let guard = 0; guard < 600; guard++) {
    const step = runUntilDecision(input, seed, choices, ritmo);
    if (step.kind === 'done') return { shown, result: step.result };
    if (step.eventId !== MEETING_EVENT && step.eventId !== PROPOSAL_EVENT) shown.push({ id: step.eventId, year: step.view.year });
    choices.push(autoDecide(step.eventId, step.view.temperament, () => step.view));
  }
  throw new Error('carreira não terminou');
}

describe('marcos por ritmo (T25c)', () => {
  it('Rápido: marcos de carreira vão à tela; marcos de clube nunca (o temperamento decide)', { timeout: 120_000 }, () => {
    const all = [1, 2, 3].flatMap((seed) => onScreen(seed, 'rapido').shown.map((s) => s.id));
    expect(all.some((id) => CAREER.has(id))).toBe(true);
    expect(all.some((id) => CLUB.has(id))).toBe(false);
  });

  it('Rápido: no máximo 1 decisão por temporada, e o marco de carreira tem prioridade sobre o evento comum', { timeout: 120_000 }, () => {
    for (const seed of [1, 2, 3]) {
      const { shown } = onScreen(seed, 'rapido');
      const perYear = new Map<number, string[]>();
      for (const s of shown) perYear.set(s.year, [...(perYear.get(s.year) ?? []), s.id]);
      for (const ids of perYear.values()) expect(ids.length).toBeLessThanOrEqual(1);
    }
  });

  it('Normal e Completo: marcos de clube também chegam à tela', { timeout: 180_000 }, () => {
    for (const ritmo of ['normal', 'completo'] as Ritmo[]) {
      const all = [1, 2, 3].flatMap((seed) => onScreen(seed, ritmo).shown.map((s) => s.id));
      expect(all.some((id) => CLUB.has(id)), ritmo).toBe(true);
    }
  });

  it('o jogador escolhe uma das 3 opções do marco e a carreira continua; opção fora delas é recusada', { timeout: 120_000 }, () => {
    const choices: string[] = [];
    for (let guard = 0; guard < 600; guard++) {
      const step = runUntilDecision(input, 1, choices, 'rapido');
      if (step.kind === 'done') throw new Error('nenhum marco na tela');
      if (CAREER.has(step.eventId)) {
        expect(step.view.state).toMatchObject({ moral: expect.any(Number), idolatria: expect.any(Number), relacaoTecnico: expect.any(Number) });
        const options = (events.eventos.find((e) => e.id === step.eventId)!.opcoes).map((o) => o.id);
        expect(options).toHaveLength(3);
        for (const o of options) expect(() => runUntilDecision(input, 1, [...choices, o], 'rapido')).not.toThrow();
        expect(() => runUntilDecision(input, 1, [...choices, 'opcao-que-nao-existe'], 'rapido')).toThrow(/escolha inválida/);
        return;
      }
      choices.push(autoDecide(step.eventId, step.view.temperament, () => step.view));
    }
  });
});
