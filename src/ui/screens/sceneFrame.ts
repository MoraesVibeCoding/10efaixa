// v2.70 (revisão /impeccable, enquadramento): onde a pintura fica para o ponto focal (a cabeça do jogador, em fração da
// altura da imagem) cair no meio do espaço livre entre a caixa do topo e o painel de baixo, sem abrir faixa vazia na tela.
// A pintura sempre cobre a tela; se precisar subir além da própria altura, cresce (no máximo `zoomMax` vezes).
export interface SceneFrameInput {
  /** Tamanho da tela em px. */
  largura: number; altura: number;
  /** Largura ÷ altura da pintura. */
  razao: number;
  /** Altura do ponto focal na pintura (0 = topo, 1 = pé). */
  focoY: number;
  /** Onde o ponto focal deve cair na tela (px a partir do topo). */
  livreMeio: number;
  /** Até onde a pintura pode descer (px): o fim da caixa do topo, que cobre o vão com o vidro. Sem caixa, 0. */
  topoLivre?: number;
  zoomMax?: number;
}
export interface SceneFrame { width: number; height: number; left: number; top: number }

export function sceneFrame({ largura, altura, razao, focoY, livreMeio, topoLivre = 0, zoomMax = 1.6 }: SceneFrameInput): SceneFrame {
  // a pintura que desce precisa continuar cobrindo o pé da tela: a base já conta com o deslocamento máximo
  const base = Math.max(altura, largura / razao);
  let height = base;
  let top = livreMeio - focoY * height;
  if (top > 0) {
    top = Math.min(top, topoLivre);
    if (top + height < altura) height = altura - top;
  }
  else if (top + height < altura) {
    // subir abriria faixa no pé: a pintura cresce até o pé encostar no fim da tela, com o foco no lugar
    height = Math.min(base * zoomMax, (altura - livreMeio) / (1 - focoY));
    top = Math.min(0, Math.max(altura - height, livreMeio - focoY * height));
  }
  const width = height * razao;
  return { width, height, left: (largura - width) / 2, top };
}
