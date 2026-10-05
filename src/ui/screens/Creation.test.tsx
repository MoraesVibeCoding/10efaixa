import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import avatarData from '../../data/avatar.json';
import biotypeData from '../../data/biotype.json';
import { ARCHETYPES, archetypesFor } from '../../engine/archetypes';
import { CLUBS } from '../../engine/clubs';
import { createPlayer } from '../../engine/player';
import { createPrng } from '../../engine/prng';
import { CREATION_STEPS } from '../../state/flow';
import { t } from '../../i18n';
import { Creation } from './Creation';

// T50 (SPEC 6.1, v2.30; v2.35): criação em três telas + tipo de início. Tela 1 "quem é ele": identidade. Tela 2 "seu visual".
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

  it('abre na tela 1 com os campos de identidade rotulados', () => {
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

  it('com a tela 1 válida, avança com Enter para o visual e o Voltar mantém o que foi preenchido', () => {
    setup();
    fillIdentity();
    fireEvent.submit(field('nome').closest('form')!);
    expect(title('visual')).toBeInTheDocument();
    expect(title('visual')).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.voltar') }));
    expect(field('nome')).toHaveValue('Dudu Maestro');
    expect(field('estado')).toHaveValue('BA');
  });

  it('Voltar na tela 1 sai da criação', () => {
    const { onExit } = setup();
    fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.voltar') }));
    expect(onExit).toHaveBeenCalledOnce();
  });

  describe('visual (tela própria; sorteado ao abrir, editável)', () => {
    const toVisual = (seed = 7) => { const view = setup(seed); fillIdentity(); advance(); return view; };
    const LOOK = ['pele', 'cabelo', 'corDoCabelo', 'barba', 'faixa', 'chuteira'].map((k) => `aparencia.${k}`);
    const snapshot = () => LOOK.map(checkedIn);

    it('seis grupos de rádio, cada um com exatamente um valor marcado', () => {
      toVisual();
      for (const k of LOOK) expect(checkedIn(k)).toHaveLength(1);
      expect(within(group('aparencia.pele')).getAllByRole('radio')).toHaveLength(avatarData.skinTones.length);
      expect(within(group('aparencia.cabelo')).getAllByRole('radio')).toHaveLength(avatarData.styles.hair.length);
    });

    it('o sorteio inicial vem da semente: mesma semente, mesmo visual', () => {
      const a = toVisual(42); const first = snapshot(); a.unmount();
      toVisual(42);
      expect(snapshot()).toEqual(first);
    });

    it('"Sortear" fica junto do título do visual e troca o visual; a escolha continua editável', () => {
      toVisual(42);
      const before = snapshot();
      const sortear = screen.getByRole('button', { name: t('ui.criacao.quemE.sortear') });
      expect(sortear.closest('.criacao__secao')).toHaveTextContent(t('ui.criacao.quemE.visual'));
      for (let i = 0; i < 5 && JSON.stringify(snapshot()) === JSON.stringify(before); i++) fireEvent.click(sortear);
      expect(snapshot()).not.toEqual(before);
      fireEvent.click(within(group('aparencia.barba')).getByRole('radio', { name: t('creation.beard.cavanhaque') }));
      expect(checkedIn('aparencia.barba')).toEqual(['cavanhaque']);
    });

    it('a prévia é anunciada ao leitor de tela quando o visual muda', () => {
      toVisual();
      fireEvent.click(within(group('aparencia.cabelo')).getByRole('radio', { name: t('creation.hairStyle.black-power') }));
      expect(screen.getByRole('status')).toHaveTextContent(new RegExp(t('creation.hairStyle.black-power'), 'i'));
    });

    it('grupos de cor mostram o nome da escolhida sob o rótulo e acompanham a escolha (sem ocupar linha nova)', () => {
      const { container } = toVisual();
      const shown = (k: string) => group(k).closest('.escolhas')!.querySelector('.escolhas__escolhida');
      expect(shown('aparencia.pele')).toHaveTextContent(t(`creation.skin.${checkedIn('aparencia.pele')[0]}`));
      const other = within(group('aparencia.pele')).getAllByRole('radio').find((r) => !(r as HTMLInputElement).checked)!;
      fireEvent.click(other);
      expect(shown('aparencia.pele')).toHaveTextContent(t(`creation.skin.${(other as HTMLInputElement).value}`));
      expect(shown('aparencia.pele')).toHaveAttribute('aria-hidden', 'true');
      // o nome do grupo para o leitor de tela continua só o rótulo
      expect(screen.getByRole('radiogroup', { name: t('ui.criacao.aparencia.pele') })).toBeInTheDocument();
      // barba (texto, não cor) não ganha o nome repetido
      expect(group('aparencia.barba').closest('.escolhas')!.querySelector('.escolhas__escolhida')).toBeNull();
      expect(container.querySelectorAll('.escolhas__escolhida').length).toBeGreaterThan(0);
    });

    describe('avatar-herói (T50g, v2.35)', () => {
      const HAIR = avatarData.styles.hair;
      const hairNow = () => checkedIn('aparencia.cabelo')[0]!;
      const arrow = (name: string) => screen.getByRole('button', { name: t(`ui.criacao.aparencia.${name}`) });

      it('mostra o busto grande, o rótulo "Seu avatar" e o nome do cabelo atual', async () => {
        const { container } = toVisual();
        await waitFor(() => expect(container.querySelector('.heroi__busto')).toHaveAttribute('src', expect.stringMatching(/^data:image\/svg\+xml,/)));
        const heroi = container.querySelector('.heroi')!;
        expect(heroi).toHaveTextContent(t('ui.criacao.aparencia.seuAvatar'));
        expect(heroi).toHaveTextContent(t(`creation.hairStyle.${hairNow()}`));
        expect(container.querySelector('.heroi__busto')).toHaveAttribute('alt', '');
      });

      it('as setas trocam o cabelo em ordem e voltam ao começo no fim da lista (nos dois sentidos)', () => {
        toVisual();
        const start = HAIR.indexOf(hairNow());
        fireEvent.click(arrow('cabeloProximo'));
        expect(hairNow()).toBe(HAIR[(start + 1) % HAIR.length]);
        fireEvent.click(arrow('cabeloAnterior'));
        fireEvent.click(arrow('cabeloAnterior'));
        expect(hairNow()).toBe(HAIR[(start - 1 + HAIR.length) % HAIR.length]);
      });

      it('uma miniatura por cabelo, como rádios do mesmo grupo, cada uma com a imagem do penteado', async () => {
        const { container } = toVisual();
        const radios = within(group('aparencia.cabelo')).getAllByRole('radio');
        expect(radios.map((r) => (r as HTMLInputElement).value)).toEqual(HAIR);
        await waitFor(() => expect(container.querySelectorAll('.escolha__miniatura').length).toBe(HAIR.length));
        for (const img of container.querySelectorAll('.escolha__miniatura')) expect(img).toHaveAttribute('alt', '');
      });

      it('escolher uma miniatura atualiza o herói', () => {
        const { container } = toVisual();
        const other = HAIR.find((h) => h !== hairNow())!;
        fireEvent.click(within(group('aparencia.cabelo')).getByRole('radio', { name: t(`creation.hairStyle.${other}`) }));
        expect(container.querySelector('.heroi')).toHaveTextContent(t(`creation.hairStyle.${other}`));
      });

      it('o cabelo só existe no herói: não há um segundo grupo de cabelo na tela', () => {
        toVisual();
        expect(screen.getAllByRole('radiogroup', { name: t('ui.criacao.aparencia.cabelo') })).toHaveLength(1);
      });
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

describe('tela 3: tipo de início e fim da criação (T50e, v2.30)', () => {
  const toOrigin = () => {
    const view = setup();
    fillIdentity();
    advance();
    advance();
    fireEvent.click(within(group('emCampo.posicao')).getByRole('radio', { name: t('positions.atacante') }));
    fireEvent.click(within(group('emCampo.estilo')).getByRole('radio', { name: t('archetypes.archetype.matador') }));
    fireEvent.click(within(group('emCampo.temperamento')).getByRole('radio', { name: t('creation.temperament.frio') }));
    advance();
    return view;
  };

  it('mostra as três origens com uma frase cada, sem números', () => {
    toOrigin();
    expect(title('origem')).toBeInTheDocument();
    const radios = within(group('origem.titulo')).getAllByRole('radio');
    expect(radios.map((r) => (r as HTMLInputElement).value)).toEqual(['baseGrande', 'peneira', 'varzea']);
    for (const id of ['baseGrande', 'peneira', 'varzea']) {
      const text = t(`ui.criacao.origem.${id}`);
      expect(screen.getByText(text)).toBeInTheDocument();
      expect(text).not.toMatch(/\d/);
    }
  });

  it('sem origem não conclui', () => {
    const { onFinish } = toOrigin();
    advance();
    expect(group('origem.titulo')).toHaveAccessibleDescription(t('creation.error.origin.invalid'));
    expect(onFinish).not.toHaveBeenCalled();
  });

  it('conclui com um CreationInput que o motor aceita; o visual vai à parte e não entra no motor', () => {
    const { onFinish } = toOrigin();
    fireEvent.click(within(group('origem.titulo')).getByRole('radio', { name: t('creation.origin.varzea') }));
    advance();
    expect(onFinish).toHaveBeenCalledOnce();
    const { input, look } = onFinish.mock.calls[0]![0];
    expect(createPlayer(input, createPrng(1)).ok).toBe(true);
    expect(input).toMatchObject({ name: 'Dudu Maestro', shirtNumber: 10, state: 'BA', heartClub: null, position: 'atacante', archetypeId: 'matador', temperament: 'frio', celebration: 'aviaozinho', origin: 'varzea' });
    for (const k of Object.keys(look)) expect(input).not.toHaveProperty(k);
    expect(look).toHaveProperty('skin');
  });
});

describe('computador (≥ 64rem): identidade e visual juntos (T50e, v2.30; v2.35)', () => {
  const desktop = (matches: boolean) => vi.stubGlobal('matchMedia', (q: string) => ({ matches, media: q, addEventListener() {}, removeEventListener() {} }));
  afterEach(() => vi.unstubAllGlobals());

  it('mostra identidade e visual na mesma tela, em 3 páginas no total', () => {
    desktop(true);
    setup();
    expect(screen.getByText(t('ui.criacao.progresso', { passo: 1, total: 3 }))).toBeInTheDocument();
    expect(field('nome')).toBeInTheDocument();
    expect(group('aparencia.pele')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: t('ui.criacao.passos.visual') })).toBeInTheDocument();
  });

  it('valida a identidade e, completa, vai a "em campo"; depois ao tipo de início', () => {
    desktop(true);
    setup();
    fillIdentity();
    advance();
    expect(title('emCampo')).toBeInTheDocument();
    advance();
    expect(group('emCampo.posicao')).toHaveAccessibleDescription(t('creation.error.position.invalid'));
    fireEvent.click(within(group('emCampo.posicao')).getByRole('radio', { name: t('positions.atacante') }));
    fireEvent.click(within(group('emCampo.estilo')).getByRole('radio', { name: t('archetypes.archetype.matador') }));
    fireEvent.click(within(group('emCampo.temperamento')).getByRole('radio', { name: t('creation.temperament.frio') }));
    advance();
    expect(title('origem')).toBeInTheDocument();
    expect(screen.getByText(t('ui.criacao.progresso', { passo: 3, total: 3 }))).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.voltar') }));
    fireEvent.click(screen.getByRole('button', { name: t('ui.criacao.voltar') }));
    expect(field('nome')).toHaveValue('Dudu Maestro');
  });
});

describe('criação com superfícies suaves (T50g, SPEC 7 v2.34)', () => {
  const css = readFileSync(join(__dirname, 'Creation.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  it('sem borda grossa nem sombra dura: borda fina e sombra suave dos tokens', () => {
    expect(css).not.toContain('var(--forma-borda)');
    expect(css).not.toMatch(/var\(--forma-sombra\)\s+var\(--forma-sombra\)/);
    expect(css).toContain('var(--forma-borda-fina)');
    expect(css).toContain('var(--forma-sombra-suave)');
  });
  it('opção curta (barba, faixa de texto) é pílula', () => {
    expect(css).toMatch(/\.escolha__marca\s*\{[^}]*border-radius:\s*999px/);
  });
});
