import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { t } from '../../i18n';
import { Abertura } from './Abertura';

// T48/T53a (SPEC 7, v2.34): a abertura. Arte do túnel, o "10" carimbando nas costas, a marca e "Nova carreira".
describe('abertura (T48)', () => {
  it('a marca é o título da tela; a arte tem texto alternativo', () => {
    render(<Abertura saved={{ status: 'nenhum' }} onNew={() => {}} onDesafio={() => {}} dia="2026-10-07" onContinue={() => {}} />);
    expect(screen.getByRole('heading', { level: 1, name: t('ui.abertura.titulo') })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: t('ui.abertura.arteAlt') })).toBeInTheDocument();
    expect(screen.getByText(t('ui.abertura.lema'))).toBeInTheDocument();
  });

  it('o "10" gigante é decorativo (o leitor de tela não lê um número solto)', () => {
    const { container } = render(<Abertura saved={{ status: 'nenhum' }} onNew={() => {}} onDesafio={() => {}} dia="2026-10-07" onContinue={() => {}} />);
    const numero = container.querySelector('.abertura__numero')!;
    expect(numero).toHaveTextContent('10');
    expect(numero).toHaveAttribute('aria-hidden', 'true');
  });

  it('"Nova carreira" começa; ainda sem save, não há "Continuar" (T54)', () => {
    const onNew = vi.fn();
    render(<Abertura saved={{ status: 'nenhum' }} onNew={onNew} onDesafio={() => {}} dia="2026-10-07" onContinue={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.novaCarreira') }));
    expect(onNew).toHaveBeenCalledOnce();
    expect(screen.getAllByRole('button')).toHaveLength(2); // sem save: "Nova carreira" e "Desafio do dia" (T57c), nada de "Continuar"
  });

  it('CSS: o número "carimba" com animação, que some com prefers-reduced-motion', () => {
    const css = readFileSync(resolve(__dirname, 'Abertura.css'), 'utf8');
    expect(css).toMatch(/@keyframes\s+carimbar/);
    expect(css).toMatch(/\.abertura__numero\s*\{[^}]*animation:[^;]*carimbar/);
    // v2.81: a capa inteira fica montada sem movimento (o número entre as peças da capa)
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[^@]*\.abertura__numero[^{]*\{[^}]*animation:\s*none/);
  });

  // v2.81 (Álbum): a arte deixou de cobrir a tela (o degradê nas laterais da v2.39 existia para a arte de tela cheia no
  // computador); agora é a figurinha da capa, inteira (4:5) numa moldura, e cabe na altura da tela
  it('CSS: a arte é a figurinha da capa, inteira na proporção 4:5, e cabe na altura da tela', () => {
    const css = readFileSync(resolve(__dirname, 'Abertura.css'), 'utf8');
    expect(css).toMatch(/\.abertura__arte \{[^}]*aspect-ratio:\s*4 \/ 5/);
    expect(css).toMatch(/\.abertura__figurinha \{[^}]*inline-size:\s*min\([^;]*100dvh/);
  });

  describe('com carreira salva (T54, v2.39)', () => {
    const show = (saved: { status: 'salvo'; name: string; position: string; shirtNumber: number; visual: string } | { status: 'invalido' } = { status: 'salvo', name: 'Dudu Maestro', position: 'meia', shirtNumber: 10, visual: 'visual-01' }) => {
      const onNew = vi.fn(); const onContinue = vi.fn();
      render(<Abertura saved={saved} onNew={onNew} onDesafio={() => {}} dia="2026-10-07" onContinue={onContinue} />);
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
    render(<Abertura saved={{ status: 'nenhum' }} onNew={() => {}} onDesafio={() => {}} dia="2026-10-07" onContinue={() => {}} />);
    const aviso = screen.getByText(t('ui.abertura.avisoLegal'));
    expect(aviso).toHaveClass('abertura__aviso');
    expect(aviso.textContent).toMatch(/identificação/);
    expect(aviso.textContent).toMatch(/escudos/);
  });
});

// T57c (SPEC 6.15, v2.49): "Desafio do dia" ao lado de "Nova carreira"; com carreira salva também pergunta antes de apagar.
describe('abertura: desafio do dia (T57c)', () => {
  const label = t('ui.abertura.desafio', { data: '07/10' });

  it('mostra o botão com a data do dia e começa o desafio quando não há save', () => {
    const onDesafio = vi.fn();
    const onNew = vi.fn();
    render(<Abertura saved={{ status: 'nenhum' }} onNew={onNew} onDesafio={onDesafio} dia="2026-10-07" onContinue={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: label }));
    expect(onDesafio).toHaveBeenCalledTimes(1);
    expect(onNew).not.toHaveBeenCalled();
  });

  it('com carreira salva, pergunta antes de apagar e só então começa o desafio', () => {
    const onDesafio = vi.fn();
    const onNew = vi.fn();
    render(<Abertura saved={{ status: 'salvo', name: 'Dudu', position: 'meia', shirtNumber: 10, visual: 'visual-01' }} onNew={onNew} onDesafio={onDesafio} dia="2026-10-07" onContinue={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: label }));
    expect(onDesafio).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.confirmar.apagar') }));
    expect(onDesafio).toHaveBeenCalledTimes(1);
    expect(onNew).not.toHaveBeenCalled();
  });

  it('cancelar a pergunta não começa nada', () => {
    const onDesafio = vi.fn();
    render(<Abertura saved={{ status: 'salvo', name: 'Dudu', position: 'meia', shirtNumber: 10, visual: 'visual-01' }} onNew={() => {}} onDesafio={onDesafio} dia="2026-10-07" onContinue={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: label }));
    fireEvent.click(screen.getByRole('button', { name: t('ui.abertura.confirmar.cancelar') }));
    expect(onDesafio).not.toHaveBeenCalled();
  });
});
