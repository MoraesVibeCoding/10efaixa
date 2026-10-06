import { fireEvent, render, screen } from '@testing-library/react';
import { t } from '../../i18n';
import { SaveInvalido } from './SaveInvalido';

// T54 (SPEC 6.16): save danificado ou de outra versão: mensagem clara e opção de recomeçar, sem travar o jogo.
describe('save inválido (T54)', () => {
  it('explica o problema pelo motivo e oferece começar uma nova ou voltar', () => {
    const onRestart = vi.fn(); const onBack = vi.fn();
    render(<SaveInvalido reason="versao" onRestart={onRestart} onBack={onBack} />);
    expect(screen.getByRole('heading', { level: 1, name: t('ui.saveInvalido.titulo') })).toBeInTheDocument();
    expect(screen.getByText(t('ui.saveInvalido.versao'))).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: t('ui.saveInvalido.recomecar') }));
    expect(onRestart).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.voltar') }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('save danificado tem a sua própria frase; o foco abre no título', () => {
    render(<SaveInvalido reason="danificado" onRestart={() => {}} onBack={() => {}} />);
    expect(screen.getByText(t('ui.saveInvalido.danificado'))).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
  });
});
