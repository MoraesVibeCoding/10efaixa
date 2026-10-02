import { fireEvent, render, screen } from '@testing-library/react';
import { CREATION_STEPS } from '../../state/flow';
import { t } from '../../i18n';
import { Creation } from './Creation';

// T50 (a): esqueleto do assistente de criação (SPEC 6.1) e o passo do nome com o filtro.
const setup = () => {
  const onExit = vi.fn();
  const onFinish = vi.fn();
  render(<Creation onExit={onExit} onFinish={onFinish} />);
  return { onExit, onFinish };
};
const nameInput = () => screen.getByRole('textbox', { name: t('ui.criacao.nome.rotulo') });
const advance = () => fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.avancar') }));
const title = (step: string) => screen.getByRole('heading', { level: 1, name: t(`ui.criacao.passos.${step}`) });

describe('assistente de criação (T50)', () => {
  it('todo passo da 6.1 tem título em pt-BR', () => {
    for (const step of CREATION_STEPS) expect(() => t(`ui.criacao.passos.${step}`)).not.toThrow();
  });

  it('abre no passo 1 de 13, com o título do nome e o campo rotulado', () => {
    setup();
    expect(title('nome')).toBeInTheDocument();
    expect(screen.getByText(t('ui.criacao.progresso', { passo: 1, total: CREATION_STEPS.length }))).toBeInTheDocument();
    expect(nameInput()).toHaveAttribute('autocomplete', 'off');
  });

  it('nome vazio não avança: mostra o erro do filtro ligado ao campo e devolve o foco', () => {
    setup();
    advance();
    const input = nameInput();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(t('creation.error.name.empty'));
    expect(input).toHaveFocus();
    expect(title('nome')).toBeInTheDocument();
  });

  it('nome bloqueado não avança e mostra a mensagem de bloqueio', () => {
    setup();
    fireEvent.change(nameInput(), { target: { value: 'Garrincha' } });
    advance();
    expect(nameInput()).toHaveAccessibleDescription(t('creation.error.name.blocked'));
  });

  it('nome válido avança com Enter (envio do formulário) e o Voltar mantém o que foi digitado', () => {
    setup();
    fireEvent.change(nameInput(), { target: { value: 'Dudu Maestro' } });
    fireEvent.submit(nameInput().closest('form')!);
    expect(title('numero')).toBeInTheDocument();
    expect(screen.getByText(t('ui.criacao.progresso', { passo: 2, total: CREATION_STEPS.length }))).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.voltar') }));
    expect(nameInput()).toHaveValue('Dudu Maestro');
    expect(nameInput()).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('corrigir o nome limpa o erro', () => {
    setup();
    advance();
    fireEvent.change(nameInput(), { target: { value: 'Dudu' } });
    expect(nameInput()).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('Voltar no primeiro passo sai da criação', () => {
    const { onExit } = setup();
    fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.voltar') }));
    expect(onExit).toHaveBeenCalledOnce();
  });

  it('o título do passo recebe o foco ao trocar de passo (leitor de tela anuncia o passo novo)', () => {
    setup();
    fireEvent.change(nameInput(), { target: { value: 'Dudu Maestro' } });
    advance();
    expect(title('numero')).toHaveFocus();
  });
});
