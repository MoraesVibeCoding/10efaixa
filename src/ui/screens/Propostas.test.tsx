import { fireEvent, render, screen, within } from '@testing-library/react';
import type { CurrentClubView, ProposalView } from '../../engine/proposals';
import { t } from '../../i18n';
import { Propostas } from './Propostas';

// T28k (SPEC 6.12, v2.54): tela de contratos em cartões selecionáveis + "Confirmar escolha"; o clube atual é o primeiro cartão
// (Renovação quando o contrato acaba). Salário por mês com %, valor projetado (estimativa), reputação e papel nas tags.
const PLAYER = {
  name: 'Pedro', position: 'meia', clubId: 'flamengo', overall: 80, titles: [] as string[], role: 'disputa',
  monthlySalary: { amount: 29_900, currency: 'EUR' as const }, marketValueEUR: 8_200_000,
};
const proposta = (over: Partial<ProposalView> = {}): ProposalView => ({
  clubId: 'flamengo', league: 'BRA-A', currency: 'BRL', annualSalary: 2_400_000, years: 3, role: 'titularRegular', staffQuality: 1.1, offAxis: false,
  minutosFaixa: 'muitos', nivelClube: 'boa', marca: null,
  salarioMensal: 200_000, salarioPct: { pct: 27, sentido: 'sobe' }, valorProjetadoEUR: 9_500_000, valorPct: { pct: 15, sentido: 'sobe' }, minutosVs: 'menos', ...over,
});
const duas = [proposta(), proposta({ clubId: 'benfica', league: 'POR', currency: 'EUR', annualSalary: 1_200_000, role: 'disputa', minutosFaixa: 'rodizio', nivelClube: 'alta', offAxis: true, salarioPct: { pct: -10, sentido: 'cai' }, valorPct: { pct: 0, sentido: 'igual' } })];
const atual = (over: Partial<CurrentClubView> = {}): CurrentClubView => ({
  clubId: 'sport', league: 'BRA-A', currency: 'BRL', salarioMensal: 150_000, anosRestantes: 1, role: 'disputa', nivelClube: 'media',
  valorProjetadoEUR: 8_000_000, valorPct: { pct: 5, sentido: 'sobe' },
  renovacao: { salarioMensal: 165_000, salarioPct: { pct: 10, sentido: 'sobe' }, anos: 3 },
  aumento: { salarioMensal: 180_000, salarioPct: { pct: 20, sentido: 'sobe' }, anos: 3 }, ...over,
});
const longo = atual({ anosRestantes: 3, renovacao: null, aumento: null });

type Extra = { atual?: CurrentClubView; podeFicar?: boolean; podeForcar?: boolean; podeRenovar?: boolean; propostas?: ProposalView[] };
function setup(extra: Extra = {}, onChoose = vi.fn()) {
  render(<Propostas propostas={extra.propostas ?? duas} atual={extra.atual} podeFicar={extra.podeFicar ?? true} podeForcar={extra.podeForcar} podeRenovar={extra.podeRenovar}
    player={PLAYER} age={24} progress={0.4} scene={{ src: 'c.webp', alt: 'Assinatura de contrato' }} onChoose={onChoose} />);
  return onChoose;
}
const cards = () => within(screen.getByRole('group', { name: t('ui.proposta.cartoes') })).getAllByRole('radio').filter((r) => r.getAttribute('name') === 'cartao');
const confirmar = () => screen.getByRole('button', { name: t('ui.proposta.confirmar') });
const pick = (i: number) => { fireEvent.click(cards()[i]!); };

