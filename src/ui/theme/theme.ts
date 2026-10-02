import tokens from './tokens.json';

// T49 (SPEC 7): os tokens viram variáveis CSS; o contraste de cada par usado em tela é conferido por teste.
type Theme = Record<string, string>;

const channel = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const luminance = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel(((n >> 16) & 255) / 255) + 0.7152 * channel(((n >> 8) & 255) / 255) + 0.0722 * channel((n & 255) / 255);
};

/** Razão de contraste da WCAG entre duas cores #RRGGBB (1 a 21). */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
const vars = (prefix: string, o: Record<string, string>) =>
  Object.entries(o).filter(([k]) => !k.startsWith('_')).map(([k, v]) => `--${prefix}-${kebab(k)}: ${v};`).join(' ');
const colors = (t: Theme) => vars('cor', t);

/** Claro por padrão; escuro pela preferência do aparelho; `data-tema` força um dos dois (telas com cena usam "escuro"). */
export function themeCss(): string {
  const { claro, escuro } = tokens.temas;
  const fixed = [vars('fonte', tokens.fontes), vars('tipo', tokens.tipo), vars('espaco', tokens.espaco), vars('toque', tokens.toque)].join(' ');
  return [
    `:root { ${fixed} ${colors(claro)} color-scheme: light; }`,
    `@media (prefers-color-scheme: dark) { :root { ${colors(escuro)} color-scheme: dark; } }`,
    `[data-tema="claro"] { ${colors(claro)} color-scheme: light; }`,
    `[data-tema="escuro"] { ${colors(escuro)} color-scheme: dark; }`,
  ].join('\n');
}
