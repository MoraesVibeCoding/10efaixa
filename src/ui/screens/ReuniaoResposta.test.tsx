import { act, fireEvent, render, screen, within } from '@testing-library/react';
import preview from '../../data/preview.json';
import type { MeetingResult } from '../../engine/meeting';
import type { Idea } from '../../engine/meetingOptions';
import { t } from '../../i18n';
import { ReuniaoResposta } from './Reuniao';

// v2.88 (pedido do usuário em 2026-10-11: a resposta estava "muito escondida apenas uma pequena tela saindo de baixo"): a resposta
// da comissão é uma página do álbum, com a foto da sala e o quadro do plano no papel. Carimbo (decisão do usuário): "TOPOU" só
// quando a comissão aceita a ideia 2 ou 3 (a 1 é a do próprio técnico); "RECUSOU" na recusa; sem carimbo na outra ideia.
// O tempo: resultadoMs quando aceita; respostaLongaMs quando o plano muda (outra ideia ou recusa). Dois toques passam.
const focusName = (f: string) => t(`attributes.attribute.${f}`);
const PLAYER = {
  name: 'Pedro', position: 'volante', clubId: 'bahia', overall: 70, titles: [] as string[], role: 'disputa',
  monthlySalary: { amount: 40_000, currency: 'BRL' as const }, marketValueEUR: 2_000_000,
};
type R = Pick<MeetingResult, 'response' | 'reason' | 'focus'>;
function abrir(resposta: R, ideia: Idea, pedido = { main: 'drible', secondary: 'finalizacao' }, onDone = vi.fn()) {
  render(<ReuniaoResposta resposta={resposta} ideia={ideia} pedido={pedido} player={PLAYER} age={19} progress={0.2}
    pagina={{ ano: 2029, numero: 4 }} scene={{ src: 'sala.webp', alt: 'Sala de reuniões' }} onDone={onDone} />);
  const pagina = screen.getByRole('alertdialog');
  return { onDone, pagina, carimbo: pagina.querySelector('.decisao__foto .decisao__carimbo'), plano: within(pagina).getByRole('list', { name: t('ui.reuniao.resposta.plano.titulo') }) };
}
const chip = (el: HTMLElement, nome: string) => within(el).getByText(nome).closest('.plano__chip') as HTMLElement;

beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} })); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('resposta da comissão como página (v2.88)', () => {
  it('página do álbum: linha da página, card do jogador, foto da sala, rótulo e título; sem botão', () => {
    const { pagina } = abrir({ response: 'aceita', focus: { main: 'passe', secondary: 'drible' } }, 'obvia', { main: 'passe', secondary: 'drible' });
    expect(pagina).toHaveAccessibleName(t('ui.reuniao.resposta.aceita.titulo'));
    expect(pagina.querySelector('.pagina__topo')).not.toBeNull();
    expect(pagina.querySelector('.decisao__topo')).not.toBeNull();
    expect(pagina.querySelector('.decisao__foto img[src="sala.webp"]')).not.toBeNull();
    expect(pagina).toHaveTextContent(t('ui.reuniao.resposta.rotulo'));
    expect(within(pagina).queryByRole('button', { name: /seguir/i })).toBeNull();
    expect(pagina).toHaveTextContent(t('ui.resultado.dica'));
  });

  it('ideia 1 aceita: sem carimbo (é o plano do técnico); o treino do semestre com principal e apoio', () => {
    const { carimbo, plano } = abrir({ response: 'aceita', focus: { main: 'passe', secondary: 'drible' } }, 'obvia', { main: 'passe', secondary: 'drible' });
    expect(carimbo).toBeNull();
    expect(plano).toHaveTextContent(t('ui.reuniao.resposta.plano.treino'));
    expect(chip(plano, focusName('passe'))).toHaveTextContent(t('ui.reuniao.resposta.plano.principal'));
    expect(chip(plano, focusName('drible'))).toHaveTextContent(t('ui.reuniao.resposta.plano.apoio'));
  });

  it.each(['mescla', 'ousada'] as const)('ideia %s aceita: carimbo "TOPOU"', (ideia) => {
    const { carimbo } = abrir({ response: 'aceita', focus: { main: 'drible', secondary: 'finalizacao' } }, ideia);
    expect(carimbo).toHaveTextContent(t('ui.reuniao.resposta.carimbo.topou'));
    expect(carimbo).toHaveClass('decisao__carimbo--positivo');
  });

  it('outra ideia: sem carimbo; "Você pediu" risca o que caiu e "O técnico quer" marca o novo como principal', () => {
    // pediu drible + finalização; o clube precisa de marcação: marcação vira principal e o drible fica de apoio
    const { carimbo, plano } = abrir({ response: 'contrapropoe', focus: { main: 'marcacao', secondary: 'drible' } }, 'ousada');
    expect(carimbo).toBeNull();
    const [pediu, quer] = within(plano).getAllByRole('listitem');
    expect(pediu).toHaveTextContent(t('ui.reuniao.resposta.plano.pediu'));
    expect(chip(pediu!, focusName('finalizacao'))).toHaveClass('plano__chip--fora');
    expect(chip(pediu!, focusName('drible'))).not.toHaveClass('plano__chip--fora');
    expect(quer).toHaveTextContent(t('ui.reuniao.resposta.plano.quer'));
    expect(chip(quer!, focusName('marcacao'))).toHaveClass('plano__chip--novo');
    expect(chip(quer!, focusName('marcacao'))).toHaveTextContent(t('ui.reuniao.resposta.plano.principal'));
    expect(chip(quer!, focusName('drible'))).toHaveTextContent(t('ui.reuniao.resposta.plano.apoio'));
  });

  it('recusa: carimbo "RECUSOU"; o pedido riscado e o treino segue normal, sem foco extra; o motivo em palavras', () => {
    const { carimbo, plano, pagina } = abrir({ response: 'recusa', reason: 'relacao', focus: {} }, 'ousada');
    expect(carimbo).toHaveTextContent(t('ui.reuniao.resposta.carimbo.recusou'));
    expect(carimbo).toHaveClass('decisao__carimbo--negativo');
    expect(pagina).toHaveTextContent(t('ui.reuniao.resposta.recusa.relacao'));
    const [pediu, segue] = within(plano).getAllByRole('listitem');
    for (const f of ['drible', 'finalizacao']) expect(chip(pediu!, focusName(f))).toHaveClass('plano__chip--fora');
    expect(segue).toHaveTextContent(t('ui.reuniao.resposta.plano.normal'));
  });

  it('o tempo: aceita fecha em resultadoMs; outra ideia e recusa, em respostaLongaMs', () => {
    const aceita = abrir({ response: 'aceita', focus: { main: 'drible', secondary: 'finalizacao' } }, 'ousada');
    act(() => { vi.advanceTimersByTime(preview.resultadoMs); });
    expect(aceita.onDone).toHaveBeenCalledOnce();
  });

  it.each([
    [{ response: 'contrapropoe', focus: { main: 'marcacao', secondary: 'drible' } }],
    [{ response: 'recusa', reason: 'score', focus: {} }],
  ] as [R][])('quando o plano muda, fica respostaLongaMs (%#)', (r) => {
    const { onDone } = abrir(r, 'ousada');
    act(() => { vi.advanceTimersByTime(preview.resultadoMs); });
    expect(onDone).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(preview.respostaLongaMs - preview.resultadoMs); });
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('dois toques passam; um só, não; o foco abre na página e Enter passa', () => {
    const { onDone, pagina } = abrir({ response: 'contrapropoe', focus: { main: 'marcacao', secondary: 'drible' } }, 'ousada');
    expect(pagina).toHaveFocus();
    fireEvent.click(pagina);
    expect(onDone).not.toHaveBeenCalled();
    fireEvent.click(pagina);
    expect(onDone).toHaveBeenCalledOnce();
  });

  it('Esc passa na hora', () => {
    const { onDone, pagina } = abrir({ response: 'aceita', focus: { main: 'passe', secondary: 'drible' } }, 'obvia', { main: 'passe', secondary: 'drible' });
    fireEvent.keyDown(pagina, { key: 'Escape' });
    expect(onDone).toHaveBeenCalledOnce();
  });
});
