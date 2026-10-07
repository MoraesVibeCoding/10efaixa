import { fireEvent, render, screen, within } from '@testing-library/react';
import type { MeetingOptions } from '../../engine/meetingOptions';
import { t } from '../../i18n';
import { Reuniao, ReuniaoResposta } from './Reuniao';

// T52d (SPEC 6.5, v2.53): a reunião com a comissão em 3 ideias (óbvia, mescla, ousada), no desenho aprovado: card do jogador no topo,
// fala do treinador e três cartões selecionáveis; depois, a resposta da comissão.
const focusName = (f: string) => (f === 'bolaParada' || f === 'pernaRuim' ? t(`ui.reuniao.foco.${f}`) : t(`attributes.attribute.${f}`));
const PLAYER = {
  name: 'Pedro', position: 'volante', clubId: 'flamengo', overall: 80, titles: [] as string[], role: 'disputa',
  monthlySalary: { amount: 29_900, currency: 'EUR' as const }, marketValueEUR: 8_200_000,
};
const IDEIAS: MeetingOptions = {
  obvia: { proposal: { main: 'fisico', secondary: 'passe' }, agrado: 'muito' },
  mescla: { proposal: { main: 'fisico', secondary: 'drible' }, agrado: 'possivel' },
  ousada: { proposal: { main: 'drible', secondary: 'finalizacao' }, agrado: 'pouco' },
};
const setup = (onChoose = vi.fn()) => {
  render(<Reuniao ideias={IDEIAS} player={PLAYER} age={19} progress={0.1} scene={{ src: 'c.webp', alt: 'Sala de reuniões' }} onChoose={onChoose} />);
  return onChoose;
};
const cards = () => within(screen.getByRole('radiogroup', { name: t('ui.reuniao.ideias') })).getAllByRole('radio');

describe('tela da reunião em 3 ideias (T52d)', () => {
  it('título, a fala do treinador com o nome do jogador e o card do jogador no topo', () => {
    setup();
    expect(screen.getByRole('heading', { level: 1, name: t('ui.reuniao.titulo') })).toBeInTheDocument();
    expect(screen.getByText(t('ui.reuniao.sala'))).toBeInTheDocument();
    expect(screen.getByText(t('ui.reuniao.fala', { nome: 'Pedro' }))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: new RegExp(t('ui.carreira.titulo')) })).toBeInTheDocument();
  });

  it('três cartões em grupo de rádio, cada um com os dois focos', () => {
    setup();
    expect(cards()).toHaveLength(3);
    expect(cards()[0]).toHaveAccessibleName(new RegExp(`${focusName('fisico')}.*${focusName('passe')}`));
    expect(cards()[1]).toHaveAccessibleName(new RegExp(`${focusName('fisico')}.*${focusName('drible')}`));
    expect(cards()[2]).toHaveAccessibleName(new RegExp(`${focusName('drible')}.*${focusName('finalizacao')}`));
  });

  it('o cartão 1 não tem rótulo nem dica de confiança; a mescla e a ousada dizem o agrado em palavras', () => {
    setup();
    expect(screen.queryByText(t('ui.reuniao.agrado.muito'))).toBeNull();
    expect(screen.getByText(t('ui.reuniao.agrado.possivel'))).toBeInTheDocument();
    expect(screen.getByText(t('ui.reuniao.agrado.pouco'))).toBeInTheDocument();
    expect(screen.queryByText(/sugerido|óbvio|obvio/i)).toBeNull();
  });

  it('"Propor ao técnico" só vale depois de escolher uma ideia e manda "principal|secundário" dela', () => {
    const onChoose = setup();
    const propor = screen.getByRole('button', { name: t('ui.reuniao.propor') });
    expect(propor).toBeDisabled();
    fireEvent.click(propor);
    expect(onChoose).not.toHaveBeenCalled();
    fireEvent.click(cards()[1]!);
    expect(cards()[1]).toBeChecked();
    expect(propor).toBeEnabled();
    fireEvent.click(propor);
    expect(onChoose).toHaveBeenCalledWith('fisico|drible');
  });

  it('escolher outro cartão troca a marca (um só marcado)', () => {
    setup();
    fireEvent.click(cards()[0]!);
    fireEvent.click(cards()[2]!);
    expect(cards().filter((c) => (c as HTMLInputElement).checked)).toHaveLength(1);
    expect(cards()[2]).toBeChecked();
  });

  it('nenhum número de atributo nos cartões', () => {
    setup();
    expect(screen.getByRole('radiogroup', { name: t('ui.reuniao.ideias') }).textContent).not.toMatch(/\d/);
  });
});

describe('resposta da comissão (T52)', () => {
  it('aceita: diz os dois focos combinados', () => {
    render(<ReuniaoResposta resposta={{ response: 'aceita', focus: { main: 'passe', secondary: 'drible' } }} onDone={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: t('ui.reuniao.resposta.aceita.titulo') });
    expect(dialog).toHaveTextContent(t('ui.reuniao.resposta.aceita.texto', { principal: focusName('passe'), secundario: focusName('drible') }));
  });

  it('contrapropõe: o clube precisa de outra coisa, e o pedido fica como secundário', () => {
    render(<ReuniaoResposta resposta={{ response: 'contrapropoe', focus: { main: 'marcacao', secondary: 'passe' } }} onDone={() => {}} />);
    expect(screen.getByRole('dialog', { name: t('ui.reuniao.resposta.contrapropoe.titulo') })).toHaveTextContent(t('ui.reuniao.resposta.contrapropoe.texto', { principal: focusName('marcacao'), secundario: focusName('passe') }));
  });

  it('recusa: o motivo em palavras (moral, relação com o técnico ou momento); "Seguir" fecha, uma vez só', () => {
    const onDone = vi.fn();
    render(<ReuniaoResposta resposta={{ response: 'recusa', reason: 'relacao', focus: {} }} onDone={onDone} />);
    const dialog = screen.getByRole('dialog', { name: t('ui.reuniao.resposta.recusa.titulo') });
    expect(dialog).toHaveTextContent(t('ui.reuniao.resposta.recusa.relacao'));
    const seguir = within(dialog).getByRole('button', { name: t('ui.resultado.seguir') });
    expect(seguir).toHaveFocus();
    fireEvent.click(seguir);
    fireEvent.click(seguir);
    expect(onDone).toHaveBeenCalledOnce();
  });
});
