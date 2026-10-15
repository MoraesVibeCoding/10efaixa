import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Ícone do site e manifesto para instalar como app (pedido do usuário antes do link de teste; parte da T61).
// Requisitos conferidos na MDN (Making PWAs installable): name/short_name, ícones de 192 e 512, start_url e display.
const root = resolve(__dirname, '..');
const pub = (f: string) => resolve(root, 'public', f.replace(/^\//, ''));
const manifest = JSON.parse(readFileSync(pub('manifest.webmanifest'), 'utf8')) as {
  name: string; short_name: string; start_url: string; display: string; theme_color: string; background_color: string;
  icons: { src: string; sizes: string; type: string; purpose?: string }[];
};
const pngSize = (f: string) => { const b = readFileSync(pub(f)); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };

describe('ícone e manifesto do app', () => {
  it('manifesto instalável: nome, início, standalone e ícones de 192 e 512 (mais um maskable)', () => {
    expect(manifest.name).toBe('10eFaixa');
    expect(manifest.short_name).toBe('10eFaixa');
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
    const sizes = manifest.icons.map((i) => i.sizes);
    expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']));
    expect(manifest.icons.some((i) => i.purpose === 'maskable')).toBe(true);
  });

  it('todo ícone PNG existe e tem o tamanho que declara', () => {
    for (const i of manifest.icons) {
      expect(existsSync(pub(i.src)), i.src).toBe(true);
      expect(pngSize(i.src).join('x'), i.src).toBe(i.sizes);
    }
    expect(pngSize('apple-touch-icon.png')).toEqual([180, 180]);
    // v3.02: sem canal alfa (tipo de cor 2 no cabeçalho PNG): com transparência o iOS preenche de preto
    expect(readFileSync(pub('apple-touch-icon.png'))[25]).toBe(2);
  });

  // v2.99: os links levam ?v=<versão do ícone> para furar o cache (o iPhone guardava o ícone antigo, da T61).
  it('index.html liga o ícone SVG, o PNG de reserva, o do iPhone e o manifesto, versionados', () => {
    const html = readFileSync(resolve(root, 'index.html'), 'utf8');
    expect(html).toContain('<link rel="icon" href="/icon.svg?v=281" type="image/svg+xml" />');
    expect(html).toContain('<link rel="icon" href="/favicon-32.png?v=281" sizes="32x32" type="image/png" />');
    // v3.02: o iOS lê esta tag exatamente assim (PNG 180, sem parâmetro na URL); o ?v= da v2.99 saiu daqui
    expect(html).toContain('<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />');
    expect(html).toContain('<link rel="manifest" href="/manifest.webmanifest?v=281" />');
    expect(existsSync(pub('icon.svg'))).toBe(true);
    expect(pngSize('favicon-32.png')).toEqual([32, 32]);
  });

  // v2.99: o iOS e vários navegadores pedem esses dois na raiz antes de ler o <link>; sem eles, ícone genérico.
  it('raiz tem favicon.ico (16, 32 e 48 em PNG) e apple-touch-icon-precomposed.png de 180', () => {
    const ico = readFileSync(pub('favicon.ico'));
    expect([...ico.subarray(0, 4)]).toEqual([0, 0, 1, 0]);
    const n = ico.readUInt16LE(4);
    const sizes = Array.from({ length: n }, (_, i) => ico[6 + i * 16]);
    expect(sizes).toEqual([16, 32, 48]);
    const first = ico.readUInt32LE(6 + 12);
    expect(ico.subarray(first + 1, first + 4).toString('ascii')).toBe('PNG');
    expect(pngSize('apple-touch-icon-precomposed.png')).toEqual([180, 180]);
  });
});

// v2.81 (direção "Álbum", proposta A escolhida pelo usuário em 2026-10-10): o ícone vira a "noite de estádio": fundo
// verde-noite com as faixas de grama, o "10" em papel e a braçadeira amarela reta com o "C". Sem azul e nada inclinado.
describe('ícone do Álbum (v2.81)', () => {
  const svg = readFileSync(pub('icon.svg'), 'utf8');
  it('verde-noite, "10" em papel e braçadeira amarela; sem as cores da bandeira e sem rotação', () => {
    expect(svg).toContain('fill="#0B2A1B"');
    expect(svg).toContain('fill="#EEE9DF"');
    expect(svg).toContain('fill="#FFC21A"');
    for (const c of ['#002776', '#FFDF00', '#009C3B']) expect(svg).not.toContain(c);
    expect(svg).not.toMatch(/rotate/);
  });
  it('o app abre no verde-noite (cor de fundo do manifesto)', () => {
    expect(manifest.background_color).toBe('#0B2A1B');
  });
});
