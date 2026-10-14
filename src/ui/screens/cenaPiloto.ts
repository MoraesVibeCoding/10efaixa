import piloto from '../../data/piloto.json';

// v3.00: as cenas do piloto (docs/arte/piloto): pintadas inteiras pela API, com o visual e o uniforme do clube.
const FILES = import.meta.glob('../../assets/piloto/*/*/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

export interface PilotoArte { src: string; largura: number; altura: number }

/** Imagem do piloto para a cena, o visual e o clube; null se o piloto está desligado ou a combinação não foi gerada. */
export function pilotoArte(scene: string, visual: string | undefined, clubId: string, ativo: boolean = piloto.ativo): PilotoArte | null {
  if (!ativo || !visual) return null;
  const src = FILES[`../../assets/piloto/${scene}/${clubId}/${visual}.webp`];
  return src ? { src, largura: piloto.largura, altura: piloto.altura } : null;
}
