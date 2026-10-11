import { render, screen } from '@testing-library/react';
import { kitOf } from '../../art/kits';
import { t } from '../../i18n';
import { Emblema } from './Emblema';

const svgOf = (c: HTMLElement) => decodeURIComponent(c.querySelector('img')!.getAttribute('src')!.replace(/^data:image\/svg\+xml,/, ''));

describe('emblema do clube (T49d, SPEC v2.26)', () => {
  it('clube com emblema próprio: versão completa a partir de 40 px, com as cores do uniforme no lugar das cores-chave', () => {
    const { container } = render(<Emblema clubId="palmeiras" size={56} />);
    const box = container.firstElementChild as HTMLElement;
    expect(box).toHaveAttribute('data-emblema', 'palmeiras');
    expect(box).toHaveAttribute('data-versao', 'completo');
    const svg = svgOf(container).toUpperCase();
    expect(svg).toContain(kitOf('palmeiras').camisa[0]!.toUpperCase());
    expect(svg).not.toContain('#00FF00');
    expect(svg).not.toContain('#0000FF');
  });

  it('abaixo de 40 px entra a versão simplificada', () => {
    const { container } = render(<Emblema clubId="palmeiras" size={20} />);
    expect(container.firstElementChild).toHaveAttribute('data-versao', 'simples');
  });

  it('clube sem emblema próprio usa o escudo genérico; a sigla aparece só na versão completa', () => {
    const { container, rerender } = render(<Emblema clubId="vasco" size={56} />);
    expect(container.firstElementChild).toHaveAttribute('data-emblema', 'generico');
    expect(screen.getByText('VAS')).toBeInTheDocument();
    rerender(<Emblema clubId="vasco" size={20} />);
    expect(screen.queryByText('VAS')).not.toBeInTheDocument();
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

// v2.86 (usuário em 2026-10-11: "utilize os que arquivei"; as pastas vazias ficam como estão): os emblemas enviados em
// docs/arte/emblemas/<clube>/ entram no jogo como imagem recortada (src/assets/emblemas/<clube>.webp), em qualquer tamanho.
describe('emblemas enviados pelo usuário (v2.86)', () => {
  const ENVIADOS = ['athletico-pr', 'atletico-mg', 'bahia', 'botafogo', 'chapecoense', 'corinthians', 'coritiba', 'cruzeiro', 'flamengo', 'internacional', 'santos'];
  it.each(ENVIADOS)('%s usa a imagem enviada, sem sigla por cima', (clubId) => {
    for (const size of [20, 56]) {
      const { container, unmount } = render(<Emblema clubId={clubId} size={size} />);
      const box = container.firstElementChild as HTMLElement;
      expect(box).toHaveAttribute('data-emblema', clubId);
      expect(box).toHaveAttribute('data-versao', 'imagem');
      expect(box.querySelector('img')!.getAttribute('src')).toMatch(new RegExp(`emblemas/${clubId}\\.webp`));
      expect(box.querySelector('.emblema__sigla')).toBeNull();
      unmount();
    }
  });

  it('as pastas vazias ficam como estão (Palmeiras com o desenho; os outros com o genérico)', () => {
    const { container, rerender } = render(<Emblema clubId="palmeiras" size={56} />);
    expect(container.firstElementChild).toHaveAttribute('data-emblema', 'palmeiras');
    for (const clubId of ['fluminense', 'gremio', 'sao-paulo', 'vasco']) {
      rerender(<Emblema clubId={clubId} size={56} />);
      expect(container.firstElementChild).toHaveAttribute('data-emblema', 'generico');
    }
  });
});
