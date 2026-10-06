import { render, screen, waitFor } from '@testing-library/react';
import { kitOf } from '../../art/kits';
import bands from '../../data/bands.json';
import tokens from '../theme/tokens.json';
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

describe('figurinha com moldura por faixa (T49h, SPEC v2.34)', () => {
  const MEDALS = tokens.medalha as unknown as Record<string, { nome: string }>;

  it('uma moldura por faixa de overall: o nome do metal e a arte vêm de bands.json e tokens, nas duas pontas de cada faixa', () => {
    for (const band of bands) {
      for (const overall of [band.min, band.max]) {
        const { container, unmount } = render(<Figurinha name="Zé" number={10} overall={overall} position="meia" clubId="flamengo" moldura />);
        const frame = container.querySelector<HTMLElement>('.figurinha--moldura')!;
        expect(frame, `overall ${overall}`).not.toBeNull();
        expect(frame.dataset.medalha).toBe(MEDALS[band.key]!.nome);
        expect(frame.style.backgroundImage).toContain(`${MEDALS[band.key]!.nome}.webp`);
        unmount();
      }
    }
  });

  it('nome acessível: "OVR n (faixa)" para o leitor de tela; o número do Over aparece uma vez para quem vê', () => {
    render(<Figurinha name="Dudu Maestro" number={10} overall={78} position="meia" clubId="flamengo" moldura tamanho="grande" />);
    expect(screen.getByText(new RegExp(`${t('ui.figurinha.over')} 78`))).toHaveClass('sr-only');
    expect(screen.getByText('Dudu Maestro')).toBeInTheDocument();
    expect(screen.getAllByText('78')).toHaveLength(1);
  });

  it('dois tamanhos: pequena (padrão, só o número na tarja) e grande (nome na tarja)', () => {
    const { container, rerender } = render(<Figurinha name="Zé" number={10} overall={60} moldura />);
    expect(container.querySelector('.figurinha--pequena')).not.toBeNull();
    expect(container.querySelector('.figurinha__tarja-nome')).toHaveClass('sr-only');
    rerender(<Figurinha name="Zé" number={10} overall={60} moldura tamanho="grande" />);
    expect(container.querySelector('.figurinha--grande')).not.toBeNull();
    expect(container.querySelector('.figurinha__tarja-nome')).not.toHaveClass('sr-only');
  });

  it('sem overall (criação) não há faixa, então não há moldura: vale a figurinha comum', () => {
    const { container } = render(<Figurinha name="Zé" moldura />);
    expect(container.querySelector('.figurinha--moldura')).toBeNull();
    expect(container.querySelector('.figurinha')).not.toBeNull();
  });
});

describe('figurinha com o retrato pintado do visual (T50g, SPEC v2.36)', () => {
  it('com `visual`, mostra a imagem pintada dele (decorativa) no lugar do busto em desenho', () => {
    const { container } = render(<Figurinha name="Zé" number={8} overall={60} position="meia" clubId="palmeiras" avatar={AVATAR} visual="visual-03" />);
    const img = container.querySelector('img.figurinha__retrato')!;
    expect(img).toHaveAttribute('src', expect.stringContaining('visual-03'));
    expect(img).not.toHaveAttribute('src', expect.stringMatching(/^data:/));
    expect(img).toHaveAttribute('alt', '');
    expect(img).toHaveClass('figurinha__retrato--pintado');
  });

  it('o retrato aparece de imediato (sem esperar o busto em desenho) e a moldura por faixa também o usa', () => {
    const { container } = render(<Figurinha name="Zé" number={8} overall={60} moldura tamanho="grande" visual="visual-05" />);
    expect(container.querySelector('.figurinha--moldura img.figurinha__retrato')).toHaveAttribute('src', expect.stringContaining('visual-05'));
  });

  it('sem `visual`, continua como antes: busto em desenho quando há avatar', async () => {
    const { container } = render(<Figurinha name="Zé" number={8} overall={60} position="meia" clubId="palmeiras" avatar={AVATAR} />);
    await waitFor(() => expect(container.querySelector('img.figurinha__retrato')).not.toBeNull());
    expect(container.querySelector('img.figurinha__retrato')).not.toHaveClass('figurinha__retrato--pintado');
  });
});
