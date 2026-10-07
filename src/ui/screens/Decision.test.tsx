import { readFileSync } from 'node:fs';
import tokens from '../theme/tokens.json';
import { resolve } from 'node:path';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import events from '../../data/events.json';
import { previewOf } from '../../engine/preview';
import { t } from '../../i18n';
import { Decision } from './Decision';
import { kitOf } from '../../art/kits';
import libertaArt from '../../assets/art/provisoria/detalhe/detalhe__trofeu-continental-principal.svg';

const EVENT = 'salario-atrasado';
const def = events.eventos.find((e) => e.id === EVENT)!;
const PLAYER = {
  name: 'Dudu Maestro', position: 'meia', clubId: 'flamengo', overall: 78, titles: ['estadual', 'estadual', 'copaDoBrasil'],
  role: 'titularRegular', monthlySalary: { amount: 180_000, currency: 'BRL' as const }, marketValueEUR: 12_500_000,
};
const setup = (onChoose = vi.fn()) => {
  render(<Decision eventId={EVENT} age={17} progress={0.05} player={PLAYER} scene={{ src: 'cena.webp', alt: 'O jogador na sala do empresário' }} onChoose={onChoose} />);
  return onChoose;
};

const STATE = { moral: 0.6, relacaoTecnico: 0.6, idolatria: 40, idolatriaCoracao: 55, disciplina: 0.7, patrimonio: 2_000_000, salarioFator: 1 };

describe('resultado da escolha (SPEC v2.20)', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  const open = (onContinue = vi.fn()) => {
    render(<Decision eventId="salario-atrasado" age={24} progress={0.4} player={{ name: 'Zé', position: 'meia', clubId: 'flamengo', overall: 60, titles: [], role: 'composicao', monthlySalary: { amount: 4_000, currency: 'BRL' } }} state={STATE} scene={{ src: 'c.webp', alt: 'cena' }} onContinue={onContinue} />);
    fireEvent.click(screen.getByRole('button', { name: new RegExp(t('events.salario-atrasado.opcoes.ficar')) }));
    fireEvent.click(screen.getByRole('button', { name: t('ui.decisao.confirmar') }));
    return onContinue;
  };

  it('as opções não mostram mais o jeito: só o texto e o resumo das consequências', () => {
    render(<Decision eventId="proposta-coracao" age={24} progress={0.4} player={{ name: 'Zé', position: 'meia', clubId: 'flamengo', overall: 60, titles: [], role: 'composicao', monthlySalary: { amount: 4_000, currency: 'BRL' } }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    expect(within(screen.getByRole('group', { name: t('ui.decisao.opcoes') })).getAllByRole('button')).toHaveLength(3);
    for (const tmp of ['frio', 'esquentado', 'lider', 'resenha']) expect(screen.queryByText(new RegExp(t(`creation.temperament.${tmp}`)))).not.toBeInTheDocument();
  });

  it('depois de escolher, abre o resultado por cima da tela, com o ganho e a perda reais', () => {
    open();
    const dialog = screen.getByRole('dialog', { name: t('ui.resultado.misto') });
    expect(within(dialog).getByText(t('events.salario-atrasado.opcoes.ficar'))).toBeInTheDocument();
    expect(within(dialog).getByText(t('preview.campo.moral'))).toBeInTheDocument();
    expect(within(dialog).getByText(t('ui.resultado.pontos', { sinal: '−', n: 10 }))).toBeInTheDocument();
    expect(within(dialog).getByText(t('ui.resultado.pontos', { sinal: '+', n: 5 }))).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('data-resultado', 'aberto');
  });

  it('o bônus de Mental de um marco aparece em palavras, nunca em número (regra: nenhum número dos atributos)', () => {
    render(<Decision eventId="estreia-profissional" age={17} progress={0.2} player={{ name: 'Zé', position: 'meia', clubId: 'flamengo', overall: 60, titles: [], role: 'composicao', monthlySalary: { amount: 4_000, currency: 'BRL' } }} state={{ ...STATE, bonusMental: 0 }} scene={{ src: 'c.webp', alt: 'cena' }} onContinue={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: new RegExp(t('events.estreia-profissional.opcoes.respirar-e-jogar-simples')) }));
    fireEvent.click(screen.getByRole('button', { name: t('ui.decisao.confirmar') }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(t('preview.campo.bonusMental'))).toBeInTheDocument();
    expect(within(dialog).getByText(t('ui.resultado.palavra', { sinal: '+' }))).toBeInTheDocument();
    expect(within(dialog).queryByText(/pontos/)).toBeInTheDocument(); // o ganho de moral continua em número
    expect(within(dialog).queryByText(t('ui.resultado.pontos', { sinal: '+', n: 4 }))).toBeNull();
  });

  // T49b: no ritmo normal o resultado só fecha pelo botão ou Esc (WCAG 2.2.1); sozinho, só no ritmo Rápido
  it('no ritmo normal o resultado espera o jogador: não fecha sozinho', () => {
    const onContinue = open();
    act(() => { vi.advanceTimersByTime(10_000); });
    expect(onContinue).not.toHaveBeenCalled();
  });

  it('no ritmo Rápido segue sozinho depois de um instante, uma única vez', () => {
    const onContinue = vi.fn();
    render(<Decision eventId="salario-atrasado" age={24} progress={0.4} ritmo="rapido" player={{ name: 'Zé', position: 'meia', clubId: 'flamengo', overall: 60, titles: [], role: 'composicao', monthlySalary: { amount: 4_000, currency: 'BRL' } }} state={STATE} scene={{ src: 'c.webp', alt: 'cena' }} onContinue={onContinue} />);
    fireEvent.click(screen.getByRole('button', { name: new RegExp(t('events.salario-atrasado.opcoes.ficar')) }));
    expect(onContinue).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(10_000); });
    expect(onContinue).toHaveBeenCalledTimes(1);
    expect(onContinue).toHaveBeenCalledWith('ficar', expect.objectContaining({ moral: 0.5, idolatria: 45 }));
  });

  it('Esc segue, como o botão', () => {
    const onContinue = open();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('com o resultado aberto, o resto da tela fica inerte (sem foco nem clique por trás)', () => {
    open();
    const main = screen.getByRole('main');
    for (const el of main.querySelectorAll('.decisao__cena, .faixa, .decisao__topo, .decisao__painel')) expect(el).toHaveAttribute('inert');
    expect(screen.getByRole('dialog')).not.toHaveAttribute('inert');
  });

  it('quem não quer esperar segue pelo botão', () => {
    const onContinue = open();
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: t('ui.resultado.seguir') }));
    expect(onContinue).toHaveBeenCalledTimes(1);
    act(() => { vi.advanceTimersByTime(10_000); });
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});

