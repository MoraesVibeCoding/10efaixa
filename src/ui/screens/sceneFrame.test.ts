import { sceneFrame } from './sceneFrame';

// v2.70 (revisão /impeccable, enquadramento): a cena se posiciona para o ponto focal (a cabeça) cair no meio do espaço livre
// entre a caixa do topo e o painel de baixo, sem nunca deixar faixa vazia na tela.
const R = 1080 / 1341;

describe('enquadramento da cena pelo ponto focal (v2.70)', () => {
  it('com folga, o ponto focal cai no meio do espaço livre', () => {
    const f = sceneFrame({ largura: 390, altura: 844, razao: R, focoY: 0.28, livreMeio: 230 });
    expect(f.top + 0.28 * f.height).toBeCloseTo(230, 0);
  });

  it('nunca deixa faixa vazia: cobre a largura e a altura da tela', () => {
    for (const [w, h, meio] of [[390, 844, 230], [360, 640, 120], [360, 640, 600], [1280, 800, 300], [390, 844, 10]] as const) {
      for (const focoY of [0.1, 0.28, 0.5, 0.8]) {
        const f = sceneFrame({ largura: w, altura: h, razao: R, focoY, livreMeio: meio });
        expect(f.top, `${w}x${h} ${focoY} ${meio}`).toBeLessThanOrEqual(0.001);
        expect(f.top + f.height).toBeGreaterThanOrEqual(h - 0.001);
        expect(f.width).toBeGreaterThanOrEqual(w - 0.001);
        expect(f.left).toBeLessThanOrEqual(0.001);
        expect(f.left + f.width).toBeGreaterThanOrEqual(w - 0.001);
        expect(f.width / f.height).toBeCloseTo(R, 5);
      }
    }
  });

  it('quando o foco pede descer a pintura, ela desce no máximo até o fim da caixa do topo (o vão fica atrás do vidro dela)', () => {
    expect(sceneFrame({ largura: 390, altura: 844, razao: R, focoY: 0.1, livreMeio: 400 }).top).toBe(0);
    const f = sceneFrame({ largura: 390, altura: 844, razao: R, focoY: 0.1, livreMeio: 400, topoLivre: 175 });
    expect(f.top).toBe(175);
    const g = sceneFrame({ largura: 390, altura: 844, razao: R, focoY: 0.28, livreMeio: 322, topoLivre: 175 });
    expect(g.top + 0.28 * g.height).toBeCloseTo(322, 0);
    expect(g.top + g.height).toBeGreaterThanOrEqual(844);
  });

  it('no celular pequeno, sobe a pintura (e cresce o quanto precisa) para a cabeça ficar acima do painel', () => {
    const f = sceneFrame({ largura: 360, altura: 640, razao: R, focoY: 0.28, livreMeio: 110 });
    expect(f.top + 0.28 * f.height).toBeCloseTo(110, 0);
  });
});
