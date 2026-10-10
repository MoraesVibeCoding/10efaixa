import { fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { t } from '../../i18n';
import { Palco } from './Palco';

// v2.71 (revisão /impeccable, momento 4): o título ganha palco. Fundo escurecido, a tela atrás inerte, os títulos do ano juntos,
// confete decorativo e "Seguir" com o foco; Esc também fecha.
describe('Palco do título (v2.71)', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('é um diálogo modal com os títulos do ano juntos e o foco no "Seguir"', () => {
    render(<Palco titulos={['serieA', 'copaDoBrasil', 'serieA']} onClose={() => {}} />);
    const d = screen.getByRole('dialog', { name: t('ui.momento.titulo') });
    expect(d).toHaveAttribute('aria-modal', 'true');
    const itens = d.querySelectorAll('.palco__taca');
    expect(itens).toHaveLength(2);
    expect(d).toHaveTextContent(t('ui.titulo.serieA'));
    expect(d).toHaveTextContent(t('ui.titulo.copaDoBrasil'));
    expect(d).toHaveTextContent(t('ui.palco.vezes', { n: 2 }));
    expect(screen.getByRole('button', { name: t('ui.palco.seguir') })).toHaveFocus();
  });

  it('"Seguir" e Esc fecham', () => {
    const onClose = vi.fn();
    render(<Palco titulos={['serieA']} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: t('ui.palco.seguir') }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('confete só com movimento, e decorativo', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q }));
    const { unmount } = render(<Palco titulos={['serieA']} onClose={() => {}} />);
    const confete = document.querySelector('.palco__confete');
    expect(confete).not.toBeNull();
    expect(confete).toHaveAttribute('aria-hidden', 'true');
    unmount();
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q }));
    render(<Palco titulos={['serieA']} onClose={() => {}} />);
    expect(document.querySelector('.palco__confete')).toBeNull();
  });

  it('CSS: fundo escurecido cobrindo a tela', () => {
    const css = readFileSync('src/ui/screens/Palco.css', 'utf8');
    expect(css).toMatch(/\.palco\s*\{[^}]*position:\s*fixed[^}]*inset:\s*0/);
    expect(css).toMatch(/\.palco\s*\{[^}]*background:[^}]*rgb\(/);
  });
});
