import type { ProposalView } from '../../engine/proposals';
import { t } from '../../i18n';
import { clubName } from './clubText';
import { divisionLabel } from './LinhaDoTempo';

// T28c (SPEC 6.12, v2.28/v2.50): o texto de uma proposta na tela. Minutos e nível do clube só em palavras (faixas).
export interface ProposalText { clube: string; liga: string; salario: string; contrato: string; papel: string; minutos: string; nivel: string; aviso: string | null }

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency, notation: 'compact', minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(amount);

export function proposalText(v: ProposalView): ProposalText {
  return {
    clube: clubName(v.clubId).nome,
    liga: divisionLabel(v.league),
    salario: t('ui.proposta.salario', { valor: money(v.annualSalary, v.currency) }),
    contrato: v.years === 1 ? t('ui.proposta.contrato_um') : t('ui.proposta.contrato', { n: v.years }),
    papel: t(`ui.proposta.papel.${v.role}`),
    minutos: t(`ui.proposta.minutos.${v.minutosFaixa}`),
    nivel: t(`ui.proposta.nivel.${v.nivelClube}`),
    aviso: v.offAxis ? t('ui.proposta.foraDoEixo') : null,
  };
}
