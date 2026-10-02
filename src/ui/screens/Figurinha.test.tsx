import { render, screen, waitFor } from '@testing-library/react';
import { kitOf } from '../../art/kits';
import { t } from '../../i18n';
import { Figurinha } from './Figurinha';

const AVATAR = { skin: 't6', hairColor: 'preto', hairStyle: 'cacheado', beard: null, expression: 'alegre', heightCm: 180, build: 'atletico', age: 24, uniform1: '#000000', uniform2: '#000000', boots: '#111111', headband: null };

describe('figurinha do jogador (T49c, SPEC v2.26)', () => {
  it('nome, número, OVR e "posição do/da clube" com o artigo certo', () => {
    const { rerender } = render(<Figurinha name="Dudu Maestro" number={10} overall={78} position="meia" clubId="flamengo" />);
    expect(screen.getByText('Dudu Maestro')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('78')).toBeInTheDocument();
    expect(screen.getByText(t('ui.figurinha.posicaoNoClube', { posicao: t('positions.meia'), prep: t('ui.figurinha.prep.o'), clube: 'Flamengo' }))).toBeInTheDocument();
    rerender(<Figurinha name="Dudu Maestro" number={10} overall={78} position="meia" clubId="portuguesa" />);
    expect(screen.getByText(t('ui.figurinha.posicaoNoClube', { posicao: t('positions.meia'), prep: t('ui.figurinha.prep.a'), clube: 'Portuguesa' }))).toBeInTheDocument();
  });

  it('o fundo tem as faixas nas cores do uniforme do clube (kits.json)', () => {
    const { container } = render(<Figurinha name="Zé" number={8} overall={60} position="meia" clubId="flamengo" />);
    const kit = kitOf('flamengo');
    const foto = container.querySelector<HTMLElement>('.figurinha__foto')!;
    expect(foto.style.getPropertyValue('--faixa1')).toBe(kit.camisa[0]);
    expect(foto.style.getPropertyValue('--faixa2')).toBe(kit.camisa[1] ?? kit.detalhe);
  });

  it('em criação (T50): sem OVR, emblema nem clube ainda; faixas no uniforme neutro', () => {
    const { container } = render(<Figurinha name="Zé" />);
    expect(screen.getByText('Zé')).toBeInTheDocument();
    expect(container.querySelector('.figurinha__over')).toBeNull();
    expect(container.querySelector('[data-emblema]')).toBeNull();
    expect(container.querySelector('.figurinha__clube')).toBeNull();
    const neutral = kitOf('');
    expect(container.querySelector<HTMLElement>('.figurinha__foto')!.style.getPropertyValue('--faixa1')).toBe(neutral.camisa[0]);
  });

  it('com avatar, mostra o busto montado pela arte provisória, de frente e com a camisa do clube', async () => {
    const { container } = render(<Figurinha name="Zé" number={8} overall={60} position="meia" clubId="palmeiras" avatar={AVATAR} />);
    await waitFor(() => expect(container.querySelector('img.figurinha__retrato')).not.toBeNull());
    const src = decodeURIComponent(container.querySelector('img.figurinha__retrato')!.getAttribute('src')!);
    expect(src).toMatch(/^data:image\/svg\+xml,/);
    expect(src).toContain('viewBox="90 88 220 220"');
    expect(src.toUpperCase()).toContain(kitOf('palmeiras').camisa[0]!.toUpperCase());
    expect(container.querySelector('img.figurinha__retrato')).toHaveAttribute('alt', '');
  });
});