describe('tela de decisão (T49: amostra; T51 completa)', () => {
  it('tema claro (SPEC v2.19), região principal e o título do evento como título da tela', () => {
    setup();
    expect(screen.getByRole('main')).toHaveAttribute('data-tema', 'claro');
    expect(screen.getByRole('heading', { level: 1, name: t(`events.${EVENT}.titulo`) })).toBeInTheDocument();
  });

  it('a cena tem texto alternativo', () => {
    setup();
    expect(screen.getByRole('img', { name: 'O jogador na sala do empresário' })).toBeInTheDocument();
  });

  it('faixa de progresso da carreira com nome acessível', () => {
    setup();
    const bar = screen.getByRole('progressbar', { name: t('ui.decisao.progresso') });
    expect(bar).toHaveAttribute('aria-valuenow', '5');
    expect(bar).toHaveAttribute('aria-valuetext', t('ui.decisao.idade', { idade: 17 }));
  });

  it('figurinha do jogador (SPEC v2.26): nome, "meia do Flamengo", OVR na medalha da faixa; é o botão que abre "Minha carreira"', () => {
    setup();
    const card = screen.getByRole('button', { name: new RegExp(t('ui.carreira.titulo')) });
    expect(card.querySelector('.figurinha')).not.toBeNull();
    expect(card).toHaveAccessibleName(/Dudu Maestro/);
    expect(within(card).getByText(t('ui.figurinha.posicaoNoClube', { posicao: t('positions.meia'), prep: t('ui.figurinha.prep.o'), clube: 'Flamengo' }))).toBeInTheDocument();
    const over = within(card).getByText('78').closest('[data-medalha]');
    expect(over).toHaveAttribute('data-medalha', 'platina');
    expect((over as HTMLElement).style.backgroundImage).toMatch(/platina/);
    expect(within(card).getByText(new RegExp(t('attributes.band.muitoBom')))).toBeInTheDocument();
  });

  it('título do evento com os selos do jogador ao lado: idade, tempo de jogo, salário do mês e valor de mercado (v2.22, v2.33)', () => {
    setup();
    expect(screen.getByRole('heading', { level: 1, name: t(`events.${EVENT}.titulo`) })).toBeInTheDocument();
    const selos = screen.getByRole('list', { name: t('ui.decisao.ficha') });
    expect(within(selos).getByText(t('ui.decisao.idade', { idade: 17 }))).toBeInTheDocument();
    expect(within(selos).getByText(t('ui.papel.titularRegular'))).toBeInTheDocument();
    expect(within(selos).getByText(/R\$\s180\smil/)).toBeInTheDocument();
    // v2.33: valor de mercado em euros junto do salário e do tempo de jogo
    expect(within(selos).getByText(/^Valor\s€\s12,5\smi$/)).toBeInTheDocument();
    // títulos, atributos e trajetória ficam na gaveta
    expect(screen.queryByRole('list', { name: t('ui.decisao.titulosLista') })).not.toBeInTheDocument();
  });

  it('álbum da carreira (v2.26): títulos conquistados com ×N e espaços vazios para as metas que faltam', () => {
    render(<Decision eventId={EVENT} age={24} progress={0.4} player={{ ...PLAYER, titles: ['estadual', 'estadual', 'serieA'] }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    const album = screen.getByRole('region', { name: t('ui.album.titulo') });
    const got = within(album).getByRole('list', { name: t('ui.album.conquistas') });
    expect(within(got).getByText(t('ui.titulo.estadual'))).toBeInTheDocument();
    expect(within(got).getByText(t('ui.decisao.vezes', { n: 2 }))).toBeInTheDocument();
    const missing = within(album).getByRole('list', { name: t('ui.album.faltam') });
    expect(within(missing).queryByText(t('ui.titulo.serieA'))).not.toBeInTheDocument();
    expect(within(missing).getByText(t('ui.album.meta.libertadores'))).toBeInTheDocument();
    expect(within(missing).getByText(t('ui.album.meta.camisa10'))).toBeInTheDocument();
  });

  describe('gaveta "Minha carreira" (SPEC v2.21)', () => {
    const opener = () => screen.getByRole('button', { name: new RegExp(t('ui.carreira.titulo')) });
    const openDrawer = (player = {}) => {
      render(<Decision eventId={EVENT} age={24} progress={0.4} player={{ ...PLAYER, ...player }} scene={{ src: 'c.webp', alt: 'cena' }} />);
      fireEvent.click(opener());
      return screen.getByRole('dialog', { name: t('ui.carreira.titulo') });
    };

    it('lista os marcos vividos como figurinhas: "Primeiro gol · Flamengo · 2027" (T25c)', () => {
      const dialog = openDrawer({ marcos: [{ id: 'primeiro-gol', ano: 2027, clubId: 'flamengo' }, { id: 'estreia-profissional', ano: 2026, clubId: 'flamengo' }] });
      const bloco = within(dialog).getByRole('heading', { name: t('ui.carreira.marcos') }).closest('section')!;
      expect(within(bloco).getByText(t('ui.album.cromoMarco', { marco: t('ui.album.marco.primeiro-gol'), clube: 'Flamengo', ano: 2027 }))).toBeInTheDocument();
      expect(within(bloco).getAllByRole('listitem')).toHaveLength(2);
    });

    it('sem marcos, a gaveta diz que ainda não há nenhum (T25c)', () => {
      const dialog = openDrawer();
      expect(within(dialog).getByText(t('ui.carreira.semMarcos'))).toBeInTheDocument();
    });

    it('fechada no começo; tocar na caixa do jogador abre', () => {
      setup();
      expect(opener()).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      fireEvent.click(opener());
      expect(opener()).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('dialog', { name: t('ui.carreira.titulo') })).toBeInTheDocument();
    });

    it('aberta, deixa o resto da tela inerte; Esc fecha de qualquer ponto e o foco volta para a caixa do jogador (T49b)', () => {
      openDrawer();
      const main = screen.getByRole('main');
      for (const el of main.querySelectorAll('.decisao__cena, .faixa, .decisao__topo, .decisao__painel')) expect(el).toHaveAttribute('inert');
      (document.activeElement as HTMLElement).blur();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      for (const el of main.querySelectorAll('.decisao__cena, .faixa, .decisao__topo, .decisao__painel')) expect(el).not.toHaveAttribute('inert');
      expect(opener()).toHaveFocus();
    });

    it('o foco só volta para a caixa do jogador depois que a tela deixou de ser inerte (navegador recusa foco em inerte)', () => {
      openDrawer();
      const box = opener();
      const painel = screen.getByRole('main').querySelector('.decisao__painel')!;
      const inertWhenFocused: boolean[] = [];
      const focus = vi.spyOn(box, 'focus').mockImplementation(() => { inertWhenFocused.push(painel.hasAttribute('inert')); });
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(inertWhenFocused.length).toBeGreaterThan(0);
      expect(inertWhenFocused.every((x) => !x)).toBe(true);
      focus.mockRestore();
    });

    it('atributos do momento: os dez, cada um com a faixa em palavra e em barra, sem número (SPEC v2.22)', () => {
      const attributes = { finalizacao: 80, passe: 86, habilidade: 78, drible: 74, forca: 60, velocidade: 70, fisico: 66, marcacao: 45, mental: 96, jogoAereo: 52 };
      const drawer = openDrawer({ attributes });
      const items = within(within(drawer).getByRole('list', { name: t('ui.carreira.atributos') })).getAllByRole('listitem');
      expect(items).toHaveLength(10);
      expect(items[0]).toHaveTextContent(t('attributes.attribute.finalizacao'));
      expect(items[0]).toHaveTextContent(t('attributes.band.muitoBom'));
      expect(items[8]).toHaveTextContent(t('attributes.band.lendario'));
      expect(items[0]!.querySelectorAll('.nivel i[data-cheio]')).toHaveLength(4);
      for (const li of items) expect(li.textContent).not.toMatch(/\d/);
      expect(within(drawer).queryByRole('term')).not.toBeInTheDocument();
    });

    it('salário em euro quando o contrato é no exterior', () => {
      render(<Decision eventId={EVENT} age={25} progress={0.5} player={{ ...PLAYER, monthlySalary: { amount: 1_250_000, currency: 'EUR' } }} scene={{ src: 'c.webp', alt: 'cena' }} />);
      expect(screen.getByText(/€\s1,3\smi/)).toBeInTheDocument();
    });

    it('títulos: todas as competições pelo nome, da mais pesada para a mais leve, com ×N só quando ganhou mais de uma vez', () => {
      const drawer = openDrawer({ titles: ['estadual', 'estadual', 'copaDoBrasil', 'serieA', 'libertadores', 'serieB', 'serieC'] });
      const items = within(within(drawer).getByRole('list', { name: t('ui.decisao.titulosLista') })).getAllByRole('listitem');
      expect(items).toHaveLength(6);
      expect(items[0]).toHaveTextContent(t('ui.titulo.libertadores'));
      const state = items.find((li) => li.textContent?.includes(t('ui.titulo.estadual')))!;
      expect(state).toHaveTextContent(t('ui.decisao.vezes', { n: 2 }));
      expect(items[0]!.textContent).not.toMatch(/\d/);
    });

    it('títulos com a imagem do troféu provisório da competição; sem peça própria, fica o ícone genérico', () => {
      const drawer = openDrawer({ titles: ['libertadores', 'europaLeague'] });
      const [liberta, europa] = within(within(drawer).getByRole('list', { name: t('ui.decisao.titulosLista') })).getAllByRole('listitem');
      // a imagem é decorativa (alt vazio): o nome da competição já está escrito ao lado
      const img = liberta!.querySelector('img')!;
      expect(img.getAttribute('src')).toBe(libertaArt);
      expect(img).toHaveAttribute('alt', '');
      expect(europa!.querySelector('img')).toBeNull();
      expect(europa!.querySelector('svg')).not.toBeNull();
    });

    it('sem título ainda: a gaveta diz isso, sem lista', () => {
      const drawer = openDrawer({ titles: [] });
      expect(within(drawer).queryByRole('list', { name: t('ui.decisao.titulosLista') })).not.toBeInTheDocument();
      expect(within(drawer).getByText(t('ui.decisao.nenhumTitulo'))).toBeInTheDocument();
    });

    it('trajetória: uma linha por temporada, da mais recente para a mais antiga, com idade, clube e overall', () => {
      const drawer = openDrawer({ seasons: [{ age: 22, clubId: 'bahia', overall: 70 }, { age: 23, clubId: 'flamengo', overall: 75 }] });
      const rows = within(within(drawer).getByRole('table', { name: t('ui.carreira.trajetoria') })).getAllByRole('row');
      expect(rows).toHaveLength(3);
      expect(rows[1]).toHaveTextContent(/23.*Flamengo.*75/);
      expect(rows[2]).toHaveTextContent(/22.*Bahia.*70/);
    });

    it('sem temporada fechada: a trajetória avisa, sem tabela', () => {
      const drawer = openDrawer();
      expect(within(drawer).queryByRole('table')).not.toBeInTheDocument();
      expect(within(drawer).getByText(t('ui.carreira.semTrajetoria'))).toBeInTheDocument();
    });

    it('fecha pelo botão e pela tecla Esc, e o foco volta para a caixa do jogador', () => {
      const drawer = openDrawer();
      const close = within(drawer).getByRole('button', { name: t('ui.carreira.fechar') });
      expect(close).toHaveFocus();
      fireEvent.click(close);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(opener()).toHaveFocus();
      fireEvent.click(opener());
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('a opção marcada separa o que se ganha do que se dá em troca (SPEC v2.21, v2.34)', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: new RegExp(t(`events.${EVENT}.opcoes.ficar`)) }));
    const detail = screen.getByRole('region', { name: t(`events.${EVENT}.opcoes.ficar`) });
    const gain = within(detail).getByText(t('ui.decisao.ganha')).parentElement!;
    const cost = within(detail).getByText(t('ui.decisao.emTroca')).parentElement!;
    expect(gain).toHaveTextContent(t('preview.campo.idolatria'));
    expect(gain).not.toHaveTextContent(t('preview.campo.moral'));
    expect(cost).toHaveTextContent(t('preview.campo.moral'));
  });

  it('uma decisão por tela: cada opção do evento é um botão com o texto do i18n', () => {
    setup();
    const group = screen.getByRole('group', { name: t('ui.decisao.opcoes') });
    expect(within(group).getAllByRole('button')).toHaveLength(def.opcoes.length);
    for (const o of def.opcoes) expect(within(group).getByRole('button', { name: new RegExp(t(`events.${EVENT}.opcoes.${o.id}`)) })).toBeInTheDocument();
  });

  it('prévia de consequências em palavras para leitor de tela, sem número', () => {
    setup();
    for (const o of def.opcoes) {
      const button = screen.getByRole('button', { name: new RegExp(t(`events.${EVENT}.opcoes.${o.id}`)) });
      const preview = previewOf(EVENT, o.id);
      for (const p of preview) {
        expect(button).toHaveAccessibleName(new RegExp(`${t(`preview.campo.${p.campo}`)}: ${t(`preview.sentido.${p.sentido}`)}`));
      }
      if (!preview.length) expect(button).toHaveAccessibleName(new RegExp(t('ui.decisao.semPrevia')));
      expect(button.textContent).not.toMatch(/\d/);
    }
  });

  it('escolher uma opção marca a opção; só "Confirmar escolha" avisa quem chamou (v2.34)', () => {
    const onChoose = setup();
    const [first] = within(screen.getByRole('group', { name: t('ui.decisao.opcoes') })).getAllByRole('button');
    expect(first).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(first!);
    expect(first).toHaveAttribute('aria-pressed', 'true');
    expect(onChoose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: t('ui.decisao.confirmar') }));
    expect(onChoose).toHaveBeenCalledWith(def.opcoes[0]!.id);
  });
});

