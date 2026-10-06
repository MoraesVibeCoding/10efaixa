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

/** Mistura `fg` com opacidade `alpha` sobre `bg` (cores #RRGGBB): a cor que o olho vê através do vidro. */
export function compose(fg: string, alpha: number, bg: string): string {
  const mix = (shift: number) => Math.round(((parseInt(fg.slice(1), 16) >> shift) & 255) * alpha + ((parseInt(bg.slice(1), 16) >> shift) & 255) * (1 - alpha));
  return '#' + [16, 8, 0].map((s) => mix(s).toString(16).padStart(2, '0')).join('').toUpperCase();
}

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
const vars = (prefix: string, o: Record<string, string>) =>
  Object.entries(o).filter(([k]) => !k.startsWith('_')).map(([k, v]) => `--${prefix}-${kebab(k)}: ${v};`).join(' ');
const colors = (t: Theme) => vars('cor', t);
type Glass = { cor: string; alfa: number; borda: string; bordaAlfa: number; scrim: string; scrimAlfa: number };
const rgb = (hex: string, alpha: number) => `rgb(${[16, 8, 0].map((s) => (parseInt(hex.slice(1), 16) >> s) & 255).join(' ')} / ${alpha})`;
const glassVars = (g: Glass) => `--vidro-fundo: ${rgb(g.cor, g.alfa)}; --vidro-borda: ${rgb(g.borda, g.bordaAlfa)}; --vidro-scrim: ${rgb(g.scrim, g.scrimAlfa)};`;

/** Claro por padrão; escuro pela preferência do aparelho; `data-tema` força um dos dois (telas com cena usam "escuro"). */
export function themeCss(): string {
  const { claro, escuro } = tokens.temas;
  const fixed = [vars('fonte', tokens.fontes), vars('tipo', tokens.tipo), vars('espaco', tokens.espaco), vars('toque', tokens.toque), vars('forma', tokens.forma), vars('paleta', tokens.paleta), `--vidro-desfoque: ${tokens.vidro.desfoque}; --vidro-saturacao: ${tokens.vidro.saturacao};`].join(' ');
  const medals = Object.entries(tokens.medalha).filter(([k]) => !k.startsWith('_')).map(([, m]) => m as { nome: string; clara: string; escura: string; aro: string; texto: string });
  return [
    `:root { ${fixed} ${colors(claro)} ${glassVars(tokens.vidro.claro)} color-scheme: light; }`,
    `@media (prefers-color-scheme: dark) { :root { ${colors(escuro)} ${glassVars(tokens.vidro.escuro)} color-scheme: dark; } }`,
    `[data-tema="claro"] { ${colors(claro)} ${glassVars(tokens.vidro.claro)} color-scheme: light; }`,
    `[data-tema="escuro"] { ${colors(escuro)} ${glassVars(tokens.vidro.escuro)} color-scheme: dark; }`,
    // a página inteira acompanha a tela escura com cena, para não sobrar moldura clara em volta dela
    `body:has([data-tema="escuro"]) { background: ${escuro.fundo}; }`,
    `body:has([data-tema="claro"]) { background: ${claro.fundo}; }`,
    // moeda do Over: as cores vêm da medalha da faixa de overall, iguais nos dois temas
    ...medals.map((m) => `[data-medalha="${m.nome}"] { --medalha-clara: ${m.clara}; --medalha-escura: ${m.escura}; --medalha-aro: ${m.aro}; --medalha-texto: ${m.texto}; }`),
  ].join('\n');
}
