import { act, fireEvent, render, screen } from '@testing-library/react';
import { simulateCareer } from '../../engine/career';
import { createPrng } from '../../engine/prng';
import { randomInput } from '../../engine/simulation';
import { cardModel } from '../../share/cardModel';
import { shareText } from '../../share/share';
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
