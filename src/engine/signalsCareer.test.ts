import { autoDecide, simulateCareer, type CareerResult, type Decider } from './career';
import { createPrng } from './prng';
import { STAY, RENEW, PROPOSAL_EVENT } from './proposals';
import { randomInput } from './simulation';
import type { SeasonSummary } from './seasonSummary';

// v2.85: os sinais chegam ao resumo da temporada pela visão da decisão; quem vai parar aos 40 é avisado na temporada anterior.
function play(seed: number) {
  const resumos = new Map<number, SeasonSummary>();
  const decide: Decider = (id, t, view) => {
    const v = view();
    if (v.ultimaTemporada) resumos.set(v.ultimaTemporada.year, v.ultimaTemporada);
    // nunca para por escolha: assim as carreiras chegam aos gatilhos forçados
    if (id === PROPOSAL_EVENT && v.state.podeParar) return v.state.podeRenovar ? RENEW : STAY;
    return autoDecide(id, t, () => v);
  };
  const r: CareerResult = simulateCareer(randomInput(createPrng(seed)), seed, 2026, decide);
  return { r, resumos };
}

describe('sinais na carreira (v2.85)', () => {
  it('todo resumo traz a lista de sinais; quem chega aos 40 foi avisado do último ano', { timeout: 120_000 }, () => {
    let aos40 = 0;
    let comSinal = 0;
    for (let seed = 1; seed <= 30; seed++) {
      const { r, resumos } = play(seed);
      for (const s of resumos.values()) {
        expect(Array.isArray(s.sinais)).toBe(true);
        if (s.sinais.length) comSinal++;
      }
      if (r.retirement === 'idadeLimite') {
        aos40++;
        const penultimo = r.seasons.at(-2)!;
        expect(resumos.get(penultimo.year)?.sinais).toContain('ultimoAno');
      }
    }
    expect(aos40).toBeGreaterThan(0);
    expect(comSinal).toBeGreaterThan(0);
  });
});
