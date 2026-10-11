import { fireEvent, render, screen, within } from '@testing-library/react';
import { RETIRE, homeChoice, type HomeCardView, type ProposalView } from '../../engine/proposals';
import { t } from '../../i18n';
import { Propostas } from './Propostas';

// v2.85 (pedido do usuário em 2026-10-11): dos 34 em diante, a tela de propostas traz o clube atual, até 2 propostas,
// "Voltar para casa" e "Pendurar as chuteiras"; sem proposta, diz que ninguém ligou.
const PLAYER = {
  name: 'Pedro', position: 'meia', clubId: 'sport', overall: 74, titles: [] as string[], role: 'disputa',
  monthlySalary: { amount: 90_000, currency: 'BRL' as const }, marketValueEUR: 900_000,
};
const proposta: ProposalView = {
  clubId: 'flamengo', league: 'BRA-A', currency: 'BRL', annualSalary: 1_200_000, years: 1, role: 'disputa', staffQuality: 1, offAxis: false,
  minutosFaixa: 'poucos', nivelClube: 'alta', marca: null, salarioMensal: 100_000, salarioPct: { pct: 10, sentido: 'sobe' }, valorProjetadoEUR: 800_000, valorPct: { pct: -10, sentido: 'cai' }, minutosVs: 'menos',
};
const casa: HomeCardView = { clubId: 'bahia', kind: 'coracao', league: 'BRA-A', currency: 'BRL', salarioMensal: 63_000, salarioPct: { pct: 30, sentido: 'cai' } };

function setup(over: { propostas?: ProposalView[]; casa?: HomeCardView; podeParar?: boolean } = {}, onChoose = vi.fn()) {
  render(<Propostas propostas={over.propostas ?? [proposta]} podeFicar={false} casa={over.casa} podeParar={over.podeParar}
    player={PLAYER} age={35} progress={0.9} scene={{ src: 'c.webp', alt: 'cena' }} onChoose={onChoose} />);
  return onChoose;
}
const lista = () => within(screen.getByRole('group', { name: t('ui.proposta.cartoes') }));
const confirmar = () => { fireEvent.click(screen.getByRole('button', { name: t('ui.proposta.confirmar') })); };

describe('fim de carreira na tela de propostas (v2.85)', () => {
  it('"Voltar para casa": o clube, o selo do coração e o salário; confirmar volta para casa', () => {
    const onChoose = setup({ casa, podeParar: true });
    const card = lista().getByRole('radio', { name: new RegExp(t('ui.proposta.casa.titulo')) });
    expect(card.closest('label')).toHaveTextContent(t('ui.proposta.casa.selo.coracao'));
    expect(card.closest('label')).toHaveTextContent('Bahia');
    fireEvent.click(card);
    expect(screen.getByText(t('ui.proposta.casa.detalhe.coracao'))).toBeInTheDocument();
    confirmar();
    expect(onChoose).toHaveBeenCalledWith(homeChoice('bahia'));
  });

  it('sem clube de coração, o card de volta é do clube formador', () => {
    setup({ casa: { ...casa, kind: 'formador' }, podeParar: true });
    expect(lista().getByRole('radio', { name: new RegExp(t('ui.proposta.casa.titulo')) }).closest('label')).toHaveTextContent(t('ui.proposta.casa.selo.formador'));
  });

  it('"Pendurar as chuteiras" é o último card; confirmar encerra a carreira', () => {
    const onChoose = setup({ casa, podeParar: true });
    const radios = lista().getAllByRole('radio').filter((r) => r.getAttribute('name') === 'cartao');
    const parar = radios.at(-1)!;
    expect(parar).toHaveAccessibleName(new RegExp(t('ui.proposta.parar.titulo')));
    fireEvent.click(parar);
    expect(screen.getByText(t('ui.proposta.parar.detalhe'))).toBeInTheDocument();
    confirmar();
    expect(onChoose).toHaveBeenCalledWith(RETIRE);
  });

  it('sem proposta, a tela diz que ninguém ligou (e ainda tem casa e parar)', () => {
    setup({ propostas: [], casa, podeParar: true });
    expect(screen.getByText(t('ui.proposta.ninguem'))).toBeInTheDocument();
    expect(lista().getAllByRole('radio').filter((r) => r.getAttribute('name') === 'cartao')).toHaveLength(2);
  });

  it('antes dos 34, nada disso aparece', () => {
    setup();
    expect(lista().queryByRole('radio', { name: new RegExp(t('ui.proposta.parar.titulo')) })).toBeNull();
    expect(screen.queryByText(t('ui.proposta.ninguem'))).toBeNull();
  });
});
