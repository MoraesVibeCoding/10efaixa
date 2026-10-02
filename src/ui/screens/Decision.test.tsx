import { fireEvent, render, screen, within } from '@testing-library/react';
import events from '../../data/events.json';
import { previewOf } from '../../engine/preview';
import { t } from '../../i18n';
import { Decision } from './Decision';

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

describe('perfil de cada opção (pedido do usuário na T49)', () => {
  it('cada opção mostra o temperamento a que remete, e marca o do próprio jogador', () => {
    render(<Decision eventId="proposta-coracao" age={24} progress={0.4} temperament="lider" player={{ name: 'Zé', position: 'meia', clubId: 'flamengo', overall: 60, titles: [], role: 'reserva', monthlySalary: { amount: 4_000, currency: 'BRL' } }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    for (const [i, o] of (events.eventos.find((e) => e.id === 'proposta-coracao')!.opcoes as { jeito: string }[]).entries()) {
      expect(buttons[i]).toHaveAccessibleName(new RegExp(t(`creation.temperament.${o.jeito}`)));
      const mine = o.jeito === 'lider';
      if (mine) expect(buttons[i]).toHaveAccessibleName(new RegExp(t('ui.decisao.seuJeito')));
      else expect(buttons[i]).not.toHaveAccessibleName(new RegExp(t('ui.decisao.seuJeito')));
    }
  });
});

describe('tela de decisão (T49: amostra; T51 completa)', () => {
  it('tema escuro, região principal e o título do evento como título da tela', () => {
    setup();
    expect(screen.getByRole('main')).toHaveAttribute('data-tema', 'escuro');
    expect(screen.getByRole('heading', { level: 1, name: t(`events.${EVENT}.titulo`) })).toBeInTheDocument();
  });

  it('a cena tem texto alternativo', () => {
    setup();
    expect(screen.getByRole('img', { name: 'O jogador na sala do empresário' })).toBeInTheDocument();
  });

  it('idade em número gigante e a faixa de progresso da carreira com nome acessível', () => {
    setup();
    expect(screen.getByText('17')).toBeInTheDocument();
    const bar = screen.getByRole('progressbar', { name: t('ui.decisao.progresso') });
    expect(bar).toHaveAttribute('aria-valuenow', '5');
    expect(bar).toHaveAttribute('aria-valuetext', t('ui.decisao.idade', { idade: 17 }));
  });

  it('quem é o jogador: nome, posição, clube com escudo estilizado e o overall em número (SPEC v2.16)', () => {
    setup();
    const who = screen.getByRole('region', { name: t('ui.decisao.jogador') });
    expect(within(who).getByText('Dudu Maestro')).toBeInTheDocument();
    expect(within(who).getByText(new RegExp(`${t('positions.meia')}.*Flamengo`))).toBeInTheDocument();
    expect(within(who).getByRole('img', { name: t('ui.decisao.escudo', { clube: 'Flamengo' }) })).toBeInTheDocument();
    expect(within(who).getByText(t('ui.decisao.over'))).toBeInTheDocument();
    const coin = within(who).getByText('78');
    expect(coin).toHaveAttribute('data-medalha', 'platina');
    expect(within(who).getByText(new RegExp(t('attributes.band.muitoBom')))).toBeInTheDocument();
  });

  it('ficha do jogador: tempo de jogo, salário do mês e títulos, em três células', () => {
    setup();
    const who = screen.getByRole('region', { name: t('ui.decisao.jogador') });
    expect(within(who).getByText(t('ui.decisao.tempoDeJogo'))).toBeInTheDocument();
    expect(within(who).getByText(t('ui.papel.titular'))).toBeInTheDocument();
    expect(within(who).getByText(t('ui.decisao.salario'))).toBeInTheDocument();
    expect(within(who).getByText(/R\$\s180\smil/)).toBeInTheDocument();
    expect(within(who).getByText(t('ui.decisao.titulosRotulo'))).toBeInTheDocument();
    expect(within(who).getAllByRole('term')).toHaveLength(3);
  });

  it('salário em euro quando o contrato é no exterior', () => {
    render(<Decision eventId={EVENT} age={25} progress={0.5} player={{ ...PLAYER, monthlySalary: { amount: 1_250_000, currency: 'EUR' } }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    expect(screen.getByText(/€\s1,3\smi/)).toBeInTheDocument();
  });

  it('títulos: um mini troféu por competição, com balão de quantidade só quando ganhou mais de um', () => {
    setup();
    const list = screen.getByRole('list', { name: t('ui.decisao.titulosLista') });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    const state = within(list).getByRole('img', { name: t('ui.decisao.trofeuVarios', { titulo: t('ui.titulo.estadual'), n: 2 }) });
    expect(state.parentElement).toHaveTextContent('2');
    const cup = within(list).getByRole('img', { name: t('ui.decisao.trofeu', { titulo: t('ui.titulo.copaDoBrasil') }) });
    expect(cup.parentElement).not.toHaveTextContent(/\d/);
  });

  it('muitas competições: cabem dois troféus e o resto vira um contador', () => {
    const titles = ['estadual', 'estadual', 'copaDoBrasil', 'serieA', 'libertadores', 'serieB'];
    render(<Decision eventId={EVENT} age={30} progress={0.7} player={{ ...PLAYER, titles }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    const list = screen.getByRole('list', { name: t('ui.decisao.titulosLista') });
    expect(within(list).getAllByRole('img')).toHaveLength(2);
    expect(within(list).getByText(t('ui.decisao.maisTitulos', { n: 4 }))).toBeInTheDocument();
    expect(within(list).getByText(t('ui.decisao.maisTitulosLeitor', { n: 4 }))).toBeInTheDocument();
  });

  it('sem título ainda: a ficha diz isso, sem lista de troféus', () => {
    render(<Decision eventId={EVENT} age={16} progress={0} player={{ ...PLAYER, titles: [] }} scene={{ src: 'c.webp', alt: 'cena' }} />);
    expect(screen.queryByRole('list', { name: t('ui.decisao.titulosLista') })).not.toBeInTheDocument();
    expect(screen.getByText(t('ui.decisao.nenhumTitulo'))).toBeInTheDocument();
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
    const [first] = screen.getAllByRole('button');
    expect(first).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(first!);
    expect(first).toHaveAttribute('aria-pressed', 'true');
    expect(onChoose).toHaveBeenCalledWith(def.opcoes[0]!.id);
  });
});
