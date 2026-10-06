import { render, screen } from '@testing-library/react';
import { kitOf } from '../../art/kits';
import { t } from '../../i18n';
import { Emblema } from './Emblema';

const svgOf = (c: HTMLElement) => decodeURIComponent(c.querySelector('img')!.getAttribute('src')!.replace(/^data:image\/svg\+xml,/, ''));

describe('emblema do clube (T49d, SPEC v2.26)', () => {
  it('clube com emblema próprio: versão completa a partir de 40 px, com as cores do uniforme no lugar das cores-chave', () => {
    const { container } = render(<Emblema clubId="flamengo" size={56} />);
    const box = container.firstElementChild as HTMLElement;
    expect(box).toHaveAttribute('data-emblema', 'flamengo');
    expect(box).toHaveAttribute('data-versao', 'completo');
    const svg = svgOf(container).toUpperCase();
    expect(svg).toContain(kitOf('flamengo').camisa[0]!.toUpperCase());
    expect(svg).not.toContain('#00FF00');
    expect(svg).not.toContain('#0000FF');
  });

  it('abaixo de 40 px entra a versão simplificada', () => {
    const { container } = render(<Emblema clubId="flamengo" size={20} />);
    expect(container.firstElementChild).toHaveAttribute('data-versao', 'simples');
  });

  it('clube sem emblema próprio usa o escudo genérico; a sigla aparece só na versão completa', () => {
    const { container, rerender } = render(<Emblema clubId="bahia" size={56} />);
    expect(container.firstElementChild).toHaveAttribute('data-emblema', 'generico');
    expect(screen.getByText('BAH')).toBeInTheDocument();
    rerender(<Emblema clubId="bahia" size={20} />);
    expect(screen.queryByText('BAH')).not.toBeInTheDocument();
  });

  it('decorativo por padrão (o nome do clube vem ao lado); com rótulo, vira imagem com nome acessível', () => {
    const { container, rerender } = render(<Emblema clubId="santos" size={20} />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    rerender(<Emblema clubId="santos" size={56} label />);
    expect(screen.getByRole('img', { name: t('ui.emblema.de', { prep: t('ui.figurinha.prep.o'), clube: 'Santos' }) })).toBeInTheDocument();
    rerender(<Emblema clubId="portuguesa" size={56} label />);
    expect(screen.getByRole('img', { name: t('ui.emblema.de', { prep: t('ui.figurinha.prep.a'), clube: 'Portuguesa' }) })).toBeInTheDocument();
  });
});
