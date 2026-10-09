import { kitOf, type Kit } from '../art/kits';
import { toBand } from '../engine/attributes';
import { t } from '../i18n';
import tokens from '../ui/theme/tokens.json';
import { clubName } from '../ui/screens/clubText';
import { idolLine, type CardModel } from './cardModel';

// T55d (SPEC 6.15, v2.42): o cartão 1080×1350 em Canvas 2D, nas versões narrativa e estatística.
// APIs conferidas na MDN (mdn/content): CanvasRenderingContext2D.globalCompositeOperation aceita "destination-in"
// (recorte pela máscara) e "multiply" (cor sobre a camisa em cinza, como no CSS da figurinha); HTMLCanvasElement.toBlob(callback, type).
export const CARD_SIZE = { width: 1080, height: 1350 } as const;
export type CardVersion = 'narrativa' | 'estatistica';
type Img = CanvasImageSource & { width: number; height: number };
export interface CardImages { portrait?: Img; mask?: Img; frame?: Img; emblem?: Img; /** sigla por cima do escudo genérico */ emblemSigla?: string; makeCanvas?: (w: number, h: number) => HTMLCanvasElement }

const P = tokens.paleta;
const TITLE = tokens.fontes.titulo;
const TEXT = tokens.fontes.texto;
const MEDALS = tokens.medalha as unknown as Record<string, { clara: string; escura: string; aro: string; texto: string }>;
const W = CARD_SIZE.width;

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
  // mesmo enquadramento da figurinha do álbum (object-position 50% 6%): do topo da cabeça ao peito
  const sx = (img.width - sw) / 2; const sy = (img.height - sh) * 0.06;
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

/** Caminho de retângulo arredondado (arcTo, para não depender de roundRect). */
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const H = CARD_SIZE.height;
const THEME = tokens.temas.claro;
// v2.66 (direção C): figurinha menor no campo verde, faixa de capitão com o veredito e o conteúdo num painel de papel sólido.
// figurinha: moldura 1 : 1,22, respiro de 9% da largura, foto em 80% da largura
const FW = 480;
const FX = (W - FW) / 2;
const FY = 36;
const FH = Math.round(FW * 1.22);
const EM = FW / 10;
// faixa do veredito, logo abaixo da figurinha, e o painel de papel por baixo dela
const BAND_Y = FY + FH + 34;
const BAND_H = 84;
const GY = BAND_Y + 22;
const GX = 40;
const GW = W - 2 * GX;
/** Pé do painel: nenhum texto do cartão passa daqui (o rodapé fica no verde, embaixo). */
const GB = H - 70;
const PAD = 44;
const BAND_TILT = -0.05;

/** Fundo: verde de gramado liso, com o número da camisa gigante e apagado atrás da figurinha. */
function backdrop(ctx: CanvasRenderingContext2D, m: CardModel) {
  ctx.fillStyle = P.gramado;
  ctx.fillRect(0, 0, W, H);
  const num = String(m.numero);
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
  font(ctx, 820, TITLE, 900);
  ctx.fillText(num, (W - ctx.measureText(num).width) / 2, FY + FH - 10);
  ctx.restore();
}

