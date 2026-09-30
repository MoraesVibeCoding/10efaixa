import { ATTRIBUTES, type Attribute, type Attributes } from './attributes';
import { POSITIONS, type Position } from './overall';
import raw from '../data/archetypes.json';

// Seção 6.2. Schema = este tipo + validateArchetypes (checado ao carregar e nos testes).
export interface Archetype {
  id: string;
  positions: Position[];
  /** Pesos (soma 100) que distribuem os pontos iniciais entre os atributos. */
  distribution: Attributes;
  /** 1 traço; 2+ = opções para o jogador escolher uma. */
  traits: string[];
  latentTrait?: string;
  /** Somado aos pesos da posição no overall (ex.: Jogo aéreo do centroavante). */
  overallWeightBonus?: Partial<Attributes>;
  /** Nome da lenda que inspira o estilo; exibido só com a flag inspiracaoLendas (seção 11). */
  inspiracao: string;
}

const isStr = (x: unknown): x is string => typeof x === 'string' && x.length > 0;
const isWeight = (x: unknown) => Number.isInteger(x) && (x as number) >= 0;

/** Retorna a lista de erros; vazia = válido. */
export function validateArchetypes(data: unknown): string[] {
  if (!Array.isArray(data)) return ['arquétipos: esperado array'];
  const errors: string[] = [];
  const ids = new Set<string>();
  data.forEach((item: unknown, i) => {
    const a = (item ?? {}) as Record<string, unknown>;
    const at = `arquétipo[${i}]`;
    if (!isStr(a.id) || ids.has(a.id)) errors.push(`${at}: id ausente ou repetido`);
    else ids.add(a.id);
    const pos = a.positions;
    if (!Array.isArray(pos) || !pos.length || !pos.every((p) => POSITIONS.includes(p))) {
      errors.push(`${at}: positions inválido`);
    }
    const d = (a.distribution ?? {}) as Record<string, unknown>;
    const keys = Object.keys(d);
    if (keys.length !== ATTRIBUTES.length || !ATTRIBUTES.every((k) => isWeight(d[k]))) {
      errors.push(`${at}: distribution precisa dos 10 atributos, inteiros ≥ 0`);
    } else if (ATTRIBUTES.reduce((s, k) => s + (d[k] as number), 0) !== 100) {
      errors.push(`${at}: distribution precisa somar 100`);
    }
    if (!Array.isArray(a.traits) || !a.traits.length || !a.traits.every(isStr)) {
      errors.push(`${at}: traits inválido`);
    }
    if (a.latentTrait !== undefined && !isStr(a.latentTrait)) errors.push(`${at}: latentTrait inválido`);
    if (!isStr(a.inspiracao)) errors.push(`${at}: inspiracao ausente`);
    const bonus = a.overallWeightBonus as Record<string, unknown> | undefined;
    if (bonus !== undefined && !Object.entries(bonus).every(([k, v]) => ATTRIBUTES.includes(k as Attribute) && isWeight(v))) {
      errors.push(`${at}: overallWeightBonus inválido`);
    }
  });
  return errors;
}

const errors = validateArchetypes(raw);
if (errors.length) throw new Error(`archetypes.json inválido:\n${errors.join('\n')}`);

export const ARCHETYPES = raw as Archetype[];

export const archetypesFor = (position: Position) =>
  ARCHETYPES.filter((a) => a.positions.includes(position));

export const inspiracao = (a: Archetype, flags: { inspiracaoLendas: boolean }) =>
  flags.inspiracaoLendas ? a.inspiracao : null;
