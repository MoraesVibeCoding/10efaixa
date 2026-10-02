import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import events from '../../data/events.json';
import { previewOf } from '../../engine/preview';
import { t } from '../../i18n';
import { Decision } from './Decision';
import libertaArt from '../../assets/art/provisoria/detalhe/detalhe__trofeu-continental-principal.svg';

const EVENT = 'salario-atrasado';
const def = events.eventos.find((e) => e.id === EVENT)!;
const PLAYER = {
  name: 'Dudu Maestro', position: 'meia', clubId: 'flamengo', overall: 78, titles: ['estadual', 'estadual', 'copaDoBrasil'],
  role: 'titular', monthlySalary: { amount: 180_000, currency: 'BRL' as const },
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
    render(<Decision eventId="salario-atrasado" age={24} progress={0.4} player={{ name: 'Zé', position: 'meia', clubId: 'flamengo', overall: 60, titles: [], role: 'reserva', monthlySalary: { amount: 4_000, currency: 'BRL' } }} state={STATE} scene={{ src: 'c.webp', alt: 'cena' }} onContinue={onContinue} />);
    fireEvent.click(screen.getByRole('button', { name: new RegExp(t('events.salario-atrasado.opcoes.ficar')) }));
    return onContinue;
  };

  it('as opções não mostram mais o jeito: só o texto e o resumo das consequências', () => {
    render(<Decision eventId="proposta-coracao" age={24} progress={0.4} player={{ name: 'Zé', position: 'meia', clubId: 'flamengo', overall: 60, titles: [], role: 'reserva', monthlySalary: { amount: 4_000, currency: 'BRL' } }} scene={{ src: 'c.webp', alt: 'cena' }} />);
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

  // T49b: no ritmo normal o resultado só fecha pelo botão ou Esc (WCAG 2.2.1); sozinho, só no ritmo Rápido
  it('no ritmo normal o resultado espera o jogador: não fecha sozinho', () => {
    const onContinue = open();
    act(() => { vi.advanceTimersByTime(10_000); });
    expect(onContinue).not.toHaveBeenCalled();
  });

  it('no ritmo Rápido segue sozinho depois de um instante, uma única vez', () => {
    const onContinue = vi.fn();
    render(<Decision eventId="salario-atrasado" age={24} progress={0.4} ritmo="rapido" player={{ name: 'Zé', position: 'meia', clubId: 'flamengo', overall: 60, titles: [], role: 'reserva', monthlySalary: { amount: 4_000, currency: 'BRL' } }} state={STATE} scene={{ src: 'c.webp', alt: 'cena' }} onContinue={onContinue} />);
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
    for (const el of main.querySelectorAll('.decisao__cena, .faixa, .decisao__painel')) expect(el).toHaveAttribute('inert');
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

  it('caixa do jogador compacta: escudo, nome, posição, clube e o overall em número (SPEC v2.16); idade e papel numa linha só', () => {
    setup();
    const who = screen.getByRole('region', { name: t('ui.decisao.jogador') });
    expect(within(who).getByText('Dudu Maestro')).toBeInTheDocument();
    expect(within(who).getByText(new RegExp(`${t('positions.meia')}.*Flamengo`))).toBeInTheDocument();
    expect(within(who).getByRole('img', { name: t('ui.decisao.escudo', { clube: 'Flamengo' }) })).toBeInTheDocument();
    const card = within(who).getByText('78').closest('[data-medalha]');
    expect(card).toHaveAttribute('data-medalha', 'platina');
    expect((card as HTMLElement).style.backgroundImage).toMatch(/platina/);
    expect(within(who).getByText(new RegExp(t('attributes.band.muitoBom')))).toBeInTheDocument();
    // a ficha fica sempre à vista (SPEC v2.22): idade, tempo de jogo e salário do mês
    expect(within(who).getAllByRole('term')).toHaveLength(3);
    expect(within(who).getByText(t('ui.decisao.idade', { idade: 17 }))).toBeInTheDocument();
    expect(within(who).getByText(t('ui.papel.titular'))).toBeInTheDocument();
    expect(within(who).getByText(/R\$\s180\smil/)).toBeInTheDocument();
    // títulos, atributos e trajetória ficam na gaveta
    expect(screen.queryByRole('list', { name: t('ui.decisao.titulosLista') })).not.toBeInTheDocument();
  });

  describe('gaveta "Minha carreira" (SPEC v2.21)', () => {
    const opener = () => screen.getByRole('button', { name: new RegExp(t('ui.carreira.titulo')) });
    const openDrawer = (player = {}) => {
      render(<Decision eventId={EVENT} age={24} progress={0.4} player={{ ...PLAYER, ...player }} scene={{ src: 'c.webp', alt: 'cena' }} />);
      fireEvent.click(opener());
      return screen.getByRole('dialog', { name: t('ui.carreira.titulo') });
    };

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
      for (const el of main.querySelectorAll('.decisao__cena, .faixa, .decisao__painel')) expect(el).toHaveAttribute('inert');
      (document.activeElement as HTMLElement).blur();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      for (const el of main.querySelectorAll('.decisao__cena, .faixa, .decisao__painel')) expect(el).not.toHaveAttribute('inert');
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

  it('cada opção separa o que se ganha do que se dá em troca (SPEC v2.21)', () => {
    setup();
    const stay = screen.getByRole('button', { name: new RegExp(t(`events.${EVENT}.opcoes.ficar`)) });
    const gain = within(stay).getByText(t('ui.decisao.ganha')).parentElement!;
    const cost = within(stay).getByText(t('ui.decisao.emTroca')).parentElement!;
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

  it('escolher uma opção marca a faixa e avisa quem chamou', () => {
    const onChoose = setup();
    const [first] = within(screen.getByRole('group', { name: t('ui.decisao.opcoes') })).getAllByRole('button');
    expect(first).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(first!);
    expect(first).toHaveAttribute('aria-pressed', 'true');
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
