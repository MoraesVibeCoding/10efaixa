import { simulateCareer } from '../engine/career';
import { createPrng } from '../engine/prng';
import { randomInput } from '../engine/simulation';
import { cardModel, idolLine } from './cardModel';
import { CARD_SIZE, drawCard } from './drawCard';

// T55d (SPEC 6.15): o desenho em Canvas 2D; aqui um contexto falso grava o texto desenhado (o jsdom não tem canvas).
function fakeCtx() {
  const texts: string[] = [];
  const state: Record<string, unknown> = { font: '10px sans-serif' };
  const ctx = new Proxy(state, {
    get(target, prop: string) {
      if (prop === 'fillText') return (s: string) => { texts.push(s); };
      if (prop === 'measureText') return (s: string) => ({ width: s.length * (parseFloat(String(target.font).match(/(\d+(\.\d+)?)px/)?.[1] ?? '10') * 0.55) });
      if (prop === 'createLinearGradient' || prop === 'createRadialGradient') return () => ({ addColorStop() {} });
      if (prop in target) return target[prop];
      return () => {};
    },
    set(target, prop: string, v) { target[prop] = v; return true; },
  });
  return { ctx: ctx as unknown as CanvasRenderingContext2D, all: () => texts.join(' ') };
}

const r = simulateCareer(randomInput(createPrng(3)), 3);
const m = cardModel(r, '10F-7K3Q-9M2X');

describe('desenho do cartão (T55d)', () => {
  it('tamanho do SPEC: 1080×1350', () => {
    expect(CARD_SIZE).toEqual({ width: 1080, height: 1350 });
  });

  it('narrativo: nome, apelido, veredito, rótulo, manchete, honrarias, frases e código', () => {
    const { ctx, all } = fakeCtx();
    drawCard(ctx, m, 'narrativa');
    const text = all();
    for (const s of [m.nome.toUpperCase(), m.apelido, m.veredito.toUpperCase(), m.rotulo, m.codigo, ...m.honrarias, ...m.frases]) expect(text, s).toContain(s);
    expect(text).toContain(m.manchete.split(' ').slice(0, 3).join(' '));
  });

  it('estatístico: números da carreira, radar com os números do pico e código; sem as frases', () => {
    const { ctx, all } = fakeCtx();
    drawCard(ctx, m, 'estatistica');
    const text = all();
    for (const n of m.numeros) { expect(text).toContain(n.valor); expect(text).toContain(n.nome.toUpperCase()); }
    for (const a of m.radar) { expect(text).toContain(a.nome); expect(text).toContain(String(a.valor)); }
    expect(text).toContain(m.codigo);
    expect(text).not.toContain(m.frases[0]!);
  });

  it('ídolos: a linha dos clubes onde virou ídolo aparece nas duas versões (v2.62)', () => {
    const x = { ...m, idolos: [{ clubId: 'bahia', nome: 'Bahia', coracao: true }, { clubId: 'santos', nome: 'Santos', coracao: false }] };
    for (const v of ['narrativa', 'estatistica'] as const) {
      const { ctx, all } = fakeCtx();
      drawCard(ctx, x, v);
      expect(all()).toContain(idolLine(x.idolos));
    }
  });
});
