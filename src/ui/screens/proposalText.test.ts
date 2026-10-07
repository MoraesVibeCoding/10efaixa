import { LEVELS } from '../../engine/minutes';
import type { ProposalView } from '../../engine/proposals';
import { t } from '../../i18n';
import { changeText, currentText, proposalText, starsOf } from './proposalText';

// T28c (SPEC 6.12, v2.28/v2.50): o texto de cada proposta na tela: clube, liga, salário, contrato, papel, minutos e nível do clube.
const view = (over: Partial<ProposalView> = {}): ProposalView => ({
  clubId: 'flamengo', league: 'BRA-A', currency: 'BRL', annualSalary: 2_400_000, years: 3, role: 'titularRegular', staffQuality: 1.1, offAxis: false,
  minutosFaixa: 'muitos', nivelClube: 'boa', marca: null,
  salarioMensal: 200_000, salarioPct: { pct: 27, sentido: 'sobe' }, valorProjetadoEUR: 9_500_000, valorPct: { pct: 15, sentido: 'sobe' }, minutosVs: 'menos', ...over,
});

describe('texto da proposta (T28c)', () => {
  it('traz clube, liga, salário por ano, contrato, papel prometido, minutos e nível do clube', () => {
    const x = proposalText(view());
    expect(x.clube).toBe('Flamengo');
    expect(x.liga).toBe('Série A');
    expect(x.salario).toMatch(/^R\$\s?2,4\smi\spor ano$/);
    expect(x.contrato).toBe('3 anos de contrato');
    expect(x.papel).toBe(t('ui.proposta.papel.titularRegular'));
    expect(x.minutos).toBe(t('ui.proposta.minutos.muitos'));
    expect(x.nivel).toBe(t('ui.proposta.nivel.boa'));
  });

  it('salário em euro para clube europeu, e contrato de um ano no singular', () => {
    const x = proposalText(view({ clubId: 'benfica', league: 'POR', currency: 'EUR', annualSalary: 1_200_000, years: 1 }));
    expect(x.salario).toMatch(/€/);
    expect(x.contrato).toBe('1 ano de contrato');
  });

  it('minutos e nível saem só em palavras: nenhuma faixa vira número', () => {
    for (const m of ['muitos', 'rodizio', 'poucos'] as const) for (const n of LEVELS) {
      const x = proposalText(view({ minutosFaixa: m, nivelClube: n }));
      expect(`${x.minutos} ${x.nivel} ${x.papel}`).not.toMatch(/\d/);
    }
  });

  it('proposta fora do eixo avisa "muito salário, pouca visibilidade"; as outras não', () => {
    expect(proposalText(view({ offAxis: true })).aviso).toBe(t('ui.proposta.foraDoEixo'));
    expect(proposalText(view()).aviso).toBeNull();
  });

  it('a legenda dos dois pesos e a previsão estão no texto da tela', () => {
    expect(t('ui.proposta.legenda')).toMatch(/pesam na sua evolução/);
    expect(t('ui.proposta.legenda')).toMatch(/previsão/);
  });

  it('a marca vira texto: coração, rival, rival do coração; sem marca, nada', () => {
    expect(proposalText(view()).marca).toBeNull();
    expect(proposalText(view({ marca: 'coracao' })).marca).toBe(t('ui.proposta.marca.coracao'));
    expect(proposalText(view({ marca: 'rival' })).marca).toBe(t('ui.proposta.marca.rival'));
    expect(proposalText(view({ marca: 'rivalCoracao' })).marca).toBe(t('ui.proposta.marca.rivalCoracao'));
  });
});

describe('texto do cartão de contrato (T28k)', () => {
  it('variação em palavras e seta, com o sinal dito por extenso', () => {
    expect(changeText({ pct: 27, sentido: 'sobe' })?.texto).toBe(t('ui.proposta.pct.sobe', { pct: 27 }));
    expect(changeText({ pct: -10, sentido: 'cai' })?.texto).toBe(t('ui.proposta.pct.cai', { pct: 10 }));
    expect(changeText({ pct: 0, sentido: 'igual' })?.texto).toBe(t('ui.proposta.pct.igual'));
    expect(changeText({ pct: 2048, sentido: 'sobe' })?.texto).toBe(t('ui.proposta.pct.muito'));
    expect(changeText({ pct: 999, sentido: 'sobe' })?.texto).toBe(t('ui.proposta.pct.sobe', { pct: 999 }));
    expect(changeText(null)).toBeNull();
  });

  it('reputação em estrelas, de 1 a 7, na ordem dos níveis', () => {
    expect(LEVELS.map(starsOf)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('a proposta traz salário por mês, valor projetado e estrelas; o clube atual traz os anos que restam', () => {
    const x = proposalText(view());
    expect(x.salarioMes).toMatch(/200\smil\spor mês/);
    expect(x.valorProj).toMatch(/Valor projetado: .*9,5\smi/);
    expect(x.estrelas).toBe(4);
    expect(x.minutosVs).toBe(t('ui.proposta.minutosVs.menos'));
    expect(proposalText(view({ minutosVs: null })).minutosVs).toBeNull();
    const a = currentText({ clubId: 'sport', league: 'BRA-A', currency: 'BRL', salarioMensal: 150_000, anosRestantes: 1, role: 'disputa', nivelClube: 'media', valorProjetadoEUR: 8_000_000, valorPct: null, renovacao: null, aumento: null });
    expect(a.restam).toBe(t('ui.proposta.restam_um'));
    expect(a.clube).toBe('Sport');
    expect(currentText({ clubId: 'sport', league: 'BRA-A', currency: 'BRL', salarioMensal: 1, anosRestantes: 3, role: 'disputa', nivelClube: 'media', valorProjetadoEUR: 1, valorPct: null, renovacao: null, aumento: null }).restam).toBe(t('ui.proposta.restam', { n: 3 }));
  });
});