describe('detalhes de navegador (T49b)', () => {
  it('a cena tem largura e altura (sem pulo ao carregar) e prioridade alta de carga', () => {
    setup();
    const img = screen.getByRole('img', { name: 'O jogador na sala do empresário' });
    expect(img).toHaveAttribute('width');
    expect(img).toHaveAttribute('height');
    expect(img).toHaveAttribute('fetchpriority', 'high');
  });

  it('index.html declara a cor do navegador e o esquema claro', () => {
    const html = readFileSync(resolve(__dirname, '../../../index.html'), 'utf8');
    expect(html).toMatch(/<meta name="theme-color" content="#EEE9DF"/);
    expect(html).toMatch(/<meta name="color-scheme" content="light"/);
  });
});

describe('tarja de risco nas opções (T49c, SPEC v2.26)', () => {
  const show = (eventId: string) => render(<Decision eventId={eventId} age={24} progress={0.4} player={PLAYER} scene={{ src: 'c.webp', alt: 'cena' }} />);
  const option = (eventId: string, id: string) => screen.getByRole('button', { name: new RegExp(t(`events.${eventId}.opcoes.${id}`)) });

  it('lesão grave: cada opção diz o risco de recaída em palavras, com o medidor de 4 segmentos, e o tempo fora', () => {
    show('lesao-grave');
    const operar = option('lesao-grave', 'operar');
    expect(operar).toHaveTextContent(t('ui.risco.tarja', { tipo: t('ui.risco.tipo.recaida'), faixa: t('ui.risco.baixo') }));
    expect(operar.querySelectorAll('.medidor s[data-cheio]')).toHaveLength(1);
    expect(operar).toHaveTextContent(t('ui.fora.ano'));
    const voltar = option('lesao-grave', 'voltar-antes');
    expect(voltar).toHaveTextContent(t('ui.risco.tarja', { tipo: t('ui.risco.tipo.recaida'), faixa: t('ui.risco.muitoAlto') }));
    expect(voltar.querySelectorAll('.medidor s[data-cheio]')).toHaveLength(4);
    expect(voltar).toHaveTextContent(t('ui.fora.meses', { n: 3 }));
    expect(option('lesao-grave', 'conservador')).toHaveTextContent(t('ui.fora.meses', { n: 6 }));
  });

  it('Copa: risco de lesão; quem poupa não tem tarja', () => {
    show('copa-sacrificio');
    expect(option('copa-sacrificio', 'jogar')).toHaveTextContent(t('ui.risco.tarja', { tipo: t('ui.risco.tipo.lesao'), faixa: t('ui.risco.alto') }));
    expect(option('copa-sacrificio', 'poupar').querySelector('.opcao__risco')).toBeNull();
  });

  it('evento sem risco não mostra tarja nem tempo fora', () => {
    show('festa');
    for (const b of within(screen.getByRole('group', { name: t('ui.decisao.opcoes') })).getAllByRole('button')) {
      expect(b.querySelector('.opcao__risco')).toBeNull();
      expect(b.querySelector('.opcao__fora')).toBeNull();
    }
  });
});

