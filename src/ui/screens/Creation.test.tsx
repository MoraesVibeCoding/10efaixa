import { fireEvent, render, screen, within } from '@testing-library/react';
import avatarData from '../../data/avatar.json';
import biotypeData from '../../data/biotype.json';
import { ARCHETYPES, archetypesFor } from '../../engine/archetypes';
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

describe('tela 2: em campo e cabeça (T50d, v2.30)', () => {
  const toField = () => {
    const view = setup();
    fillIdentity();
    advance();
    return view;
  };
  const radio = (k: string, name: string | RegExp) => within(group(k)).getByRole('radio', { name });
  const height = () => screen.getByRole('slider', { name: t('ui.criacao.emCampo.altura') });

  it('abre com posição, perna, compleição, temperamento e mentalidade como grupos; altura como controle deslizante', () => {
    toField();
    expect(title('emCampo')).toBeInTheDocument();
    const order = within(group('emCampo.posicao')).getAllByRole('radio').map((r) => (r as HTMLInputElement).value);
    // ordem do teclado = ordem visual do campinho, e todas as posições com faixa de altura aparecem
    expect(order).toEqual(['goleiro', 'zagueiro', 'lateral', 'volante', 'meia', 'atacante']);
    expect([...order].sort()).toEqual(Object.keys(biotypeData.heightRangesCm).sort());
    expect(within(group('emCampo.perna')).getAllByRole('radio')).toHaveLength(2);
    expect(within(group('emCampo.compleicao')).getAllByRole('radio')).toHaveLength(3);
    expect(within(group('emCampo.temperamento')).getAllByRole('radio')).toHaveLength(4);
    expect(within(group('emCampo.mentalidade')).getAllByRole('radio')).toHaveLength(4);
    expect(height()).toBeInTheDocument();
  });

  it('sem posição, o estilo pede a posição primeiro; com posição, mostra só os arquétipos dela', () => {
    toField();
    expect(screen.getByText(t('ui.criacao.emCampo.estiloPrimeiro'))).toBeInTheDocument();
    fireEvent.click(radio('emCampo.posicao', t('positions.meia')));
    expect(within(group('emCampo.estilo')).getAllByRole('radio')).toHaveLength(archetypesFor('meia').length);
  });

  it('o estilo escolhido mostra o traço e a inspiração (flag), em palavras', () => {
    toField();
    fireEvent.click(radio('emCampo.posicao', t('positions.meia')));
    fireEvent.click(radio('emCampo.estilo', t('archetypes.archetype.classico10')));
    const zico = ARCHETYPES.find((a) => a.id === 'classico10')!;
    const trait = t('ui.criacao.emCampo.traco', { traco: zico.traits.map((k) => t(`archetypes.trait.${k}`)).join(' / ') });
    expect(group('emCampo.estilo')).toHaveAccessibleDescription(`${trait} · ${t('archetypes.inspiracao', { lenda: zico.inspiracao })}`);
  });

  it('trocar para uma posição sem o estilo escolhido limpa o estilo', () => {
    toField();
    fireEvent.click(radio('emCampo.posicao', t('positions.meia')));
    fireEvent.click(radio('emCampo.estilo', t('archetypes.archetype.classico10')));
    fireEvent.click(radio('emCampo.posicao', t('positions.zagueiro')));
    expect(within(group('emCampo.estilo')).getAllByRole('radio').every((r) => !(r as HTMLInputElement).checked)).toBe(true);
  });

  it('a altura respeita a faixa da posição e se ajusta ao trocar de posição', () => {
    toField();
    fireEvent.click(radio('emCampo.posicao', t('positions.goleiro')));
    const gk = biotypeData.heightRangesCm.goleiro;
    expect(height()).toHaveAttribute('min', String(gk.min));
    expect(height()).toHaveAttribute('max', String(gk.max));
    expect(Number((height() as HTMLInputElement).value)).toBeGreaterThanOrEqual(gk.min);
    fireEvent.change(height(), { target: { value: '195' } });
    fireEvent.click(radio('emCampo.posicao', t('positions.meia')));
    expect(height()).toHaveValue(String(biotypeData.heightRangesCm.meia.max));
    expect(height()).toHaveAttribute('aria-valuetext', t('ui.criacao.emCampo.metros', { altura: '1,85' }));
  });

  it('sem posição, estilo e temperamento, não avança: mostra os erros e o foco vai para a posição', () => {
    toField();
    advance();
    expect(group('emCampo.posicao')).toHaveAccessibleDescription(t('creation.error.position.invalid'));
    expect(group('emCampo.temperamento')).toHaveAccessibleDescription(t('creation.error.temperament.invalid'));
    expect(within(group('emCampo.posicao')).getAllByRole('radio')[0]).toHaveFocus();
    expect(title('emCampo')).toBeInTheDocument();
  });

  it('completa, avança para o tipo de início; mentalidade é opcional; o Voltar mantém as escolhas', () => {
    toField();
    fireEvent.click(radio('emCampo.posicao', t('positions.atacante')));
    fireEvent.click(radio('emCampo.estilo', t('archetypes.archetype.matador')));
    fireEvent.click(radio('emCampo.temperamento', t('creation.temperament.frio')));
    advance();
    expect(title('origem')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.voltar') }));
    expect(radio('emCampo.posicao', t('positions.atacante'))).toBeChecked();
    expect(radio('emCampo.estilo', t('archetypes.archetype.matador'))).toBeChecked();
  });
});
