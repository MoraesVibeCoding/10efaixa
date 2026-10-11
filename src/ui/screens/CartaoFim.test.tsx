import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { simulateCareer } from '../../engine/career';
import { createPrng } from '../../engine/prng';
import { randomInput } from '../../engine/simulation';
import { cardModel } from '../../share/cardModel';
import { t } from '../../i18n';
import { MOTION } from '../motion';
import { Cartao } from './Cartao';

// v2.81 (direção "Álbum", PR 4): o fim de carreira é a contracapa do álbum, em verde-noite, com o card grande de frente e
// verso. Frente: a figurinha do auge com o Over e a idade, o veredito na faixa amarela, as metas do jogo respondidas e os
// números. Verso: a manchete, o arco da carreira, o sonho, os clubes (com a marca de ídolo), a Seleção, a estante e os 10
// atributos do auge em número (o único lugar com número de atributo). O card vira uma vez sozinho; depois, "Toque para virar".
const r = simulateCareer(randomInput(createPrng(3)), 3);
const m = cardModel(r, '10F-7K3Q-9M2X');
const show = () => render(<Cartao result={r} code="10F-7K3Q-9M2X" onRestart={() => {}} />);
const frente = () => document.querySelector('.fim__frente') as HTMLElement;
const verso = () => document.querySelector('.fim__verso') as HTMLElement;
const virar = () => screen.getByRole('button', { name: t('ui.fim.virar') });
const css = readFileSync(resolve(__dirname, 'Cartao.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.useRealTimers(); });

describe('card de fim de carreira (v2.81)', () => {
  it('a contracapa: verde-noite, com o topo "Carreira completa"', () => {
    show();
    expect(screen.getByRole('main')).toHaveClass('cartao--contracapa');
    expect(document.querySelector('.cartao__topo')).toHaveTextContent(t('ui.fim.topo'));
    expect(css).toMatch(/\.cartao--contracapa \{[^}]*background:[^;]*var\(--paleta-noite\)/);
  });

  it('frente: o auge com a idade, o veredito, as metas respondidas e os números', () => {
    show();
    expect(frente()).toHaveTextContent(t('ui.fim.aos', { idade: m.auge.idade }));
    expect(frente().querySelector('.fim__veredito')).toHaveTextContent(m.veredito);
    const metas = within(frente()).getByRole('list', { name: t('ui.fim.metas.titulo') });
    const [dez, faixa] = within(metas).getAllByRole('listitem');
    expect(dez).toHaveTextContent(t(m.metas.dez ? 'ui.fim.metas.dez' : 'ui.fim.metas.semDez'));
    expect(dez).toHaveAttribute('data-feita', String(m.metas.dez));
    expect(faixa).toHaveTextContent(t(m.metas.faixa ? 'ui.fim.metas.faixa' : 'ui.fim.metas.semFaixa'));
    expect(frente()).toHaveTextContent(m.numeros[0]!.valor);
  });

  it('verso: manchete, arco, clubes, estante e os 10 atributos do auge em número', () => {
    show();
    fireEvent.click(virar());
    expect(verso()).not.toHaveAttribute('aria-hidden');
    expect(verso()).toHaveTextContent(m.manchete);
    expect(verso()).toHaveTextContent(m.arco);
    const chips = within(verso()).getByRole('list', { name: t('ui.fim.verso.auge') });
    expect(within(chips).getAllByRole('listitem')).toHaveLength(10);
    expect(chips).toHaveTextContent(String(m.radar[0]!.valor));
    expect(verso()).toHaveTextContent(t('ui.fim.verso.codigo', { codigo: m.codigo }));
  });

  it('com movimento, o card vira uma vez sozinho; depois só no toque', () => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q }));
    show();
    expect(document.querySelector('.fim')).toHaveAttribute('data-lado', 'frente');
    act(() => { vi.advanceTimersByTime(MOTION.virarFimMs); });
    expect(document.querySelector('.fim')).toHaveAttribute('data-lado', 'verso');
    fireEvent.click(virar());
    act(() => { vi.advanceTimersByTime(MOTION.virarFimMs * 2); });
    expect(document.querySelector('.fim')).toHaveAttribute('data-lado', 'frente');
  });

  it('sem movimento, não vira sozinho', () => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q }));
    show();
    act(() => { vi.advanceTimersByTime(MOTION.virarFimMs * 2); });
    expect(document.querySelector('.fim')).toHaveAttribute('data-lado', 'frente');
  });

  it('a imagem de compartilhar acompanha o lado à vista (frente: história; verso: números)', () => {
    show();
    const canvas = document.querySelector('canvas')!;
    expect(canvas).toHaveAttribute('data-versao', 'narrativa');
    fireEvent.click(virar());
    expect(canvas).toHaveAttribute('data-versao', 'estatistica');
  });

  it('CSS: o card vira em 3D; a faixa do veredito é reta (nada inclinado)', () => {
    expect(css).toMatch(/\.fim\[data-lado='verso'\] \.fim__card \{[^}]*transform:\s*rotateY\(180deg\)/);
    expect(css).not.toMatch(/rotate\(|rotate:/);
  });
});

describe('o motivo na frente do card (v2.85)', () => {
  it('a frente diz por que e com que idade ele parou', () => {
    show();
    expect(frente().querySelector('.fim__motivo')).toHaveTextContent(m.motivo);
  });
});

// Regressão (relato do usuário em 2026-10-11: "o botão virar no card final não está virando"): a animação de colar do card
// ficava com `both` e prendia `transform: none` depois de acabar, por cima do rotateY do verso. A animação de entrada só
// pode valer antes e durante (backwards), nunca depois.
describe('o card vira de verdade (regressão)', () => {
  it('a animação de entrada do card não prende o transform depois de acabar', () => {
    const regra = css.match(/\n\.fim__card \{[^}]*\}/)![0];
    expect(regra).toMatch(/animation:[^;]*fim-cola/);
    expect(regra).not.toMatch(/animation:[^;]*\b(both|forwards)\b/);
    expect(css).toMatch(/\.fim\[data-lado='verso'\] \.fim__card \{[^}]*rotateY\(180deg\)/);
  });
});
