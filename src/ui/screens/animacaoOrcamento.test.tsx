import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render } from '@testing-library/react';
import { CenaPintada } from './CenaPintada';
import { Decision } from './Decision';

// v2.71 (revisão pela skill web-animation-design): o que o jogador vê a cada decisão é rápido e sem rebote; os momentos raros
// seguem especiais. Orçamento por frequência: resultado pronto em até ~400 ms, toque de 100 ms, cena repetida sem fade.
const css = (f: string) => readFileSync(resolve(__dirname, f), 'utf8');
const rule = (src: string, sel: string) => {
  const i = src.lastIndexOf(`${sel} {`);
  expect(i, `regra ${sel}`).toBeGreaterThanOrEqual(0);
  return src.slice(i, src.indexOf('}', i));
};
const ms = (s: string) => [...s.matchAll(/(\d+)ms/g)].map((m) => Number(m[1]));

describe('orçamento das animações da decisão (v2.71)', () => {
  const d = css('Decision.css');

  it('resultado: veredito sem rebote e em até 200 ms; linhas e botão prontos em até ~400 ms', () => {
    const v = rule(d, '.resultado__veredito');
    expect(v).toMatch(/animation:\s*resultado-veredito 200ms ease-out/);
    expect(d).toMatch(/@keyframes resultado-veredito \{ from \{ opacity: 0; transform: scale\(1\.15\); \}/);
    const linha = rule(d, '.resultado__lista li');
    const [dur, atraso, passo] = ms(linha);
    expect(dur! + atraso! + 3 * passo!).toBeLessThanOrEqual(400);
    const [bd, ba] = ms(rule(d, '.resultado__seguir'));
    expect(bd! + ba!).toBeLessThanOrEqual(400);
  });

  it('opção: sem o pulo ao marcar; o toque afunda para 0,97 em 100 ms', () => {
    expect(d).not.toMatch(/opcao-marca/);
    expect(rule(d, '.opcao:active')).toMatch(/transform:\s*scale\(0\.97\)/);
    expect(d).toMatch(/\.opcao \{ transition:[^;]*transform 100ms ease-out/);
  });

  it('"+N" entra de 0,8 sem rebote', () => {
    expect(d).toMatch(/@keyframes novas-chega \{ from \{ opacity: 0; transform: scale\(0\.8\); \}/);
    expect(rule(d, '.jogador__novas')).toMatch(/animation:\s*novas-chega \d+ms ease-out/);
  });

  it('ritmo Rápido: sem cascata no resultado e sem a cena "respirando"', () => {
    expect(d).toMatch(/\.decisao\[data-ritmo='rapido'\] :is\([^)]*\.resultado__lista li[^)]*\) \{ animation: none; \}/);
    expect(d).toMatch(/\.decisao\[data-ritmo='rapido'\] \.cena \{ animation: none; \}/);
    const { container } = render(<Decision eventId="salario-atrasado" age={20} progress={0.3} ritmo="rapido" scene={{ src: 'c.webp', alt: 'cena' }}
      player={{ name: 'Zé', position: 'meia', clubId: 'flamengo', overall: 70, titles: [], role: 'titularRegular', monthlySalary: { amount: 1, currency: 'BRL' } }} />);
    expect(container.querySelector('.decisao')).toHaveAttribute('data-ritmo', 'rapido');
  });

  it('o botão de detalhes do topo tem área de toque de 44 px', () => {
    expect(d).toMatch(/\.jogador__detalhes::before \{[^}]*inset:\s*-8px 0/);
  });
});

describe('cena (v2.71)', () => {
  it('entra em 200 ms, "respira" com will-change e, repetida, não pisca', () => {
    const c = css('CenaPintada.css');
    expect(c).toMatch(/animation:\s*cena-entra 200ms ease-out both, cena-respira/);
    expect(c).toMatch(/will-change:\s*scale/);
    expect(c).toMatch(/\.cena\[data-repete\] \{ animation-name: none, cena-respira; \}/);
    const a = render(<CenaPintada scene="gol" cut="curto" clubId="flamengo" alt="x" />);
    a.unmount();
    const b = render(<CenaPintada scene="gol" cut="curto" clubId="flamengo" alt="x" />);
    expect(b.container.querySelector('.cena')).toHaveAttribute('data-repete');
    b.unmount();
    const c2 = render(<CenaPintada scene="casa-familia" cut="curto" clubId="flamengo" alt="x" />);
    expect(c2.container.querySelector('.cena')).not.toHaveAttribute('data-repete');
  });
});

describe('momentos raros e botões (v2.71)', () => {
  it('palco: fundo e caixa entram no mesmo tempo', () => {
    const p = css('Palco.css');
    expect(ms(rule(p, '.palco'))[0]).toBe(ms(rule(p, '.palco__caixa'))[0]);
  });

  it('os botões principais afundam ao toque (0,97 em 100 ms), só com movimento', () => {
    const b = readFileSync(resolve(__dirname, '../base.css'), 'utf8');
    for (const c of ['revelacao__comecar', 'criacao__botao--principal', 'decisao__confirmar', 'resultado__seguir', 'palco__seguir', 'resumo__continuar', 'cartao__principal', 'linha__cartao', 'abertura__botao']) {
      expect(b, c).toMatch(new RegExp(`\\.${c}[^{]*\\{[^}]*\\}`));
    }
    expect(b).toMatch(/:is\([^)]*\.resultado__seguir[^)]*\):active \{ transform: scale\(0\.97\); \}/);
    expect(b).toMatch(/:is\([^)]*\.resultado__seguir[^)]*\) \{ transition: transform 100ms ease-out/);
  });
});
