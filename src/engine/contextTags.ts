import data from '../data/contextTags.json';
import { holds, type Cond, type Ctx } from './events';
import { memoryCtx, type Memory } from './memory';

// T25e (SPEC 6.13c): etiquetas de contexto. A situação do jogador (fatos da carreira + memórias) vira palavras de motor que escolhem
// a abertura e as frases de contexto do texto do evento e reforçam o sorteio. A ordem de contextTags.json é a prioridade.
export interface ContextFacts {
  idade: number; moral: number; idolatria: number; idolatriaCoracao: number;
  /** Fração de minutos do semestre (0–1). */
  minutosFracao: number;
  salarioAtrasos: number; convocado: boolean; subiuDivisao: boolean; caiuDivisao: boolean; foraDoEixo: boolean;
  empresarioPressiona: boolean; posicaoDisputada: boolean; noClubeDeCoracao: boolean; capitao: boolean; campeaoNoAno: boolean;
  /** v2.67: ainda na base, na várzea ou no primeiro ano da carreira (libera os eventos de formação do catálogo). */
  iniciante?: boolean;
}
export interface ContextTag { id: string; condicoes: Cond[] }
export const CONTEXT_TAGS = data.etiquetas as unknown as ContextTag[];

/** Contexto completo: os fatos e as memórias (mem.<id>, anos.<id>), no formato das condições de evento. */
export function contextCtx(facts: ContextFacts, memories: readonly Memory[], year: number): Ctx {
  return { ...facts, ...memoryCtx(memories, year) };
}

/** Etiquetas que valem no contexto, da mais forte para a mais fraca (ordem do arquivo). */
export function tagsOf(ctx: Ctx): string[] {
  return CONTEXT_TAGS.filter((tag) => tag.condicoes.every((c) => holds(ctx, c))).map((tag) => tag.id);
}
