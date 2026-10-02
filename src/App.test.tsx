import { render, screen } from '@testing-library/react';
import { App } from './App';
import { t } from './i18n';

describe('App (amostra da T49)', () => {
  it('abre na tela de decisão de amostra, com o evento como título principal', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: t('events.proposta-coracao.titulo') })).toBeInTheDocument();
  });

  it('expõe uma região principal e a cena com texto alternativo', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /assinando contrato/ })).toBeInTheDocument();
  });
});
