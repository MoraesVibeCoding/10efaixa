import { autoDecide, simulateCareer, type Decider } from './career';
import { createPrng } from './prng';
import { randomInput } from './simulation';
import raw from '../data/events.json';

// v2.67 (docs/proposta-inicio-de-carreira.md, aprovado em 2026-10-09): o primeiro ano deixa de passar sozinho. A primeira decisão
// é o "Primeiro passo" da origem escolhida, aos 16, e o primeiro ano tem ao menos duas decisões.
const FIRST: Record<string, string> = { varzea: 'primeiro-passo-varzea', peneira: 'primeiro-passo-peneira', baseGrande: 'primeiro-passo-base' };
const careers = Array.from({ length: 60 }, (_, i) => {
  const seen: { eventId: string; year: number; age: number; overall: number }[] = [];
  const decide: Decider = (eventId, temperament, view) => { const v = view(); seen.push({ eventId, year: v.year, age: v.age, overall: v.overall }); return autoDecide(eventId, temperament, () => v); };
  const input = randomInput(createPrng(i + 1));
  const result = simulateCareer(input, i + 1, 2026, decide);
  return { input, result, seen };
});

describe('início de carreira (v2.67)', () => {
  it('a primeira decisão é o "Primeiro passo" da origem, aos 16, com o Over da revelação', () => {
    const origins = new Set<string>();
    for (const { input, result, seen } of careers) {
      expect(seen[0]!.eventId, input.origin).toBe(FIRST[input.origin]);
      expect(Math.floor(seen[0]!.age)).toBe(16);
      expect(seen[0]!.year).toBe(2026);
      expect(seen[0]!.overall).toBe(result.player.startingOverall);
      origins.add(input.origin);
    }
    expect(origins.size).toBe(3);
  });

  it('o primeiro ano tem ao menos duas decisões, em toda origem', () => {
    for (const { input, seen } of careers) {
      expect(seen.filter((s) => s.year === 2026).length, input.origin).toBeGreaterThanOrEqual(2);
    }
  });

  it('os eventos de início têm 3 opções com jeitos diferentes e nunca entram no sorteio comum', () => {
    const ids = [...Object.values(FIRST)];
    for (const id of ids) {
      const e = (raw.eventos as { id: string; opcoes: { jeito?: string }[]; sorteio?: boolean }[]).find((x) => x.id === id);
      expect(e, id).toBeDefined();
      expect(new Set(e!.opcoes.map((o) => o.jeito)).size).toBe(3);
      expect(e!.sorteio).toBeFalsy();
    }
  });
});
