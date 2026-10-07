import { fireEvent, render, screen, within } from '@testing-library/react';
import type { ProposalView } from '../../engine/proposals';
import { t } from '../../i18n';
import { Propostas } from './Propostas';

// T28d (SPEC 6.12, v2.50): a tela de propostas de clube: até 3 propostas e "Ficar no clube".
const proposta = (over: Partial<ProposalView> = {}): ProposalView => ({
  clubId: 'flamengo', league: 'BRA-A', currency: 'BRL', annualSalary: 2_400_000, years: 3, role: 'titularRegular', staffQuality: 1.1, offAxis: false,
  minutosFaixa: 'muitos', nivelClube: 'grande', marca: null, ...over,
});
const duas = [proposta(), proposta({ clubId: 'benfica', league: 'POR', currency: 'EUR', annualSalary: 1_200_000, role: 'disputa', minutosFaixa: 'rodizio', nivelClube: 'grande', offAxis: true })];

describe('tela de propostas (T28d)', () => {
  it('título em h1 com o foco nele, uma proposta por item de lista e a legenda dos dois pesos', () => {
    render(<Propostas propostas={duas} podeFicar onChoose={() => {}} />);
    const h1 = screen.getByRole('heading', { level: 1, name: t('ui.proposta.titulo') });
    expect(h1).toHaveFocus();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText(t('ui.proposta.legenda'))).toBeInTheDocument();
  });

  it('cada proposta lê clube, liga, salário, contrato, papel, minutos e nível do clube', () => {
    render(<Propostas propostas={duas} podeFicar onChoose={() => {}} />);
    const first = within(screen.getAllByRole('listitem')[0]!);
    expect(first.getByText('Flamengo')).toBeInTheDocument();
    expect(first.getByText('Série A')).toBeInTheDocument();
    expect(first.getByText(/2,4\smi\spor ano/)).toBeInTheDocument();
    expect(first.getByText('3 anos de contrato')).toBeInTheDocument();
    expect(first.getByText(t('ui.proposta.papel.titularRegular'))).toBeInTheDocument();
    expect(first.getByText(t('ui.proposta.minutos.muitos'))).toBeInTheDocument();
    expect(first.getByText(t('ui.proposta.nivel.grande'))).toBeInTheDocument();
    expect(within(screen.getAllByRole('listitem')[1]!).getByText(t('ui.proposta.foraDoEixo'))).toBeInTheDocument();
  });

  it('"Aceitar proposta" escolhe aquele clube; o nome do botão diz qual clube (leitor de tela)', () => {
    const onChoose = vi.fn();
    render(<Propostas propostas={duas} podeFicar onChoose={onChoose} />);
    fireEvent.click(screen.getByRole('button', { name: /Aceitar proposta do Flamengo/ }));
    expect(onChoose).toHaveBeenLastCalledWith('aceitar:flamengo');
    fireEvent.click(screen.getByRole('button', { name: /Aceitar proposta do Benfica/ }));
    expect(onChoose).toHaveBeenLastCalledWith('aceitar:benfica');
  });

  it('"Ficar no clube" escolhe ficar e só existe quando há clube para ficar', () => {
    const onChoose = vi.fn();
    const { rerender } = render(<Propostas propostas={duas} podeFicar onChoose={onChoose} />);
    fireEvent.click(screen.getByRole('button', { name: t('ui.proposta.ficar') }));
    expect(onChoose).toHaveBeenCalledWith('ficar');
    rerender(<Propostas propostas={duas} podeFicar={false} onChoose={onChoose} />);
    expect(screen.queryByRole('button', { name: t('ui.proposta.ficar') })).toBeNull();
  });

  it('os emblemas são decorativos (o nome do clube já está no texto)', () => {
    const { container } = render(<Propostas propostas={duas} podeFicar onChoose={() => {}} />);
    expect(container.querySelectorAll('[role="img"]')).toHaveLength(0);
  });

  it('proposta do clube de coração mostra a marca e "Aceitar por amor" (salário menor, mais idolatria)', () => {
    const onChoose = vi.fn();
    render(<Propostas propostas={[proposta({ clubId: 'bahia', marca: 'coracao' }), proposta({ clubId: 'sport', marca: 'rival' })]} podeFicar onChoose={onChoose} />);
    expect(screen.getByText(t('ui.proposta.marca.coracao'))).toBeInTheDocument();
    expect(screen.getByText(t('ui.proposta.marca.rival'))).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Aceitar por amor do Bahia/ }));
    expect(onChoose).toHaveBeenLastCalledWith('amor:bahia');
    expect(screen.getAllByRole('button', { name: /Aceitar por amor/ })).toHaveLength(1);
    expect(screen.getByText(t('ui.proposta.dicaAmor'))).toBeInTheDocument();
  });

  it('cada proposta tem "Mandar o empresário negociar", que escolhe aquele clube', () => {
    const onChoose = vi.fn();
    render(<Propostas propostas={duas} podeFicar onChoose={onChoose} />);
    expect(screen.getAllByRole('button', { name: /Mandar o empresário negociar/ })).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: /Mandar o empresário negociar a proposta do Benfica/ }));
    expect(onChoose).toHaveBeenLastCalledWith('negociar:benfica');
    expect(screen.getAllByText(t('ui.proposta.dicaNegociar')).length).toBeGreaterThan(0);
  });

  it('"Forçar a saída" só aparece com contrato longo (podeForcar) e escolhe forcar:<clube>', () => {
    const onChoose = vi.fn();
    const { rerender } = render(<Propostas propostas={duas} podeFicar podeForcar onChoose={onChoose} />);
    fireEvent.click(screen.getByRole('button', { name: /Forçar a saída e aceitar a proposta do Flamengo/ }));
    expect(onChoose).toHaveBeenLastCalledWith('forcar:flamengo');
    expect(screen.getByText(t('ui.proposta.dicaForcar'))).toBeInTheDocument();
    rerender(<Propostas propostas={duas} podeFicar onChoose={onChoose} />);
    expect(screen.queryByRole('button', { name: /Forçar a saída/ })).toBeNull();
    expect(screen.queryByText(t('ui.proposta.dicaForcar'))).toBeNull();
  });
});
