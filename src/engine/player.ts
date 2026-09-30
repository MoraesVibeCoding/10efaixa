import { ATTRIBUTES, type Attributes } from './attributes';
import { ARCHETYPES, type Archetype } from './archetypes';
import { BUILDS, applyBiotype, isHeightAllowed, rollGrowth, type Biotype, type Growth } from './biotype';
import { checkName } from './nameFilter';
import { overall, type Position } from './overall';
import { pickWeighted, type Prng } from './prng';
import data from '../data/creation.json';

// Seção 6.1. Erros são chaves de i18n (src/i18n/pt-BR/creation.json).
export interface CreationInput {
  name: string;
  shirtNumber: number;
  state: string;
  position: Position;
  archetypeId: string;
  biotype: Biotype;
  temperament: string;
  celebration: string;
  origin: string;
  foot: string;
}

export interface Player extends CreationInput {
  startingOverall: number;
  potential: number;
  isDiamond: boolean;
  dualNationality: string | null;
  growth: Growth;
  attributes: Attributes;
  baseCaps: Attributes;
  caps: Attributes;
}

export type CreationResult = { ok: true; player: Player } | { ok: false; errors: string[] };

type Origin = { overall: number[]; potential: number[]; diamond?: { chance: number; potential: number[] } };
const ORIGINS: Record<string, Origin> = data.origins;

function validate(i: CreationInput): string[] {
  const errors: string[] = [];
  const name = checkName(i.name);
  if (name !== 'ok') errors.push(`name.${name}`);
  if (!Number.isInteger(i.shirtNumber) || i.shirtNumber < 1 || i.shirtNumber > 99) errors.push('shirtNumber.invalid');
  if (!data.states.includes(i.state)) errors.push('state.invalid');
  if (!isHeightAllowed(i.position, i.biotype.heightCm)) errors.push('height.outOfRange');
  if (!BUILDS.includes(i.biotype.build)) errors.push('build.invalid');
  const arch = ARCHETYPES.find((a) => a.id === i.archetypeId);
  if (!arch?.positions.includes(i.position)) errors.push('archetype.invalid');
  if (!data.temperaments.includes(i.temperament)) errors.push('temperament.invalid');
  if (!data.celebrations.includes(i.celebration)) errors.push('celebration.invalid');
  if (!data.feet.includes(i.foot)) errors.push('foot.invalid');
  if (!ORIGINS[i.origin]) errors.push('origin.invalid');
  return errors;
}

const clamp = (v: number) => Math.min(99, Math.max(1, Math.round(v)));

/** Espalha um nível em torno dos pesos do arquétipo (peso médio 10 = o próprio nível). */
const shape = (level: number, arch: Archetype): Attributes => {
  const out = {} as Attributes;
  for (const a of ATTRIBUTES) out[a] = clamp(level + (data.attributeSpread * (arch.distribution[a] - 10)) / 10);
  return out;
};

export function createPlayer(input: CreationInput, rng: Prng): CreationResult {
  const errors = validate(input);
  if (errors.length) return { ok: false, errors };

  const origin = ORIGINS[input.origin]!;
  const arch = ARCHETYPES.find((a) => a.id === input.archetypeId)!;
  const roll = ([lo, hi]: number[]) => rng.int(lo!, hi!);

  const startingOverall = roll(origin.overall);
  const isDiamond = !!origin.diamond && rng.next() < origin.diamond.chance;
  const potential = roll(isDiamond ? origin.diamond!.potential : origin.potential);
  const { chance, countries } = data.dualNationality;
  const dualNationality = rng.next() < chance ? pickWeighted(rng, countries) : null;
  const growth = rollGrowth(rng);

  const baseCaps = shape(potential, arch);
  const caps = applyBiotype(baseCaps, input.biotype);
  const raw = shape(startingOverall, arch);
  const shift = startingOverall - overall(raw, input.position, arch.overallWeightBonus);
  const attributes = {} as Attributes;
  for (const a of ATTRIBUTES) attributes[a] = Math.min(caps[a], clamp(raw[a] + shift));

  return {
    ok: true,
    player: { ...input, startingOverall, potential, isDiamond, dualNationality, growth, attributes, baseCaps, caps },
  };
}
