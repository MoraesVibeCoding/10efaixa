import { act, fireEvent, render, screen } from '@testing-library/react';
import { t } from '../../i18n';
import { MOTION } from '../motion';
import { Decision } from './Decision';

// v2.72 (web-animation-design, FLIP): ao fechar o palco, a taça nova voa do palco até a estante da caixa do topo (só transform,
// ease-in-out: movimento na tela). Escondida (caixa fechada no celular) ou sem movimento, não voa.
const PLAYER = { name: 'Zé', position: 'meia', clubId: 'flamengo', overall: 70, titles: ['estadual', 'serieA'], role: 'titularRegular', monthlySalary: { amount: 1, currency: 'BRL' as const } };
const show = () => render(<Decision eventId="salario-atrasado" age={24} progress={0.4} player={PLAYER} scene={{ src: 'c.webp', alt: 'cena' }} momentos={[{ kind: 'titulo', competition: 'serieA' }]} />);

describe('a taça voa do palco para a estante (v2.72)', () => {
  let animate: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('requestAnimationFrame', () => 0);
    vi.stubGlobal('cancelAnimationFrame', () => {});
    animate = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: animate });
  });
  afterEach(() => {
    vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks();
    delete (HTMLElement.prototype as { animate?: unknown }).animate;
  });
  const rects = (palco: number, estante: number) => vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const w = this.closest('.palco') ? palco : estante;
    const y = this.closest('.palco') ? 400 : 20;
    return { left: 100, top: y, width: w, height: w, right: 100 + w, bottom: y + w, x: 100, y, toJSON: () => ({}) } as DOMRect;
  });
  const fechar = () => {
    fireEvent.click(screen.getByRole('button', { name: t('ui.palco.seguir') }));
    act(() => { vi.advanceTimersByTime(MOTION.saidaMs); });
  };

  it('com movimento, a taça nova sai do lugar do palco e chega à estante', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q }));
    rects(96, 28);
    show();
    fechar();
    expect(animate).toHaveBeenCalledTimes(1);
    const [frames, opts] = animate.mock.calls[0]! as [Keyframe[], KeyframeAnimationOptions];
    expect(String(frames[0]!.transform)).toMatch(/translate\(\d+(\.\d+)?px, \d+(\.\d+)?px\) scale\(3\.4\d*\)/);
    expect(frames[1]!.transform).toBe('none');
    expect(opts.duration).toBe(MOTION.vooMs);
    expect(opts.easing).toMatch(/cubic-bezier/);
    expect((animate.mock.contexts[0] as HTMLElement).dataset.taca).toBe('serieA');
  });

  it('escondida (caixa fechada no celular), não voa', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q }));
    rects(96, 1);
    show();
    fechar();
    expect(animate).not.toHaveBeenCalled();
  });

  it('sem movimento, não voa', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q }));
    rects(96, 28);
    show();
    fireEvent.click(screen.getByRole('button', { name: t('ui.palco.seguir') }));
    expect(animate).not.toHaveBeenCalled();
  });
});
