import { ATTRIBUTES } from './attributes';
import { autoProposal } from './meeting';
import { drawClubNeed, meetingOptions, needProbability } from './meetingOptions';
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
/** A necessidade do clube de cada perfil (determinística): percorre os 10 atributos. */
const needOf = (i: number) => ATTRIBUTES[(i * 3) % ATTRIBUTES.length]!;
const opts = (p: (typeof PROFILES)[number], i: number, score = 0.5) => meetingOptions({ ...p, score, need: needOf(i) });
const sameSet = (a: { main: string; secondary: string }, b: { main: string; secondary: string }) =>
  [a.main, a.secondary].sort().join() === [b.main, b.secondary].sort().join();

describe('três ideias da reunião (T52b)', () => {
  it('as 7 posições aparecem nos perfis de teste', () => {
    expect(new Set(PROFILES.map((p) => p.position))).toEqual(new Set(POSITIONS));
  });

  it('a óbvia é a proposta do técnico (v2.58): o principal é o que o clube quer e o secundário, o melhor complemento do preparador', () => {
    PROFILES.forEach((p, i) => {
      const o = opts(p, i);
      const auto = autoProposal(p.attrs, p.caps, p.position, p.age);
      expect(o.obvia.proposal.main).toBe(needOf(i));
      expect(o.obvia.proposal.secondary).toBe(auto.main !== needOf(i) ? auto.main : auto.secondary);
      expect(o.obvia.proposal.secondary).not.toBe(o.obvia.proposal.main);
    });
  });

  it('cada cartão tem dois atributos válidos e diferentes, e os três cartões são distintos entre si', () => {
    PROFILES.forEach((p, i) => {
      const o = opts(p, i);
      for (const c of [o.obvia, o.mescla, o.ousada]) {
        expect(ATTRIBUTES).toContain(c.proposal.main);
        expect(ATTRIBUTES).toContain(c.proposal.secondary);
        expect(c.proposal.main).not.toBe(c.proposal.secondary);
      }
      expect(sameSet(o.obvia.proposal, o.mescla.proposal)).toBe(false);
      expect(sameSet(o.obvia.proposal, o.ousada.proposal)).toBe(false);
      expect(sameSet(o.mescla.proposal, o.ousada.proposal)).toBe(false);
    });
  });

  it('a mescla mantém o principal óbvio e traz um diferencial: forte no jogador e menos pedido pela posição', () => {
    PROFILES.forEach((p, i) => {
      const o = opts(p, i);
      expect(o.mescla.proposal.main).toBe(o.obvia.proposal.main);
      const diff = o.mescla.proposal.secondary;
      expect([o.obvia.proposal.main, o.obvia.proposal.secondary]).not.toContain(diff);
      const w = weights[p.position] as Record<string, number>;
      const sorted = Object.values(w).sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)]!;
      expect(w[diff]!).toBeLessThanOrEqual(median);
    });
  });

  it('a ousada usa os dois atributos mais fortes; quando eles colidem com outro cartão, troca o segundo pelo seguinte mais forte', () => {
    let pure = 0;
    PROFILES.forEach((p, i) => {
      const o = opts(p, i);
      const strongest = [...ATTRIBUTES].sort((a, b) => p.attrs[b] - p.attrs[a] || p.caps[b] - p.caps[a] || ATTRIBUTES.indexOf(a) - ATTRIBUTES.indexOf(b));
      expect(o.ousada.proposal.main).toBe(strongest[0]);
      if (sameSet(o.ousada.proposal, { main: strongest[0]!, secondary: strongest[1]! })) pure++;
      else expect(strongest.slice(0, 4)).toContain(o.ousada.proposal.secondary);
    });
    expect(pure).toBeGreaterThan(PROFILES.length / 3);
  });

  it('a óbvia e a mescla levam o que o clube quer: sempre "muito provável"; a ousada segue a chance do foco principal (v2.58)', () => {
    PROFILES.forEach((p, i) => {
      for (const score of [0.1, 0.4, 0.9]) {
        const o = opts(p, i, score);
        expect(o.obvia.agrado).toBe('muito');
        expect(o.mescla.agrado).toBe('muito');
        if (o.ousada.proposal.main !== needOf(i)) {
          if (score < 0.35) expect(o.ousada.agrado).toBe('pouco');
          else if (score >= 0.6) expect(o.ousada.agrado).toBe('muito');
        }
      }
    });
    const total = ATTRIBUTES.reduce((s2, a) => s2 + needProbability('meia', a), 0);
    expect(total).toBeCloseTo(1, 6);
  });

  it('dica de agrado em palavras: com moral e relação altos tudo é "muito provável"; com score baixo, a ousada vem da chance do foco principal', () => {
    PROFILES.slice(0, 30).forEach((p, i) => {
      const alto = opts(p, i, 0.9);
      for (const c of [alto.obvia, alto.mescla, alto.ousada]) expect(c.agrado).toBe('muito');
      const baixo = opts(p, i, 0.4);
      for (const c of [baixo.obvia, baixo.mescla, baixo.ousada]) expect(['muito', 'possivel', 'pouco']).toContain(c.agrado);
    });
  });
});

