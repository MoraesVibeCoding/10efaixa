import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import tokens from './theme/tokens.json';

// T49f/T49g (SPEC 7, v2.34): o vidro é exceção, tem fallback sólido e só usa tokens.
const css = readFileSync(join(__dirname, 'glass.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const blocks = (at: string) => [...css.matchAll(new RegExp(`^${at.replace(/[()]/g, '\\$&')}[^{]*\\{([\\s\\S]*?\\n\\})`, 'gm'))].map((m) => m[1]!).join('\n');
const outside = css.replace(/^@(supports|media)[^{]*\{[\s\S]*?\n\}/gm, '');

describe('superfície de vidro (T49g)', () => {
  it('fora de qualquer @supports a superfície já é sólida (fallback primeiro, sem blur)', () => {
    expect(outside).toMatch(/\.vidro\s*\{[^}]*background:\s*var\(--cor-superficie\)/);
    expect(outside).not.toContain('backdrop-filter');
  });

  it('com suporte a backdrop-filter, usa fundo, borda, blur e saturação dos tokens (com prefixo WebKit)', () => {
    const supports = blocks('@supports');
    expect(css).toMatch(/@supports\s*\(\(?backdrop-filter:\s*blur\(1px\)\)?/);
    expect(supports).toContain('background: var(--vidro-fundo)');
    expect(supports).toContain('border-color: var(--vidro-borda)');
    expect(supports).toMatch(/-webkit-backdrop-filter:\s*blur\(var\(--vidro-desfoque\)\)\s*saturate\(var\(--vidro-saturacao\)\)/);
    expect(supports).toMatch(/[^-]backdrop-filter:\s*blur\(var\(--vidro-desfoque\)\)\s*saturate\(var\(--vidro-saturacao\)\)/);
  });

  it('quem pede menos transparência volta à superfície sólida, sem blur', () => {
    const reduced = blocks('@media (prefers-reduced-transparency: reduce)');
    expect(reduced).toContain('background: var(--cor-superficie)');
    expect(reduced).toContain('backdrop-filter: none');
    expect(reduced).toContain('-webkit-backdrop-filter: none');
  });

  it('o scrim do modal vem do token do tema', () => {
    expect(outside).toMatch(/\.vidro-scrim\s*\{[^}]*background:\s*var\(--vidro-scrim\)/);
  });

  it('só tokens: nenhuma cor literal no CSS do vidro', () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/);
  });

  it('no máximo 2 camadas de vidro por tela', () => {
    const dir = join(__dirname, 'screens');
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.tsx') && !n.endsWith('.test.tsx'))) {
      const uses = (readFileSync(join(dir, f), 'utf8').match(/['"` ]vidro['"` ]/g) ?? []).length;
      expect(uses, `${f} usa ${uses} camadas de vidro`).toBeLessThanOrEqual(tokens.vidro.maxCamadas);
    }
  });
});
