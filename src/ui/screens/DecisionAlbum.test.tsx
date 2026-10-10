import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { t } from '../../i18n';
import { Decision } from './Decision';

// v2.81 (direção "Álbum", aprovada pelo usuário em 2026-10-10): a decisão é uma página do álbum. No topo, a linha da
// página e o card pequeno do jogador (com a etiqueta "Carreira ›"); a cena vira uma foto na página, e o texto e as
// opções ficam no papel. O vidro sai. O resultado carimba a foto (inclinado) e separa "Você ganha" de "Em troca".
afterEach(cleanup);

const PLAYER = {
  name: 'Dudu Maestro', position: 'meia', clubId: 'flamengo', overall: 74, titles: ['estadual', 'estadual', 'copaDoBrasil'],
  role: 'titularRegular', monthlySalary: { amount: 180_000, currency: 'BRL' as const }, marketValueEUR: 6_200_000,
};
const STATE = { moral: 0.6, relacaoTecnico: 0.6, idolatria: 40, idolatriaCoracao: 55, disciplina: 0.7, patrimonio: 2_000_000, salarioFator: 1 };
const show = () => render(
  <Decision eventId="salario-atrasado" age={24} progress={0.4} player={PLAYER} state={STATE} pagina={{ ano: 2032, numero: 7 }} scene={{ src: 'cena.webp', alt: 'cena' }} />,
);
const css = readFileSync(resolve(__dirname, 'Decision.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

describe('decisão como página do álbum (v2.81)', () => {
  it('a linha da página: temporada e número da página', () => {
    show();
    const topo = document.querySelector('.pagina__topo') as HTMLElement;
    expect(topo).toHaveTextContent(t('ui.pagina.temporada', { ano: 2032 }));
    expect(topo).toHaveTextContent(t('ui.pagina.numero', { n: 7 }));
  });

  it('sem vidro: a cena é uma foto dentro da página, e o painel é papel', () => {
    show();
    const main = screen.getByRole('main');
    expect(main.querySelectorAll('.vidro')).toHaveLength(0);
    expect(main.querySelector('.decisao__foto img[src="cena.webp"]')).not.toBeNull();
    expect(css).not.toMatch(/\.decisao__cena\s*\{[^}]*position:\s*fixed/);
  });

  it('card pequeno: ficha sempre à vista (idade, salário, valor e papel), sem o botão de abrir detalhes', () => {
    show();
    const card = document.querySelector('.decisao__topo') as HTMLElement;
    expect(card).toHaveClass('card-jogador');
    expect(screen.queryByRole('button', { name: /Mais detalhes/ })).toBeNull();
    const ficha = within(card).getByRole('list', { name: t('ui.decisao.ficha') });
    expect(ficha).toHaveTextContent(t('ui.decisao.idade', { idade: 24 }));
    expect(ficha).toHaveTextContent(t(`ui.papel.${PLAYER.role}`));
    expect(css).not.toMatch(/decisao__topo--aberto/);
  });

  it('a etiqueta "Carreira ›" é pequena, mostra "Carreira" e abre "Minha carreira"', () => {
    show();
    const tag = screen.getByRole('button', { name: t('ui.carreira.titulo') });
    expect(tag).toHaveClass('card-jogador__carreira');
    expect(tag).toHaveTextContent(t('ui.carreira.etiqueta'));
    expect(tag).toHaveAttribute('aria-haspopup', 'dialog');
    fireEvent.click(tag);
    expect(screen.getByRole('dialog', { name: t('ui.carreira.titulo') })).toBeInTheDocument();
  });

  it('o card mostra o total de taças ao lado das miniaturas', () => {
    show();
    expect(document.querySelector('.tacas__total')).toHaveTextContent('3');
  });

  it('o resultado carimba a foto da cena (inclinado, como carimbo de borracha) e separa "Você ganha" de "Em troca"', () => {
    show();
    fireEvent.click(screen.getByRole('button', { name: new RegExp(t('events.salario-atrasado.opcoes.ficar')) }));
    fireEvent.click(screen.getByRole('button', { name: t('ui.decisao.confirmar') }));
    const carimbo = document.querySelector('.decisao__foto .decisao__carimbo') as HTMLElement;
    expect(carimbo).toHaveTextContent(t('ui.resultado.carimbo.misto'));
    expect(carimbo).toHaveAttribute('aria-hidden', 'true');
    // v2.81 (pedido do usuário: "podem vir tortos e maiores"): o carimbo é a exceção do "nada inclinado"
    expect(css).toMatch(/\n\.decisao__carimbo \{[^}]*rotate:\s*-9deg/);
    const dialog = screen.getByRole('dialog', { name: t('ui.resultado.misto') });
    expect(within(dialog).getByText(t('ui.resultado.voceEscolheu'))).toBeInTheDocument();
    expect(within(dialog).getByRole('list', { name: t('ui.decisao.ganha') })).toHaveTextContent(t('ui.resultado.pontos', { sinal: '+', n: 5 }));
    expect(within(dialog).getByRole('list', { name: t('ui.decisao.emTroca') })).toHaveTextContent(t('preview.campo.moral'));
  });
});

// v2.81 (pedido do usuário: "minha carreira mostra o resumo da carreira até o momento, com stats e números"): a gaveta
// abre com os números somados das temporadas fechadas; o goleiro vê jogos sem sofrer gol no lugar de gols e assistências.
describe('"Minha carreira": números da carreira até agora (v2.81)', () => {
  const seasons = [
    { age: 17, clubId: 'bahia', overall: 58, games: 18, goals: 3, assists: 2, cleanSheets: 0 },
    { age: 18, clubId: 'bahia', overall: 63, games: 40, goals: 9, assists: 7, cleanSheets: 1 },
  ];
  const abrir = (position = 'meia') => {
    render(<Decision eventId="salario-atrasado" age={19} progress={0.2} player={{ ...PLAYER, position, seasons }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    fireEvent.click(screen.getByRole('button', { name: t('ui.carreira.titulo') }));
    return within(screen.getByRole('dialog', { name: t('ui.carreira.titulo') })).getByRole('list', { name: t('ui.carreira.numeros') });
  };

  it('jogos, gols e assistências somados', () => {
    const numeros = abrir();
    expect(within(numeros).getByText(t('ui.carreira.jogos')).closest('li')).toHaveTextContent('58');
    expect(within(numeros).getByText(t('ui.carreira.gols')).closest('li')).toHaveTextContent('12');
    expect(within(numeros).getByText(t('ui.carreira.assistencias')).closest('li')).toHaveTextContent('9');
  });

  it('goleiro: jogos e jogos sem sofrer gol', () => {
    const numeros = abrir('goleiro');
    expect(within(numeros).getByText(t('ui.carreira.semSofrerGol')).closest('li')).toHaveTextContent('1');
    expect(within(numeros).queryByText(t('ui.carreira.gols'))).toBeNull();
  });
});

// v2.81 (pedido do usuário: "valorizar as fotos"): a dica e o detalhe da marcada ficam sobre a parte de baixo da foto, sem
// linha própria, e a foto ganha essa altura. No HTML seguem depois das opções (a ordem de leitura não muda).
describe('foto maior: dica e detalhe sobre a foto (v2.81)', () => {
  it('a dica e o detalhe são posicionados sobre a foto, sem reservar altura no painel', () => {
    expect(css).toMatch(/\.decisao__painel > \.decisao__detalhe \{[^}]*position:\s*absolute/);
    expect(css).not.toMatch(/\n\.decisao__detalhe \{[^}]*min-block-size/);
  });
});
