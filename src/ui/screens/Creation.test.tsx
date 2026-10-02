import { fireEvent, render, screen, within } from '@testing-library/react';
import avatarData from '../../data/avatar.json';
import { CLUBS } from '../../engine/clubs';
import { CREATION_STEPS } from '../../state/flow';
import { t } from '../../i18n';
import { Creation } from './Creation';

// T50 (SPEC 6.1, v2.30): criação em duas telas + tipo de início. Tela 1 "quem é ele": identidade e visual.
const setup = (seed = 7) => {
  const onExit = vi.fn();
  const onFinish = vi.fn();
  const view = render(<Creation onExit={onExit} onFinish={onFinish} seed={seed} />);
  return { onExit, onFinish, ...view };
};
const field = (k: string) => screen.getByLabelText(t(`ui.criacao.quemE.${k}`));
const advance = () => fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.avancar') }));
const title = (step: string) => screen.getByRole('heading', { level: 1, name: t(`ui.criacao.passos.${step}`) });
const group = (k: string) => screen.getByRole('radiogroup', { name: t(`ui.criacao.${k}`) });
const checkedIn = (k: string) => within(group(k)).getAllByRole('radio').filter((r) => (r as HTMLInputElement).checked).map((r) => (r as HTMLInputElement).value);

/** Preenche a tela 1 com valores válidos. */
const fillIdentity = () => {
  fireEvent.change(field('nome'), { target: { value: 'Dudu Maestro' } });
  fireEvent.change(field('estado'), { target: { value: 'BA' } });
  fireEvent.click(within(group('quemE.comemoracao')).getByRole('radio', { name: t('creation.celebration.aviaozinho') }));
};

