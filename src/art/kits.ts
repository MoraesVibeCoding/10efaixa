import { CLUBS } from '../engine/clubs';
import data from '../data/kits.json';
import europe from '../data/europe.json';
import foreign from '../data/foreignClubs.json';

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
// todos os clubes em que o jogador pode jogar (v2.37): brasileiros, sul-americanos, Europa e fora do eixo
const COLORS = new Map([CLUBS, foreign.clubs, europe.clubs, europe.outros.clubs, europe.foraDoEixo.clubs].flat().map((c) => [c.id, c.cores]));

/** Uniforme do clube (ou da seleção, com o prefixo "selecao:"); sem cadastro, camisa lisa nas cores do clube. */
const NATIONAL = data.selecoes as unknown as Record<string, Kit>;
/** Prefixo do uniforme de seleção (v2.37): "selecao:brasil". */
export const NATIONAL_PREFIX = 'selecao:';

export function kitOf(clubId: string): Kit {
  if (clubId.startsWith(NATIONAL_PREFIX)) return NATIONAL[clubId.slice(NATIONAL_PREFIX.length)] ?? kitOf('');
  const kit = KITS[clubId];
  if (kit) return kit;
  const cores = COLORS.get(clubId) ?? [];
  const a = cores[0] ?? '#C9CFC6';
  const b = cores[1] ?? '#14213D';
  return { padrao: 'lisa', camisa: [a], detalhe: b, calcao: b, meiao: a };
}

// v2.37: o padrão tradicional desenhado por cima da camisa em cinza (componente Camisa), no quadro do retrato 4:5.
// A camisa ocupa mais ou menos de 40% a 100% da altura e de 15% a 85% da largura; as medidas abaixo são frações desse quadro.
const PAINT: Record<string, (c: string[]) => string> = {
  lisa: ([a]) => `linear-gradient(${a}, ${a})`,
  'listras-verticais': (c) => `repeating-linear-gradient(90deg, ${bands(c, 7)})`,
  'listras-finas': ([a, ...rest]) => `repeating-linear-gradient(90deg, ${a} 0 4%, ${rest.map((x, i) => `${x} ${4 + i}% ${5 + i}%`).join(', ')})`,
  'faixas-horizontais': (c) => `repeating-linear-gradient(180deg, ${bands(c, 6)})`,
  'listras-diagonais': (c) => `repeating-linear-gradient(45deg, ${bands(c, 6)})`,
  'faixa-diagonal': ([a, ...rest]) => `linear-gradient(135deg, ${a} 0 54%, ${rest.map((x, i, all) => `${x} ${54 + (12 / all.length) * i}% ${54 + (12 / all.length) * (i + 1)}%`).join(', ')}, ${a} 66%)`,
  'faixa-no-peito': ([a, ...rest]) => `linear-gradient(180deg, ${a} 0 56%, ${rest.map((x, i, all) => `${x} ${56 + (10 / all.length) * i}% ${56 + (10 / all.length) * (i + 1)}%`).join(', ')}, ${a} 66%)`,
};

/** Faixas de largura igual (em % do quadro), uma por cor, que se repetem. */
function bands(colors: string[], width: number): string {
  return colors.map((c, i) => `${c} ${i * width}% ${(i + 1) * width}%`).join(', ');
}

/** Desenho CSS (background-image) da camisa pelo padrão e cores do uniforme. */
export function shirtPaint(kit: Kit): string {
  const paint = PAINT[kit.padrao] ?? PAINT.lisa!;
  return paint(kit.camisa);
}
