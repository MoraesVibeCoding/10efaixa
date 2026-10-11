import { autoDecide, simulateCareer, type Decider } from './career';
import { createPrng } from './prng';
import { randomInput } from './simulation';

// v2.84 (pedido do usuário em 2026-10-11, carimbo de rebaixamento fora de hora): a visão da decisão leva a divisão do
// clube de agora (derivada, sem sorteio novo). A temporada fechada seguinte, do mesmo clube e do mesmo ano, confirma.
describe('divisão do clube na visão da decisão', () => {
  it('é a divisão em que a temporada daquele ano é jogada', () => {
    const vistos: { year: number; clubId: string | null; divisao: string | null }[] = [];
    const decide: Decider = (id, t, view) => { const v = view(); vistos.push({ year: v.year, clubId: v.clubId, divisao: v.divisao }); return autoDecide(id, t, () => v); };
    let conferidos = 0;
    for (let seed = 1; seed <= 15; seed++) {
      vistos.length = 0;
      const r = simulateCareer(randomInput(createPrng(seed)), seed, 2026, decide);
      for (const v of vistos) {
        const s = r.seasons.find((x) => x.year === v.year);
        if (!s || !v.clubId || s.clubId !== v.clubId) continue;
        expect(v.divisao).toBe(s.division);
        conferidos++;
      }
    }
    expect(conferidos).toBeGreaterThan(50);
  });

  it('não muda nenhum resultado da mesma semente', () => {
    const input = randomInput(createPrng(7));
    expect(simulateCareer(input, 7).seasons.map((s) => s.division)).toEqual(simulateCareer(input, 7, 2026, (id, t, view) => autoDecide(id, t, view)).seasons.map((s) => s.division));
  });
});
