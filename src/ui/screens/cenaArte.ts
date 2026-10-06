import type { Kit } from '../../art/kits';
import cfg from '../../data/cortes.json';
import arte from '../../data/cenasArte.json';
import visuais from '../../data/visuais.json';

// T60a: as cenas pintadas (docs/arte/processar_cenas.py): a pintura com o uniforme em cinza, as máscaras da camisa e
// do calção e onde fica o número nas costas. Cada arquivo só é baixado quando a cena aparece.
const FILES = import.meta.glob('../../assets/cenas/*/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const DATA = arte.cenas as Record<string, { largura: number; altura: number; cortes: Record<string, { numero: number[] | null; calcao: boolean }> }>;
const BY_HAIR = cfg.porCabelo as Record<string, string>;
const HAIR_OF = new Map(visuais.visuais.map((v) => [v.id, v.look.hairStyle]));

export const CUTS = cfg.cortes;

/** Corte de cabelo da cena para o visual escolhido (ou para um cabelo dado); sem cadastro, o corte padrão. */
export function cutForVisual(visual: string | undefined, hairStyle?: string): string {
  const hair = hairStyle ?? (visual ? HAIR_OF.get(visual) : undefined);
  return (hair && BY_HAIR[hair]) || cfg.padrao;
}

export interface SceneArt { src: string; camisa: string; calcao: string | null; numero: [number, number, number] | null; largura: number; altura: number }

/** Arquivos e medidas de uma cena num corte; null se a cena não foi gerada. */
export function sceneArt(scene: string, cut: string): SceneArt | null {
  const d = DATA[scene];
  const c = d?.cortes[cut];
  const file = (s: string) => FILES[`../../assets/cenas/${scene}/${cut}${s}.webp`];
  if (!d || !c || !file('')) return null;
  return {
    src: file('')!, camisa: file('-camisa')!, calcao: c.calcao ? file('-calcao') ?? null : null,
    numero: c.numero ? [c.numero[0]!, c.numero[1]!, c.numero[2]!] : null, largura: d.largura, altura: d.altura,
  };
}

/** Luminância relativa (WCAG 2.1) de uma cor #RRGGBB. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

/** Cor do número nas costas: entre o detalhe do clube, branco e marinho, a de maior contraste com a camisa. */
export function numberColor(kit: Kit): string {
  const shirt = kit.camisa[0]!;
  return [kit.detalhe, '#FFFFFF', '#14213D'].reduce((best, c) => (contrast(c, shirt) > contrast(best, shirt) ? c : best));
}
