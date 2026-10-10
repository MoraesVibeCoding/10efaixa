import { autoDecide, simulateCareer, type Decider } from './career';
import { createPrng } from './prng';
import { randomInput } from './simulation';

// Pedido do usuário (2026-10-10): nos eventos da Seleção a tela diz de qual categoria se trata (Sub-17, Sub-20, olímpica);
// na principal, nada. A visão da decisão leva o degrau da Seleção de agora (derivado, sem sorteio novo).
describe('degrau da Seleção na visão da decisão', () => {
  it('a primeira convocação traz o degrau em que o jogador foi chamado; quem não foi chamado está em "nenhum"', () => {
    const vistos: { id: string; degrau: string }[] = [];
    const decide: Decider = (id, t, view) => { const v = view(); vistos.push({ id, degrau: v.selecaoDegrau }); return autoDecide(id, t, () => v); };
    for (let seed = 1; seed <= 40 && !vistos.some((x) => x.id === 'primeira-convocacao'); seed++) simulateCareer(randomInput(createPrng(seed)), seed, 2026, decide);
    const conv = vistos.filter((x) => x.id === 'primeira-convocacao');
    expect(conv.length).toBeGreaterThan(0);
    for (const c of conv) expect(c.degrau).not.toBe('nenhum');
    expect(vistos.some((x) => x.degrau === 'nenhum')).toBe(true);
  });
});
