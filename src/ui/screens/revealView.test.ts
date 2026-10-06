import type { CreationInput } from '../../engine/player';
import { createPlayer } from '../../engine/player';
import { createPrng } from '../../engine/prng';
import { overall } from '../../engine/overall';
import { ARCHETYPES } from '../../engine/archetypes';
import { ATTRIBUTES, toBand } from '../../engine/attributes';
import { revealOf } from './revealView';

// T49i: o que a revelação mostra sai do mesmo sorteio da carreira (createPlayer com a mesma semente).
const INPUT: CreationInput = {
  name: 'Dudu Maestro', shirtNumber: 10, state: 'BA', position: 'meia', archetypeId: 'classico10',
  biotype: { heightCm: 184, build: 'forte' }, temperament: 'resenha', celebration: 'aviaozinho',
  origin: 'varzea', foot: 'direita', heartClub: 'bahia',
};

describe('revelação do jogador (T49i)', () => {
  it('Over e atributos são os do jogador sorteado com a mesma semente da carreira', () => {
    const r = revealOf(INPUT, 11);
    const created = createPlayer(INPUT, createPrng(11));
    if (!created.ok) throw new Error('criação inválida');
    const arch = ARCHETYPES.find((a) => a.id === INPUT.archetypeId)!;
    expect(r.overall).toBe(overall(created.player.attributes, INPUT.position, arch.overallWeightBonus));
    expect(r.isDiamond).toBe(created.player.isDiamond);
    expect(r.bands.map((b) => b.id)).toEqual([...ATTRIBUTES]);
    for (const b of r.bands) expect(b.band).toBe(toBand(created.player.attributes[b.id]).key);
  });

  it('mesma semente, mesma revelação; a revelação não traz número de atributo nem o potencial', () => {
    expect(revealOf(INPUT, 7)).toEqual(revealOf(INPUT, 7));
    const r = revealOf(INPUT, 7) as unknown as Record<string, unknown>;
    expect(r).not.toHaveProperty('potential');
    expect(r).not.toHaveProperty('attributes');
    for (const b of revealOf(INPUT, 7).bands) expect(Object.keys(b).sort()).toEqual(['band', 'id']);
  });

  it('em alguma semente sai um diamante bruto da várzea (3%)', () => {
    const seeds = Array.from({ length: 400 }, (_, i) => i + 1);
    expect(seeds.some((s) => revealOf(INPUT, s).isDiamond)).toBe(true);
    expect(seeds.some((s) => !revealOf(INPUT, s).isDiamond)).toBe(true);
  });
});
