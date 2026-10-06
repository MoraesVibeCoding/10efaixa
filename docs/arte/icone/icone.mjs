// Ícone do 10eFaixa: o "10" atravessado pela faixa de capitão, nas cores da Seleção (pedido do usuário):
// fundo amarelo, "10" azul, faixa verde com contorno e "C" brancos. Tons do uniforme da seleção em src/data/kits.json
// (selecoes.brasil); só cores, nada de escudo ou marca da CBF (CLAUDE.md). Desenhado em formas (sem fonte), nítido de 16 a 512 px.
// Gera public/icon.svg e os PNGs: node docs/arte/icone/icone.mjs (usa o Chromium do Playwright).
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const C = { amarelo: '#FFDF00', verde: '#009C3B', azul: '#002776', branco: '#FFFFFF' };

/** O desenho em 512×512. `scale` encolhe o conteúdo ao centro (ícone maskable: zona segura de 80%). */
export function iconSvg({ rounded = false, scale = 1 } = {}) {
  const bg = rounded
    ? `<rect width="512" height="512" rx="104" fill="${C.amarelo}"/>`
    : `<rect width="512" height="512" fill="${C.amarelo}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  ${bg}
  <g transform="translate(256 256) scale(${scale}) translate(-256 -256)">
    <!-- 1: haste e bandeirinha -->
    <path fill="${C.azul}" d="M150 106h60v300h-60V178l-44 26v-56z"/>
    <!-- 0: estádio vazado -->
    <path fill="${C.azul}" fill-rule="evenodd" d="M326 106c-48 0-86 34-86 86v128c0 52 38 86 86 86s86-34 86-86V192c0-52-38-86-86-86zm0 60c-16 0-28 10-28 28v124c0 18 12 28 28 28s28-10 28-28V194c0-18-12-28-28-28z"/>
    <!-- faixa de capitão verde, levemente inclinada, com contorno e "C" brancos -->
    <g transform="rotate(-8 256 262)">
      <rect x="40" y="224" width="432" height="76" rx="10" fill="${C.verde}" stroke="${C.branco}" stroke-width="10"/>
      <path d="M414 243a21 21 0 1 0 0 38" fill="none" stroke="${C.branco}" stroke-width="12" stroke-linecap="round" transform="translate(-16 0)"/>
    </g>
  </g>
</svg>
`;
}

const out = (f) => resolve(import.meta.dirname, '../../../public', f);

if (process.argv[1] && process.argv[1].endsWith('icone.mjs')) {
  const { chromium } = await import(process.env.PLAYWRIGHT_CORE ?? '/opt/node-tools/node_modules/playwright-core/index.mjs');
  writeFileSync(out('icon.svg'), iconSvg({ rounded: true }));
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? '/opt/pw-browsers/chromium' });
  const page = await browser.newPage();
  const png = async (file, size, opts) => {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0">${iconSvg(opts).replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
    await page.screenshot({ path: out(file), clip: { x: 0, y: 0, width: size, height: size } });
  };
  await png('favicon-32.png', 32, { rounded: true });
  await png('apple-touch-icon.png', 180, {});
  await png('icon-192.png', 192, {});
  await png('icon-512.png', 512, {});
  await png('icon-maskable-512.png', 512, { scale: 0.8 });
  await browser.close();
  console.log('ícones gerados em public/');
}