// v2.89 (pedido do usuário em 2026-10-11: "a partir do momento que uma habilidade sua está 100% alcançada, ela não deveria
// aparecer mais entre as propostas"): nenhuma ideia traz um foco que já não cresce (no teto do jogador, o que inclui o 99),
// enquanto houver alternativa; o foco do clube é sorteado só entre os que crescem, com um sorteio só.
describe('ideias sem foco no teto (v2.89)', () => {
  /** o perfil com os `n` atributos mais fortes já no teto */
  const capped = (p: (typeof PROFILES)[number], n: number) => {
    const order = [...ATTRIBUTES].sort((a, b) => p.attrs[b] - p.attrs[a]);
    const attrs = { ...p.attrs };
    for (const a of order.slice(0, n)) attrs[a] = p.caps[a];
    return { ...p, attrs, full: new Set(order.slice(0, n)) };
  };
  const focos = (o: ReturnType<typeof meetingOptions>) => (['obvia', 'mescla', 'ousada'] as const).flatMap((k) => [o[k].proposal.main, o[k].proposal.secondary]);

  it('com os 3 mais fortes no teto, nenhuma das 3 ideias usa um deles (o foco do clube vem de fora do teto)', () => {
    PROFILES.forEach((p, i) => {
      const c = capped(p, 3);
      const need = drawClubNeed(p.position, createPrng(i + 1), c.attrs, c.caps);
      expect(c.full.has(need)).toBe(false);
      const o = meetingOptions({ ...c, score: 0.5, need });
      for (const f of focos(o)) expect(c.full.has(f), `${p.position} ${f}`).toBe(false);
    });
  });

  it('o sorteio do foco do clube gasta um número só, como antes (não muda o resto da carreira)', () => {
    const p = capped(PROFILES[0]!, 3);
    const [a, b] = [createPrng(9), createPrng(9)];
    drawClubNeed(p.position, a, p.attrs, p.caps); b.next();
    expect(a.next()).toBe(b.next());
  });

  it('com quase tudo no teto (auge), a reunião ainda traz 3 ideias diferentes, completando com os que seguram o nível', () => {
    PROFILES.forEach((p, i) => {
      const c = capped(p, 9);
      const need = drawClubNeed(p.position, createPrng(i + 1), c.attrs, c.caps);
      const o = meetingOptions({ ...c, score: 0.5, need });
      const cards = [o.obvia.proposal, o.mescla.proposal, o.ousada.proposal];
      for (const x of cards) expect(x.main).not.toBe(x.secondary);
      expect(sameSet(cards[0]!, cards[1]!) || sameSet(cards[0]!, cards[2]!) || sameSet(cards[1]!, cards[2]!)).toBe(false);
      // o único que ainda cresce está em alguma ideia
      const livre = ATTRIBUTES.find((a) => !c.full.has(a))!;
      expect(focos(o)).toContain(livre);
    });
  });
});
