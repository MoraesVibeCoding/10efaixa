import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App (smoke)', () => {
  it('mostra o nome do jogo como título principal', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: '10eFaixa' })).toBeInTheDocument();
  });

  it('expõe uma região principal para leitores de tela', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
