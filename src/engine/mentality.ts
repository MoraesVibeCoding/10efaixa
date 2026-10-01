import type { Attributes } from './attributes';
import cfg from '../data/mentality.json';

export const MENTALITIES = ['fominha', 'capitao', 'professor', 'maquina'] as const;
type Entry = { crescimento: Partial<Attributes>; ruido: number; declinio: number };

/** `growth` multiplica o crescimento por atributo; `evo` vai para o estado de evolução (ruído e declínio). Sem mentalidade = neutro. */
export function mentalityEffects(id: string | undefined): { growth: Partial<Attributes>; evo: { noiseFactor?: number; declineFactor?: number } } {
  const m = (cfg as unknown as Record<string, Entry>)[id ?? ''];
  return m ? { growth: m.crescimento, evo: { noiseFactor: m.ruido, declineFactor: m.declinio } } : { growth: {}, evo: {} };
}
