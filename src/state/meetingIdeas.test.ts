import { autoDecide, simulateCareer } from '../engine/career';
import { MEETING_EVENT, encodeProposal } from '../engine/meeting';
import { drawClubNeed } from '../engine/meetingOptions';
import { createPrng } from '../engine/prng';
import { randomInput } from '../engine/simulation';
import { ATTRIBUTES } from '../engine/attributes';
import weights from '../data/positionWeights.json';
import { runUntilDecision, type Ritmo } from './careerRun';

// T52c/T52d (SPEC 6.5, v2.53): reunião em 3 ideias no motor, com a chave `tresIdeias` ligada em meeting.json.

const inputOf = (seed: number) => randomInput(createPrng(seed));

/** Joga com o automático até a primeira reunião que chega à tela (Completo); devolve as escolhas até ali e a tela. */
function toFirstMeeting(seed: number, ritmo: Ritmo = 'completo') {
  const input = inputOf(seed);
  const choices: string[] = [];
  for (let guard = 0; guard < 800; guard++) {
    const step = runUntilDecision(input, seed, choices, ritmo);
    if (step.kind === 'done') return null;
    if (step.eventId === MEETING_EVENT) return { input, seed, choices: [...choices], view: step.view };
    choices.push(autoDecide(step.eventId, step.view.temperament, () => step.view));
  }
  return null;
}

describe('sorteio da necessidade do clube pela posição (T52c)', () => {
  it('uma só chamada ao sorteio (a sequência da semente não desloca) e sempre um atributo', () => {
    const a = createPrng(5); const b = createPrng(5);
    drawClubNeed('meia', a);
    b.next();
    expect(a.state()).toBe(b.state());
    expect(ATTRIBUTES).toContain(drawClubNeed('goleiro', createPrng(9)));
  });

  it('a frequência segue os pesos da posição', () => {
    const n = 20000; const rng = createPrng(1); const count: Record<string, number> = {};
    for (let i = 0; i < n; i++) { const f = drawClubNeed('volante', rng); count[f] = (count[f] ?? 0) + 1; }
    const w = weights.volante as Record<string, number>; const total = ATTRIBUTES.reduce((s, a) => s + w[a]!, 0);
    for (const a of ATTRIBUTES) expect(Math.abs((count[a] ?? 0) / n - w[a]! / total), a).toBeLessThan(0.012);
  });
});

describe('reunião em 3 ideias no motor (T52c)', () => {
  it('a tela da reunião traz as 3 ideias e a sugestão é a óbvia', { timeout: 120_000 }, () => {
    const f = toFirstMeeting(1)!;
    const o = f.view.reuniao!;
    expect([o.obvia, o.mescla, o.ousada]).toHaveLength(3);
    expect(f.view.state.sugestao).toBe(encodeProposal(o.obvia.proposal));
  });

  it('cada uma das 3 ideias é aceita; qualquer outra proposta é recusada pelo motor', { timeout: 120_000 }, () => {
    const f = toFirstMeeting(1)!;
    const o = f.view.reuniao!;
    for (const c of [o.obvia, o.mescla, o.ousada]) {
      expect(runUntilDecision(f.input, f.seed, [...f.choices, encodeProposal(c.proposal)], 'completo').kind).toBeDefined();
    }
    const livre = ATTRIBUTES.map((a) => `${a}|${ATTRIBUTES.find((b) => b !== a)}`).find((p) => ![o.obvia, o.mescla, o.ousada].some((c) => encodeProposal(c.proposal) === p))!;
    expect(() => runUntilDecision(f.input, f.seed, [...f.choices, livre], 'completo')).toThrow(/escolha inválida/);
  });

  it('a confiança do técnico muda com a ideia: óbvia sobe mais que a mescla, e a ousada fica abaixo das duas', { timeout: 120_000 }, () => {
    for (let seed = 1; seed <= 8; seed++) {
      const f = toFirstMeeting(seed);
      if (!f) continue;
      const o = f.view.reuniao!;
      const rel = (c: typeof o.obvia) => {
        const s = runUntilDecision(f.input, f.seed, [...f.choices, encodeProposal(c.proposal)], 'completo');
        return s.kind === 'decision' ? Number(s.view.state.relacaoTecnico) : NaN;
      };
      const [a, b, c] = [rel(o.obvia), rel(o.mescla), rel(o.ousada)];
      if ([a, b, c].some(Number.isNaN)) continue;
      expect(a).toBeGreaterThanOrEqual(b);
      expect(b).toBeGreaterThanOrEqual(c);
      expect(a).toBeGreaterThan(c);
      return;
    }
    throw new Error('nenhuma carreira de teste chegou a uma decisão depois da reunião');
  });

  it('escolher sempre a óbvia é exatamente a carreira automática (todos os ritmos)', { timeout: 300_000 }, () => {
    for (const [seed, ritmo] of [[1, 'completo'], [2, 'normal'], [3, 'rapido']] as [number, Ritmo][]) {
      const input = inputOf(seed);
      const choices: string[] = [];
      let result;
      for (let guard = 0; guard < 800; guard++) {
        const step = runUntilDecision(input, seed, choices, ritmo);
        if (step.kind === 'done') { result = step.result; break; }
        choices.push(autoDecide(step.eventId, step.view.temperament, () => step.view));
      }
      expect(JSON.stringify(result)).toBe(JSON.stringify(simulateCareer(input, seed)));
    }
  });

  it('a reunião registra qual ideia o jogador escolheu', { timeout: 120_000 }, () => {
    const f = toFirstMeeting(1)!;
    const o = f.view.reuniao!;
    const s = runUntilDecision(f.input, f.seed, [...f.choices, encodeProposal(o.mescla.proposal)], 'completo');
    if (s.kind !== 'decision') throw new Error('esperava decisão');
    expect(s.view.meetings.at(-1)!.ideia).toBe('mescla');
  });
});