describe('tela de contratos (T28k)', () => {
  it('cabeçalho, título com foco, card do jogador no topo e a legenda da estimativa', () => {
    setup({ atual: longo });
    expect(screen.getByText(t('ui.proposta.sala'))).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: t('ui.proposta.titulo') })).toHaveFocus();
    expect(screen.getByRole('button', { name: new RegExp(t('ui.carreira.titulo')) })).toBeInTheDocument();
    expect(screen.getByText(t('ui.proposta.apoio'))).toBeInTheDocument();
  });

  it('o clube atual é o primeiro cartão, seguido das propostas, num grupo de cartões', () => {
    setup({ atual: longo });
    expect(cards()).toHaveLength(3);
    expect(cards()[0]).toHaveAccessibleName(new RegExp('Sport'));
    expect(cards()[0]).toHaveAccessibleName(new RegExp(t('ui.proposta.selo.atual')));
    expect(cards()[1]).toHaveAccessibleName(new RegExp(`Flamengo.*${t('ui.proposta.selo.nova')}`));
  });

  it('sem clube para ficar, só as propostas', () => {
    setup({ podeFicar: false });
    expect(cards()).toHaveLength(2);
  });

  it('cada cartão lê clube, liga, salário por mês com %, valor projetado, reputação e papel', () => {
    setup({ atual: longo });
    const card = within(cards()[1]!.closest('label')!);
    expect(card.getByText('Flamengo')).toBeInTheDocument();
    expect(card.getByText('Série A')).toBeInTheDocument();
    expect(card.getByText(/200\smil\spor mês/)).toBeInTheDocument();
    expect(card.getByText(t('ui.proposta.pct.sobe', { pct: 27 }))).toBeInTheDocument();
    expect(card.getByText(/Valor projetado/)).toBeInTheDocument();
    expect(card.getByText(t('ui.proposta.pct.sobe', { pct: 15 }))).toBeInTheDocument();
    expect(card.getByText(t('ui.proposta.nivel.boa'))).toBeInTheDocument();
    expect(card.getByText(t('ui.proposta.papel.titularRegular'))).toBeInTheDocument();
  });

  it('a marca de minutos contra o clube atual aparece em palavras no cartão (mais, parecido ou menos que hoje)', () => {
    setup({ atual: longo, propostas: [proposta({ minutosVs: 'menos' }), proposta({ clubId: 'benfica', minutosVs: 'mais' }), proposta({ clubId: 'sport', minutosVs: 'parecido' }), proposta({ clubId: 'bahia', minutosVs: null })] });
    expect(within(cards()[1]!.closest('label')!).getByText(t('ui.proposta.minutosVs.menos'))).toBeInTheDocument();
    expect(within(cards()[2]!.closest('label')!).getByText(t('ui.proposta.minutosVs.mais'))).toBeInTheDocument();
    expect(within(cards()[3]!.closest('label')!).getByText(t('ui.proposta.minutosVs.parecido'))).toBeInTheDocument();
    expect(within(cards()[4]!.closest('label')!).queryByText(/que hoje|com hoje/)).toBeNull();
  });

  it('redução e igual aparecem em palavras, não só em cor', () => {
    setup({ atual: longo });
    const second = within(cards()[2]!.closest('label')!);
    expect(second.getByText(t('ui.proposta.pct.cai', { pct: 10 }))).toBeInTheDocument();
    expect(second.getByText(t('ui.proposta.pct.igual'))).toBeInTheDocument();
  });

  it('"Confirmar escolha" fica desligado até escolher um cartão; aceitar é o padrão de uma proposta', () => {
    const onChoose = setup({ atual: longo });
    expect(confirmar()).toBeDisabled();
    pick(2);
    expect(confirmar()).toBeEnabled();
    fireEvent.click(confirmar());
    expect(onChoose).toHaveBeenCalledWith('aceitar:benfica');
  });

  it('o detalhe do cartão escolhido mostra salário por ano, contrato e o aviso de fora do eixo', () => {
    setup({ atual: longo });
    pick(2);
    const detalhe = screen.getByRole('region', { name: t('ui.proposta.detalhe') });
    expect(within(detalhe).getByText(/1,2\smi\spor ano/)).toBeInTheDocument();
    expect(within(detalhe).getByText('3 anos de contrato')).toBeInTheDocument();
    expect(within(detalhe).getByText(t('ui.proposta.foraDoEixo'))).toBeInTheDocument();
  });

  it('negociar com o empresário escolhe negociar:<clube>', () => {
    const onChoose = setup({ atual: longo });
    pick(1);
    fireEvent.click(screen.getByRole('radio', { name: t('ui.proposta.modo.negociar') }));
    fireEvent.click(confirmar());
    expect(onChoose).toHaveBeenCalledWith('negociar:flamengo');
  });

  it('"Forçar a saída" só existe com contrato longo (podeForcar) e escolhe forcar:<clube>', () => {
    const onChoose = setup({ atual: longo, podeForcar: true });
    pick(1);
    fireEvent.click(screen.getByRole('radio', { name: t('ui.proposta.modo.forcar') }));
    expect(screen.getByText(t('ui.proposta.dicaForcar'))).toBeInTheDocument();
    fireEvent.click(confirmar());
    expect(onChoose).toHaveBeenCalledWith('forcar:flamengo');
  });

  it('sem podeForcar não há "Forçar a saída"', () => {
    setup({ atual: longo });
    pick(1);
    expect(screen.queryByRole('radio', { name: t('ui.proposta.modo.forcar') })).toBeNull();
  });

  it('proposta do clube de coração mostra a marca e "Aceitar por amor"; só ela', () => {
    const onChoose = setup({ propostas: [proposta({ clubId: 'bahia', marca: 'coracao' }), proposta({ clubId: 'sport', marca: 'rival' })], podeFicar: false });
    const marcas = screen.getAllByText(t('ui.proposta.marca.coracao'));
    expect(marcas.length).toBeGreaterThan(0);
    expect(screen.getByText(t('ui.proposta.marca.rival'))).toBeInTheDocument();
    pick(0);
    fireEvent.click(screen.getByRole('radio', { name: t('ui.proposta.modo.amor') }));
    expect(screen.getByText(t('ui.proposta.dicaAmor'))).toBeInTheDocument();
    fireEvent.click(confirmar());
    expect(onChoose).toHaveBeenCalledWith('amor:bahia');
    pick(1);
    expect(screen.queryByRole('radio', { name: t('ui.proposta.modo.amor') })).toBeNull();
  });

  it('contrato no fim: o primeiro cartão é a Renovação, com renovar, pedir aumento e não renovar', () => {
    const onChoose = setup({ atual: atual(), podeRenovar: true });
    expect(cards()[0]).toHaveAccessibleName(new RegExp(t('ui.proposta.selo.renovacao')));
    pick(0);
    fireEvent.click(confirmar());
    expect(onChoose).toHaveBeenLastCalledWith('renovar');
    fireEvent.click(screen.getByRole('radio', { name: new RegExp(t('ui.proposta.modo.aumento')) }));
    fireEvent.click(confirmar());
    expect(onChoose).toHaveBeenLastCalledWith('aumento');
    fireEvent.click(screen.getByRole('radio', { name: new RegExp(t('ui.proposta.modo.naoRenovar')) }));
    fireEvent.click(confirmar());
    expect(onChoose).toHaveBeenLastCalledWith('ficar');
  });

  it('contrato longo: escolher o clube atual confirma ficar', () => {
    const onChoose = setup({ atual: longo });
    pick(0);
    fireEvent.click(confirmar());
    expect(onChoose).toHaveBeenCalledWith('ficar');
  });

  it('os emblemas são decorativos (o nome do clube já está no texto)', () => {
    const { container } = render(<Propostas propostas={duas} atual={longo} podeFicar player={PLAYER} age={24} progress={0.4} scene={{ src: 'c.webp', alt: 'x' }} onChoose={() => {}} />);
    expect(container.querySelectorAll('.propostas__item [role="img"]')).toHaveLength(0);
  });
});
