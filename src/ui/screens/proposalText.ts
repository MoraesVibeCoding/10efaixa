import type { Change } from '../../engine/contractCard';
import cfg from '../../data/contractCard.json';
import { LEVELS } from '../../engine/minutes';
import type { CurrentClubView, ProposalView } from '../../engine/proposals';
import { t } from '../../i18n';
import { clubName } from './clubText';
import { divisionLabel } from './LinhaDoTempo';

// T28c (SPEC 6.12, v2.28/v2.50): o texto de uma proposta na tela. Minutos e nível do clube só em palavras (faixas).
export interface ProposalText {
  clube: string; liga: string; salario: string; contrato: string; papel: string; minutos: string; nivel: string; aviso: string | null; marca: string | null;
  /** T28k: salário por mês com a variação, valor projetado (estimativa) com a variação e a reputação em estrelas (1 a 6). */
  salarioMes: string; salarioVar: ChangeText | null; valorProj: string; valorVar: ChangeText | null; estrelas: number;
  /** T28m: minutos neste clube contra o atual, em palavras (null = sem clube atual para comparar). */
  minutosVs: string | null;
}
export interface ChangeText { texto: string; sentido: Change['sentido'] }

/** Variação em palavras e seta (nunca só cor): "▲ 27% a mais", "▼ 10% a menos", "● igual ao atual". */
export function changeText(c: Change | null): ChangeText | null {
  if (!c) return null;
  const key = c.sentido === 'sobe' && c.pct >= cfg.pctMaximo ? 'muito' : c.sentido;
  return { texto: t(`ui.proposta.pct.${key}`, { pct: Math.abs(c.pct) }), sentido: c.sentido };
}
/** Reputação do clube em estrelas, de 1 (sem expressão) a 6 (gigante). */
export const starsOf = (nivel: ProposalView['nivelClube']): number => LEVELS.indexOf(nivel) + 1;

export const money = (amount: number, currency: string) =>
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
    marca: v.marca ? t(`ui.proposta.marca.${v.marca}`) : null,
    salarioMes: t('ui.proposta.salarioMes', { valor: money(v.salarioMensal, v.currency) }),
    salarioVar: changeText(v.salarioPct),
    valorProj: v.valorProjetadoEUR === null ? '' : t('ui.proposta.valorProjetado', { valor: money(v.valorProjetadoEUR, 'EUR') }),
    valorVar: changeText(v.valorPct),
    estrelas: starsOf(v.nivelClube),
    minutosVs: v.minutosVs === null ? null : t(`ui.proposta.minutosVs.${v.minutosVs}`),
  };
}

export interface CurrentText { clube: string; liga: string; salarioMes: string; valorProj: string; valorVar: ChangeText | null; nivel: string; papel: string; estrelas: number; restam: string }

/** O clube atual como cartão: mesmos campos da proposta, mais os anos de contrato que restam. */
export function currentText(a: CurrentClubView): CurrentText {
  return {
    clube: clubName(a.clubId).nome, liga: divisionLabel(a.league),
    salarioMes: t('ui.proposta.salarioMes', { valor: money(a.salarioMensal, a.currency) }),
    valorProj: t('ui.proposta.valorProjetado', { valor: money(a.valorProjetadoEUR, 'EUR') }), valorVar: changeText(a.valorPct),
    nivel: t(`ui.proposta.nivel.${a.nivelClube}`), papel: t(`ui.proposta.papel.${a.role}`), estrelas: starsOf(a.nivelClube),
    restam: a.anosRestantes <= 1 ? t('ui.proposta.restam_um') : t('ui.proposta.restam', { n: a.anosRestantes }),
  };
}
