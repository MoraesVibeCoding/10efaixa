import { toBand } from '../../engine/attributes';
import type { CareerResult } from '../../engine/career';
import { figurinhaClub } from '../../share/cardModel';
import type { CardImages } from '../../share/drawCard';
import { loadImage } from '../../share/loadImage';
import tokens from '../theme/tokens.json';
import { emblemArt } from './emblemArt';

// T55d: as imagens do cartão final — retrato e máscara da camisa do visual, textura de metal da faixa do Over e emblema do clube
// da figurinha (v2.62: o último clube profissional).
const PORTRAITS = import.meta.glob('../../assets/visuais/visual-[0-9][0-9].webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const MASKS = import.meta.glob('../../assets/visuais/*-camisa.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const FRAMES = import.meta.glob('../../assets/cartoes-over/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const MEDALS = tokens.medalha as unknown as Record<string, { nome: string }>;

/** Carrega tudo (e as fontes) antes de desenhar; o que não carregar fica de fora e o cartão usa só as cores. */
export async function loadCardImages(result: CareerResult, visual?: string): Promise<CardImages> {
  const medal = MEDALS[toBand(result.peakOverall).key]!.nome;
  const emblem = emblemArt(figurinhaClub(result), 96);
  const base = '../../assets/visuais/';
  const [portrait, mask, frame, emblemImg] = await Promise.all([
    loadImage(visual && PORTRAITS[`${base}${visual}.webp`]), loadImage(visual && MASKS[`${base}${visual}-camisa.webp`]),
    loadImage(FRAMES[`../../assets/cartoes-over/${medal}.webp`]), loadImage(emblem.src),
    document.fonts?.ready,
  ]);
  const makeCanvas = (w: number, h: number) => Object.assign(document.createElement('canvas'), { width: w, height: h });
  return { portrait, mask, frame, emblem: emblemImg, emblemSigla: emblem.generic ? emblem.sigla : undefined, makeCanvas };
}
