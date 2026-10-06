import { kitOf, type Kit } from '../art/kits';
import { toBand } from '../engine/attributes';
import { t } from '../i18n';
import tokens from '../ui/theme/tokens.json';
import { clubName } from '../ui/screens/clubText';
import type { CardModel } from './cardModel';

// T55d (SPEC 6.15, v2.42): o cartão 1080×1350 em Canvas 2D, nas versões narrativa e estatística.
// APIs conferidas na MDN (mdn/content): CanvasRenderingContext2D.globalCompositeOperation aceita "destination-in"
// (recorte pela máscara) e "multiply" (cor sobre a camisa em cinza, como no CSS da figurinha); HTMLCanvasElement.toBlob(callback, type).
export const CARD_SIZE = { width: 1080, height: 1350 } as const;
export type CardVersion = 'narrativa' | 'estatistica';
type Img = CanvasImageSource & { width: number; height: number };
export interface CardImages { portrait?: Img; mask?: Img; makeCanvas?: (w: number, h: number) => HTMLCanvasElement }

const P = tokens.paleta;
const TITLE = tokens.fontes.titulo;
const TEXT = tokens.fontes.texto;
const MEDALS = tokens.medalha as unknown as Record<string, { clara: string; escura: string; aro: string; texto: string }>;
const W = CARD_SIZE.width;
const M = 60;

function font(ctx: CanvasRenderingContext2D, size: number, family: string, weight = 400, style = '') {
  ctx.font = `${style} ${weight} ${size}px ${family}`.trim();
}

/** Maior tamanho de fonte (até `max`) em que o texto cabe na largura. */
function fit(ctx: CanvasRenderingContext2D, text: string, family: string, weight: number, max: number, min: number, width: number): number {
  let size = max;
  for (; size > min; size -= 2) {
    font(ctx, size, family, weight);
    if (ctx.measureText(text).width <= width) return size;
  }
  font(ctx, min, family, weight);
  return min;
}

/** Quebra em linhas que cabem na largura, palavra por palavra. */
function wrap(ctx: CanvasRenderingContext2D, text: string, width: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > width) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** Texto em parágrafo até `maxY`; devolve onde parou. */
function paragraph(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, lh: number, maxY: number): number {
  for (const line of wrap(ctx, text, width)) {
    if (y > maxY) break;
    ctx.fillText(line, x, y);
    y += lh;
  }
  return y;
}

/** O padrão tradicional do clube (mesma geometria do `shirtPaint` em CSS), dentro do retângulo. */
function paintKit(ctx: CanvasRenderingContext2D, kit: Kit, w: number, h: number) {
  const [a, ...rest] = kit.camisa as [string, ...string[]];
  const colors = kit.camisa;
  ctx.fillStyle = a;
  ctx.fillRect(0, 0, w, h);
  const stripes = (step: number, vertical: boolean, cs: string[]) => {
    const span = vertical ? w : h;
    for (let i = 0, p = 0; p < span; i++, p += step) {
      ctx.fillStyle = cs[i % cs.length]!;
      if (vertical) ctx.fillRect(p, 0, step, h); else ctx.fillRect(0, p, w, step);
    }
  };
  const band = (x0: number, y0: number, x1: number, y1: number, from: number, to: number) => {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    const n = rest.length || 1;
    g.addColorStop(0, a); g.addColorStop(from, a);
    rest.forEach((c, i) => { g.addColorStop(from + ((to - from) / n) * i, c); g.addColorStop(from + ((to - from) / n) * (i + 1), c); });
    g.addColorStop(to, a); g.addColorStop(1, a);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  };
  switch (kit.padrao) {
    case 'listras-verticais': stripes(w * 0.07, true, colors); break;
    case 'faixas-horizontais': stripes(h * 0.06, false, colors); break;
    case 'listras-finas':
      for (let p = w * 0.04, i = 0; p < w; p += w * (0.04 + rest.length * 0.01), i++) {
        rest.forEach((c, j) => { ctx.fillStyle = c; ctx.fillRect(p + j * w * 0.01, 0, w * 0.01, h); });
      }
      break;
    case 'listras-diagonais': {
      ctx.save(); ctx.translate(w / 2, h / 2); ctx.rotate(-Math.PI / 4); ctx.translate(-w, -h);
      const step = h * 0.06;
      for (let i = 0, p = 0; p < 2 * h; i++, p += step) { ctx.fillStyle = colors[i % colors.length]!; ctx.fillRect(0, p, 2 * w, step); }
      ctx.restore();
      break;
    }
    case 'faixa-diagonal': band(0, 0, w, h, 0.54, 0.66); break;
    case 'faixa-no-peito': band(0, 0, 0, h, 0.56, 0.66); break;
    default: break;
  }
}

