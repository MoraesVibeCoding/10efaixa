// Ícone do 10eFaixa (v2.81, direção "Álbum", proposta A "noite de estádio", escolhida pelo usuário em 2026-10-10): o nome
// do jogo desenhado, o "10" e a faixa de capitão, na cor da capa e da contracapa. Fundo verde-noite com duas faixas de grama
// cortada, o "10" em papel e a braçadeira amarela reta com o "C" em tinta. Sem azul e nada inclinado (o ícone de antes, nas
// cores da bandeira e com a faixa torta, saiu: azul fora da paleta, perto demais da identidade da Seleção oficial e o "10"
// cortado pela faixa em 60 px). Cores da paleta (src/ui/theme/tokens.json); desenhado em formas (sem fonte), nítido de 16 a
// 512 px. Gera public/icon.svg e os PNGs: node docs/arte/icone/icone.mjs (usa o Chromium do Playwright).
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const C = { noite: '#0B2A1B', noiteFaixa: '#0E3122', papel: '#EEE9DF', amarelo: '#FFC21A', tinta: '#0F2A1C' };

/** O desenho em 512×512. `scale` encolhe o conteúdo ao centro (ícone maskable: zona segura de 80%). */
export function iconSvg({ rounded = false, scale = 1 } = {}) {
  const bg = rounded
    ? `<rect width="512" height="512" rx="104" fill="${C.noite}"/>`
    : `<rect width="512" height="512" fill="${C.noite}"/>`;
  // as faixas de grama acompanham o canto arredondado (recortadas pelo próprio fundo)
  const clip = rounded ? '<clipPath id="c"><rect width="512" height="512" rx="104"/></clipPath>' : '';
  const faixas = `<g${rounded ? ' clip-path="url(#c)"' : ''}><rect width="512" height="128" fill="${C.noiteFaixa}"/><rect y="256" width="512" height="128" fill="${C.noiteFaixa}"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  ${clip}${bg}
  ${faixas}
  <g transform="translate(256 256) scale(${scale}) translate(-256 -256)">
    <g transform="translate(256 222) scale(0.86) translate(-256 -256)">
      <!-- 1: haste e bandeirinha -->
      <path fill="${C.papel}" d="M150 106h60v300h-60V178l-44 26v-56z"/>
      <!-- 0: estádio vazado -->
      <path fill="${C.papel}" fill-rule="evenodd" d="M326 106c-48 0-86 34-86 86v128c0 52 38 86 86 86s86-34 86-86V192c0-52-38-86-86-86zm0 60c-16 0-28 10-28 28v124c0 18 12 28 28 28s28-10 28-28V194c0-18-12-28-28-28z"/>
    </g>
    <!-- a braçadeira de capitão, reta, com o "C" em tinta (grande o bastante para ler em 60 px) -->
    <rect x="96" y="368" width="320" height="72" rx="12" fill="${C.amarelo}"/>
    <path d="M384 382.6A22 22 0 1 0 384 425.4" fill="none" stroke="${C.tinta}" stroke-width="13" stroke-linecap="round"/>
  </g>
</svg>
`;
}

const out = (f) => resolve(import.meta.dirname, '../../../public', f);

/** v2.99: favicon.ico com PNGs dentro (formato aceito desde o Windows Vista e por todos os navegadores atuais).
 *  Cabeçalho ICONDIR (6 bytes) + uma ICONDIRENTRY (16 bytes) por tamanho + os PNGs. Tamanho 256 vira 0 no byte. */
export function icoFromPngs(entries) {
  const head = Buffer.alloc(6 + 16 * entries.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(entries.length, 4);
  let offset = head.length;
  entries.forEach(({ size, png }, i) => {
    const e = 6 + i * 16;
    head[e] = size % 256; head[e + 1] = size % 256; head[e + 2] = 0; head[e + 3] = 0;
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(png.length, e + 8); head.writeUInt32LE(offset, e + 12);
    offset += png.length;
  });
  return Buffer.concat([head, ...entries.map((x) => x.png)]);
}

if (process.argv[1] && process.argv[1].endsWith('icone.mjs')) {
  const { chromium } = await import(process.env.PLAYWRIGHT_CORE ?? '/opt/node-tools/node_modules/playwright-core/index.mjs');
  writeFileSync(out('icon.svg'), iconSvg({ rounded: true }));
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage();
  const png = async (file, size, opts) => {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0">${iconSvg(opts).replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
    return page.screenshot({ path: file ? out(file) : undefined, clip: { x: 0, y: 0, width: size, height: size } });
  };
  // quadrado: a captura não tem transparência e o canto arredondado saía branco na aba escura
  await png('favicon-32.png', 32, {});
  await png('apple-touch-icon.png', 180, {});
  await png('icon-192.png', 192, {});
  await png('icon-512.png', 512, {});
  await png('icon-maskable-512.png', 512, { scale: 0.8 });
  // v2.99: o iOS pede este nome na raiz antes de ler o <link>; e o favicon.ico, que vários navegadores pedem sozinhos
  await png('apple-touch-icon-precomposed.png', 180, {});
  // v3.03: o mesmo ícone com nome novo, ligado no index.html (o iPhone guardava a falha do nome antigo)
  await png('apple-touch-icon-281.png', 180, {});
  const ico = [];
  for (const size of [16, 32, 48]) ico.push({ size, png: await png(null, size, {}) });
  writeFileSync(out('favicon.ico'), icoFromPngs(ico));
  await browser.close();
  console.log('ícones gerados em public/');
}
