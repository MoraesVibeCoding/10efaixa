import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { simulateCareer } from '../../engine/career';
import { createPrng } from '../../engine/prng';
import { randomInput } from '../../engine/simulation';
import { cardModel } from '../../share/cardModel';
import { shareText } from '../../share/share';
import { careerLinkFragment, type CareerLinkData } from '../../share/careerLink';
import { t } from '../../i18n';
import { Cartao } from './Cartao';

// T56: botões de compartilhar na tela do cartão; o leitor de tela ouve o resultado.
const result = simulateCareer(randomInput(createPrng(3)), 3);

describe('compartilhar na tela do cartão (T56)', () => {
  it('"Copiar texto" copia o texto pronto e avisa', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<Cartao result={result} code="10F-7K3Q-9M2X" onRestart={() => {}} />);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copiar texto' })); });
    expect(writeText).toHaveBeenCalledWith(shareText(cardModel(result, '10F-7K3Q-9M2X')));
    expect(screen.getByRole('status')).toHaveTextContent('Texto copiado');
  });

  it('"Baixar imagem" existe sempre; "Compartilhar" só onde o navegador compartilha arquivos', () => {
    render(<Cartao result={result} code="10F-7K3Q-9M2X" onRestart={() => {}} />);
    expect(screen.getByRole('button', { name: 'Baixar imagem' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Compartilhar' })).toBeNull();
  });
});

// T57c (v2.49): selo do desafio do dia na tela do cartão (só quando a carreira é um desafio).
describe('selo do desafio (T57c)', () => {
  it('mostra "Desafio de DD/MM" quando é desafio', () => {
    render(<Cartao result={result} code="10F-7K3Q-9M2X" desafio="2026-10-07" onRestart={() => {}} />);
    expect(screen.getByText('Desafio de 07/10')).toBeInTheDocument();
  });

  it('não mostra selo na carreira livre', () => {
    render(<Cartao result={result} code="10F-7K3Q-9M2X" onRestart={() => {}} />);
    expect(screen.queryByText(/^Desafio de/)).toBeNull();
  });
});

// T57e (v2.49): "Copiar link" copia o endereço do site + o fragmento do link da carreira.
describe('copiar link (T57e)', () => {
  const link: CareerLinkData = {
    seed: 11, ritmo: 'normal', visual: 'visual-01', choices: ['a'], codigo: '10F-7K3Q-9M2X',
    input: { shirtNumber: 11, state: 'BA', position: 'meia', archetypeId: 'classico10', biotype: { heightCm: 176, build: 'atletico' }, temperament: 'resenha', celebration: 'aviaozinho', origin: 'baseGrande', foot: 'direita', heartClub: 'bahia' },
  };

  it('copia o endereço da página com o fragmento do link e avisa', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<Cartao result={result} code="10F-7K3Q-9M2X" link={link} onRestart={() => {}} />);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copiar link' })); });
    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}${window.location.pathname}${careerLinkFragment(link)}`);
    expect(screen.getByRole('status')).toHaveTextContent('Link copiado');
  });

  it('avisa quando o navegador não deixa copiar', async () => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: vi.fn().mockRejectedValue(new Error('negado')) }, configurable: true });
    render(<Cartao result={result} code="10F-7K3Q-9M2X" link={link} onRestart={() => {}} />);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Copiar link' })); });
    expect(screen.getByRole('status')).toHaveTextContent('Não deu para copiar');
  });

  it('sem dados de link (rever um link) não há "Copiar link"', () => {
    render(<Cartao result={result} code="10F-7K3Q-9M2X" onRestart={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Copiar link' })).toBeNull();
  });
});

// v2.71 (momento 10): o cartão entra virando e compartilhar é a ação principal; "Nova carreira" fica secundária.
describe('fim da carreira com compartilhar em primeiro (v2.71)', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('com compartilhar nativo, ele é o botão principal; "Nova carreira" é secundário', () => {
    vi.stubGlobal('navigator', { ...navigator, canShare: () => true });
    render(<Cartao result={result} code="10F-7K3Q-9M2X" onRestart={() => {}} />);
    expect(screen.getByRole('button', { name: t('ui.compartilhar.compartilhar') })).toHaveClass('cartao__principal');
    expect(screen.getByRole('button', { name: t('ui.fim.novaCarreira') })).not.toHaveClass('cartao__principal');
  });

  it('sem compartilhar nativo (computador), baixar a imagem é o principal', () => {
    render(<Cartao result={result} code="10F-7K3Q-9M2X" onRestart={() => {}} />);
    expect(screen.getByRole('button', { name: t('ui.compartilhar.baixar') })).toHaveClass('cartao__principal');
  });

  it('CSS: o cartão entra virando; o botão principal é o verde do jogo e "Nova carreira" é contorno', () => {
    const css = readFileSync(resolve(__dirname, 'Cartao.css'), 'utf8');
    expect(css).toMatch(/\.cartao__imagem\s*\{[^}]*animation:\s*cartao-vira/);
    expect(css).toMatch(/\.cartao__acoes \.cartao__principal\s*\{[^}]*background:\s*var\(--cor-destaque\)/);
    expect(css).toMatch(/\.cartao__nova\s*\{[^}]*background:\s*transparent/);
  });
});
