import type { Kit } from './kits';
import dados from '../data/uniformes.json';

// v2.98: os 20 clubes da Série A vestem a camisa e o calção das imagens planas do usuário (docs/arte/uniformes-serie-a), recortadas por
// docs/arte/processar_uniformes_serie_a.py. A textura é esticada no retângulo de cada parte da máscara da cena (cenasArte.json, `partes`).
// Clube sem textura, seleção e goleiro continuam no desenho em CSS de kits.ts.
const FILES = import.meta.glob('../assets/uniformes/*/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const CLUBES = dados.clubes as Record<string, { calcaoPrincipal: string }>;

export interface Uniforme { camisa: string; calcao: string; calcaoPrincipal: string }

/** Textura de camisa e de calção do clube; null se ele não tem (ou se o id é de seleção). */
export function uniformeTextura(clubId: string): Uniforme | null {
  const d = CLUBES[clubId];
  const camisa = FILES[`../assets/uniformes/${clubId}/camisa.webp`];
  const calcao = FILES[`../assets/uniformes/${clubId}/calcao.webp`];
  if (!d || !camisa || !calcao) return null;
  return { camisa, calcao, calcaoPrincipal: d.calcaoPrincipal };
}

export interface Partes { camisa: number[][]; calcao: readonly (readonly [string, number, number, number, number])[] }
/** Camadas de fundo do CSS: uma por parte, na ordem; `size` e `position` na mesma ordem de `image`. */
export interface Camadas { image: string; size: string; position: string }

const cq = (v: number) => `${+(v * 100).toFixed(3)}`;
const tamanho = (x0: number, y0: number, x1: number, y1: number) => `${cq(x1 - x0)}cqw ${cq(y1 - y0)}cqh`;
const posicao = (x0: number, y0: number) => `${cq(x0)}cqw ${cq(y0)}cqh`;
const cor = (c: string) => `linear-gradient(${c}, ${c})`;
const juntar = (camadas: { image: string; size: string; position: string }[]): Camadas => ({
  image: camadas.map((c) => c.image).join(', '), size: camadas.map((c) => c.size).join(', '), position: camadas.map((c) => c.position).join(', '),
});

/**
 * Camadas da camisa e do calção para o clube numa cena. As medidas vêm em frações da imagem e viram unidades do contêiner da cena
 * (`.cena` é um contêiner de tamanho), então a textura acompanha o quadro em qualquer tela.
 * Calção do jogador: textura; meiões do jogador: cor `meiao` do cadastro; companheiros ao fundo: cor principal do calção.
 * O que a máscara cobre e nenhuma parte alcança (o vazamento sobre o céu) fica sem camada e, portanto, sem tinta.
 */
export function camadasUniforme(partes: Partes, tex: Uniforme, kit: Kit): { camisa: Camadas; calcao: Camadas } {
  const camisa = partes.camisa.map(([x0, y0, x1, y1]) => ({ image: `url(${tex.camisa})`, size: tamanho(x0!, y0!, x1!, y1!), position: posicao(x0!, y0!) }));
  const calcao = partes.calcao.map(([papel, x0, y0, x1, y1]) => ({
    image: papel === 'calcao' ? `url(${tex.calcao})` : cor(papel === 'meiao' ? kit.meiao : tex.calcaoPrincipal),
    size: tamanho(x0, y0, x1, y1), position: posicao(x0, y0),
  }));
  return { camisa: juntar(camisa), calcao: juntar(calcao) };
}
