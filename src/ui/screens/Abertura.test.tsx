import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { t } from '../../i18n';
import { Abertura } from './Abertura';

// T48/T53a (SPEC 7, v2.34): a abertura. Arte do túnel, o "10" carimbando nas costas, a marca e "Nova carreira".
describe('abertura (T48)', () => {
  it('a marca é o título da tela; a arte tem texto alternativo', () => {
    render(<Abertura saved={{ status: 'nenhum' }} onNew={() => {}} onContinue={() => {}} />);
    expect(screen.getByRole('heading', { level: 1, name: t('ui.abertura.titulo') })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: t('ui.abertura.arteAlt') })).toBeInTheDocument();
    expect(screen.getByText(t('ui.abertura.lema'))).toBeInTheDocument();
  });

  it('o "10" gigante é decorativo (o leitor de tela não lê um número solto)', () => {
    const { container } = render(<Abertura saved={{ status: 'nenhum' }} onNew={() => {}} onContinue={() => {}} />);
    const numero = container.querySelector('.abertura__numero')!;
    expect(numero).toHaveTextContent('10');
    expect(numero).toHaveAttribute('aria-hidden', 'true');
  });

  it('"Nova carreira" começa; ainda sem save, não há "Continuar" (T54)', () => {
    const onNew = vi.fn();
    render(<Abertura saved={{ status: 'nenhum' }} onNew={onNew} onContinue={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.novaCarreira') }));
    expect(onNew).toHaveBeenCalledOnce();
    expect(screen.getAllByRole('button')).toHaveLength(1); // sem save, só "Nova carreira"
  });

  it('CSS: o número "carimba" com animação, que some com prefers-reduced-motion', () => {
    const css = readFileSync(resolve(__dirname, 'Abertura.css'), 'utf8');
    expect(css).toMatch(/@keyframes\s+carimbar/);
    expect(css).toMatch(/\.abertura__numero\s*\{[^}]*animation:[^;]*carimbar/);
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[^@]*\.abertura__numero\s*\{[^}]*animation:\s*none/);
  });

  it('CSS: a arte some em degradê nas laterais (sem borda visível no computador, v2.39)', () => {
    const css = readFileSync(resolve(__dirname, 'Abertura.css'), 'utf8');
    for (const p of ['-webkit-mask-image', 'mask-image']) {
      expect(css).toMatch(new RegExp(`\\.abertura__arte img\\s*\\{[^}]*(^|[^-])${p}:\\s*linear-gradient\\(to right, transparent`, 'm'));
    }
  });

  describe('com carreira salva (T54, v2.39)', () => {
    const show = (saved: { status: 'salvo'; name: string } | { status: 'invalido' } = { status: 'salvo', name: 'Dudu Maestro' }) => {
      const onNew = vi.fn(); const onContinue = vi.fn();
      render(<Abertura saved={saved} onNew={onNew} onContinue={onContinue} />);
      return { onNew, onContinue };
    };

    it('"Continuar a carreira de [nome]" vem primeiro, com o foco, e continua', () => {
      const { onContinue } = show();
      const cont = screen.getByRole('button', { name: t('ui.abertura.continuar', { nome: 'Dudu Maestro' }) });
      expect(cont).toHaveFocus();
      fireEvent.click(cont);
      expect(onContinue).toHaveBeenCalledOnce();
    });

    it('"Nova carreira" pergunta antes de apagar; "Cancelar" mantém, "Apagar e começar" começa', () => {
      const { onNew } = show();
      fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.novaCarreira') }));
      const dialog = screen.getByRole('alertdialog', { name: t('ui.abertura.confirmar.titulo') });
      expect(dialog).toHaveTextContent(t('ui.abertura.confirmar.texto', { nome: 'Dudu Maestro' }));
      fireEvent.click(within(dialog).getByRole('button', { name: t('ui.abertura.confirmar.cancelar') }));
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
      expect(onNew).not.toHaveBeenCalled();
      fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.novaCarreira') }));
      fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: t('ui.abertura.confirmar.apagar') }));
      expect(onNew).toHaveBeenCalledOnce();
    });

    it('save inválido: "Continuar a carreira salva" (sem nome) leva ao aviso; a confirmação também não usa nome', () => {
      const { onContinue } = show({ status: 'invalido' });
      fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.continuarSemNome') }));
      expect(onContinue).toHaveBeenCalledOnce();
      fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.novaCarreira') }));
      expect(screen.getByRole('alertdialog')).toHaveTextContent(t('ui.abertura.confirmar.textoSemNome'));
    });
  });
});

// v2.47: aviso legal discreto; os nomes de clubes servem só para identificação
describe('aviso legal (v2.47)', () => {
  it('a abertura traz o aviso sobre nomes de clubes, sem escudos oficiais', () => {
    render(<Abertura saved={{ status: 'nenhum' }} onNew={() => {}} onContinue={() => {}} />);
    const aviso = screen.getByText(t('ui.abertura.avisoLegal'));
    expect(aviso).toHaveClass('abertura__aviso');
    expect(aviso.textContent).toMatch(/identificação/);
    expect(aviso.textContent).toMatch(/escudos/);
  });
});
