import type { Build } from '../../engine/biotype';
import type { CreationInput } from '../../engine/player';
import type { Identity } from './Creation';
import type { OnField } from './onField';

// T50e (SPEC 6.1, v2.30): o que a criação entrega ao motor. O visual (look.ts) fica de fora: aparência nunca mexe no jogo.
export function toCreationInput(identity: Identity, field: OnField, origin: string): CreationInput {
  return {
    name: identity.name.trim(),
    shirtNumber: Number(identity.number),
    state: identity.state,
    heartClub: identity.heartClub || null,
    position: field.position!,
    archetypeId: field.archetypeId!,
    biotype: { heightCm: field.heightCm, build: field.build as Build },
    temperament: field.temperament!,
    celebration: identity.celebration!,
    origin,
    foot: field.foot,
    ...(field.side ? { side: field.side } : {}),
    ...(field.mentality ? { mentality: field.mentality } : {}),
  };
}
