import { validateArt, type ArtFormat } from './validateArt';
import raw from './format.json';

const format = raw as ArtFormat;
const kinds = (name: string, svg: string) => validateArt(name, svg, format).map((i) => i.kind);

const g = (id: string, extra = '') => `<g id="${id}"${extra}><rect width="10" height="10" fill="#FF00FF"/></g>`;
const pose = (ids = format.categories.pose!.layers!) => `<svg viewBox="0 0 400 800">${ids
  .map((id) => g(id, format.categories.pose!.pivots!.includes(id) ? ' data-pivo="200,300"' : '')).join('')}</svg>`;
const cabelo = (fill = '#FF8000') => `<svg viewBox="0 0 400 800"><g id="cabelo-frente"><path d="M0 0" fill="${fill}"/></g></svg>`;

describe('validador de arte (T43)', () => {
  it('peças válidas passam sem problemas', () => {
    expect(validateArt('pose__correndo.svg', pose(), format)).toEqual([]);
    expect(validateArt('cabelo__black-power__frente.svg', cabelo(), format)).toEqual([]);
    expect(validateArt('cabelo__cacheado-entradas__tres-quartos.svg', cabelo('#B05800'), format)).toEqual([]);
  });

  describe('nome', () => {
    it.each([
      'Cabelo__black-power__frente.svg', // maiúscula
      'cabelo_black-power_frente.svg', // separador errado
      'cabelo__black power__frente.svg', // espaço
      'cabelo__pele-escura__frente.png', // extensão
      'chapeu__panama.svg', // categoria desconhecida
      'cabelo__black-power.svg', // peça de cabeça sem ângulo
      'cabelo__black-power__costas.svg', // ângulo inválido
      'cabelo__trança__frente.svg', // acento
    ])('recusa %s', (name) => {
      expect(kinds(name, cabelo())).toContain('nome');
    });
  });

  describe('camadas', () => {
    it('aponta camada obrigatória faltando, pelo nome', () => {
      const issues = validateArt('pose__correndo.svg', pose(format.categories.pose!.layers!.filter((l) => l !== 'tronco')), format);
      expect(issues.map((i) => i.kind)).toContain('camada');
      expect(issues.map((i) => i.message).join()).toContain('tronco');
    });

    it('aponta camadas fora de ordem', () => {
      const [a, b, ...rest] = format.categories.pose!.layers!;
      expect(kinds('pose__correndo.svg', pose([b!, a!, ...rest]))).toContain('camada');
    });

    it('aponta membro sem ponto de articulação (data-pivo)', () => {
      const svg = pose().replace(' data-pivo="200,300"', '');
      expect(kinds('pose__correndo.svg', svg)).toContain('camada');
    });

    it('cabelo precisa de cabelo-tras ou cabelo-frente', () => {
      expect(kinds('cabelo__curto__perfil.svg', '<svg><g id="cabeca"><path fill="#FF8000"/></g></svg>')).toContain('camada');
    });

    it('cenário exige slot do jogador', () => {
      const svg = `<svg>${['fundo', 'meio', 'frente'].map((id) => `<g id="${id}"><rect fill="#1E7B4F"/></g>`).join('')}</svg>`;
      expect(validateArt('cenario__vestiario.svg', svg, format).map((i) => i.message).join()).toContain('slot-jogador');
    });
  });

  describe('cores', () => {
    it.each([
      ['cor quase igual à cor-chave', '#FE00FF'],
      ['cor fora da paleta', '#123456'],
      ['nome de cor', 'red'],
      ['rgb()', 'rgb(255,0,255)'],
    ])('recusa %s', (_, fill) => {
      expect(kinds('cabelo__curto__frente.svg', cabelo(fill))).toContain('cor');
    });

    it('aceita hex curto e minúsculo equivalente (#f0f = cor-chave pele)', () => {
      expect(kinds('cabelo__curto__frente.svg', cabelo('#f0f'))).toEqual([]);
    });

    it('confere também stroke, stop-color e style inline', () => {
      expect(kinds('cabelo__curto__frente.svg', cabelo().replace('/>', ' stroke="#123456"/>'))).toContain('cor');
      expect(kinds('cabelo__curto__frente.svg', cabelo().replace('/>', ' style="fill:#123456"/>'))).toContain('cor');
    });

    it('aceita none e cores da lista fixa', () => {
      expect(kinds('cabelo__curto__frente.svg', cabelo('none'))).toEqual([]);
      const withFixed = { ...format, fixedColors: ['#87CEEB'] };
      expect(validateArt('cabelo__curto__frente.svg', cabelo('#87ceeb'), withFixed)).toEqual([]);
    });
  });

  describe('elementos proibidos', () => {
    it.each(['<image href="x.png"/>', '<script>alert(1)</script>', '<linearGradient id="g"/>', '<text>oi</text>', '<style>.a{}</style>'])(
      'recusa %s', (el) => {
        expect(kinds('cabelo__curto__frente.svg', cabelo().replace('</svg>', `${el}</svg>`))).toContain('proibido');
      },
    );
  });

  describe('peso', () => {
    it('recusa peça acima do orçamento da categoria, dizendo tamanho e limite', () => {
      const big = cabelo().replace('</svg>', `<!--${'x'.repeat(16 * 1024)}--></svg>`);
      const issues = validateArt('cabelo__curto__frente.svg', big, format);
      expect(issues.map((i) => i.kind)).toContain('peso');
      expect(issues.find((i) => i.kind === 'peso')!.message).toContain('15 KB');
    });
  });
});
