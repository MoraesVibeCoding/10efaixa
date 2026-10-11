import { recolor, uniformColors } from '../../art/avatar';
import { kitOf } from '../../art/kits';
import emblems from '../../data/emblems.json';
import { clubName } from './clubText';
import { svgUri } from './portrait';

// T49d (SPEC v2.26): emblema original do clube, ou o escudo genérico. As peças usam as cores-chave do uniforme,
// trocadas aqui pelas cores do clube (kits.json); abaixo de `simplesAbaixoDePx` entra a versão simplificada.
// T55d: separado do componente para o cartão final (canvas) usar a mesma arte.
const PIECES = import.meta.glob('../../assets/art/provisoria/emblema/*.svg', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const piece = (id: string, version: string) => PIECES[`../../assets/art/provisoria/emblema/emblema__${id}-${version}.svg`]!;
const OWN = new Set(Object.keys(emblems.clubes));
// v2.86: os emblemas enviados pelo usuário (imagem recortada, já nas cores do clube) valem sobre a peça desenhada, em qualquer tamanho
const IMAGES = import.meta.glob('../../assets/emblemas/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const imageOf = (clubId: string) => IMAGES[`../../assets/emblemas/${clubId}.webp`];

/** Arte do emblema: id da peça, versão, imagem (data URI) e a sigla que o escudo genérico leva por cima. */
export function emblemArt(clubId: string, size: number) {
  const image = imageOf(clubId);
  if (image) return { id: clubId, version: 'imagem', src: image, sigla: clubName(clubId).sigla, generic: false };
  const kit = kitOf(clubId);
  const id = OWN.has(clubId) ? clubId : 'generico';
  const version = size < emblems.simplesAbaixoDePx ? 'simples' : 'completo';
  const src = svgUri(recolor(piece(id, version), uniformColors(kit.camisa[0]!, kit.camisa[1] ?? kit.detalhe)));
  return { id, version, src, sigla: clubName(clubId).sigla, generic: id === 'generico' };
}
