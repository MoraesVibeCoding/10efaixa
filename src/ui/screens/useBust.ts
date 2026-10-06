import { useEffect, useState } from 'react';
import type { AvatarSpec } from '../../art/avatar';
import { kitOf } from '../../art/kits';
import { bustSvg, svgUri } from './portrait';

// T49c/T50g: busto do jogador como imagem. O uniforme vem do clube (ou do neutro, sem clube). Extraído da Figurinha
// para o avatar-herói da criação (v2.35) usar o mesmo caminho; a montagem das peças continua em portrait.ts.
const dressed = (avatar: AvatarSpec, clubId: string): AvatarSpec => {
  const kit = kitOf(clubId);
  return { ...avatar, uniform1: kit.camisa[0]!, uniform2: kit.camisa[1] ?? kit.detalhe };
};

/** Um busto; `null` até carregar (as peças vêm sob demanda) ou sem avatar. */
export function useBust(avatar: AvatarSpec | undefined, clubId: string) {
  const [uri, setUri] = useState(null as string | null);
  useEffect(() => {
    if (!avatar) return undefined;
    let alive = true;
    void bustSvg(dressed(avatar, clubId)).then((svg) => { if (alive) setUri(svgUri(svg)); });
    return () => { alive = false; };
  }, [avatar, clubId]);
  return avatar ? uri : null;
}
