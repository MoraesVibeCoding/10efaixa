import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { t } from '../../i18n';
import { Abertura } from './Abertura';

// v2.81 (direção "Álbum", proposta A aprovada pelo usuário em 2026-10-10): a abertura é a capa do álbum. Verde-noite com
// faixas de grama, a marca, a arte do túnel como figurinha da capa (moldura de ouro, selo "Álbum da carreira", o "10"
// nas costas), "Nova carreira" em amarelo e o "Desafio do dia" pequeno. Com carreira salva, o card pequeno do jogador
// e "Continuar" primeiro. Animação: luzes, a figurinha cola, o 10 carimba, brilho e botões; um toque pula; nada gira.
afterEach(cleanup);
const css = readFileSync(resolve(__dirname, 'Abertura.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const nada = { status: 'nenhum' } as const;
const salvo = { status: 'salvo', name: 'Dudu Maestro', position: 'meia', shirtNumber: 11, visual: 'visual-03' } as const;
const capa = (saved: Parameters<typeof Abertura>[0]['saved'] = nada) =>
  render(<Abertura saved={saved} dia="2026-10-10" onNew={() => {}} onDesafio={() => {}} onContinue={() => {}} />);

describe('capa do álbum (v2.81)', () => {
  it('a marca em três partes ("10", "e", "Faixa"), com o nome inteiro para o leitor de tela', () => {
    capa();
    const h1 = screen.getByRole('heading', { level: 1, name: t('ui.abertura.titulo') });
    expect(h1.querySelector('.abertura__marca-e')).toHaveTextContent(t('ui.abertura.marca.e'));
  });

  it('a arte é a figurinha da capa: moldura, o 10 nas costas e o selo "Álbum da carreira"', () => {
    capa();
    const fig = document.querySelector('.abertura__figurinha') as HTMLElement;
    expect(fig.querySelector('img')).toHaveAttribute('alt', t('ui.abertura.arteAlt'));
    expect(fig.querySelector('.abertura__numero')).toHaveTextContent('10');
    expect(fig.querySelector('.abertura__selo')).toHaveTextContent(t('ui.abertura.selo'));
  });

  it('"Desafio do dia" é o botão pequeno, em contorno', () => {
    capa();
    expect(screen.getByRole('button', { name: new RegExp(t('ui.abertura.novaCarreira')) })).toHaveClass('abertura__botao');
    expect(screen.getByRole('button', { name: /10\/10/ })).toHaveClass('abertura__botao--pequeno');
  });

  it('com carreira salva: o card pequeno do jogador e "Continuar" primeiro', () => {
    capa(salvo);
    const card = document.querySelector('.abertura__salvo') as HTMLElement;
    expect(card).toHaveTextContent('Dudu Maestro');
    expect(card).toHaveTextContent(t('ui.abertura.salvoLinha', { posicao: t('positions.meia'), numero: 11 }));
    const botoes = screen.getAllByRole('button');
    expect(botoes[0]).toHaveTextContent(t('ui.abertura.continuar', { nome: 'Dudu Maestro' }));
  });

  it('um toque na capa pula a animação', () => {
    capa();
    const main = screen.getByRole('main');
    expect(main).not.toHaveAttribute('data-pronta');
    fireEvent.pointerDown(main);
    expect(main).toHaveAttribute('data-pronta');
    expect(css).toMatch(/\.abertura\[data-pronta\][^{]*\{[^}]*animation:\s*none/);
  });

  it('a animação da capa: luzes, figurinha colando, carimbo do 10, brilho e botões; nada gira', () => {
    for (const k of ['capa-luzes', 'capa-cola', 'carimbar', 'capa-brilho', 'capa-sobe']) expect(css).toMatch(new RegExp(`@keyframes ${k} \\{`));
    expect(css).not.toMatch(/rotate/);
    expect(css).toMatch(/background:[^;]*repeating-linear-gradient\(180deg, var\(--paleta-noite\)/);
  });
});
