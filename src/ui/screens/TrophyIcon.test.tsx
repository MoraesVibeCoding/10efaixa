import { render } from '@testing-library/react';
import ui from '../../i18n/pt-BR/ui.json';
import { TrophyIcon, trophySrc } from './TrophyIcon';

// v2.56: o selo e a gaveta mostram o troféu em imagem que criamos; todo título tem uma peça (nenhum cai no ícone genérico em vetor).
describe('troféus em imagem (v2.56)', () => {
  it('todo título do jogo tem uma peça de imagem', () => {
    for (const id of Object.keys(ui.titulo)) expect(trophySrc(id), id).toBeTruthy();
  });

  it('com peça, o ícone é a imagem decorativa no tamanho pedido; sem peça (id desconhecido), o ícone genérico', () => {
    const { container, unmount } = render(<TrophyIcon id="serieA" size={96} />);
    const img = container.querySelector('img')!;
    expect(img).toHaveAttribute('alt', '');
    expect(img).toHaveAttribute('width', '96');
    unmount();
    expect(render(<TrophyIcon id="inexistente" />).container.querySelector('svg')).not.toBeNull();
  });
});