describe('contraste das cores de texto (T49c)', () => {
  it('o verde de destaque (4,34:1 sobre o papel) nunca é cor de texto: só preenchimento, borda ou ícone; texto verde usa --cor-positivo', () => {
    const css = ['Decision.css', 'Figurinha.css'].map((f) => readFileSync(resolve(__dirname, f), 'utf8')).join('\n');
    const offenders = [...css.matchAll(/([^{}]+)\{[^}]*(?:^|[\s;{])color:\s*var\(--cor-destaque\)/gm)]
      .map((m) => m[1]!.trim())
      .filter((sel) => !sel.split(',').every((x) => /\bsvg\s*$/.test(x.trim())));
    expect(offenders).toEqual([]);
  });

  it('a figurinha tem os pares de texto conferidos no tema: marinho e texto suave sobre o papel branco', () => {
    const pairs = tokens.contraste.texto.map((p) => p.join('/'));
    expect(pairs).toContain('texto/sobreDestaque');
    expect(pairs).toContain('textoSuave/sobreDestaque');
  });
});

describe('camadas (T49c)', () => {
  it('gaveta e resultado ficam acima da caixa do jogador e da faixa de baixo, que ficam sobre a cena', () => {
    const css = readFileSync(resolve(__dirname, 'Decision.css'), 'utf8');
    const z = (sel: string) => Number(new RegExp(`\\n\\${sel} \\{[^}]*z-index:\\s*(\\d+)`).exec(css)?.[1] ?? 0);
    for (const over of ['.gaveta', '.resultado']) {
      for (const under of ['.decisao__topo', '.decisao__painel']) expect(z(over)).toBeGreaterThan(z(under));
    }
    expect(z('.decisao__topo')).toBeGreaterThan(0);
  });
});

describe('emblemas na tela (T49d)', () => {
  const seasons = [{ age: 20, clubId: 'bahia', overall: 69 }, { age: 21, clubId: 'flamengo', overall: 72 }];
  it('trajetória: cada temporada com o emblema do clube (simplificado, decorativo) ao lado do nome', () => {
    render(<Decision eventId={EVENT} age={22} progress={0.3} player={{ ...PLAYER, seasons }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    fireEvent.click(screen.getByRole('button', { name: new RegExp(t('ui.carreira.titulo')) }));
    const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1);
    expect(rows[0]!.querySelector('.emblema')).toHaveAttribute('data-emblema', 'flamengo');
    expect(rows[1]!.querySelector('.emblema')).toHaveAttribute('data-emblema', 'generico');
    expect(rows[0]!.querySelector('.emblema')).toHaveAttribute('data-versao', 'simples');
  });

  it('a caixa do jogador traz o emblema do clube ao lado da linha "meia do Flamengo" (v2.34)', () => {
    setup();
    const card = screen.getByRole('button', { name: new RegExp(t('ui.carreira.titulo')) });
    expect(card.querySelector('.jogador__clube .emblema')).toHaveAttribute('data-emblema', 'flamengo');
  });
});

describe('variação B (T51c, SPEC v2.34)', () => {
  const show = (eventId = EVENT, extra: Record<string, unknown> = {}) => {
    const onChoose = vi.fn();
    render(<Decision eventId={eventId} age={24} progress={0.4} player={PLAYER} scene={{ src: 'c.webp', alt: 'cena' }} onChoose={onChoose} {...extra} />);
    return onChoose;
  };
  const option = (eventId: string, id: string) => screen.getByRole('button', { name: new RegExp(t(`events.${eventId}.opcoes.${id}`)) });
  const confirm = () => screen.getByRole('button', { name: t('ui.decisao.confirmar') });

  it('a cena ocupa a tela; caixa do jogador no topo e faixa de baixo em vidro (as duas camadas da tela)', () => {
    show();
    const main = screen.getByRole('main');
    expect(main.querySelector('.decisao__topo')).toHaveClass('vidro');
    expect(main.querySelector('.decisao__painel')).toHaveClass('vidro');
    expect(main.querySelectorAll('.vidro')).toHaveLength(2);
  });

  it('a caixa do topo mostra a figurinha com moldura, o Over grande e a contagem de títulos', () => {
    show();
    const topo = screen.getByRole('main').querySelector('.decisao__topo') as HTMLElement;
    expect(topo.querySelector('.figurinha--moldura')).not.toBeNull();
    expect(topo.querySelector('.decisao__over')).toHaveTextContent('78');
    expect(within(topo).getByRole('list', { name: t('ui.decisao.ficha') })).toHaveTextContent(t('ui.decisao.titulosQtd', { n: 3 }));
  });

  it('nada marcado: confirmar fica desligado e a caixa de detalhe convida a tocar numa opção', () => {
    show();
    expect(confirm()).toBeDisabled();
    expect(screen.getByText(t('ui.decisao.marque'))).toBeInTheDocument();
  });

  it('dá para trocar a marcada antes de confirmar; só uma fica marcada', () => {
    const onChoose = show();
    const [a, b] = def.opcoes.map((o) => option(EVENT, o.id));
    fireEvent.click(a!);
    fireEvent.click(b!);
    expect(a).toHaveAttribute('aria-pressed', 'false');
    expect(b).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(confirm());
    expect(onChoose).toHaveBeenCalledWith(def.opcoes[1]!.id);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('o detalhe da marcada traz o risco em palavras e o tempo fora', () => {
    show('lesao-grave');
    fireEvent.click(option('lesao-grave', 'operar'));
    const detail = screen.getByRole('region', { name: t('events.lesao-grave.opcoes.operar') });
    expect(detail).toHaveTextContent(t('ui.risco.tarja', { tipo: t('ui.risco.tipo.recaida'), faixa: t('ui.risco.baixo') }));
    expect(detail).toHaveTextContent(t('ui.fora.ano'));
  });

  it('no ritmo Rápido tocar já decide: sem confirmar e sem caixa de detalhe', () => {
    const onChoose = show(EVENT, { ritmo: 'rapido' });
    expect(screen.queryByRole('button', { name: t('ui.decisao.confirmar') })).not.toBeInTheDocument();
    expect(screen.queryByText(t('ui.decisao.marque'))).not.toBeInTheDocument();
    fireEvent.click(option(EVENT, def.opcoes[0]!.id));
    expect(onChoose).toHaveBeenCalledWith(def.opcoes[0]!.id);
  });

  it('superfícies sem sombra dura nem borda grossa (v2.34)', () => {
    const css = readFileSync(resolve(__dirname, 'Decision.css'), 'utf8');
    expect(css).not.toContain('var(--forma-sombra) var(--forma-sombra) 0');
    expect(css).not.toMatch(/border[\w-]*:\s*var\(--forma-borda\)/);
  });
});

describe('uniforme na caixa do jogador (T50k, SPEC v2.37)', () => {
  it('em evento da Seleção a figurinha do topo veste a seleção; o emblema segue o clube', () => {
    render(<Decision eventId="copa-penalti" age={24} progress={0.4} player={{ ...PLAYER, visual: 'visual-03', uniforme: 'selecao:brasil' }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    const topo = screen.getByRole('main').querySelector('.decisao__topo') as HTMLElement;
    expect((topo.querySelector('.camisa') as HTMLElement).style.getPropertyValue('--camisa-cor')).toBe(kitOf('selecao:brasil').camisa[0]);
    expect(topo.querySelector('.jogador__clube .emblema')).toHaveAttribute('data-emblema', 'flamengo');
  });
});

describe('tela pequena (T49j): nada fica cortado', () => {
  // achado na verificação: em 360x640 o "Confirmar escolha" ficava abaixo da borda, sem como rolar (overflow: hidden)
  const css = readFileSync(resolve(__dirname, 'Decision.css'), 'utf8');
  const rule = (sel: string) => new RegExp(`\\n\\${sel} \\{([^}]*)\\}`).exec(css)?.[1] ?? '';

  it('a tela de decisão cresce e rola quando falta altura (nunca esconde o que passa da borda)', () => {
    expect(rule('.decisao')).not.toMatch(/overflow:\s*hidden/);
    expect(rule('.decisao')).not.toMatch(/(^|[^-])block-size:\s*100dvh/);
    expect(rule('.decisao')).toMatch(/min-block-size:\s*100dvh/);
  });

  it('a cena fica fixa ao fundo; gaveta e resultado ficam presos à tela, não ao meio de uma página alta', () => {
    expect(rule('.decisao__cena')).toMatch(/position:\s*fixed/);
    expect(rule('.gaveta')).toMatch(/position:\s*fixed/);
    expect(rule('.resultado')).toMatch(/position:\s*fixed/);
  });
});

describe('prévia curta no ritmo Rápido (SPEC v2.38)', () => {
  const show = (ritmo: 'normal' | 'rapido', eventId = EVENT) => render(<Decision eventId={eventId} age={24} progress={0.4} ritmo={ritmo} player={PLAYER} scene={{ src: 'c.webp', alt: 'cena' }} />);
  const option = (id: string, eventId = EVENT) => screen.getByRole('button', { name: new RegExp(t(`events.${eventId}.opcoes.${id}`)) });

  it('no Rápido, cada opção mostra numa linha o campo e as setas: ganho em verde, custo em vermelho', () => {
    show('rapido');
    const resumo = option('ficar').querySelector('.opcao__resumo') as HTMLElement;
    expect(resumo).not.toBeNull();
    expect(resumo).toHaveAttribute('aria-hidden', 'true');
    expect(resumo.querySelector('.previa--sobe')).toHaveTextContent(t('preview.campo.idolatria'));
    expect(resumo.querySelector('.previa--desce')).toHaveTextContent(t('preview.campo.moral'));
    expect(resumo.querySelectorAll('.previa__setas svg').length).toBeGreaterThan(0);
  });

  it('no Rápido, toda opção dos 25 eventos tem a linha preenchida; no Normal não há linha (o detalhe da marcada faz esse papel)', () => {
    for (const e of events.eventos) {
      show('rapido', e.id);
      for (const o of e.opcoes) expect(option(o.id, e.id).querySelector('.opcao__resumo')?.textContent, `${e.id}/${o.id}`).toMatch(/\p{L}{3,}/u);
      cleanup();
    }
    show('normal');
    expect(document.querySelector('.opcao__resumo')).toBeNull();
  });

  it('no Rápido, o tempo fora aparece na linha da opção (o risco já está no medidor)', () => {
    show('rapido', 'lesao-grave');
    expect(option('operar', 'lesao-grave').querySelector('.opcao__resumo')).toHaveTextContent(t('ui.fora.ano'));
  });
});

describe('evolução do semestre e idolatria (T51b, v2.41)', () => {
  const show = (extra: Record<string, unknown> = {}, player: Record<string, unknown> = {}) =>
    render(<Decision eventId={EVENT} age={24} progress={0.4} player={{ ...PLAYER, ...player }} scene={{ src: 'c.webp', alt: 'cena' }} {...extra} />);

  it('com frases do semestre, a faixa de baixo abre com "Neste semestre: …" antes do título', () => {
    show({ semestre: ['Seu passe melhorou bastante.', 'Seu físico caiu.'] });
    const linha = screen.getByText(new RegExp(t('ui.evolucao.titulo'))).closest('p')!;
    expect(linha).toHaveTextContent(`${t('ui.evolucao.titulo')}: Seu passe melhorou bastante. Seu físico caiu.`);
    const painel = screen.getByRole('main').querySelector('.decisao__painel')!;
    expect(painel.firstElementChild).toBe(linha);
    expect(linha.textContent).not.toMatch(/\d/);
  });

  it('sem frases, sem linha', () => {
    show();
    expect(screen.queryByText(new RegExp(t('ui.evolucao.titulo')))).not.toBeInTheDocument();
  });

  it('o selo da torcida aparece na ficha do topo, em palavras', () => {
    show({}, { torcida: 'querido' });
    const selos = screen.getByRole('list', { name: t('ui.decisao.ficha') });
    expect(within(selos).getByText(t('ui.idolatria.selo', { faixa: t('ui.idolatria.faixa.querido') }))).toBeInTheDocument();
  });

  it('na trajetória de "Minha carreira", a torcida de cada clube em palavras', () => {
    show({}, { seasons: [{ age: 22, clubId: 'bahia', overall: 70, torcida: 'idolo' }, { age: 23, clubId: 'flamengo', overall: 75, torcida: 'conhecido' }] });
    fireEvent.click(screen.getByRole('button', { name: new RegExp(t('ui.carreira.titulo')) }));
    const table = screen.getByRole('table', { name: t('ui.carreira.trajetoria') });
    expect(within(table).getByRole('columnheader', { name: t('ui.idolatria.coluna') })).toBeInTheDocument();
    const rows = within(table).getAllByRole('row');
    expect(rows[1]).toHaveTextContent(t('ui.idolatria.faixa.conhecido'));
    expect(rows[2]).toHaveTextContent(t('ui.idolatria.faixa.idolo'));
  });
});

// v2.47: o overall, a idade e o valor rolam do valor anterior ao novo; o leitor de tela recebe só o valor final
describe('números que rolam (v2.47)', () => {
  afterEach(() => { vi.unstubAllGlobals(); });
  const ANTES = { overall: 70, age: 16, marketValueEUR: 1_000_000 };
  const show = () => render(<Decision eventId={EVENT} age={17} progress={0.05} player={PLAYER} anterior={ANTES} scene={{ src: 'cena.webp', alt: 'cena' }} />);

  it('com movimento, começa no valor anterior e o texto acessível já é o final', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q }));
    vi.stubGlobal('requestAnimationFrame', () => 0);
    vi.stubGlobal('cancelAnimationFrame', () => {});
    const { container } = show();
    expect(container.querySelector('.decisao__over-numero')).toHaveTextContent('70');
    expect(screen.getByText(t('ui.decisao.idade', { idade: 17 }))).toHaveClass('sr-only');
    expect(screen.getByText(t('ui.decisao.idade', { idade: 16 }))).toHaveAttribute('aria-hidden', 'true');
  });

  it('com prefers-reduced-motion, mostra o valor final direto', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q }));
    const { container } = show();
    expect(container.querySelector('.decisao__over-numero')).toHaveTextContent('78');
    expect(screen.queryByText(t('ui.decisao.idade', { idade: 16 }))).not.toBeInTheDocument();
  });
});
