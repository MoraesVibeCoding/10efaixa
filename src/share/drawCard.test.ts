import tokens from '../ui/theme/tokens.json';
import { simulateCareer } from '../engine/career';
import { createPrng } from '../engine/prng';
import { randomInput } from '../engine/simulation';
import { cardModel, idolLine } from './cardModel';
import { CARD_SIZE, drawCard } from './drawCard';

// T55d (SPEC 6.15): o desenho em Canvas 2D; aqui um contexto falso grava o texto desenhado (o jsdom não tem canvas).
function fakeCtx() {
  const texts: string[] = [];
  const at: { s: string; y: number }[] = [];
  const state: Record<string, unknown> = { font: '10px sans-serif' };
  const ctx = new Proxy(state, {
    get(target, prop: string) {
      if (prop === 'fillText') return (s: string, _x: number, y: number) => { texts.push(s); at.push({ s, y }); };
      if (prop === 'measureText') return (s: string) => ({ width: s.length * (parseFloat(String(target.font).match(/(\d+(\.\d+)?)px/)?.[1] ?? '10') * 0.55) });
      if (prop === 'createLinearGradient' || prop === 'createRadialGradient') return () => ({ addColorStop() {} });
      if (prop in target) return target[prop];
      return () => {};
    },
    set(target, prop: string, v) { target[prop] = v; return true; },
  });
  return { ctx: ctx as unknown as CanvasRenderingContext2D, all: () => texts.join(' '), at };
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
    // v2.79: o nome longo que não cabe ao lado do número vira só o primeiro nome (o completo segue no texto alternativo)
    for (const s of [m.nome.toUpperCase().split(' ')[0]!, m.apelido, m.veredito.toUpperCase(), m.rotulo, m.codigo, ...m.honrarias, m.frases[0]!]) expect(text, s).toContain(s);
    // v2.73: só entram as frases que cabem inteiras, na ordem; a que não cabe sai toda (nunca pela metade)
    const desenhadas = m.frases.filter((f) => text.includes(f));
    expect(desenhadas).toEqual(m.frases.slice(0, desenhadas.length));
    for (const f of m.frases.slice(desenhadas.length)) expect(text).not.toContain(f.split(' ').slice(0, 4).join(' '));
    expect(text).toContain(m.manchete.split(' ').slice(0, 3).join(' '));
  });

  it('estatístico (v2.79): números em fichas, Seleção e patrimônio por extenso, os 10 atributos em fichas da maior para a menor; sem as frases', () => {
    const { ctx, all, at } = fakeCtx();
    drawCard(ctx, m, 'estatistica');
    const text = all();
    for (const n of m.numeros) {
      expect(text).toContain(n.valor);
      expect(text).toContain(n.id === 'selecao' || n.id === 'patrimonio' ? `${n.nome}: ${n.valor}` : n.nome.toUpperCase());
    }
    const nomes = new Set(m.radar.map((a) => a.nome.toUpperCase()));
    const ordem = at.filter((a) => nomes.has(a.s)).map((a) => a.s);
    expect(ordem).toEqual([...m.radar].sort((a, b) => b.valor - a.valor).map((a) => a.nome.toUpperCase()));
    for (const a of m.radar) expect(text).toContain(String(a.valor));
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

// v2.66 (direção C, escolhida pelo usuário): fundo verde com o número da camisa gigante, veredito numa faixa de capitão e o
// conteúdo num painel de papel; nenhum texto passa do painel (antes as honrarias caíam em cima do código).
describe('cartão na direção C (v2.66)', () => {
  const careers = Array.from({ length: 40 }, (_, i) => cardModel(simulateCareer(randomInput(createPrng(i + 1)), i + 1), '10F-AAAA-BBBB'));

  it('nas duas versões, todo texto fora o rodapé fica dentro do painel (até 70 px do pé)', () => {
    for (const x of careers) {
      for (const v of ['narrativa', 'estatistica'] as const) {
        const { ctx, at } = fakeCtx();
        drawCard(ctx, x, v);
        const body = at.filter((a) => !a.s.includes(x.codigo) && a.s !== '10eFaixa');
        for (const a of body) expect(a.y, `${v}: ${a.s}`).toBeLessThanOrEqual(CARD_SIZE.height - 70);
      }
    }
  });

  it('o número da camisa aparece gigante ao fundo, antes de tudo', () => {
    const { ctx, at } = fakeCtx();
    drawCard(ctx, m, 'narrativa');
    expect(at[0]!.s).toBe(String(m.numero));
  });
});

// v2.73 (revisão /impeccable): o cartão é visto pequeno (prévia do WhatsApp, ~300 px de largura); nenhum texto abaixo do
// mínimo legível no desenho de 1080 px. Frase longa quebra em linhas, nunca encolhe.
describe('cartão legível na prévia (v2.73)', () => {
  function sizesCtx() {
    const sizes: { s: string; px: number }[] = [];
    const base = fakeCtx();
    const ctx = new Proxy(base.ctx as unknown as Record<string, unknown>, {
      get(target, prop: string) {
        if (prop === 'fillText') return (s: string, x: number, y: number) => { sizes.push({ s, px: parseFloat(String(target.font).match(/(\d+(\.\d+)?)px/)![1]!) }); (target.fillText as (a: string, b: number, c: number) => void)(s, x, y); };
        return target[prop];
      },
      set(target, prop: string, v) { target[prop] = v; return true; },
    });
    return { ctx: ctx as unknown as CanvasRenderingContext2D, sizes, all: base.all };
  }
  const longo = {
    ...m,
    apelido: 'Apelido Bem Comprido Mesmo', rotulo: 'Lenda absoluta do futebol mundial',
    honrarias: ['Melhor do mundo 3x', 'Artilheiro histórico', 'Campeão mundial', 'Bola de prata'],
    frases: ['Atravessou o oceano aos 21 para vestir a camisa de um gigante europeu', 'Eleito o melhor do mundo aos 25, depois de uma temporada inesquecível', 'Virou ídolo e jogou 12 temporadas no mesmo clube'],
  };

  it.each(['narrativa', 'estatistica'] as const)('%s: todo texto com pelo menos 30 px no desenho de 1080', (v) => {
    for (const x of [m, longo]) {
      const { ctx, sizes } = sizesCtx();
      drawCard(ctx, x, v);
      const small = sizes.filter((z) => z.px < 30);
      expect(small, small.map((z) => `${z.px}px ${z.s}`).join(' | ')).toEqual([]);
    }
  });

  it('frase longa quebra em linhas e aparece inteira', () => {
    const { ctx, all } = sizesCtx();
    drawCard(ctx, longo, 'narrativa');
    expect(all()).toContain(longo.frases[0]);
  });
});

// v2.77: a manchete é texto impresso, não fala: cara de jornal (Oswald, a fonte condensada dos títulos), nunca itálico.
describe('manchete com cara de jornal (v2.77)', () => {
  it('a manchete sai na fonte dos títulos, sem itálico', () => {
    const fonts: { s: string; font: string }[] = [];
    const base = fakeCtx();
    const ctx = new Proxy(base.ctx as unknown as Record<string, unknown>, {
      get(target, prop: string) {
        if (prop === 'fillText') return (s: string) => { fonts.push({ s, font: String(target.font) }); };
        return target[prop];
      },
      set(target, prop: string, v) { target[prop] = v; return true; },
    });
    drawCard(ctx as unknown as CanvasRenderingContext2D, m, 'narrativa');
    // a 1ª linha da manchete é um começo dela com mais de uma palavra (o apelido sozinho também pode ser um começo)
    const linha = fonts.find((f) => f.s.includes(' ') && m.manchete.startsWith(f.s));
    expect(linha?.font).toContain(tokens.fontes.titulo);
    expect(linha?.font).not.toMatch(/italic/);
  });
});

// v2.79 (achado do usuário: "as infos estão sobrepostas"): nenhum texto do cartão encosta em outro, nas duas versões.
// A faixa (desenhada girada) e o número gigante do fundo ficam de fora: são camadas de trás ou de outra orientação.
describe('nada sobreposto (v2.79)', () => {
  type Box = { s: string; x0: number; x1: number; y0: number; y1: number };
  function boxesOf(x: typeof m, v: 'narrativa' | 'estatistica'): Box[] {
    const boxes: Box[] = [];
    const base = fakeCtx();
    const ctx = new Proxy(base.ctx as unknown as Record<string, unknown>, {
      get(target, prop: string) {
        if (prop === 'fillText') return (s: string, px: number, py: number) => {
          const size = parseFloat(String(target.font).match(/(\d+(\.\d+)?)px/)![1]!);
          const w = (target.measureText as (t: string) => { width: number })(s).width;
          boxes.push({ s, x0: px, x1: px + w, y0: py - 0.72 * size, y1: py + 0.12 * size });
        };
        return target[prop];
      },
      set(target, prop: string, val) { target[prop] = val; return true; },
    });
    drawCard(ctx as unknown as CanvasRenderingContext2D, x, v);
    return boxes.slice(1).filter((b) => b.s !== x.veredito.toUpperCase());
  }
  const hit = (a: Box, b: Box) => Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) > 2 && Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) > 2;
  const careers = Array.from({ length: 40 }, (_, i) => cardModel(simulateCareer(randomInput(createPrng(i + 1)), i + 1), '10F-AAAA-BBBB'));
  const longo = { ...m, nome: 'Jogador Com Nome Bem Comprido', numeros: m.numeros.map((n) => (n.id === 'patrimonio' ? { ...n, valor: 'R$ 1.234,5 mi' } : n)) };

  it.each(['narrativa', 'estatistica'] as const)('%s: nenhum par de textos se sobrepõe', (v) => {
    for (const x of [...careers, longo]) {
      const b = boxesOf(x, v);
      const pares: string[] = [];
      for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) if (hit(b[i]!, b[j]!)) pares.push(`${b[i]!.s} × ${b[j]!.s}`);
      expect(pares, x.nome).toEqual([]);
    }
  });
});
