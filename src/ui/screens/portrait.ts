import { composeAvatar, headFiles, type AvatarSpec } from '../../art/avatar';

// T49c: busto do jogador para a figurinha, montado com a arte provisória de camadas (a arte pintada chega na T43b).
// As peças carregam sob demanda: só a pose em pé e as peças de frente que o jogador usa.
const FRONT = import.meta.glob('../../assets/art/provisoria/*/*__frente.svg', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>;
const POSE = import.meta.glob('../../assets/art/provisoria/pose/pose__em-pe.svg', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>;

/** Recorte quadrado do corpo de 400×800: do topo do cabelo aos ombros. */
export const BUST_VIEWBOX = '90 88 220 220';

const byName = (glob: Record<string, () => Promise<string>>) =>
  new Map(Object.entries(glob).map(([path, load]) => [path.slice(path.lastIndexOf('/') + 1), load]));
const PIECES = byName(FRONT);
const [poseLoad] = Object.values(POSE);

/** SVG do busto, de frente, já com as cores do jogador e do uniforme. */
export async function bustSvg(spec: AvatarSpec): Promise<string> {
  const names = headFiles(spec, 'frente').filter((n) => PIECES.has(n));
  const loaded = await Promise.all(names.map(async (n) => [n, await PIECES.get(n)!()] as const));
  const pose = poseLoad ? await poseLoad() : '';
  return composeAvatar(spec, pose, Object.fromEntries(loaded)).replace('viewBox="0 0 400 800"', `viewBox="${BUST_VIEWBOX}"`);
}

export const svgUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;
