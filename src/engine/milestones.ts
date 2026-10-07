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
  convocado: boolean;
  jogosSelecao: number;
  golsSelecaoAno: number;
  copa: boolean;
  exterior: boolean;
  estreouSelecao: boolean;
}
export interface MilestoneDef { id: string; escopo: 'carreira' | 'clube'; gatilho: Cond[]; espelho?: string }

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

/** `done` = chaves já vividas (ou silenciadas) até aqui. */
export function fireMilestones(facts: MilestoneFacts, done: ReadonlySet<string>): MilestoneResult {
  const ctx = facts as unknown as Record<string, number | string | boolean>;
  const fired: MilestoneDef[] = [];
  const silenced: string[] = [];
  for (const m of MILESTONES) {
    const key = m.escopo === 'clube' ? milestoneKey(m.id, facts.clubId) : milestoneKey(m.id);
    if (done.has(key) || !m.gatilho.every((c) => holds(ctx, c))) continue;
    if (m.espelho && fired.some((f) => f.id === m.espelho)) { silenced.push(key); continue; }
    if (fired.length >= MAX_PER_SEASON) continue;
    fired.push(m);
  }
  return { fired, silenced };
}
