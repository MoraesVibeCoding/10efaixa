import bands from '../../data/bands.json';
import tokens from './tokens.json';
import { compose, contrast, themeCss } from './theme';

const THEMES = Object.keys(tokens.temas) as (keyof typeof tokens.temas)[];

describe('tokens visuais (T49, SPEC 7)', () => {
  it('contraste: fórmula da WCAG (preto no branco = 21, cor igual = 1)', () => {
    expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrast('#14213D', '#14213D')).toBe(1);
  });

  // v2.81 (direção "Álbum", aprovada pelo usuário em 2026-10-10): papel creme de volta ao fundo, tinta verde quase preta
  // e nenhum azul; capa e contracapa em verde-noite, selos em verde-escuro, moldura dos cards grandes em ouro
  it('a paleta é a do SPEC (v2.81, Álbum): papel, tinta e gramado como base, verde-noite na capa; sem marinho nem menta', () => {
    expect(tokens.paleta).toEqual({
      papel: '#EEE9DF', tinta: '#0F2A1C', gramado: '#006731', verdeEscuro: '#0B4A2A', noite: '#0B2A1B', noiteFaixa: '#0E3122',
      amarelo: '#FFC21A', ouro: '#DA942C', ouroMoldura: '#B08D57', vermelho: '#D62839', linha: '#C9CFC6',
    });
    expect(tokens.temas.claro.fundo).toBe(tokens.paleta.papel);
    expect(tokens.temas.claro.texto).toBe(tokens.paleta.tinta);
    expect(tokens.temas.claro.destaque).toBe(tokens.paleta.gramado);
    expect(tokens.vidro.claro.scrim).toBe(tokens.paleta.noite);
  });

  // v2.81: o azul só aparece na bandeira e nos uniformes (dados de clube), nunca na interface. As medalhas são metais de
  // raridade (platina e diamante puxam para o frio) e ficam de fora.
  it('nenhuma cor azul na paleta, nos temas e no vidro', () => {
    const hue = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
      const max = Math.max(r, g, b); const min = Math.min(r, g, b); const d = max - min;
      if (d === 0) return { h: 0, s: 0 };
      const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      return { h: (h * 60 + 360) % 360, s: d / (1 - Math.abs(max + min - 1)) };
    };
    const hexes: [string, string][] = [];
    const walk = (o: unknown, path: string) => {
      if (typeof o === 'string' && /^#[0-9A-Fa-f]{6}$/.test(o)) hexes.push([path, o]);
      else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, `${path}.${k}`);
    };
    walk({ paleta: tokens.paleta, temas: tokens.temas, vidro: tokens.vidro }, 'tokens');
    for (const [path, hex] of hexes) {
      const { h, s } = hue(hex);
      expect.soft(s > 0.2 && h >= 190 && h <= 260, `${path} ${hex} é azul`).toBe(false);
    }
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

  it('fontes do SPEC (v2.46 Oswald; v2.76 Archivo no texto), sempre com reserva do sistema', () => {
    expect(tokens.fontes.titulo).toMatch(/^'Oswald Variable'/);
    expect(tokens.fontes.texto).toMatch(/^'Archivo Variable'/);
    for (const stack of Object.values(tokens.fontes)) expect(stack.split(',').length).toBeGreaterThanOrEqual(3);
    expect(tokens.fontes.titulo).toMatch(/sans-serif$/);
    expect(tokens.fontes.texto).toMatch(/sans-serif$/);
  });

  it('texto nunca pequeno e alvo de toque confortável', () => {
    expect(parseFloat(tokens.tipo.corpo)).toBeGreaterThanOrEqual(1);
    expect(parseFloat(tokens.tipo.apoio)).toBeGreaterThanOrEqual(0.875);
    // v2.76: o piso de 14 px (v2.73) vira degrau da escala, para o DESIGN.md e o CSS falarem a mesma língua
    expect((tokens.tipo as Record<string, string>).miudo).toBe('0.875rem');
    expect(themeCss()).toContain('--tipo-miudo: 0.875rem');
    expect(parseFloat(tokens.toque.minimo)).toBeGreaterThanOrEqual(3);
    // T50: faixas de escolha da criação; nunca abaixo dos 44 px (2,75rem) do WCAG 2.5.5.
    expect(parseFloat(tokens.toque.compacto)).toBeGreaterThanOrEqual(2.75);
  });

  // v2.75 (tema escuro fora da v1, decisão do usuário): o aparelho no modo escuro não escurece mais a criação, o ritmo e a
  // revelação, que destoavam da carreira toda clara. Só a abertura força o escuro da marca por data-tema.
  it('CSS: sempre claro (o modo escuro do aparelho não muda o tema); escuro só forçado por data-tema', () => {
    const css = themeCss();
    expect(css).toContain(`--cor-fundo: ${tokens.temas.claro.fundo}`);
    expect(css).not.toMatch(/prefers-color-scheme/);
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
  it('cada cor da paleta vira --paleta-*: a capa usa o amarelo da braçadeira (marca) sobre o verde-noite (v2.81)', () => {
    const css = themeCss();
    for (const [k, v] of Object.entries(tokens.paleta)) expect(css).toContain(`--paleta-${k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}: ${v};`);
  });

  it('na capa e na contracapa: amarelo e papel sobre o verde-noite, branco sobre o verde-escuro dos selos, em AA', () => {
    expect(contrast(tokens.paleta.amarelo, tokens.paleta.noite)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens.paleta.papel, tokens.paleta.noite)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens.paleta.papel, tokens.paleta.noiteFaixa)).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#FFFFFF', tokens.paleta.verdeEscuro)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens.paleta.tinta, tokens.paleta.amarelo)).toBeGreaterThanOrEqual(4.5);
  });
});
