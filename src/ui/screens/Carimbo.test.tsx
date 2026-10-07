import { act, render, screen } from '@testing-library/react';
import { t } from '../../i18n';
import { MOTION } from '../motion';
import { Carimbo } from './Carimbo';

// v2.47: o carimbo anuncia o momento ao leitor de tela, fica ~1,5 s e some; título com celebração
describe('Carimbo (v2.47)', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('mostra um momento por vez e some no fim', () => {
    render(<Carimbo momentos={[{ kind: 'titulo', competition: 'serieA' }, { kind: 'acesso' }]} />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(t('ui.momento.titulo'));
    expect(status).toHaveTextContent(t('ui.titulo.serieA'));
    expect(status.querySelector('[data-momento="titulo"]')).not.toBeNull();
    act(() => { vi.advanceTimersByTime(MOTION.celebracaoMs); });
    expect(screen.getByRole('status')).toHaveTextContent(t('ui.momento.acesso'));
    act(() => { vi.advanceTimersByTime(MOTION.carimboMs); });
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('o selo de título traz a imagem do troféu da competição dentro dele, decorativa; acesso e rebaixamento não', () => {
    const { unmount } = render(<Carimbo momentos={[{ kind: 'titulo', competition: 'serieA' }]} />);
    const selo = screen.getByRole('status').querySelector('[data-momento="titulo"]')!;
    const trofeu = selo.querySelector('.carimbo__trofeu')!;
    expect(trofeu).not.toBeNull();
    expect(trofeu.querySelector('img, svg')).not.toBeNull();
    expect(trofeu.querySelector('img')?.getAttribute('alt') ?? '').toBe('');
    expect(selo).toHaveTextContent(t('ui.titulo.serieA'));
    unmount();
    render(<Carimbo momentos={[{ kind: 'acesso' }]} />);
    expect(screen.getByRole('status').querySelector('.carimbo__trofeu')).toBeNull();
  });

  it('sem momentos, só a região viva vazia', () => {
    render(<Carimbo momentos={[]} />);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });
});
