import { CLUBS } from '../engine/clubs';
import data from '../data/kits.json';

// Uniformes para a arte (SPEC 6.17): padrão genérico + cores por clube, aplicados por código sobre as áreas de troca.
export interface Kit { padrao: string; camisa: string[]; detalhe: string; calcao: string; meiao: string }
export const PATTERNS = data.padroes;
/** Um uniforme de goleiro para todos os clubes: manga longa e luvas. */
export const GOALKEEPER_KIT = data.goleiro;

const HEX = /^#[0-9A-F]{6}$/i;

export function validateKits(d: { padroes: string[]; clubes: Record<string, Kit> }, clubIds: string[]): string[] {
  const errors: string[] = [];
  for (const [id, k] of Object.entries(d.clubes)) {
    if (!clubIds.includes(id)) errors.push(`${id}: clube inexistente`);
    if (!d.padroes.includes(k.padrao)) errors.push(`${id}: padrão desconhecido ${k.padrao}`);
    if (![...k.camisa, k.detalhe, k.calcao, k.meiao].every((c) => HEX.test(c))) errors.push(`${id}: cor fora do formato #RRGGBB`);
    if (k.camisa.length < (k.padrao === 'lisa' ? 1 : 2)) errors.push(`${id}: padrão ${k.padrao} pede pelo menos 2 cores na camisa`);
  }
  return errors;
}
const errors = validateKits(data, CLUBS.map((c) => c.id));
if (errors.length) throw new Error(`kits.json inválido: ${errors.join('; ')}`);

const KITS = data.clubes as Record<string, Kit>;
const COLORS = new Map(CLUBS.map((c) => [c.id, c.cores]));

/** Uniforme do clube; sem cadastro, camisa lisa nas cores do clube. */
export function kitOf(clubId: string): Kit {
  const kit = KITS[clubId];
  if (kit) return kit;
  const [a, b] = COLORS.get(clubId) ?? ['#C9CFC6', '#14213D'];
  return { padrao: 'lisa', camisa: [a], detalhe: b, calcao: b, meiao: a };
}
