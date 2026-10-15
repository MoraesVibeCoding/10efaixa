import { autoDecide, simulateCareer, type Decider } from '../engine/career';
import type { CreationInput } from '../engine/player';
import { SALE_EVENT } from '../engine/proposals';
import { runUntilDecision, type Ritmo } from './careerRun';

// v3.05 (relato do usuário em 2026-10-15: no ritmo Normal o jogador trocava de clube sozinho): a venda pelo empresário
// é decisão de transferência (v2.64, "sem assinatura, não há transferência") e vai à tela no Normal e no Completo, fora
// da conta de decisões por temporada, como a proposta e o empréstimo. No Rápido o temperamento decide (flow.json).
const input: CreationInput = {
  name: 'Jogador Teste', shirtNumber: 11, state: 'BA', position: 'meia', archetypeId: 'classico10',
  biotype: { heightCm: 176, build: 'atletico' }, temperament: 'frio', celebration: 'aviaozinho',
  origin: 'baseGrande', foot: 'direita', heartClub: null,
};

/** Vendas que o motor resolve com o jogador escolhendo sempre o automático (a carreira é a mesma em qualquer ritmo). */
function salesInEngine(seed: number): string[] {
  const sales: string[] = [];
  const spy: Decider = (e, t, v) => {
    const c = autoDecide(e, t, v);
    if (e === SALE_EVENT) sales.push(`${v().year}:${c}`);
    return c;
  };
  simulateCareer(input, seed, 2026, spy);
  return sales;
}

/** Vendas que chegam à tela jogando pela tela com o automático. */
function salesOnScreen(seed: number, ritmo: Ritmo): string[] {
  const choices: string[] = [];
  const shown: string[] = [];
  for (let guard = 0; guard < 800; guard++) {
    const step = runUntilDecision(input, seed, choices, ritmo);
    if (step.kind === 'done') return shown;
    const c = autoDecide(step.eventId, step.view.temperament, () => step.view);
    if (step.eventId === SALE_EVENT) shown.push(`${step.view.year}:${c}`);
    choices.push(c);
  }
  throw new Error('carreira não terminou');
}

describe('venda pelo empresário como decisão (v3.05)', () => {
  it('no Normal, toda venda que o motor resolve passa pela tela', { timeout: 120_000 }, () => {
    const sales = salesInEngine(6);
    expect(sales.length).toBeGreaterThan(0);
    expect(salesOnScreen(6, 'normal')).toEqual(sales);
  });

  it('no Rápido, a venda segue decidida pelo temperamento (não vai à tela)', { timeout: 120_000 }, () => {
    expect(salesOnScreen(6, 'rapido')).toEqual([]);
  });
});
