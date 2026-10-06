import { ARCHETYPES } from '../../engine/archetypes';
import { ATTRIBUTES, toBand, type Attribute } from '../../engine/attributes';
import { overall } from '../../engine/overall';
import { createPlayer, type CreationInput } from '../../engine/player';
import { createPrng } from '../../engine/prng';

// T49i (SPEC 6.1, v2.34): o sorteio revelado depois da criação. Mesma semente da carreira (simulateCareer também começa
// por createPlayer), então o Over mostrado é o do jogador que vai jogar. Só o Over sai em número; atributos em faixa e
// o potencial continua oculto.
export interface Reveal { overall: number; isDiamond: boolean; bands: { id: Attribute; band: string }[] }

export function revealOf(input: CreationInput, seed: number): Reveal {
  const created = createPlayer(input, createPrng(seed));
  if (!created.ok) throw new RangeError(`criação inválida: ${created.errors.join(', ')}`);
  const { attributes, isDiamond, position } = created.player;
  const arch = ARCHETYPES.find((a) => a.id === input.archetypeId)!;
  return {
    overall: overall(attributes, position, arch.overallWeightBonus),
    isDiamond,
    bands: ATTRIBUTES.map((id) => ({ id, band: toBand(attributes[id]).key })),
  };
}
