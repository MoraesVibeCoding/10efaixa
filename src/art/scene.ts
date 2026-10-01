import { composeAvatar, recolor, uniformColors, type AvatarSpec } from './avatar';
import { pickWeighted, type Prng } from '../engine/prng';
import cfg from '../data/avatar.json';
import txt from '../i18n/pt-BR/scenes.json';

// T45 (SPEC 6.17): cenário + avatar + companheiros nas cores do clube + detalhes, com texto alternativo gerado.
export interface Club { nome: string; cores: [string, string] }
export interface Detail { svg: string; x: number; y: number; width: number }
export interface SceneInput {
  sceneId: string; scenario: string; player: AvatarSpec; club: Club; mates: number; rng: Prng;
  /** Poses por id (ex.: `correndo`); a do slot vem de `data-pose-sugerida`. */
  poses: Record<string, string>; parts: Record<string, string>;
  details?: Detail[]; playerName?: string;
}

const attr = (tag: string, name: string) => new RegExp(`\\b${name}="([^"]*)"`).exec(tag)?.[1];
const num = (x: number) => String(+x.toFixed(3));
const pick = <T>(rng: Prng, xs: readonly T[]) => xs[rng.int(0, xs.length - 1)]!;

/** Companheiros: mesmo sistema do jogador, aparência sorteada e uniforme nas cores do clube. */
export function mateSpecs(n: number, club: Club, rng: Prng): AvatarSpec[] {
  const m = cfg.mates;
  return Array.from({ length: n }, () => ({
    skin: pick(rng, cfg.skinTones).id, hairColor: pick(rng, cfg.hairColors).id, hairStyle: pick(rng, cfg.styles.hair),
    beard: rng.next() < m.beardChance ? pick(rng, cfg.styles.beards) : null, expression: pick(rng, cfg.styles.expressions),
    heightCm: rng.int(m.heightCm[0]!, m.heightCm[1]!), build: pickWeighted(rng, m.builds), age: rng.int(m.age[0]!, m.age[1]!),
    uniform1: club.cores[0], uniform2: club.cores[1], boots: pick(rng, m.boots), headband: null,
  }));
}

interface Slot { id: string; x: number; y: number; w: number; h: number; escala: number; pose?: string }
function slotsOf(scenario: string): Slot[] {
  return [...scenario.matchAll(/<g\b[^>]*\bid="(slot-[a-z0-9-]+)"[^>]*>/g)].flatMap((m) => {
    const rect = /<rect\b[^>]*>/.exec(scenario.slice(m.index!))?.[0] ?? '';
    const [x, y, w, h] = ['x', 'y', 'width', 'height'].map((n) => Number(attr(rect, n) ?? 0));
    return [{ id: m[1]!, x: x!, y: y!, w: w!, h: h!, escala: Number(attr(m[0], 'data-escala') ?? 1), pose: attr(m[0], 'data-pose-sugerida') }];
  });
}

/** Avatar 400×800 com os pés na base do slot, centrado; altura = altura do slot × escala. */
function place(avatar: string, s: Slot): string {
  const scale = (s.h * s.escala) / 800;
  const [w, h] = [400 * scale, 800 * scale];
  return avatar.replace(/<svg\b[^>]*>/, `<svg x="${num(s.x + s.w / 2 - w / 2)}" y="${num(s.y + s.h - h)}" width="${num(w)}" height="${num(h)}" viewBox="0 0 400 800">`);
}

export function composeScene(i: SceneInput): { svg: string; alt: string } {
  const slots = slotsOf(i.scenario);
  const poseFor = (s: Slot) => i.poses[s.pose ?? ''] ?? i.poses['em-pe'] ?? Object.values(i.poses)[0]!;
  const kit = { uniform1: i.club.cores[0], uniform2: i.club.cores[1] };
  const mateSlots = slots.filter((s) => s.id.startsWith('slot-companheiro')).slice(0, Math.min(i.mates, cfg.mates.max));
  const mates = mateSpecs(mateSlots.length, i.club, i.rng);
  const playerSlot = slots.find((s) => s.id === 'slot-jogador');

  const figures = [
    ...mateSlots.map((s, k) => place(composeAvatar(mates[k]!, poseFor(s), i.parts), s)),
    ...(playerSlot ? [place(composeAvatar({ ...i.player, ...kit }, poseFor(playerSlot), i.parts), playerSlot)] : []),
    ...(i.details ?? []).map((d) => d.svg.replace(/<svg\b[^>]*?(viewBox="[^"]*")[^>]*>/, `<svg x="${d.x}" y="${d.y}" width="${d.width}" $1>`)),
  ].join('');

  const at = i.scenario.search(/<g\b[^>]*\bid="frente"/);
  const merged = at >= 0 ? i.scenario.slice(0, at) + figures + i.scenario.slice(at) : i.scenario.replace(/<\/svg>\s*$/, `${figures}</svg>`);
  const svg = recolor(merged, uniformColors(i.club.cores[0], i.club.cores[1]));

  const n = mateSlots.length;
  const fill = (t: string) => t.replace('{nome}', i.playerName ?? txt.jogadorPadrao).replace('{clube}', i.club.nome).replace('{n}', String(n));
  const base = fill((txt.alt as Record<string, string>)[i.sceneId] ?? '');
  const alt = n ? `${base}. ${fill(n === 1 ? txt.companheiros.um : txt.companheiros.varios)}` : `${base}.`;
  return { svg, alt };
}
