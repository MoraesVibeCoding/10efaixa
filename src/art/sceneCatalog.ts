import { sceneOf } from '../engine/events';
import data from '../data/scenes.json';

// T46 (SPEC 6.17): cada cenário do catálogo diz qual pose, expressão, detalhes e quantos companheiros usa.
// A definição é única por cenário: eventos diferentes no mesmo lugar reaproveitam a mesma cena padrão.
export interface SceneDef {
  id: string; pose: string; poseGoleiro?: string; expressao: string; detalhes: string[]; companheiros: number;
}
const DEFS = new Map<string, SceneDef>(Object.entries(data.definicoes as Record<string, Omit<SceneDef, 'id'>>).map(([id, d]) => [id, { id, ...d }]));

export function sceneDef(id: string): SceneDef {
  const d = DEFS.get(id);
  if (!d) throw new RangeError(`cena desconhecida: ${id}`);
  return d;
}

export const sceneForEvent = (eventId: string) => sceneDef(sceneOf(eventId));

/** Peças que a cena pede à arte, já com os nomes do formato (briefing 5.1). */
export const filesFor = (d: SceneDef, goalkeeper: boolean) => ({
  cenario: `cenario__${d.id}.svg`,
  pose: `pose__${(goalkeeper && d.poseGoleiro) || d.pose}.svg`,
  detalhes: d.detalhes.map((x) => `detalhe__${x}.svg`),
});

/** Lista de todas as peças de cena do catálogo (cenários, poses, detalhes e troféus), sem repetição — a encomenda da T47. */
export const allFiles = (): string[] => [...new Set([
  ...data.cenas.map((id) => `cenario__${id}.svg`),
  ...data.poses.map((p) => `pose__${p}.svg`),
  ...data.detalhes.map((x) => `detalhe__${x}.svg`),
  ...data.trofeus.map((x) => `detalhe__trofeu-${x}.svg`),
])];
