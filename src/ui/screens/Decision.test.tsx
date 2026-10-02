import { fireEvent, render, screen, within } from '@testing-library/react';
import events from '../../data/events.json';
import { previewOf } from '../../engine/preview';
import { t } from '../../i18n';
import { Decision } from './Decision';

const EVENT = 'salario-atrasado';
const def = events.eventos.find((e) => e.id === EVENT)!;
const setup = (onChoose = vi.fn()) => {
  render(<Decision eventId={EVENT} age={17} progress={0.05} scene={{ src: 'cena.webp', alt: 'O jogador na sala do empresário' }} onChoose={onChoose} />);
  return onChoose;
};

describe('perfil de cada opção (pedido do usuário na T49)', () => {
  it('cada opção mostra o temperamento a que remete, e marca o do próprio jogador', () => {
    render(<Decision eventId="proposta-coracao" age={24} progress={0.4} temperament="lider" scene={{ src: 'c.webp', alt: 'cena' }} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    const [accept, byLove, refuse] = buttons;
    expect(byLove).toHaveAccessibleName(new RegExp(t('creation.temperament.lider')));
    expect(byLove).toHaveAccessibleName(new RegExp(t('ui.decisao.seuJeito')));
    expect(accept).toHaveAccessibleName(new RegExp(t('creation.temperament.frio')));
    expect(accept).not.toHaveAccessibleName(new RegExp(t('ui.decisao.seuJeito')));
    expect(refuse).not.toHaveAccessibleName(new RegExp(t('ui.decisao.jeito')));
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
