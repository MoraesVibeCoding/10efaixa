import { fireEvent, render, screen, within } from '@testing-library/react';
import { CREATION_STEPS } from '../../state/flow';
import { t } from '../../i18n';
import avatarData from '../../data/avatar.json';
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

  describe('aparência (T50b): só visual, com a figurinha ao vivo', () => {
    const toLook = () => {
      setup();
      fireEvent.change(nameInput(), { target: { value: 'Dudu Maestro' } });
      while (!screen.queryByRole('heading', { level: 1, name: t('ui.criacao.passos.aparencia') })) advance();
    };
    const group = (k: string) => screen.getByRole('group', { name: t(`ui.criacao.aparencia.${k}`) });

    it('mostra os grupos de escolha com opções de rádio e um valor já marcado em cada', () => {
      toLook();
      for (const k of ['pele', 'cabelo', 'corDoCabelo', 'barba', 'faixa', 'chuteira']) {
        const radios = within(group(k)).getAllByRole('radio');
        expect(radios.length).toBeGreaterThan(1);
        expect(radios.filter((r) => (r as HTMLInputElement).checked)).toHaveLength(1);
      }
      expect(within(group('pele')).getAllByRole('radio')).toHaveLength(10);
      expect(within(group('cabelo')).getAllByRole('radio')).toHaveLength(8);
    });

    it('a aparência padrão (avatar.json) aponta para opções que existem', () => {
      const { skinTones, hairColors, styles, escolhas } = avatarData;
      const d = escolhas.padrao;
      expect(skinTones.map((o) => o.id)).toContain(d.skin);
      expect(styles.hair).toContain(d.hairStyle);
      expect(hairColors.map((o) => o.id)).toContain(d.hairColor);
      expect(escolhas.chuteiras.map((o) => o.id)).toContain(d.boots);
      expect([null, ...styles.beards]).toContain(d.beard);
      expect([null, ...escolhas.faixas.map((o) => o.id)]).toContain(d.headband);
    });

    it('a figurinha ao vivo mostra o nome digitado', () => {
      toLook();
      expect(screen.getByText('Dudu Maestro', { selector: '.figurinha__nome' })).toBeInTheDocument();
    });

    it('trocar o cabelo atualiza a descrição anunciada da prévia', () => {
      toLook();
      fireEvent.click(within(group('cabelo')).getByRole('radio', { name: t('creation.hairStyle.black-power') }));
      expect(screen.getByRole('status')).toHaveTextContent(new RegExp(t('creation.hairStyle.black-power'), 'i'));
    });

    it('a escolha continua marcada depois de voltar e avançar', () => {
      toLook();
      fireEvent.click(within(group('barba')).getByRole('radio', { name: t('creation.beard.cavanhaque') }));
      fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.voltar') }));
      advance();
      expect(within(group('barba')).getByRole('radio', { name: t('creation.beard.cavanhaque') })).toBeChecked();
    });
  });

  it('o título do passo recebe o foco ao trocar de passo (leitor de tela anuncia o passo novo)', () => {
    setup();
    fireEvent.change(nameInput(), { target: { value: 'Dudu Maestro' } });
    advance();
    expect(title('numero')).toHaveFocus();
  });
});