/** A figurinha do álbum em tamanho grande: moldura de metal, foto com as faixas do clube, Over, tarja e emblema. */
function figurinha(ctx: CanvasRenderingContext2D, m: CardModel, images: CardImages, kit: Kit) {
  const medal = MEDALS[toBand(m.overall).key]!;
  ctx.save();
  rr(ctx, FX, FY, FW, FH, FW * 0.08);
  ctx.clip();
  const g = ctx.createLinearGradient(FX, FY, FX + FW, FY + FH);
  g.addColorStop(0, medal.clara); g.addColorStop(1, medal.escura);
  ctx.fillStyle = g; ctx.fillRect(FX, FY, FW, FH);
  if (images.frame) ctx.drawImage(images.frame, FX, FY, FW, FH);
  ctx.restore();
  rr(ctx, FX + 1, FY + 1, FW - 2, FH - 2, FW * 0.08);
  ctx.strokeStyle = medal.aro; ctx.lineWidth = 3; ctx.stroke();

  // foto: papel em cima, as duas faixas do clube embaixo (60–80–100%)
  const [px, py, pw, ph] = [FX + FW * 0.09, FY + FW * 0.09, FW * 0.82, FW * 0.8];
  ctx.save();
  rr(ctx, px, py, pw, ph, 0.4 * EM);
  ctx.clip();
  ctx.fillStyle = THEME.superficie; ctx.fillRect(px, py, pw, ph);
  ctx.fillStyle = kit.camisa[0]!; ctx.fillRect(px, py + ph * 0.6, pw, ph * 0.2);
  ctx.fillStyle = kit.camisa[1] ?? kit.detalhe; ctx.fillRect(px, py + ph * 0.8, pw, ph * 0.2);
  portrait(ctx, images, kit, px, py, pw, ph);
  ctx.restore();

  // Over na pastilha marinho, no canto de cima
  font(ctx, 1.7 * EM, TITLE, 900);
  const ow = ctx.measureText(String(m.overall)).width + 0.56 * EM;
  ctx.fillStyle = THEME.siglaContorno;
  rr(ctx, px + 0.3 * EM, py + 0.3 * EM, ow, 1.86 * EM, 0.2 * EM); ctx.fill();
  ctx.fillStyle = THEME.siglaTexto;
  ctx.fillText(String(m.overall), px + 0.58 * EM, py + 1.86 * EM);

  // emblema do clube do auge, no canto oposto
  if (images.emblem) {
    const [ex, ey, es] = [px + pw - 1.9 * EM, py + 0.3 * EM, 1.6 * EM];
    ctx.drawImage(images.emblem, ex, ey, es, es);
    if (images.emblemSigla) {
      font(ctx, es * 0.24, TITLE, 900);
      const sw = ctx.measureText(images.emblemSigla).width;
      ctx.fillStyle = THEME.superficie; ctx.fillRect(ex + (es - sw) / 2 - 3, ey + es * 0.38, sw + 6, es * 0.26);
      ctx.fillStyle = THEME.texto; ctx.fillText(images.emblemSigla, ex + (es - sw) / 2, ey + es * 0.38 + es * 0.21);
    }
  }

  // tarja: nome e número
  const [tx, ty, tw, th] = [FX + FW * 0.09, FY + FH * (1 - 0.07 - 0.17), FW * 0.82, FH * 0.17];
  ctx.fillStyle = THEME.siglaContorno;
  rr(ctx, tx, ty, tw, th, 0.25 * EM); ctx.fill();
  ctx.fillStyle = THEME.siglaTexto;
  const num = String(m.numero);
  font(ctx, 1.6 * EM, TITLE, 900);
  const nw = ctx.measureText(num).width;
  ctx.fillText(num, tx + tw - 0.6 * EM - nw, ty + th * 0.72);
  fit(ctx, m.nome.toUpperCase(), TITLE, 900, 0.92 * EM, 0.5 * EM, tw - nw - 1.8 * EM);
  ctx.fillText(m.nome.toUpperCase(), tx + 0.6 * EM, ty + th * 0.66);
}

/** Painel de papel sólido com sombra suave (o vidro fica para as telas com cena por trás). */
function panel(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.shadowColor = 'rgba(9, 26, 17, 0.28)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  rr(ctx, GX, GY, GW, GB - GY, 24);
  ctx.fillStyle = THEME.superficie; ctx.fill();
  ctx.restore();
}

/** A faixa de capitão (amarelo braçadeira), inclinada e passando das bordas, com o veredito. */
function band(ctx: CanvasRenderingContext2D, m: CardModel) {
  const v = m.veredito.toUpperCase();
  ctx.save();
  ctx.translate(W / 2, BAND_Y + BAND_H / 2);
  ctx.rotate(BAND_TILT);
  ctx.shadowColor = 'rgba(9, 26, 17, 0.3)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6;
  ctx.fillStyle = P.amarelo;
  ctx.fillRect(-W / 2 - 40, -BAND_H / 2, W + 80, BAND_H);
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = P.tinta;
  const size = fit(ctx, v, TITLE, 900, 56, 28, W - 2 * PAD - 40);
  ctx.fillText(v, -ctx.measureText(v).width / 2, size * 0.36);
  ctx.restore();
}

/** Rótulo, a linha "apelido · posição · clube" e onde virou ídolo. Devolve onde o conteúdo continua. */
function header(ctx: CanvasRenderingContext2D, m: CardModel): number {
  const x = GX + PAD; const width = GW - 2 * PAD;
  let y = GY + 122;
  ctx.fillStyle = P.tinta;
  fit(ctx, m.rotulo, TEXT, 700, 30, 20, width);
  ctx.fillText(m.rotulo, x, y);
  y += 38;
  ctx.fillStyle = THEME.textoSuave;
  const who = `${m.apelido} · ${m.posicao} · ${clubName(m.clubeAuge).nome}`;
  fit(ctx, who, TEXT, 400, 26, 18, width);
  ctx.fillText(who, x, y);
  // v2.62: onde virou ídolo; o clube de coração vem primeiro e a linha fica em verde, em destaque
  if (m.idolos.length) {
    y += 36;
    const line = idolLine(m.idolos);
    ctx.fillStyle = m.idolos[0]!.coracao ? P.gramado : P.tinta;
    fit(ctx, line, TEXT, 700, 26, 16, width);
    ctx.fillText(line, x, y);
  }
  return y + 50;
}

