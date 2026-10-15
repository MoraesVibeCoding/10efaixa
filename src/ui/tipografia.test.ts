import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import tokens from './theme/tokens.json';

// v2.73 (revisão /impeccable, tipografia, aprovada pelo usuário em 2026-10-09): nenhum texto da interface abaixo de 14 px,
// um só botão principal (verde, Oswald em caixa alta, pílula) e a história da decisão em 1rem no celular.
const dir = resolve(__dirname, 'screens');
const files = [resolve(__dirname, 'base.css'), ...readdirSync(dir).filter((f) => f.endsWith('.css')).map((f) => resolve(dir, f))];
const css = Object.fromEntries(files.map((f) => [f.split('/').pop()!, readFileSync(f, 'utf8')]));

/** Todas as regras de nível de topo com exatamente esse seletor, juntas (a última declaração vence ao ler o texto). */
function rule(file: string, sel: string): string {
  const src = css[file]!;
  const parts: string[] = [];
  for (let i = src.indexOf(`\n${sel} {`); i >= 0; i = src.indexOf(`\n${sel} {`, i + 1)) parts.push(src.slice(i, src.indexOf('}', i)));
  expect(parts.length, `${file} ${sel}`).toBeGreaterThan(0);
  return parts.join('\n');
}

describe('tipografia (v2.73)', () => {
  it('nenhum font-size abaixo de 14 px (rem ou px)', () => {
    const small: string[] = [];
    for (const [f, src] of Object.entries(css)) {
      for (const m of src.matchAll(/font-size:\s*([\d.]+)(rem|px)\b/g)) {
        const px = Number(m[1]) * (m[2] === 'rem' ? 16 : 1);
        if (px < 14) small.push(`${f}: ${m[0]}`);
      }
    }
    expect(small).toEqual([]);
  });

  it('tamanhos em em relativos a título grande têm piso de 14 px', () => {
    expect(rule('Carimbo.css', '.carimbo__sub')).toMatch(/font-size:\s*max\(0\.875rem,/);
  });

  it.each([
    ['Decision.css', '.decisao__confirmar'], ['ResumoTemporada.css', '.resumo__continuar'],
    ['LinhaDoTempo.css', '.linha__cartao'], ['Revelacao.css', '.revelacao__comecar'], ['Palco.css', '.palco__seguir'], ['Creation.css', '.criacao__botao--principal'],
  ])('botão principal único: %s %s', (f, sel) => {
    const r = rule(f, sel);
    expect(r).toMatch(/background:\s*var\(--cor-destaque\)/);
    expect(r).toMatch(/color:\s*var\(--cor-sobre-destaque\)/);
    expect(r).toMatch(/font-family:\s*var\(--fonte-titulo\)/);
    expect(r).toMatch(/text-transform:\s*uppercase/);
    expect(r).toMatch(/border-radius:\s*999px/);
  });

  it('história da decisão no piso de 14 px no celular, com linha arejada (v3.09)', () => {
    // pedido do usuário (2026-10-10): 1rem; v3.09 (2026-10-15, "diminuir ainda mais ... e aumentar o tamanho das imagens"):
    // desce ao piso de 14 px (v2.73), e a foto da cena, que ocupa a sobra de altura, cresce
    expect(css['Decision.css']).toMatch(/\.decisao__historia \{ font-size: 0\.875rem; line-height: 1\.45;/);
  });

  it('história da decisão em 1rem no computador (v3.09; era 1.125rem)', () => {
    expect(tokens.tipo.historia).toBe('1rem');
  });

  it('o comentário do técnico sem a barra lateral colorida', () => {
    expect(rule('ResumoTemporada.css', '.resumo__tecnico')).not.toMatch(/border-inline-start|border-left/);
  });
});