describe('criação (T50, v2.30)', () => {
  it('cada tela tem título em pt-BR', () => {
    for (const step of CREATION_STEPS) expect(() => t(`ui.criacao.passos.${step}`)).not.toThrow();
  });

  it('abre na tela 1 de 3 com os campos de identidade rotulados', () => {
    setup();
    expect(title('quemE')).toBeInTheDocument();
    expect(screen.getByText(t('ui.criacao.progresso', { passo: 1, total: CREATION_STEPS.length }))).toBeInTheDocument();
    expect(field('nome')).toHaveAttribute('autocomplete', 'off');
    expect(field('numero')).toHaveValue('10');
    expect(field('estado')).toHaveValue('');
    expect(field('clube')).toHaveValue('');
  });

  describe('validação', () => {
    it('com tudo vazio, não avança: cada campo mostra o seu erro e o foco vai para o primeiro', () => {
      setup();
      fireEvent.change(field('numero'), { target: { value: '' } });
      advance();
      expect(field('nome')).toHaveAttribute('aria-invalid', 'true');
      expect(field('nome')).toHaveAccessibleDescription(t('creation.error.name.empty'));
      expect(field('numero')).toHaveAccessibleDescription(t('creation.error.shirtNumber.invalid'));
      expect(field('estado')).toHaveAccessibleDescription(t('creation.error.state.invalid'));
      expect(group('quemE.comemoracao')).toHaveAccessibleDescription(t('creation.error.celebration.invalid'));
      expect(field('nome')).toHaveFocus();
      expect(title('quemE')).toBeInTheDocument();
    });

    it('nome bloqueado pelo filtro não avança', () => {
      setup();
      fillIdentity();
      fireEvent.change(field('nome'), { target: { value: 'Garrincha' } });
      advance();
      expect(field('nome')).toHaveAccessibleDescription(t('creation.error.name.blocked'));
    });

    it('número fora de 1–99 não avança', () => {
      setup();
      fillIdentity();
      fireEvent.change(field('numero'), { target: { value: '100' } });
      advance();
      expect(field('numero')).toHaveAttribute('aria-invalid', 'true');
    });

    it('corrigir um campo limpa só o erro dele', () => {
      setup();
      advance();
      fireEvent.change(field('nome'), { target: { value: 'Dudu' } });
      expect(field('nome')).not.toHaveAttribute('aria-invalid', 'true');
      expect(field('estado')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('clube de coração: "Nenhum" por padrão e os clubes do estado natal primeiro', () => {
    setup();
    fireEvent.change(field('estado'), { target: { value: 'BA' } });
    const groups = within(field('clube')).getAllByRole('group');
    const first = within(groups[0]!).getAllByRole('option').map((o) => (o as HTMLOptionElement).value);
    expect(first.length).toBeGreaterThan(0);
    expect(first.every((id) => CLUBS.find((c) => c.id === id)!.uf === 'BA')).toBe(true);
    expect(within(field('clube')).getByRole('option', { name: t('ui.criacao.quemE.nenhum') })).toHaveValue('');
  });

  it('com a tela 1 válida, avança com Enter e o Voltar mantém o que foi preenchido', () => {
    setup();
    fillIdentity();
    fireEvent.submit(field('nome').closest('form')!);
    expect(title('emCampo')).toBeInTheDocument();
    expect(title('emCampo')).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.voltar') }));
    expect(field('nome')).toHaveValue('Dudu Maestro');
    expect(field('estado')).toHaveValue('BA');
  });

  it('Voltar na tela 1 sai da criação', () => {
    const { onExit } = setup();
    fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.voltar') }));
    expect(onExit).toHaveBeenCalledOnce();
  });

  describe('visual (só visual; sorteado ao abrir, editável)', () => {
    const LOOK = ['pele', 'cabelo', 'corDoCabelo', 'barba', 'faixa', 'chuteira'].map((k) => `aparencia.${k}`);
    const snapshot = () => LOOK.map(checkedIn);

    it('seis grupos de rádio, cada um com exatamente um valor marcado', () => {
      setup();
      for (const k of LOOK) expect(checkedIn(k)).toHaveLength(1);
      expect(within(group('aparencia.pele')).getAllByRole('radio')).toHaveLength(avatarData.skinTones.length);
      expect(within(group('aparencia.cabelo')).getAllByRole('radio')).toHaveLength(avatarData.styles.hair.length);
    });

    it('o sorteio inicial vem da semente: mesma semente, mesmo visual', () => {
      const a = setup(42); const first = snapshot(); a.unmount();
      setup(42);
      expect(snapshot()).toEqual(first);
    });

    it('"Sortear" fica junto do título do visual e troca o visual; a escolha continua editável', () => {
      setup(42);
      const before = snapshot();
      const sortear = screen.getByRole('button', { name: t('ui.criacao.quemE.sortear') });
      expect(sortear.closest('.criacao__secao')).toHaveTextContent(t('ui.criacao.quemE.visual'));
      for (let i = 0; i < 5 && JSON.stringify(snapshot()) === JSON.stringify(before); i++) fireEvent.click(sortear);
      expect(snapshot()).not.toEqual(before);
      fireEvent.click(within(group('aparencia.barba')).getByRole('radio', { name: t('creation.beard.cavanhaque') }));
      expect(checkedIn('aparencia.barba')).toEqual(['cavanhaque']);
    });

    it('a figurinha ao vivo mostra o nome e a prévia é anunciada', () => {
      setup();
      fireEvent.change(field('nome'), { target: { value: 'Dudu Maestro' } });
      expect(screen.getByText('Dudu Maestro', { selector: '.figurinha__nome' })).toBeInTheDocument();
      fireEvent.click(within(group('aparencia.cabelo')).getByRole('radio', { name: t('creation.hairStyle.black-power') }));
      expect(screen.getByRole('status')).toHaveTextContent(new RegExp(t('creation.hairStyle.black-power'), 'i'));
    });

    it('a aparência padrão e as chances do sorteio (avatar.json) são válidas', () => {
      const { skinTones, hairColors, styles, escolhas } = avatarData;
      const d = escolhas.padrao;
      expect(skinTones.map((o) => o.id)).toContain(d.skin);
      expect(styles.hair).toContain(d.hairStyle);
      expect(hairColors.map((o) => o.id)).toContain(d.hairColor);
      expect(escolhas.chuteiras.map((o) => o.id)).toContain(d.boots);
      expect([null, ...styles.beards]).toContain(d.beard);
      expect([null, ...escolhas.faixas.map((o) => o.id)]).toContain(d.headband);
      for (const [k, p] of Object.entries(escolhas.sorteio)) if (!k.startsWith('_')) { expect(p).toBeGreaterThanOrEqual(0); expect(p).toBeLessThanOrEqual(1); }
    });
  });
});
