import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render } from '@testing-library/react';
import { CenaPintada } from './CenaPintada';

// v2.71 (revisão pela skill web-animation-design): o que o jogador vê a cada decisão é rápido e sem rebote; os momentos raros
// seguem especiais. Orçamento por frequência: resultado pronto em até ~400 ms, toque de 100 ms, cena repetida sem fade.
const css = (f: string) => readFileSync(resolve(__dirname, f), 'utf8');
const rule = (src: string, sel: string) => {
  const i = src.lastIndexOf(`\n${sel} {`);
  expect(i, `regra ${sel}`).toBeGreaterThanOrEqual(0);
  return src.slice(i, src.indexOf('}', i));
};
const ms = (s: string) => [...s.matchAll(/(\d+)ms/g)].map((m) => Number(m[1]));

describe('orçamento das animações da decisão (v2.71)', () => {
  const d = css('Decision.css');

  // v2.88: o resultado não tem mais "Seguir"; a dica do toque duplo entra no lugar dele, no mesmo orçamento
  it('resultado: veredito sem rebote e em até 200 ms; linhas e dica prontas em até ~400 ms', () => {
    const v = rule(d, '.resultado__veredito');
    expect(v).toMatch(/animation:\s*resultado-veredito 200ms ease-out/);
    expect(d).toMatch(/@keyframes resultado-veredito \{ from \{ opacity: 0; transform: scale\(1\.15\); \}/);
    const linha = rule(d, '.resultado__lista li');
    const [dur, atraso, passo] = ms(linha);
    expect(dur! + atraso! + 3 * passo!).toBeLessThanOrEqual(400);
    const [bd, ba] = ms(rule(d, '.resultado__dica'));
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

  // v3.06: o Rápido tem as mesmas animações dos outros ritmos (mesma tela)
  it('nenhuma regra de CSS só para o ritmo Rápido', () => {
    expect(d).not.toContain("data-ritmo='rapido'");
  });

  it('a etiqueta "Carreira ›" do card tem área de toque de 44 px (v2.81)', () => {
    expect(d).toMatch(/\.card-jogador__carreira::before \{[^}]*inset:\s*-8px -4px/);
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
    // v2.88: o "Seguir" do resultado saiu; o do palco segue
    for (const c of ['revelacao__comecar', 'criacao__botao--principal', 'decisao__confirmar', 'palco__seguir', 'resumo__continuar', 'cartao__principal', 'linha__cartao', 'abertura__botao']) {
      expect(b, c).toMatch(new RegExp(`\\.${c}[^{]*\\{[^}]*\\}`));
    }
    expect(b).toMatch(/:is\([^)]*\.palco__seguir[^)]*\):active \{ transform: scale\(0\.97\); \}/);
    expect(b).toMatch(/:is\([^)]*\.palco__seguir[^)]*\) \{ transition: transform 100ms ease-out/);
  });
});
