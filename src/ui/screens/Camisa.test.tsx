import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render } from '@testing-library/react';
import { kitOf, shirtPaint } from '../../art/kits';
import { AvatarHeroi } from './AvatarHeroi';
import { Figurinha } from './Figurinha';

// T50h: a camisa do retrato pintado vem em cinza com máscara; a cor do clube entra por cima, multiplicada.
const AVATAR = { skin: 't6', hairColor: 'preto', hairStyle: 'cacheado', beard: null, expression: 'alegre', heightCm: 180, build: 'atletico', age: 24, uniform1: '#000000', uniform2: '#000000', boots: '#111111', headband: null };

describe('camisa pela cor do clube (T50h)', () => {
  it('figurinha com visual: camada da camisa com a cor principal do clube e a máscara do visual', () => {
    const { container } = render(<Figurinha name="Zé" number={8} overall={60} position="meia" clubId="palmeiras" visual="visual-03" />);
    const camisa = container.querySelector('.figurinha__foto .camisa') as HTMLElement;
    expect(camisa).not.toBeNull();
    expect(camisa).toHaveAttribute('aria-hidden', 'true');
    expect(camisa.style.getPropertyValue('--camisa-cor')).toBe(kitOf('palmeiras').camisa[0]);
    expect(camisa.style.getPropertyValue('--camisa-mascara')).toMatch(/^url\(.*visual-03-camisa.*\)$/);
  });

  it('o desenho da camisa segue o padrão do clube (v2.37): Flamengo em faixas horizontais', () => {
    const { container } = render(<Figurinha name="Zé" number={8} overall={80} clubId="flamengo" moldura tamanho="grande" visual="visual-05" />);
    const camisa = container.querySelector('.camisa') as HTMLElement;
    expect(camisa.style.getPropertyValue('--camisa-desenho')).toBe(shirtPaint(kitOf('flamengo')));
  });

  it('com `uniforme`, a camisa veste a seleção e o emblema continua o do clube (T50k)', () => {
    const { container } = render(<Figurinha name="Zé" number={8} overall={60} position="meia" clubId="flamengo" uniforme="selecao:brasil" visual="visual-03" />);
    const camisa = container.querySelector('.camisa') as HTMLElement;
    expect(camisa.style.getPropertyValue('--camisa-cor')).toBe(kitOf('selecao:brasil').camisa[0]);
    expect(container.querySelector('.emblema')).toHaveAttribute('data-emblema', 'flamengo');
  });

  it('a figurinha com moldura também pinta a camisa', () => {
    const { container } = render(<Figurinha name="Zé" number={8} overall={80} clubId="flamengo" moldura tamanho="grande" visual="visual-05" />);
    const camisa = container.querySelector('.figurinha--moldura .camisa') as HTMLElement;
    expect(camisa.style.getPropertyValue('--camisa-cor')).toBe(kitOf('flamengo').camisa[0]);
  });

  it('sem visual (busto em desenho), não há camada: o desenho já vem com o uniforme', () => {
    const { container } = render(<Figurinha name="Zé" number={8} overall={60} position="meia" clubId="palmeiras" avatar={AVATAR} />);
    expect(container.querySelector('.camisa')).toBeNull();
  });

  it('na criação, ainda sem clube, a camisa fica na cor neutra do uniforme', () => {
    const { container } = render(<AvatarHeroi id="v" value="visual-02" number="10" onChange={() => {}} />);
    const camisa = container.querySelector('.heroi__palco .camisa') as HTMLElement;
    expect(camisa.style.getPropertyValue('--camisa-cor')).toBe(kitOf('').camisa[0]);
    expect(camisa.style.getPropertyValue('--camisa-mascara')).toMatch(/visual-02-camisa/);
  });

  it('CSS: multiplica a cor pela camisa em cinza, recortada pela máscara no mesmo enquadramento do retrato (com prefixo WebKit)', () => {
    const css = readFileSync(resolve(__dirname, 'Camisa.css'), 'utf8');
    expect(css).toMatch(/mix-blend-mode:\s*multiply/);
    expect(css).toMatch(/background(-color)?:\s*var\(--camisa-cor\)/);
    expect(css).toMatch(/background-image:\s*var\(--camisa-desenho\)/);
    for (const p of ['-webkit-mask-image', 'mask-image']) expect(css).toMatch(new RegExp(`(^|[^-])${p}:\\s*var\\(--camisa-mascara\\)`, 'm'));
    expect(css).toMatch(/mask-size:\s*cover/);
    expect(css).toMatch(/mask-repeat:\s*no-repeat/);
  });
});
