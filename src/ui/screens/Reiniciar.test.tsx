import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { t } from '../../i18n';
import { Reiniciar } from './Reiniciar';

// v2.56: botão fixo de reiniciar a carreira em todas as telas (criação, revelação, ritmo, carreira), com aviso antes de apagar.
function Harness({ onConfirm = vi.fn() }: { onConfirm?: () => void }) {
  const [open, setOpen] = useState(false);
  return <Reiniciar open={open} onOpen={() => { setOpen(true); }} onCancel={() => { setOpen(false); }} onConfirm={onConfirm} />;
}
const botao = () => screen.getByRole('button', { name: t('ui.reiniciar.botao') });

describe('botão de reiniciar a carreira (v2.56)', () => {
  it('é um botão com nome para leitor de tela, e o aviso só abre ao tocar', () => {
    render(<Harness />);
    expect(botao()).toHaveAttribute('aria-haspopup', 'dialog');
    expect(screen.queryByRole('alertdialog')).toBeNull();
    fireEvent.click(botao());
    const aviso = screen.getByRole('alertdialog', { name: t('ui.reiniciar.titulo') });
    expect(aviso).toHaveAttribute('aria-modal', 'true');
    expect(aviso).toHaveAccessibleDescription(t('ui.reiniciar.texto'));
  });

  it('o foco abre em "Continuar jogando" (a opção segura), e não em "Reiniciar"', () => {
    render(<Harness />);
    fireEvent.click(botao());
    expect(screen.getByRole('button', { name: t('ui.reiniciar.cancelar') })).toHaveFocus();
  });

  it('"Continuar jogando" e Esc fecham sem reiniciar, e o foco volta para o botão', () => {
    const onConfirm = vi.fn();
    render(<Harness onConfirm={onConfirm} />);
    fireEvent.click(botao());
    fireEvent.click(screen.getByRole('button', { name: t('ui.reiniciar.cancelar') }));
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(botao()).toHaveFocus();
    fireEvent.click(botao());
    fireEvent.keyDown(screen.getByRole('alertdialog'), { key: 'Escape' });
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(botao()).toHaveFocus();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('"Reiniciar" confirma uma vez só', () => {
    const onConfirm = vi.fn();
    render(<Harness onConfirm={onConfirm} />);
    fireEvent.click(botao());
    fireEvent.click(screen.getByRole('button', { name: t('ui.reiniciar.confirmar') }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('Tab fica preso entre os dois botões do aviso', () => {
    render(<Harness />);
    fireEvent.click(botao());
    const cancelar = screen.getByRole('button', { name: t('ui.reiniciar.cancelar') });
    const confirmar = screen.getByRole('button', { name: t('ui.reiniciar.confirmar') });
    fireEvent.keyDown(cancelar, { key: 'Tab', shiftKey: true });
    expect(confirmar).toHaveFocus();
    fireEvent.keyDown(confirmar, { key: 'Tab' });
    expect(cancelar).toHaveFocus();
  });
});
