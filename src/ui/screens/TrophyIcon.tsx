import trophyArt from '../../data/trophyArt.json';

// troféu de cada competição: os que o usuário criou (v2.60); sem peça, o ícone genérico abaixo
const TROPHY_FILES = import.meta.glob('../../assets/trofeus/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
export const trophySrc = (id: string) => {
  const piece = (trophyArt.pecas as Record<string, string>)[id];
  return piece ? TROPHY_FILES[`../../assets/trofeus/${piece}.webp`] : undefined;
};

const TROPHY = 'M7 3h10v2h3.5v3.2A4.3 4.3 0 0 1 16.6 12 5.2 5.2 0 0 1 13 14.4V17h3v4H8v-4h3v-2.6A5.2 5.2 0 0 1 7.4 12 4.3 4.3 0 0 1 3.5 8.2V5H7zm0 4H5.5v1.2c0 .9.6 1.7 1.5 2zm10 0v3.2c.9-.3 1.5-1.1 1.5-2V7z';

/** Imagem decorativa: o nome da competição vem escrito ao lado. */
export function TrophyIcon({ id, size }: { id: string; size?: number }) {
  const src = trophySrc(id);
  return src
    ? <img className="trofeu__arte" src={src} alt="" width={size ?? 32} height={size ?? 32} />
    : <svg viewBox="0 0 24 24" width={size ? size * 0.7 : 20} height={size ? size * 0.7 : 20} aria-hidden="true" focusable="false"><path d={TROPHY} fill="currentColor" /></svg>;
}