/** Retrato no quadro (cover), com a camisa pintada pela máscara e multiplicada sobre o cinza. */
function portrait(ctx: CanvasRenderingContext2D, images: CardImages, kit: Kit, x: number, y: number, w: number, h: number) {
  const img = images.portrait;
  if (!img) return;
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale; const sh = h / scale;
  const sx = (img.width - sw) / 2; const sy = (img.height - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  if (!images.mask || !images.makeCanvas) return;
  const layer = images.makeCanvas(w, h);
  const lc = layer.getContext('2d');
  if (!lc) return;
  paintKit(lc, kit, w, h);
  lc.globalCompositeOperation = 'destination-in';
  lc.drawImage(images.mask, sx, sy, sw, sh, 0, 0, w, h);
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(layer, x, y);
  ctx.restore();
}

function header(ctx: CanvasRenderingContext2D, m: CardModel, images: CardImages) {
  // faixa com as cores dos clubes da carreira, em ordem
  const seg = W / Math.max(1, m.clubes.length);
  m.clubes.forEach((id, i) => { ctx.fillStyle = kitOf(id).camisa[0]!; ctx.fillRect(i * seg, 0, seg + 1, 20); });

  // retrato 4:5 com moldura no metal da faixa do Over
  const medal = MEDALS[toBand(m.overall).key]!;
  const kit = kitOf(m.clubeAuge);
  const [px, py, pw, ph] = [M, 60, 480, 600];
  const g = ctx.createLinearGradient(px, py, px + pw, py + ph);
  g.addColorStop(0, medal.clara); g.addColorStop(1, medal.escura);
  ctx.fillStyle = g;
  ctx.fillRect(px, py, pw, ph);
  portrait(ctx, images, kit, px, py, pw, ph);
  ctx.strokeStyle = medal.aro; ctx.lineWidth = 10;
  ctx.strokeRect(px + 5, py + 5, pw - 10, ph - 10);

  // coluna da direita: número gigante na cor do clube, Over máximo, clube e honrarias
  const cx = 580; const cw = W - M - cx;
  const num = String(m.numero);
  const size = Math.min(300, fit(ctx, num, TITLE, 900, 300, 80, cw));
  font(ctx, size, TITLE, 900);
  ctx.lineWidth = 8; ctx.strokeStyle = P.marinho; ctx.fillStyle = kit.camisa[0]!;
  ctx.textBaseline = 'alphabetic';
  ctx.strokeText(num, cx, 60 + size * 0.86);
  ctx.fillText(num, cx, 60 + size * 0.86);

  const oy = 380;
  const og = ctx.createLinearGradient(cx, oy, cx, oy + 150);
  og.addColorStop(0, medal.clara); og.addColorStop(1, medal.escura);
  ctx.fillStyle = og; ctx.fillRect(cx, oy, 190, 150);
  ctx.strokeStyle = medal.aro; ctx.lineWidth = 4; ctx.strokeRect(cx + 2, oy + 2, 186, 146);
  ctx.fillStyle = medal.texto;
  font(ctx, 26, TITLE, 800); ctx.fillText(t('ui.cartao.overMax').toUpperCase(), cx + 16, oy + 36);
  font(ctx, 100, TITLE, 900); ctx.fillText(String(m.overall), cx + 16, oy + 132);

  ctx.fillStyle = P.marinho;
  fit(ctx, clubName(m.clubeAuge).nome, TITLE, 800, 40, 22, cw - 210);
  ctx.fillText(clubName(m.clubeAuge).nome, cx + 210, oy + 70);
  fit(ctx, m.posicao, TEXT, 400, 30, 20, cw - 210);
  ctx.fillText(m.posicao, cx + 210, oy + 112);

  if (m.honrarias.length) {
    font(ctx, 24, TITLE, 800);
    ctx.fillText(t('ui.cartao.honrarias').toUpperCase(), cx, 580);
    let y = 614;
    for (const h of m.honrarias) {
      fit(ctx, `★ ${h}`, TEXT, 700, 24, 16, cw);
      ctx.fillText(`★ ${h}`, cx, y);
      y += 30;
    }
  }

  // nome, apelido e posição
  ctx.fillStyle = P.marinho;
  fit(ctx, m.nome.toUpperCase(), TITLE, 900, 96, 40, W - 2 * M);
  ctx.fillText(m.nome.toUpperCase(), M, 752);
  fit(ctx, m.apelido, TEXT, 400, 38, 22, W - 2 * M);
  ctx.fillText(m.apelido, M, 798);

  // faixa amarela: veredito e rótulo
  ctx.fillStyle = P.amarelo; ctx.fillRect(0, 826, W, 130);
  ctx.fillStyle = P.marinho;
  fit(ctx, m.veredito.toUpperCase(), TITLE, 900, 60, 30, W - 2 * M);
  ctx.fillText(m.veredito.toUpperCase(), M, 888);
  fit(ctx, m.rotulo, TEXT, 700, 32, 20, W - 2 * M);
  ctx.fillText(m.rotulo, M, 934);
}

function narrative(ctx: CanvasRenderingContext2D, m: CardModel) {
  ctx.fillStyle = P.marinho;
  font(ctx, 34, TEXT, 700);
  const y0 = paragraph(ctx, m.manchete, M, 1004, W - 2 * M, 42, 1046) + 10;
  // até 4 frases, uma linha cada: a fonte diminui até caber, nunca corta (T55d)
  m.frases.forEach((f, i) => {
    const y = y0 + i * 46;
    ctx.fillStyle = P.verde; ctx.fillRect(M, y - 18, 12, 12);
    ctx.fillStyle = P.marinho;
    fit(ctx, f, TEXT, 400, 30, 18, W - 2 * M - 28);
    ctx.fillText(f, M + 28, y);
  });
}

function statistics(ctx: CanvasRenderingContext2D, m: CardModel) {
  // números da carreira, em coluna
  ctx.fillStyle = P.marinho;
  let y = 1010;
  for (const n of m.numeros) {
    font(ctx, 24, TITLE, 800); ctx.fillText(n.nome.toUpperCase(), M, y);
    font(ctx, 40, TITLE, 900); ctx.fillText(n.valor, M + 230, y + 4);
    y += 56;
  }
  // radar dos 10 atributos no auge, escala 0–100
  const [cx, cy, r] = [800, 1118, 112];
  const pt = (i: number, v: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / m.radar.length;
    return [cx + Math.cos(a) * r * v, cy + Math.sin(a) * r * v] as const;
  };
  ctx.strokeStyle = P.linha; ctx.lineWidth = 2;
  for (const ring of [0.5, 1]) {
    ctx.beginPath();
    m.radar.forEach((_, i) => { const [x, yy] = pt(i, ring); if (i) ctx.lineTo(x, yy); else ctx.moveTo(x, yy); });
    ctx.closePath(); ctx.stroke();
  }
  ctx.beginPath();
  m.radar.forEach((a, i) => { const [x, yy] = pt(i, Math.min(1, a.valor / 100)); if (i) ctx.lineTo(x, yy); else ctx.moveTo(x, yy); });
  ctx.closePath();
  ctx.fillStyle = 'rgba(30, 123, 79, 0.35)'; ctx.fill();
  ctx.strokeStyle = P.verde; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = P.marinho;
  font(ctx, 20, TEXT, 700);
  // rótulo alinhado pelo lado em que está, para nunca invadir o polígono
  m.radar.forEach((a, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / m.radar.length;
    const [x, yy] = pt(i, 1.14);
    const label = `${a.nome} ${a.valor}`;
    const w = ctx.measureText(label).width;
    const cos = Math.cos(ang);
    const left = cos > 0.2 ? x + 4 : cos < -0.2 ? x - 4 - w : x - w / 2;
    const dy = Math.sin(ang) > 0.5 ? 18 : Math.sin(ang) < -0.5 ? -6 : 7;
    ctx.fillText(label, Math.min(W - 16 - w, Math.max(480, left)), yy + dy);
  });
}

/** Desenha o cartão inteiro no contexto (1080×1350). Imagens opcionais: sem retrato, fica o fundo no metal da faixa. */
export function drawCard(ctx: CanvasRenderingContext2D, m: CardModel, version: CardVersion, images: CardImages = {}) {
  ctx.fillStyle = P.papel;
  ctx.fillRect(0, 0, W, CARD_SIZE.height);
  header(ctx, m, images);
  if (version === 'narrativa') narrative(ctx, m); else statistics(ctx, m);
  // rodapé: código da carreira e a marca
  ctx.fillStyle = P.marinho; ctx.fillRect(0, 1290, W, 60);
  ctx.fillStyle = P.papel;
  font(ctx, 26, TITLE, 800);
  ctx.fillText(`${t('ui.cartao.codigo')} ${m.codigo}`, M, 1330);
  const brand = t('app.title');
  const bw = ctx.measureText(brand).width;
  ctx.fillText(brand, W - M - bw, 1330);
}
