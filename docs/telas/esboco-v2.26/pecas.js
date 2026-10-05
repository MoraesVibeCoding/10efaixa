// Peças comuns dos esboços: emblemas (versão completa e simplificada) e a troca de cor da arte.
const EMBLEMAS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<defs>
 <clipPath id="clip-escudo"><path d="M12 8h76v44c0 22-17 36-38 44C29 88 12 74 12 52z"/></clipPath>
</defs>
<!-- Flamengo: chama rubro-negra num escudo (conceito do usuário) -->
<symbol id="fla" viewBox="0 0 100 100">
 <path d="M12 8h76v44c0 22-17 36-38 44C29 88 12 74 12 52z" fill="#111"/>
 <g clip-path="url(#clip-escudo)" fill="#C8102E">
  <path d="M0 74 100 50v8L0 82z"/><path d="M0 88 100 64v8L0 96z"/>
 </g>
 <path d="M50 16c4 12 16 18 14 34-1 10-8 16-14 18-8-2-15-9-14-20 1-9 7-12 8-20 3 5 2 10 6 12 2-8-3-16 0-24z" fill="#C8102E"/>
 <path d="M50 38c3 6 8 9 7 17-1 5-4 8-7 9-4-1-7-5-7-10 0-5 4-7 5-11 1 2 1 4 3 5 0-3-2-6-1-10z" fill="#F3EEDF"/>
 <path d="M12 8h76v44c0 22-17 36-38 44C29 88 12 74 12 52z" fill="none" stroke="#C8102E" stroke-width="6"/>
</symbol>
<symbol id="fla-s" viewBox="0 0 100 100">
 <path d="M12 8h76v44c0 22-17 36-38 44C29 88 12 74 12 52z" fill="#111" stroke="#C8102E" stroke-width="9"/>
 <path d="M50 18c5 13 17 19 15 35-1 11-8 17-15 19-9-2-16-10-15-21 1-10 8-13 9-21 3 5 2 10 6 12 2-8-3-16 0-24z" fill="#C8102E"/>
</symbol>
<!-- Santos: vela e ondas de cidade portuária, num círculo -->
<symbol id="san" viewBox="0 0 100 100">
 <circle cx="50" cy="50" r="46" fill="#111"/><circle cx="50" cy="50" r="39" fill="none" stroke="#F8F5EE" stroke-width="3"/>
 <path d="M52 16 52 66 26 66z" fill="#F8F5EE"/><path d="M57 26 57 66 74 66z" fill="#F8F5EE"/>
 <path d="M20 72c10-6 20 6 30 0s20-6 30 0" fill="none" stroke="#B9BEC8" stroke-width="5" stroke-linecap="round"/>
 <path d="M24 82c9-5 17 5 26 0s17-5 26 0" fill="none" stroke="#F8F5EE" stroke-width="4" stroke-linecap="round"/>
</symbol>
<symbol id="san-s" viewBox="0 0 100 100">
 <circle cx="50" cy="50" r="45" fill="#111" stroke="#F8F5EE" stroke-width="6"/>
 <path d="M54 18 54 70 24 70z" fill="#F8F5EE"/><path d="M60 30 60 70 78 70z" fill="#F8F5EE"/>
</symbol>
<!-- Palmeiras: palmeira num hexágono -->
<symbol id="pal" viewBox="0 0 100 100">
 <path d="M50 3 93 27v46L50 97 7 73V27z" fill="#0B5D35"/><path d="M50 11 86 31v38L50 89 14 69V31z" fill="none" stroke="#F3EEDF" stroke-width="3"/>
 <circle cx="50" cy="30" r="12" fill="#F3EEDF" opacity=".9"/>
 <path d="M48 36h4l2 46h-8z" fill="#F3EEDF"/>
 <path d="M50 38C40 26 28 28 20 36c10-2 20 0 30 4zM50 38c10-12 22-10 30-2-10-2-20 0-30 4zM50 38c-8-4-18 0-24 10 8-6 16-8 24-6zM50 38c8-4 18 0 24 10-8-6-16-8-24-6zM50 38c-2-10 0-18 0-24 2 8 3 16 0 24z" fill="#F3EEDF"/>
 <path d="M14 76c14-8 30-10 36-8 8-2 22 0 36 8v-4c-14-8-28-10-36-8-8-2-22 0-36 8z" fill="#3FA06A"/>
