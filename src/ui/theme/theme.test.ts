import tokens from './tokens.json';
import { contrast, themeCss } from './theme';

const THEMES = Object.keys(tokens.temas) as (keyof typeof tokens.temas)[];

describe('tokens visuais (T49, SPEC 7)', () => {
  it('contraste: fórmula da WCAG (preto no branco = 21, cor igual = 1)', () => {
    expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrast('#14213D', '#14213D')).toBe(1);
  });

  it('a paleta é a do SPEC, sem cor nova nos papéis de marca', () => {
    expect(tokens.paleta).toEqual({
      cal: '#F2F4EF', marinho: '#14213D', amarelo: '#FFC21A', verde: '#1E7B4F', vermelho: '#D62839', linha: '#C9CFC6',
    });
    for (const t of THEMES) expect(tokens.temas[t].destaque).toBe(tokens.paleta.amarelo);
    expect(tokens.temas.claro.fundo).toBe(tokens.paleta.cal);
    // pedido do usuário (T49): fundo cinza neutro nas telas com cena, para não brigar com as cores dos clubes
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(tokens.temas.escuro.fundo.slice(i, i + 2), 16)) as [number, number, number];
    expect(Math.max(r, g, b) - Math.min(r, g, b)).toBeLessThanOrEqual(12);
  });

  it('todo par de texto passa em AA (4,5:1) e todo par gráfico em 3:1, nos dois temas', () => {
    for (const t of THEMES) {
      const c = tokens.temas[t] as Record<string, string>;
      for (const [fg, bg] of tokens.contraste.texto) expect.soft(contrast(c[fg!]!, c[bg!]!), `${t}: ${fg} sobre ${bg}`).toBeGreaterThanOrEqual(4.5);
      for (const [fg, bg] of tokens.contraste.grafico) expect.soft(contrast(c[fg!]!, c[bg!]!), `${t}: ${fg} sobre ${bg}`).toBeGreaterThanOrEqual(3);
    }
  });

  it('os pares conferidos cobrem todos os papéis de cor dos temas', () => {
    const checked = new Set([...tokens.contraste.texto, ...tokens.contraste.grafico].flat().concat(tokens.contraste.decorativo));
    for (const t of THEMES) for (const role of Object.keys(tokens.temas[t])) expect(checked, `${t}.${role}`).toContain(role);
  });

  it('fontes do SPEC, sempre com reserva do sistema', () => {
    expect(tokens.fontes.titulo).toMatch(/^'Big Shoulders Display/);
    expect(tokens.fontes.texto).toMatch(/^'Atkinson Hyperlegible/);
    for (const stack of Object.values(tokens.fontes)) expect(stack.split(',').length).toBeGreaterThanOrEqual(3);
    expect(tokens.fontes.titulo).toMatch(/sans-serif$/);
    expect(tokens.fontes.texto).toMatch(/sans-serif$/);
  });

  it('texto nunca pequeno e alvo de toque confortável', () => {
    expect(parseFloat(tokens.tipo.corpo)).toBeGreaterThanOrEqual(1);
    expect(parseFloat(tokens.tipo.apoio)).toBeGreaterThanOrEqual(0.875);
    expect(parseFloat(tokens.toque.minimo)).toBeGreaterThanOrEqual(3);
  });

  it('CSS: claro por padrão, escuro pela preferência do aparelho e forçado por data-tema', () => {
    const css = themeCss();
    expect(css).toContain(`--cor-fundo: ${tokens.temas.claro.fundo}`);
    expect(css).toMatch(/@media \(prefers-color-scheme: dark\)/);
    expect(css).toContain('[data-tema="escuro"]');
    expect(css).toContain('[data-tema="claro"]');
    expect(css).toContain(`--cor-fundo: ${tokens.temas.escuro.fundo}`);
    for (const role of Object.keys(tokens.temas.claro)) expect(css).toContain(`--cor-${role.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}:`);
    expect(css).toContain('--fonte-titulo:');
    expect(css).toContain('--espaco-4:');
    expect(css).toContain(`body:has([data-tema="escuro"]) { background: ${tokens.temas.escuro.fundo}`);
  });
});
