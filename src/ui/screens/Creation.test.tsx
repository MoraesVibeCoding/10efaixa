import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import avatarData from '../../data/avatar.json';
import biotypeData from '../../data/biotype.json';
import visuais from '../../data/visuais.json';
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
    expect(field('numero')).toHaveValue('7');
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

    it('v2.63: a 10 não se escolhe na criação (se conquista em campo)', () => {
      setup();
      fillIdentity();
      fireEvent.change(field('numero'), { target: { value: '10' } });
      advance();
      expect(field('numero')).toHaveAttribute('aria-invalid', 'true');
      expect(field('numero')).toHaveAccessibleDescription(t('creation.error.shirtNumber.reserved'));
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

  describe('visual (tela própria; 10 visuais prontos, T50g v2.36)', () => {
    const toVisual = (seed = 7) => { const view = setup(seed); fillIdentity(); advance(); return view; };
    const LIST = visuais.visuais;
    const checkedVisual = () => checkedIn('visuais.titulo')[0]!;
    const arrow = (name: string) => screen.getByRole('button', { name: t(`ui.criacao.visuais.${name}`) });

    it('um grupo de rádio com os 10 visuais ("Visual 1" a "Visual 10"), um marcado, sem nomes de pessoas', () => {
      toVisual();
      const radios = within(group('visuais.titulo')).getAllByRole('radio');
      expect(radios.map((r) => (r as HTMLInputElement).value)).toEqual(LIST.map((v) => v.id));
      for (const v of LIST) expect(within(group('visuais.titulo')).getByRole('radio', { name: t('ui.criacao.visuais.nome', { n: v.n }) })).toBeInTheDocument();
      expect(checkedIn('visuais.titulo')).toHaveLength(1);
    });

    it('o visual inicial vem da semente: mesma semente, mesmo visual; sementes diferentes variam', () => {
      const a = toVisual(42); const first = checkedVisual(); a.unmount();
      toVisual(42);
      expect(checkedVisual()).toBe(first);
      cleanup();
      const seen = new Set<string>();
      for (let seed = 1; seed <= 12; seed++) { const v = toVisual(seed); seen.add(checkedVisual()); v.unmount(); }
      expect(seen.size).toBeGreaterThan(1);
    });

    it('o herói mostra a imagem pintada do visual marcado e o nome "Visual N" (a imagem é decorativa)', () => {
      const { container } = toVisual();
      const v = LIST.find((x) => x.id === checkedVisual())!;
      const img = container.querySelector('.heroi__retrato')!;
      expect(img).toHaveAttribute('src', expect.stringContaining(v.id));
      expect(img).toHaveAttribute('alt', '');
      expect(container.querySelector('.heroi')).toHaveTextContent(t('ui.criacao.visuais.nome', { n: v.n }));
    });

    it('as setas passam de um visual ao outro e voltam ao começo no fim da lista (nos dois sentidos)', () => {
      toVisual();
      const ids = LIST.map((v) => v.id);
      const start = ids.indexOf(checkedVisual());
      fireEvent.click(arrow('proximo'));
      expect(checkedVisual()).toBe(ids[(start + 1) % ids.length]);
      fireEvent.click(arrow('anterior'));
      fireEvent.click(arrow('anterior'));
      expect(checkedVisual()).toBe(ids[(start - 1 + ids.length) % ids.length]);
    });

    it('escolher uma miniatura atualiza o herói e a frase para o leitor de tela ("Visual N de 10")', () => {
      const { container } = toVisual();
      const other = LIST.find((v) => v.id !== checkedVisual())!;
      fireEvent.click(within(group('visuais.titulo')).getByRole('radio', { name: t('ui.criacao.visuais.nome', { n: other.n }) }));
      expect(container.querySelector('.heroi__retrato')).toHaveAttribute('src', expect.stringContaining(other.id));
      expect(screen.getByRole('status')).toHaveTextContent(t('ui.criacao.visuais.descricao', { n: other.n, total: LIST.length }));
    });

    it('não há mais escolha peça por peça nem "Sortear" na tela', () => {
      toVisual();
      for (const k of ['pele', 'cabelo', 'corDoCabelo', 'barba', 'faixa', 'chuteira']) expect(screen.queryByRole('radiogroup', { name: t(`ui.criacao.aparencia.${k}`) }), k).toBeNull();
      expect(screen.queryByRole('button', { name: t('ui.criacao.quemE.sortear') })).toBeNull();
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
    // v2.46: 9 camisas, da defesa ao ataque (ordem do teclado), cobrindo todas as posições com faixa de altura
    expect(order).toEqual(['goleiro', 'zagueiro', 'lateral-esquerdo', 'lateral-direito', 'volante', 'meia', 'ponta-esquerda', 'ponta-direita', 'atacante']);
    expect([...new Set(order.map((v) => v.split('-')[0]))].sort()).toEqual(Object.keys(biotypeData.heightRangesCm).sort());
    expect(within(group('emCampo.perna')).getAllByRole('radio')).toHaveLength(2);
    expect(within(group('emCampo.compleicao')).getAllByRole('radio')).toHaveLength(3);
    expect(within(group('emCampo.temperamento')).getAllByRole('radio')).toHaveLength(4);
    expect(within(group('emCampo.mentalidade')).getAllByRole('radio')).toHaveLength(4);
    expect(height()).toBeInTheDocument();
  });

  it('v2.46: a camisa marcada leva o número do jogador; o leitor de tela ouve a vaga por extenso', () => {
    toField();
    const pe = radio('emCampo.posicao', 'Ponta esquerda');
    fireEvent.click(pe);
    expect(pe).toBeChecked();
    expect(pe.closest('label')).toHaveTextContent('7');
    expect(radio('emCampo.posicao', 'Atacante').closest('label')).toHaveTextContent('ATA');
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
    expect(input).toMatchObject({ name: 'Dudu Maestro', shirtNumber: 7, state: 'BA', heartClub: null, position: 'atacante', archetypeId: 'matador', temperament: 'frio', celebration: 'aviaozinho', origin: 'varzea' });
    for (const k of Object.keys(look)) expect(input).not.toHaveProperty(k);
    expect(look).toHaveProperty('skin');
    const { visual } = onFinish.mock.calls[0]![0];
    expect(visuais.visuais.find((v) => v.id === visual)!.look).toEqual(look);
    expect(input).not.toHaveProperty('visual');
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
    expect(group('visuais.titulo')).toBeInTheDocument();
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