function narrative(ctx: CanvasRenderingContext2D, m: CardModel, y0: number) {
  const x = GX + PAD; const width = GW - 2 * PAD;
  ctx.fillStyle = P.tinta;
  font(ctx, 30, TEXT, 700);
  let y = paragraph(ctx, m.manchete, x, y0, width, 38, y0 + 38) + 8;
  // honrarias em pílulas numa linha (a fonte diminui até a linha caber), logo depois da manchete: nunca caem no pé
  if (m.honrarias.length) {
    const labels = m.honrarias.map((h) => `★ ${h}`);
    let size = 22;
    for (; size > 14; size--) {
      font(ctx, size, TEXT, 700);
      if (labels.reduce((sum, l) => sum + ctx.measureText(l).width + 2 * size + 12, 0) <= width) break;
    }
    let px = x;
    const top = y - size * 1.1;
    for (const l of labels) {
      const w = ctx.measureText(l).width + 2 * size;
      ctx.fillStyle = P.tinta; rr(ctx, px, top, w, size * 1.7, size * 0.85); ctx.fill();
      ctx.fillStyle = P.papel; ctx.fillText(l, px + size, top + size * 1.2);
      px += w + 12;
    }
    y = top + size * 1.7 + 44;
  }
  // até 4 frases, uma linha cada (a fonte diminui até caber, nunca corta); só as que cabem antes do pé do painel
  for (const f of m.frases) {
    if (y > GB - 24) break;
    ctx.fillStyle = P.gramado; ctx.fillRect(x, y - 16, 10, 10);
    ctx.fillStyle = P.tinta;
    fit(ctx, f, TEXT, 400, 28, 16, width - 24);
    ctx.fillText(f, x + 24, y);
    y += 44;
  }
}

function statistics(ctx: CanvasRenderingContext2D, m: CardModel, y0: number) {
  const x = GX + PAD; const width = GW - 2 * PAD;
  // números da carreira numa linha
  const col = width / m.numeros.length;
  m.numeros.forEach((n, i) => {
    ctx.fillStyle = P.tinta;
    fit(ctx, n.valor, TITLE, 900, 44, 22, col - 12);
    ctx.fillText(n.valor, x + i * col, y0 + 8);
    fit(ctx, n.nome.toUpperCase(), TITLE, 800, 20, 12, col - 12);
    ctx.fillStyle = THEME.textoSuave;
    ctx.fillText(n.nome.toUpperCase(), x + i * col, y0 + 36);
  });
  // radar dos 10 atributos no auge, escala 0–100
  // o rótulo de baixo fica a 1,14 do raio e mais 18 px: o raio é o maior que ainda cabe no painel
  const r = Math.min(130, ((GB - (y0 + 70)) / 2 - 24) / 1.14);
  const [cx, cy] = [W / 2, (y0 + 70 + GB) / 2];
  const pt = (i: number, v: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / m.radar.length;
    return [cx + Math.cos(a) * r * v, cy + Math.sin(a) * r * v] as const;
  };
  ctx.strokeStyle = P.linha; ctx.lineWidth = 2;
  for (const ring of [0.5, 1]) {
    ctx.beginPath();
    m.radar.forEach((_, i) => { const [px, py] = pt(i, ring); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); });
    ctx.closePath(); ctx.stroke();
  }
  ctx.beginPath();
  m.radar.forEach((a, i) => { const [px, py] = pt(i, Math.min(1, a.valor / 100)); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); });
  ctx.closePath();
  ctx.fillStyle = 'rgba(30, 123, 79, 0.35)'; ctx.fill();
  ctx.strokeStyle = P.gramado; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = P.tinta;
  font(ctx, 20, TEXT, 700);
  // rótulo alinhado pelo lado em que está, para nunca invadir o polígono
  m.radar.forEach((a, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / m.radar.length;
    const [px, py] = pt(i, 1.14);
    const label = `${a.nome} ${a.valor}`;
    const w = ctx.measureText(label).width;
    const cos = Math.cos(ang);
    const left = cos > 0.2 ? px + 4 : cos < -0.2 ? px - 4 - w : px - w / 2;
    const dy = Math.sin(ang) > 0.5 ? 18 : Math.sin(ang) < -0.5 ? -6 : 7;
    ctx.fillText(label, left, py + dy);
  });
}

/** Desenha o cartão inteiro no contexto (1080×1350). Imagens opcionais: sem elas, ficam as cores (metal e clube). */
export function drawCard(ctx: CanvasRenderingContext2D, m: CardModel, version: CardVersion, images: CardImages = {}) {
  ctx.textBaseline = 'alphabetic';
  backdrop(ctx, m);
  // v2.62: a figurinha veste o último clube profissional
  figurinha(ctx, m, images, kitOf(m.clubeFigurinha));
  panel(ctx);
  band(ctx, m);
  const y = header(ctx, m);
  if (version === 'narrativa') narrative(ctx, m, y); else statistics(ctx, m, y);
  // rodapé sobre o verde: código da carreira e a marca
  ctx.fillStyle = P.papel;
  font(ctx, 26, TITLE, 800);
  ctx.fillText(`${t('ui.cartao.codigo')} ${m.codigo}`, GX + 8, H - 26);
  const brand = t('app.title');
  ctx.fillText(brand, W - GX - 8 - ctx.measureText(brand).width, H - 26);
}
