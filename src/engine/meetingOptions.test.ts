import { ATTRIBUTES } from './attributes';
import { autoProposal } from './meeting';
import { meetingOptions, needProbability } from './meetingOptions';
import { createPlayer } from './player';
import { POSITIONS } from './overall';
import { createPrng } from './prng';
import { randomInput } from './simulation';
import weights from '../data/positionWeights.json';

// T52b (SPEC 6.5, v2.53): os 3 cartões da reunião: óbvia, mescla (posição + diferencial seu) e ousada (os mais fortes).
function profiles(n = 120) {
  const out = [];
  for (let seed = 1; seed <= n; seed++) {
    const input = randomInput(createPrng(seed));
    const r = createPlayer(input, createPrng(seed));
    if (r.ok) out.push({ position: input.position, attrs: r.player.attributes, caps: r.player.caps, age: 16 + (seed % 20) });
  }
  return out;
}
const PROFILES = profiles();
const sameSet = (a: { main: string; secondary: string }, b: { main: string; secondary: string }) =>
  [a.main, a.secondary].sort().join() === [b.main, b.secondary].sort().join();

describe('três ideias da reunião (T52b)', () => {
  it('as 7 posições aparecem nos perfis de teste', () => {
    expect(new Set(PROFILES.map((p) => p.position))).toEqual(new Set(POSITIONS));
  });

  it('a óbvia é a proposta automática do preparador', () => {
    for (const p of PROFILES) {
      const o = meetingOptions({ ...p, score: 0.5 });
      expect(o.obvia.proposal).toEqual(autoProposal(p.attrs, p.caps, p.position, p.age));
    }
  });

  it('cada cartão tem dois atributos válidos e diferentes, e os três cartões são distintos entre si', () => {
    for (const p of PROFILES) {
      const o = meetingOptions({ ...p, score: 0.5 });
      for (const c of [o.obvia, o.mescla, o.ousada]) {
        expect(ATTRIBUTES).toContain(c.proposal.main);
        expect(ATTRIBUTES).toContain(c.proposal.secondary);
        expect(c.proposal.main).not.toBe(c.proposal.secondary);
      }
      expect(sameSet(o.obvia.proposal, o.mescla.proposal)).toBe(false);
      expect(sameSet(o.obvia.proposal, o.ousada.proposal)).toBe(false);
      expect(sameSet(o.mescla.proposal, o.ousada.proposal)).toBe(false);
    }
  });

  it('a mescla mantém o principal óbvio e traz um diferencial: forte no jogador e menos pedido pela posição', () => {
    for (const p of PROFILES) {
      const o = meetingOptions({ ...p, score: 0.5 });
      expect(o.mescla.proposal.main).toBe(o.obvia.proposal.main);
      const diff = o.mescla.proposal.secondary;
      expect([o.obvia.proposal.main, o.obvia.proposal.secondary]).not.toContain(diff);
      const w = weights[p.position] as Record<string, number>;
      const sorted = Object.values(w).sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)]!;
      expect(w[diff]!).toBeLessThanOrEqual(median);
    }
  });

  it('a ousada usa os dois atributos mais fortes; quando eles colidem com outro cartão, troca o segundo pelo seguinte mais forte', () => {
    let pure = 0;
    for (const p of PROFILES) {
      const o = meetingOptions({ ...p, score: 0.5 });
      const strongest = [...ATTRIBUTES].sort((a, b) => p.attrs[b] - p.attrs[a] || p.caps[b] - p.caps[a] || ATTRIBUTES.indexOf(a) - ATTRIBUTES.indexOf(b));
      expect(o.ousada.proposal.main).toBe(strongest[0]);
      if (sameSet(o.ousada.proposal, { main: strongest[0]!, secondary: strongest[1]! })) pure++;
      else expect(strongest.slice(0, 4)).toContain(o.ousada.proposal.secondary);
    }
    expect(pure).toBeGreaterThan(PROFILES.length / 3);
  });

  it('a chance de agradar segue os pesos da posição e é maior para a óbvia que para a ousada, em média', () => {
    let obvia = 0; let ousada = 0;
    for (const p of PROFILES) {
      const o = meetingOptions({ ...p, score: 0.5 });
      obvia += needProbability(p.position, o.obvia.proposal.main);
      ousada += needProbability(p.position, o.ousada.proposal.main);
    }
    expect(obvia).toBeGreaterThan(ousada);
    const total = ATTRIBUTES.reduce((s, a) => s + needProbability('meia', a), 0);
    expect(total).toBeCloseTo(1, 6);
  });

  it('dica de agrado em palavras: com moral e relação altos tudo é "muito provável"; com score baixo vem da chance do foco principal', () => {
    for (const p of PROFILES.slice(0, 30)) {
      const alto = meetingOptions({ ...p, score: 0.9 });
      for (const c of [alto.obvia, alto.mescla, alto.ousada]) expect(c.agrado).toBe('muito');
      const baixo = meetingOptions({ ...p, score: 0.4 });
      for (const c of [baixo.obvia, baixo.mescla, baixo.ousada]) expect(['muito', 'possivel', 'pouco']).toContain(c.agrado);
    }
  });
});
