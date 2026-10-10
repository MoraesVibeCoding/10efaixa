import { holds, type Cond } from './events';
import data from '../data/milestones.json';

// T25c (SPEC 6.13b, v2.29): marcos da carreira, as primeiras vezes. O motor só decide QUAIS marcos disparam em cada temporada
// (fatos → dados de milestones.json); o texto e as 3 opções são um evento comum de events.json com o mesmo id.
export interface MilestoneFacts {
  clubId: string;
  /** Primeira temporada no profissional da carreira. */
  proDebut: boolean;
  /** Primeira temporada neste clube (já no profissional). */
  clubDebut: boolean;
  titular: boolean;
  golsAno: number;
  golsCarreira: number;
  assistenciasCarreira: number;
  golsNoClube: number;
  /** Já cobra falta/bola parada (traço ou escolha). */
  cobrador: boolean;
  titulosCarreira: number;
  /** Disputou final de copa ou ganhou título no ano. */
  finalAno: boolean;
  classico: boolean;
  capitao: boolean;
  /** v2.63: virou a referência do clube (regra da 10 em shirt.json): a camisa 10 é dele. */
  camisa10: boolean;
  convocado: boolean;
  jogosSelecao: number;
  golsSelecaoAno: number;
  copa: boolean;
  exterior: boolean;
  estreouSelecao: boolean;
}
/** v2.78: quando a cena acontece na temporada (sem momento: no fim, pelo desempenho do ano). */
export type MilestoneMoment = 'chegada' | 'convocacao' | 'copa' | 'fim';
export interface MilestoneDef { id: string; escopo: 'carreira' | 'clube'; gatilho: Cond[]; espelho?: string | string[]; momento?: MilestoneMoment }

export const MILESTONES = data.marcos as unknown as MilestoneDef[];
export const MAX_PER_SEASON = data.maxPorTemporada;
/** Como a temporada vira fatos (titular, gols pela Seleção) e o teto dos efeitos dos marcos; números em milestones.json. */
export const FACTS = data.fatos;
export const EFFECTS = data.efeitos;

/** Chave de registro: o de carreira é o id; o de clube é "id@clube" (uma vez por clube). */
export const milestoneKey = (id: string, clubId?: string): string => (clubId ? `${id}@${clubId}` : id);

export interface MilestoneResult {
  /** Os marcos que disparam nesta temporada, na ordem de prioridade dos dados, até o máximo por temporada. */
  fired: MilestoneDef[];
  /** Chaves de marcos de clube que ficam em silêncio: o espelho de carreira disparou na mesma temporada (a mesma cena duas vezes). */
  silenced: string[];
}

/** v2.78: o momento do marco (sem momento nos dados, é o fim da temporada). */
export const momentOf = (m: MilestoneDef): MilestoneMoment => m.momento ?? 'fim';

/** `done` = chaves já vividas (ou silenciadas) até aqui. Só os marcos do `momento` pedido; o limite por temporada vale só no fim. */
export function fireMilestones(facts: MilestoneFacts, done: ReadonlySet<string>, momento: MilestoneMoment = 'fim'): MilestoneResult {
  const ctx = facts as unknown as Record<string, number | string | boolean>;
  const fired: MilestoneDef[] = [];
  const silenced: string[] = [];
  for (const m of MILESTONES) {
    if (momentOf(m) !== momento) continue;
    const key = m.escopo === 'clube' ? milestoneKey(m.id, facts.clubId) : milestoneKey(m.id);
    if (done.has(key) || !m.gatilho.every((c) => holds(ctx, c))) continue;
    const mirrors = [m.espelho ?? []].flat();
    if (fired.some((f) => mirrors.includes(f.id))) { silenced.push(key); continue; }
    if (momento === 'fim' && fired.length >= MAX_PER_SEASON) continue;
    fired.push(m);
  }
  return { fired, silenced };
}
