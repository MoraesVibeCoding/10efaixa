import { readFileSync } from 'node:fs';
import tokens from '../theme/tokens.json';
import { resolve } from 'node:path';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import events from '../../data/events.json';
import { previewOf } from '../../engine/preview';
import { t } from '../../i18n';
import { clubName } from './clubText';
import { Decision } from './Decision';
import { kitOf } from '../../art/kits';
import libertaArt from '../../assets/trofeus/continental-principal.webp';

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
    // pedido do usuário (sem "Confirmar escolha"): tocar de novo na marcada decide na hora
    fireEvent.click(screen.getByRole('button', { name: new RegExp(t('events.salario-atrasado.opcoes.ficar')) }));
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

  it('o texto do evento sai em camadas pelas etiquetas da carreira (T25e): abertura, texto base e frases de contexto', () => {
    const render1 = (etiquetas: string[]) => render(<Decision eventId="festa" age={19} progress={0.2} player={{ ...PLAYER, etiquetas }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    const { unmount } = render1(['jovem', 'moralBaixa', 'noBanco', 'capitao']);
    const texto = document.querySelector('.decisao__historia')?.textContent ?? '';
    expect(texto).toContain(t('events.festa.abertura.jovem'));
    expect(texto).toContain(t('events.festa.texto'));
    expect(texto).toContain(t('events.festa.contexto.moralBaixa'));
    expect(texto).toContain(t('events.festa.contexto.noBanco'));
    expect(texto).not.toContain(t('events.festa.contexto.capitao')); // só 2 frases de contexto
    unmount();
    render1([]);
    expect(document.body.textContent).toContain(t('events.festa.texto'));
    expect(document.body.textContent).not.toContain(t('events.festa.abertura.jovem'));
  });

  it('o bônus de Mental de um marco aparece em palavras, nunca em número (regra: nenhum número dos atributos)', () => {
    render(<Decision eventId="estreia-profissional" age={17} progress={0.2} player={{ name: 'Zé', position: 'meia', clubId: 'flamengo', overall: 60, titles: [], role: 'composicao', monthlySalary: { amount: 4_000, currency: 'BRL' } }} state={{ ...STATE, bonusMental: 0 }} scene={{ src: 'c.webp', alt: 'cena' }} onContinue={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: new RegExp(t('events.estreia-profissional.opcoes.respirar-e-jogar-simples')) }));
    // pedido do usuário (sem "Confirmar escolha"): tocar de novo na marcada decide na hora
    fireEvent.click(screen.getByRole('button', { name: new RegExp(t('events.estreia-profissional.opcoes.respirar-e-jogar-simples')) }));
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

  // v2.81 (Álbum): o card pequeno traz a figurinha e o Over num selo com o aro no metal da faixa; quem abre "Minha
  // carreira" é a etiqueta "Carreira ›" (DecisionAlbum.test.tsx)
  it('figurinha do jogador (SPEC v2.26, v2.81): nome, "meia do Flamengo" e o OVR no selo com o metal da faixa', () => {
    setup();
    const card = document.querySelector('.decisao__topo') as HTMLElement;
    expect(card.querySelector('.figurinha')).not.toBeNull();
    expect(card.querySelector('.jogador__nome')).toHaveTextContent('Dudu Maestro');
    expect(within(card).getAllByText(t('ui.figurinha.posicaoNoClube', { posicao: t('positions.meia'), prep: t('ui.figurinha.prep.o'), clube: 'Flamengo' })).length).toBeGreaterThan(0);
    const over = card.querySelector('.decisao__over-medalha');
    expect(over).toHaveTextContent('78');
    expect(over).toHaveAttribute('data-medalha', 'platina');
    expect(within(card).getByText(new RegExp(t('attributes.band.muitoBom')))).toBeInTheDocument();
  });

  it('título do evento com os selos do jogador ao lado: idade, tempo de jogo, salário do mês e valor de mercado (v2.22, v2.33)', () => {
    setup();
    expect(screen.getByRole('heading', { level: 1, name: t(`events.${EVENT}.titulo`) })).toBeInTheDocument();
    // v2.62: idade, salário e valor ficam entre o nome e o Over; o papel vai para a linha de selos de baixo
    const dados = screen.getByRole('list', { name: t('ui.decisao.ficha') });
    expect(within(dados).getByText(t('ui.decisao.idade', { idade: 17 }))).toBeInTheDocument();
    expect(within(dados).getByText(/R\$\s180\smil/)).toBeInTheDocument();
    // v2.33: valor de mercado em euros junto do salário
    expect(within(dados).getByText(/^Valor\s€\s12,5\smi$/)).toBeInTheDocument();
    // v2.62: o papel (tempo de jogo) fica embaixo do Over
    expect(screen.getByRole('main').querySelector('.decisao__papel')).toHaveTextContent(t('ui.papel.titularRegular'));
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

    it('todo título mostra a imagem do troféu que criamos (a Liga Europa usa a peça da segunda copa continental)', () => {
      const drawer = openDrawer({ titles: ['libertadores', 'europaLeague'] });
      const [liberta, europa] = within(within(drawer).getByRole('list', { name: t('ui.decisao.titulosLista') })).getAllByRole('listitem');
      // a imagem é decorativa (alt vazio): o nome da competição já está escrito ao lado
      const img = liberta!.querySelector('img')!;
      expect(img.getAttribute('src')).toBe(libertaArt);
      expect(img).toHaveAttribute('alt', '');
      expect(europa!.querySelector('img')).not.toBeNull();
      expect(europa!.querySelector('svg')).toBeNull();
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
    fireEvent.click(first!); // sem "Confirmar escolha": tocar de novo na marcada decide
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
  // v2.81: o resultado entra no lugar do painel, na página; só a gaveta fica por cima
  it('a gaveta fica acima do card do jogador e do painel', () => {
    const css = readFileSync(resolve(__dirname, 'Decision.css'), 'utf8');
    const z = (sel: string) => Number(new RegExp(`\\n\\${sel} \\{[^}]*z-index:\\s*(\\d+)`).exec(css)?.[1] ?? 0);
    for (const over of ['.gaveta']) {
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
    const card = document.querySelector('.decisao__topo') as HTMLElement;
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

  it('a caixa do topo mostra a figurinha com moldura, o Over grande e a contagem de títulos', () => {
    show();
    const topo = screen.getByRole('main').querySelector('.decisao__topo') as HTMLElement;
    expect(topo.querySelector('.figurinha--moldura')).not.toBeNull();
    expect(topo.querySelector('.decisao__over')).toHaveTextContent('78');
    // v2.62: os títulos viram miniaturas das taças, agrupadas por competição, com a quantidade numa bolinha
    const tacas = within(topo).getByRole('list', { name: t('ui.decisao.titulosLinha') });
    const itens = within(tacas).getAllByRole('listitem');
    expect(itens).toHaveLength(2);
    expect(itens[0]).toHaveTextContent(t('ui.decisao.tacaQtd', { nome: t('ui.titulo.estadual'), n: 2 }));
    expect(itens[0]!.querySelector('.taca__qtd')).toHaveTextContent('2');
    expect(itens[1]!.querySelector('.taca__qtd')).toBeNull();
  });

  it('sem títulos, nem taças nem "Sem títulos" (v2.62)', () => {
    render(<Decision eventId={EVENT} age={24} progress={0.4} player={{ ...PLAYER, titles: [] }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    expect(screen.queryByRole('list', { name: t('ui.decisao.titulosLinha') })).not.toBeInTheDocument();
    expect(screen.queryByText(t('ui.decisao.semTitulos'))).not.toBeInTheDocument();
  });

  it('com estreia na seleção principal, a bandeira do país e a sigla aparecem ao lado do nome (v2.62)', () => {
    render(<Decision eventId={EVENT} age={24} progress={0.4} player={{ ...PLAYER, selecao: 'brasil' }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    const topo = screen.getByRole('main').querySelector('.decisao__topo') as HTMLElement;
    expect(within(topo).getByText(t('ui.decisao.selecao', { pais: t('ui.pais.brasil') }))).toBeInTheDocument();
    expect(topo.querySelector('.bandeira svg')).not.toBeNull();
    expect(topo.querySelector('.bandeira')).toHaveTextContent(t('ui.sigla.brasil'));
  });

  it('v2.63: com a 10 e a faixa, selos "10" e "C" ao lado do nome; sem elas, nada', () => {
    render(<Decision eventId={EVENT} age={24} progress={0.4} player={{ ...PLAYER, number: 10, capitao: true }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    const topo = screen.getByRole('main').querySelector('.decisao__topo') as HTMLElement;
    expect(within(topo).getByText(t('ui.decisao.selo10Texto'))).toBeInTheDocument();
    expect(within(topo).getByText(t('ui.decisao.seloCapitaoTexto'))).toBeInTheDocument();
    cleanup();
    render(<Decision eventId={EVENT} age={24} progress={0.4} player={{ ...PLAYER, number: 7 }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    expect(screen.getByRole('main').querySelector('.selo-conquista')).toBeNull();
  });

  it('sem seleção, sem bandeira (v2.62)', () => {
    show();
    expect(screen.getByRole('main').querySelector('.bandeira')).toBeNull();
  });

  it('o Over tem a medalha da faixa por trás do número, do bronze ao diamante (v2.62)', () => {
    show();
    const medalha = screen.getByRole('main').querySelector('.decisao__over .decisao__over-medalha') as HTMLElement;
    expect(medalha).toHaveAttribute('data-medalha', 'platina');
    expect(medalha).toHaveTextContent('78');
  });

  it('nada marcado: não há "Confirmar escolha" e a dica convida a tocar numa opção', () => {
    show();
    expect(screen.queryByRole('button', { name: /Confirmar escolha/i })).toBeNull();
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
    fireEvent.click(b!); // tocar de novo na marcada decide
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
    expect(screen.queryByText(t('ui.decisao.marque'))).not.toBeInTheDocument();
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

  // v2.81: a cena é uma foto na página, com altura mínima (a página rola antes de a foto sumir); a gaveta segue presa à tela
  it('a foto da cena tem altura mínima; a gaveta fica presa à tela, não ao meio de uma página alta', () => {
    expect(rule('.decisao__foto')).toMatch(/min-block-size:\s*7rem/);
    expect(rule('.gaveta')).toMatch(/position:\s*fixed/);
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

  it('v2.62: a torcida não fica no topo (vai para o resumo da temporada e o cartão final)', () => {
    show({}, { torcida: 'querido' });
    expect(screen.queryByText(t('ui.idolatria.selo', { faixa: t('ui.idolatria.faixa.querido') }))).not.toBeInTheDocument();
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

// v2.64: a venda fechada pelo empresário mostra o cartão do clube comprador antes das opções.
describe('venda pelo empresário com o clube à vista (v2.64)', () => {
  const comprador = { clubId: 'flamengo', league: 'BRA-A', currency: 'BRL' as const, annualSalary: 2_400_000, years: 3, role: 'titularRegular' as const, staffQuality: 1, offAxis: false,
    minutosFaixa: 'muitos' as const, nivelClube: 'boa' as const, marca: null, salarioMensal: 200_000, salarioPct: { pct: 27, sentido: 'sobe' as const }, valorProjetadoEUR: 9_000_000, valorPct: null, minutosVs: 'menos' as const };

  it('o cartão do comprador aparece com clube, salário, papel e minutos; sem comprador, nada', () => {
    render(<Decision eventId="empresario-forca-venda" age={24} progress={0.4} player={{ ...PLAYER, comprador, textoParams: { comprador: 'Flamengo' } }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    const card = screen.getByRole('group', { name: t('ui.venda.cartao') });
    expect(within(card).getByText(clubName('flamengo').nome)).toBeInTheDocument();
    expect(within(card).getByText(t('ui.proposta.papel.titularRegular'))).toBeInTheDocument();
    expect(within(card).getByText(t('ui.proposta.minutosVs.menos'))).toBeInTheDocument();
    expect(screen.getByText(/Flamengo/, { selector: '.decisao__historia' })).toBeInTheDocument();
    cleanup();
    setup();
    expect(screen.queryByRole('group', { name: t('ui.venda.cartao') })).toBeNull();
  });
});

// v2.71 (momento 4): o título do ano tem palco; a decisão atrás fica inerte, e depois a taça nova "chega" na caixa do topo.
// Acesso e rebaixamento seguem no carimbo, depois do palco.
describe('palco do título na decisão (v2.71)', () => {
  const comTitulo = () => render(
    <Decision eventId={EVENT} age={24} progress={0.4} player={{ ...PLAYER, titles: ['estadual', 'serieA'] }} scene={{ src: 'c.webp', alt: 'cena' }}
      momentos={[{ kind: 'titulo', competition: 'serieA' }, { kind: 'acesso' }]} />,
  );

  it('o palco abre com a decisão inerte; Seguir fecha, devolve o foco ao evento e solta o carimbo do acesso', () => {
    comTitulo();
    expect(screen.getByRole('dialog', { name: t('ui.momento.titulo') })).toBeInTheDocument();
    expect(document.querySelector('.decisao__painel')).toHaveAttribute('inert');
    expect(screen.getByRole('status')).not.toHaveTextContent(t('ui.momento.acesso'));
    fireEvent.click(screen.getByRole('button', { name: t('ui.palco.seguir') }));
    expect(screen.queryByRole('dialog', { name: t('ui.momento.titulo') })).toBeNull();
    expect(document.querySelector('.decisao__painel')).not.toHaveAttribute('inert');
    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent(t('ui.momento.acesso'));
  });

  it('a taça nova ganha destaque na caixa do topo', () => {
    comTitulo();
    fireEvent.click(screen.getByRole('button', { name: t('ui.palco.seguir') }));
    const tacas = document.querySelectorAll('.taca');
    expect(tacas[1]).toHaveClass('taca--nova');
    expect(tacas[0]).not.toHaveClass('taca--nova');
    // no celular, com a caixa fechada, o aviso fica no botão de detalhes
  });

  it('sem título, nenhum palco', () => {
    setup();
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('palco do título espera o card de cima (v2.71)', () => {
  it('pausado (resumo da temporada aberto), o palco não abre; ao soltar, abre', () => {
    const props = { eventId: EVENT, age: 24, progress: 0.4, player: PLAYER, scene: { src: 'c.webp', alt: 'cena' }, momentos: [{ kind: 'titulo' as const, competition: 'serieA' }] };
    const { rerender } = render(<Decision {...props} pausado />);
    expect(screen.queryByRole('dialog')).toBeNull();
    rerender(<Decision {...props} pausado={false} />);
    expect(screen.getByRole('dialog', { name: t('ui.momento.titulo') })).toBeInTheDocument();
  });
});

// v2.71 (momento 3): quando o Over muda de faixa, a medalha da caixa do topo troca de metal no meio da rolagem e brilha.
describe('mudança de faixa no topo (v2.71)', () => {
  afterEach(() => { vi.unstubAllGlobals(); });
  const show = (antes: number) => render(<Decision eventId={EVENT} age={17} progress={0.05} player={PLAYER} anterior={{ overall: antes, age: 17 }} scene={{ src: 'c.webp', alt: 'cena' }} />);

  it('com movimento, começa no metal de antes e marca a troca', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q }));
    vi.stubGlobal('requestAnimationFrame', () => 0);
    vi.stubGlobal('cancelAnimationFrame', () => {});
    show(70);
    const m = document.querySelector('.decisao__over-medalha')!;
    expect(m).toHaveAttribute('data-medalha', 'ouro');
    expect(m).toHaveClass('decisao__over-medalha--troca');
  });

  it('na mesma faixa, sem a marca', () => {
    show(76);
    expect(document.querySelector('.decisao__over-medalha')).not.toHaveClass('decisao__over-medalha--troca');
  });
});

// v2.71 (momentos 5, 6, 7 e 8): o resultado entra em cascata, a cena entra e "respira", a opção marcada dá um pulo
// e as figurinhas novas do álbum aparecem como "+N" em "Minha carreira".
describe('ritmo da decisão (v2.71)', () => {
  const css = readFileSync(resolve(__dirname, 'Decision.css'), 'utf8');

  it('resultado em cascata: cada linha tem a sua ordem e a animação usa essa ordem', () => {
    vi.useFakeTimers();
    render(<Decision eventId={EVENT} age={17} progress={0.05} player={PLAYER} state={STATE} scene={{ src: 'c.webp', alt: 'cena' }} />);
    fireEvent.click(document.querySelector(`[data-opcao-id="${def.opcoes[0]!.id}"]`)!);
    // pedido do usuário (sem "Confirmar escolha"): tocar de novo na marcada decide na hora
    fireEvent.click(document.querySelector(`[data-opcao-id="${def.opcoes[0]!.id}"]`)!);
    const itens = [...document.querySelectorAll<HTMLElement>('.resultado__lista li')];
    itens.forEach((li, i) => { expect(li.style.getPropertyValue('--i')).toBe(String(i)); });
    expect(css).toMatch(/\.resultado__lista li\s*\{[^}]*animation:\s*resultado-linha[^}]*var\(--i/);
    vi.useRealTimers();
  });

  // revisão pela web-animation-design: o pulo ao marcar virou o toque que afunda (também não anima ao marcar pelo teclado)
  it('a opção afunda ao toque', () => {
    expect(css).toMatch(/\.opcao:active\s*\{[^}]*transform:\s*scale\(0\.97\)/);
  });

  it('a cena entra com fade e "respira" devagar (Ken Burns)', () => {
    const cena = readFileSync(resolve(__dirname, 'CenaPintada.css'), 'utf8');
    expect(cena).toMatch(/\.cena\s*\{[^}]*animation:\s*cena-entra[^;]*,\s*cena-respira/);
  });

  it('figurinha nova: "+N" em "Minha carreira", com texto para o leitor de tela; sem anterior, nada', () => {
    const marcos = [{ id: 'estreia-profissional', ano: 2027, clubId: 'flamengo' }];
    render(<Decision eventId={EVENT} age={17} progress={0.05} player={{ ...PLAYER, marcos }} anterior={{ overall: 78, age: 17, cromos: 2 }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    const badge = document.querySelector('.jogador__novas')!;
    expect(badge).toHaveTextContent('+2');
    expect(screen.getByRole('button', { name: new RegExp(t('ui.album.novas', { n: 2 })) })).toHaveClass('card-jogador__carreira');
    cleanup();
    render(<Decision eventId={EVENT} age={17} progress={0.05} player={{ ...PLAYER, marcos }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    expect(document.querySelector('.jogador__novas')).toBeNull();
  });
});
