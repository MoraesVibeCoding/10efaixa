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
  });

  it('index.html liga o ícone SVG, o PNG de reserva, o do iPhone e o manifesto', () => {
    const html = readFileSync(resolve(root, 'index.html'), 'utf8');
    expect(html).toContain('<link rel="icon" href="/icon.svg" type="image/svg+xml" />');
    expect(html).toContain('<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />');
    expect(html).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png" />');
    expect(html).toContain('<link rel="manifest" href="/manifest.webmanifest" />');
    expect(existsSync(pub('icon.svg'))).toBe(true);
    expect(pngSize('favicon-32.png')).toEqual([32, 32]);
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
