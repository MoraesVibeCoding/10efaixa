import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { t } from '../../i18n';
import { Abertura } from './Abertura';

// T48/T53a (SPEC 7, v2.34): a abertura. Arte do túnel, o "10" carimbando nas costas, a marca e "Nova carreira".
describe('abertura (T48)', () => {
  it('a marca é o título da tela; a arte tem texto alternativo', () => {
    render(<Abertura onNew={() => {}} />);
    expect(screen.getByRole('heading', { level: 1, name: t('ui.abertura.titulo') })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: t('ui.abertura.arteAlt') })).toBeInTheDocument();
    expect(screen.getByText(t('ui.abertura.lema'))).toBeInTheDocument();
  });

  it('o "10" gigante é decorativo (o leitor de tela não lê um número solto)', () => {
    const { container } = render(<Abertura onNew={() => {}} />);
    const numero = container.querySelector('.abertura__numero')!;
    expect(numero).toHaveTextContent('10');
    expect(numero).toHaveAttribute('aria-hidden', 'true');
  });

  it('"Nova carreira" começa; ainda sem save, não há "Continuar" (T54)', () => {
    const onNew = vi.fn();
    render(<Abertura onNew={onNew} />);
    fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.novaCarreira') }));
    expect(onNew).toHaveBeenCalledOnce();
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('CSS: o número "carimba" com animação, que some com prefers-reduced-motion', () => {
    const css = readFileSync(resolve(__dirname, 'Abertura.css'), 'utf8');
    expect(css).toMatch(/@keyframes\s+carimbar/);
    expect(css).toMatch(/\.abertura__numero\s*\{[^}]*animation:[^;]*carimbar/);
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[^@]*\.abertura__numero\s*\{[^}]*animation:\s*none/);
  });
});
