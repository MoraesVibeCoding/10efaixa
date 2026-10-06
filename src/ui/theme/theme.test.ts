import bands from '../../data/bands.json';
import tokens from './tokens.json';
import { compose, contrast, themeCss } from './theme';

const THEMES = Object.keys(tokens.temas) as (keyof typeof tokens.temas)[];

describe('tokens visuais (T49, SPEC 7)', () => {
  it('contraste: fórmula da WCAG (preto no branco = 21, cor igual = 1)', () => {
    expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrast('#14213D', '#14213D')).toBe(1);
  });

  it('a paleta é a do SPEC (v2.19): papel, marinho e verde como base', () => {
    expect(tokens.paleta).toEqual({
      papel: '#EEE9DF', marinho: '#14213D', verde: '#1E7B4F', amarelo: '#FFC21A', vermelho: '#D62839', linha: '#C9CFC6',
    });
    expect(tokens.temas.claro.fundo).toBe(tokens.paleta.papel);
    expect(tokens.temas.claro.texto).toBe(tokens.paleta.marinho);
    expect(tokens.temas.claro.destaque).toBe(tokens.paleta.verde);
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

  it('medalha do Over: uma por faixa de overall, do bronze ao diamante, com o número legível nas duas metades', () => {
    const medals = tokens.medalha as unknown as Record<string, { nome: string; clara: string; escura: string; aro: string; texto: string }>;
    expect(Object.keys(medals).filter((k) => !k.startsWith('_'))).toEqual(bands.map((b) => b.key));
    expect(medals[bands[0]!.key]!.nome).toBe('bronze');
    expect(medals[bands.at(-1)!.key]!.nome).toBe('diamante');
    for (const b of bands) {
      const m = medals[b.key]!;
      expect.soft(contrast(m.texto, m.clara), `${m.nome} clara`).toBeGreaterThanOrEqual(4.5);
      expect.soft(contrast(m.texto, m.escura), `${m.nome} escura`).toBeGreaterThanOrEqual(4.5);
    }
    expect(themeCss()).toContain('[data-medalha="diamante"]');
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
    // T50: faixas de escolha da criação; nunca abaixo dos 44 px (2,75rem) do WCAG 2.5.5.
    expect(parseFloat(tokens.toque.compacto)).toBeGreaterThanOrEqual(2.75);
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
    expect(css).toContain(`body:has([data-tema="claro"]) { background: ${tokens.temas.claro.fundo}`);
    expect(css).toContain('--forma-borda:');
  });
});

describe('vidro (T49f, SPEC 7 v2.34)', () => {
  const glass = tokens.vidro as unknown as Record<string, { cor: string; alfa: number; borda: string; bordaAlfa: number; scrim: string; scrimAlfa: number }> & { maxCamadas: number; desfoque: string; saturacao: string };
  const roles = (t: string) => tokens.temas[t as keyof typeof tokens.temas] as Record<string, string>;

  it('compose: mistura a cor com o fundo pela opacidade (#RRGGBB)', () => {
    expect(compose('#FFFFFF', 0.5, '#000000')).toBe('#808080');
    expect(compose('#123456', 1, '#FFFFFF')).toBe('#123456');
    expect(compose('#123456', 0, '#FFFFFF')).toBe('#FFFFFF');
  });

  it('texto sobre o vidro passa em AA no pior fundo (preto e branco por trás), nos dois temas', () => {
    for (const t of THEMES) {
      for (const backdrop of ['#000000', '#FFFFFF']) {
        const base = compose(glass[t]!.cor, glass[t]!.alfa, backdrop);
        for (const fg of ['texto', 'textoSuave', 'positivo', 'negativo']) expect.soft(contrast(roles(t)[fg]!, base), `${t}: ${fg} sobre vidro com ${backdrop} atrás`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('o vidro é exceção: no máximo 2 camadas por tela e blur declarado nos tokens', () => {
    expect(glass.maxCamadas).toBe(2);
    expect(parseFloat(glass.desfoque)).toBeGreaterThan(0);
    expect(parseFloat(glass.saturacao)).toBeGreaterThanOrEqual(1);
  });

  it('CSS: cada tema traz fundo, borda e scrim do vidro; borda fina e sombra suave existem', () => {
    const css = themeCss();
    for (const t of THEMES) {
      const g = glass[t]!;
      const [r, gr, b] = [1, 3, 5].map((i) => parseInt(g.cor.slice(i, i + 2), 16));
      expect(css, `${t} fundo do vidro`).toContain(`--vidro-fundo: rgb(${r} ${gr} ${b} / ${g.alfa});`);
      expect(css).toContain('--vidro-borda: rgb(');
      expect(css).toContain('--vidro-scrim: rgb(');
    }
    for (const v of ['--vidro-desfoque:', '--vidro-saturacao:', '--forma-borda-fina:', '--forma-sombra-suave:']) expect(css).toContain(v);
  });
});

describe('paleta como variável (T48 abertura)', () => {
  it('cada cor da paleta vira --paleta-*: a abertura usa o amarelo da braçadeira (marca) sobre o marinho', () => {
    const css = themeCss();
    for (const [k, v] of Object.entries(tokens.paleta)) expect(css).toContain(`--paleta-${k}: ${v};`);
  });

  it('amarelo da marca sobre o marinho passa em AA para texto grande e normal', () => {
    expect(contrast(tokens.paleta.amarelo, tokens.paleta.marinho)).toBeGreaterThanOrEqual(4.5);
  });
});
