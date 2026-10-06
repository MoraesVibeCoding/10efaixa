import biotypeData from '../../data/biotype.json';
import creationData from '../../data/creation.json';
import flags from '../../data/flags.json';
import { ARCHETYPES, archetypesFor, inspiracao } from '../../engine/archetypes';
import type { Position } from '../../engine/overall';
import { t } from '../../i18n';

// T50d (SPEC 6.1, 6.2, 6.17, v2.30): tela 2 "em campo e cabeça", tudo que pesa no jogo. Só faixas e frases, sem números.
export interface OnField {
  position: Position | null; archetypeId: string | null; foot: string; heightCm: number; build: string;
  temperament: string | null; mentality: string | null;
  /** v2.46: lado do lateral e da ponta (só figurinha e narrativa, nunca atributo); null nas outras posições. */
  side: Side | null;
}
export type Side = 'esquerdo' | 'direito';
export const DEFAULT_FIELD: OnField = {
  position: null, archetypeId: null, foot: creationData.feet[0]!, heightCm: biotypeData.referenceHeightCm - 2, build: 'atletico',
  temperament: null, mentality: null, side: null,
};

/** v2.46: as 9 vagas do campo, da defesa ao ataque (também a ordem das setas do teclado). */
export const FIELD_SLOTS: { id: string; position: Position; side: Side | null }[] = [
  { id: 'goleiro', position: 'goleiro', side: null },
  { id: 'zagueiro', position: 'zagueiro', side: null },
  { id: 'lateral-esquerdo', position: 'lateral', side: 'esquerdo' },
  { id: 'lateral-direito', position: 'lateral', side: 'direito' },
  { id: 'volante', position: 'volante', side: null },
  { id: 'meia', position: 'meia', side: null },
  { id: 'ponta-esquerda', position: 'ponta', side: 'esquerdo' },
  { id: 'ponta-direita', position: 'ponta', side: 'direito' },
  { id: 'atacante', position: 'atacante', side: null },
];
const hasSide = (p: Position) => FIELD_SLOTS.some((s) => s.position === p && s.side);

/** Vaga marcada no campo; lateral ou ponta sem lado (save antigo) vale como direito. */
export function slotOf(f: OnField): string {
  if (!f.position) return '';
  const side = hasSide(f.position) ? f.side ?? 'direito' : null;
  return FIELD_SLOTS.find((s) => s.position === f.position && s.side === side)?.id ?? '';
}

/** Marca uma vaga: posição (com as regras de withPosition) e lado. */
export function withSlot(f: OnField, slotId: string): OnField {
  const slot = FIELD_SLOTS.find((s) => s.id === slotId);
  if (!slot) return f;
  return { ...withPosition(f, slot.position), side: slot.side };
}
export const FIELD_ERROR_ORDER = ['position', 'archetypeId', 'temperament'] as const;

/** Ordem das posições no campinho, da esquerda para a direita: é também a ordem das setas do teclado. */
export const POSITIONS: Position[] = ['goleiro', 'zagueiro', 'lateral', 'volante', 'meia', 'ponta', 'atacante'];
export const RANGES = biotypeData.heightRangesCm as Record<Position, { min: number; max: number }>;
const clamp = (v: number, { min, max }: { min: number; max: number }) => Math.min(max, Math.max(min, v));

/** Erros da tela 2, como chaves de i18n de creation.error. */
export function fieldErrors(f: OnField): Partial<Record<keyof OnField, string>> {
  const errors: Partial<Record<keyof OnField, string>> = {};
  if (!f.position) errors.position = 'creation.error.position.invalid';
  else if (!f.archetypeId) errors.archetypeId = 'creation.error.archetype.empty';
  if (!f.temperament) errors.temperament = 'creation.error.temperament.invalid';
  return errors;
}

/** Nova posição: o estilo que não serve mais é limpo e a altura volta para a faixa da posição (6.17). */
export function withPosition(f: OnField, position: Position): OnField {
  const keeps = archetypesFor(position).some((a) => a.id === f.archetypeId);
  return { ...f, position, archetypeId: keeps ? f.archetypeId : null, heightCm: clamp(f.heightCm, RANGES[position]) };
}

export const meters = (cm: number) => (cm / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Traço e inspiração do estilo escolhido (a lenda só com a flag, seção 11). */
export function styleHint(archetypeId: string | null) {
  const a = ARCHETYPES.find((x) => x.id === archetypeId);
  if (!a) return null;
  const trait = t('ui.criacao.emCampo.traco', { traco: a.traits.map((k) => t(`archetypes.trait.${k}`)).join(' / ') });
  const legend = inspiracao(a, flags);
  return legend ? `${trait} · ${t('archetypes.inspiracao', { lenda: legend })}` : trait;
}
export const hintOf = (prefix: string, v: string | null) => (v ? t(`${prefix}.${v}`) : null);
