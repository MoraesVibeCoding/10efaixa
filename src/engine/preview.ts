import { toBRL, type Offer } from './market';
import data from '../data/events.json';
import cfg from '../data/preview.json';

// T41b (SPEC v2.14, estilo Copero): antes de decidir, o jogador vê o efeito provável de cada opção em sentido e intensidade, nunca em números.
export interface Preview { campo: string; sentido: 'sobe' | 'desce' | 'muda'; intensidade: 1 | 2 | 3 }
type Effect = [string, string, number | string | boolean];

const RANGES = data.campos as unknown as Record<string, [number | null, number | null] | string>;
const [SMALL, BIG] = cfg.intensidade as [number, number];
const level = (fraction: number): 1 | 2 | 3 => (fraction < SMALL ? 1 : fraction < BIG ? 2 : 3);

/** Efeitos numéricos da opção; escolhas que são a própria ação (sim/não, texto) ficam de fora. */
export function previewOf(eventId: string, optionId: string): Preview[] {
  const opt = data.eventos.find((e) => e.id === eventId)?.opcoes.find((o) => o.id === optionId);
  if (!opt) throw new RangeError(`opção inexistente: ${eventId}/${optionId}`);
  return (opt.efeitos as Effect[]).flatMap(([campo, op, v]): Preview[] => {
    if (typeof v !== 'number') return [];
    if (op === 'set') return [{ campo, sentido: 'muda', intensidade: 2 }];
    const range = RANGES[campo];
    const [lo, hi] = Array.isArray(range) ? range : [null, null];
    // ponytail: campo sem faixa (patrimônio) somado vale intensidade média; hoje ele só é multiplicado.
    const fraction = op === 'mul' ? Math.abs(v - 1) : lo !== null && hi !== null ? Math.abs(v) / (hi - lo) : SMALL;
    return [{ campo, sentido: (op === 'mul' ? v >= 1 : v >= 0) ? 'sobe' : 'desce', intensidade: level(fraction) }];
  });
}

export interface OfferPreview { minutos: number; salario: 'menor' | 'parecido' | 'maior' | 'muitoMaior'; anos: number }

/** Prévia de uma proposta: minutos e espaço no elenco pelo papel, salário em faixa contra o atual (sem contrato, qualquer salário é maior). */
export function offerPreview(o: Offer, currentAnnualSalaryBRL: number | null): OfferPreview {
  const ratio = currentAnnualSalaryBRL ? toBRL(o) / currentAnnualSalaryBRL : cfg.salario.maior;
  const s = cfg.salario;
  return {
    minutos: (cfg.papel as Record<string, number>)[o.role] ?? 1,
    salario: ratio < s.menor ? 'menor' : ratio >= s.muitoMaior ? 'muitoMaior' : ratio >= s.maior ? 'maior' : 'parecido',
    anos: o.years,
  };
}