</symbol>
<symbol id="pal-s" viewBox="0 0 100 100">
 <path d="M50 4 92 28v44L50 96 8 72V28z" fill="#0B5D35" stroke="#F3EEDF" stroke-width="6"/>
 <path d="M46 40h8l3 42H43z" fill="#F3EEDF"/>
 <path d="M50 42C40 26 26 28 18 40c12-4 22-2 32 4zM50 42c10-16 24-14 32-2-12-4-22-2-32 4zM50 42c-2-12 0-20 0-26 3 9 3 18 0 26z" fill="#F3EEDF"/>
</symbol>
<!-- Coritiba: araucária num quadrado arredondado (símbolo a conferir) -->
<symbol id="cfc" viewBox="0 0 100 100">
 <rect x="5" y="5" width="90" height="90" rx="20" fill="#0B5D35"/><rect x="13" y="13" width="74" height="74" rx="14" fill="#F3EEDF"/>
 <path d="M13 70c14-10 26-12 37-6 12-6 24-4 37 6v17H13z" fill="#3FA06A"/>
 <rect x="47" y="30" width="6" height="46" fill="#0B5D35"/>
 <path d="M28 40c4-6 14-6 20-2H28zM52 38c6-4 16-4 20 2H52zM24 52c4-6 16-6 24-2H24zM52 50c8-4 20-4 24 2H52zM36 30c4-6 12-8 14-2 2-6 10-4 14 2z" fill="#0B5D35" stroke="#0B5D35" stroke-width="5" stroke-linejoin="round"/>
</symbol>
<symbol id="cfc-s" viewBox="0 0 100 100">
 <rect x="6" y="6" width="88" height="88" rx="20" fill="#0B5D35"/>
 <rect x="46" y="34" width="8" height="48" fill="#F3EEDF"/>
 <path d="M22 50c6-10 22-10 28-4H22zM50 46c6-6 22-6 28 4H50zM32 34c6-10 30-10 36 0z" fill="#F3EEDF" stroke="#F3EEDF" stroke-width="7" stroke-linejoin="round"/>
</symbol>
<!-- Escudo genérico melhorado (clube sem emblema próprio): formato, faixas nas cores e a sigla -->
<symbol id="bah-s" viewBox="0 0 100 100">
 <clipPath id="clip-frances"><path d="M12 8h76v50c0 18-14 30-38 38C26 88 12 76 12 58z"/></clipPath>
 <g clip-path="url(#clip-frances)"><rect width="100" height="100" fill="#F8F5EE"/><rect x="12" width="25" height="100" fill="#0033A0"/><rect x="63" width="25" height="100" fill="#C8102E"/></g>
 <path d="M12 8h76v50c0 18-14 30-38 38C26 88 12 76 12 58z" fill="none" stroke="#14213D" stroke-width="7"/>
 </symbol>
</svg>`;
document.body.insertAdjacentHTML('afterbegin', EMBLEMAS);

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
async function recortar(src, camisa, chave = true) {
  const img = new Image(); img.src = src; await img.decode();
  const c = document.createElement('canvas'); c.width = img.naturalWidth / 2; c.height = img.naturalHeight / 2;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0, c.width, c.height);
  const d = x.getImageData(0, 0, c.width, c.height); const p = d.data; const [cr, cg, cb] = hex(camisa);
  for (let i = 0; i < p.length; i += 4) {
    const r = p[i], g = p[i + 1], b = p[i + 2]; const verde = g - Math.max(r, b);
    if (chave && verde > 25) { p[i + 3] = Math.round(255 * Math.max(0, 1 - (verde - 25) / 50)); p[i + 1] = Math.max(r, b); continue; }
    if (Math.min(r, b) - g > 50) { const k = Math.min(1.15, ((r + b) / 2) / 201); p[i] = Math.min(255, cr * k); p[i + 1] = Math.min(255, cg * k); p[i + 2] = Math.min(255, cb * k); }
  }
  x.putImageData(d, 0, 0); return c.toDataURL('image/png');
}
const R = 'file:///home/user/10efaixa';
window.pronto = Promise.all([
  ...[...document.querySelectorAll('img[data-retrato]')].map(async (im) => { im.src = await recortar(`${R}/docs/arte/retratos/cacheado-grande/imagem.jpeg`, im.dataset.retrato); }),
  ...[...document.querySelectorAll('img[data-cena]')].map(async (im) => { im.src = await recortar(`${R}/docs/arte/cenas/${im.dataset.cena}/cacheado-grande/imagem.jpeg`, '#C8102E', false); }),
]);
