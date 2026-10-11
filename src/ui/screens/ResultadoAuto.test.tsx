import { act, fireEvent, render, screen, within } from '@testing-library/react';
import preview from '../../data/preview.json';
import { t } from '../../i18n';
import { Decision } from './Decision';

// v2.88 (usuário em 2026-10-11: "igual em tudo"): o card do resultado da decisão perde o "Seguir" em todos os ritmos, como a
// resposta da reunião: fecha sozinho em resultadoMs e passa com dois toques; Enter, Espaço e Esc passam pelo teclado.
const PLAYER = {
  name: 'Dudu Maestro', position: 'meia', clubId: 'flamengo', overall: 74, titles: [] as string[],
  role: 'titularRegular', monthlySalary: { amount: 180_000, currency: 'BRL' as const }, marketValueEUR: 6_200_000,
};
const STATE = { moral: 0.6, relacaoTecnico: 0.6, idolatria: 40, idolatriaCoracao: 55, disciplina: 0.7, patrimonio: 2_000_000, salarioFator: 1 };
beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} })); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

function decidir(ritmo: 'normal' | 'completo' | 'rapido' = 'normal') {
  const onContinue = vi.fn();
  render(<Decision eventId="salario-atrasado" age={24} progress={0.4} player={PLAYER} state={STATE} ritmo={ritmo} scene={{ src: 'c.webp', alt: 'cena' }} onChoose={() => {}} onContinue={onContinue} />);
  const opcao = screen.getByRole('button', { name: new RegExp(t('events.salario-atrasado.opcoes.ficar')) });
  fireEvent.click(opcao);
  if (ritmo !== 'rapido') fireEvent.click(opcao);
  return { onContinue, caixa: screen.getByRole('dialog') };
}

describe('resultado da decisão sem "Seguir" (v2.88)', () => {
  it.each(['normal', 'completo', 'rapido'] as const)('%s: sem botão, com a dica e a barra do tempo', (ritmo) => {
    const { caixa } = decidir(ritmo);
    expect(within(caixa).queryByRole('button')).toBeNull();
    expect(caixa).toHaveTextContent(t('ui.resultado.dica'));
    expect(caixa.querySelector('.resultado__prazo')).not.toBeNull();
  });

  it('fecha sozinho em resultadoMs no Normal, uma vez só', () => {
    const { onContinue } = decidir('normal');
    act(() => { vi.advanceTimersByTime(preview.resultadoMs - 1); });
    expect(onContinue).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(preview.resultadoMs * 2); });
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it('dois toques passam na hora; um só, não', () => {
    const { onContinue, caixa } = decidir('normal');
    fireEvent.click(caixa);
    expect(onContinue).not.toHaveBeenCalled();
    fireEvent.click(caixa);
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it('o foco abre na caixa; Enter passa', () => {
    const { onContinue, caixa } = decidir('normal');
    expect(caixa).toHaveFocus();
    fireEvent.keyDown(caixa, { key: 'Enter' });
    expect(onContinue).toHaveBeenCalledOnce();
  });
});
