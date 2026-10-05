import type { AvatarSpec } from '../../art/avatar';
import avatarData from '../../data/avatar.json';
import type { Prng } from '../../engine/prng';

// T50 (SPEC 6.17, v2.30): o visual do jogador na criação. Só visual: nunca entra em CreationInput nem no motor.
export interface Look { skin: string; hairStyle: string; hairColor: string; beard: string | null; headband: string | null; boots: string }

export const PICKS = avatarData.escolhas;
const pick = <T,>(rng: Prng, list: readonly T[]) => list[rng.int(0, list.length - 1)]!;

/** Visual sorteado pelo PRNG do projeto (mesma semente, mesmo visual); barba e faixa pelas chances de avatar.json. */
export function randomLook(rng: Prng): Look {
  return {
    skin: pick(rng, avatarData.skinTones).id,
    hairStyle: pick(rng, avatarData.styles.hair),
    hairColor: pick(rng, avatarData.hairColors).id,
    beard: rng.next() < PICKS.sorteio.barba ? pick(rng, avatarData.styles.beards) : null,
    headband: rng.next() < PICKS.sorteio.faixa ? pick(rng, PICKS.faixas).id : null,
    boots: pick(rng, PICKS.chuteiras).id,
  };
}

const hexOf = (list: { id: string; hex: string }[], id: string | null) => list.find((o) => o.id === id)?.hex ?? null;

/** Avatar da prévia: o visual escolhido sobre um corpo padrão; o uniforme vem do clube (ou do neutro) na figurinha. */
export function previewAvatar(look: Look): AvatarSpec {
  return {
    skin: look.skin, hairStyle: look.hairStyle, hairColor: look.hairColor, beard: look.beard, expression: 'neutra',
    heightCm: 178, build: 'atletico', age: 16, uniform1: '#000000', uniform2: '#000000',
    boots: hexOf(PICKS.chuteiras, look.boots)!, headband: hexOf(PICKS.faixas, look.headband),
  };
}
