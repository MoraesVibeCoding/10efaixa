import { useEffect, useState } from 'react';

// T50e (v2.30): no computador (≥ 64rem) as telas 1 e 2 da criação viram uma só. Sem matchMedia (jsdom, SSR), celular.
const QUERY = '(min-width: 64rem)';
const supported = () => typeof globalThis.matchMedia === 'function';

export function useWide(): boolean {
  const [wide, setWide] = useState(() => supported() && globalThis.matchMedia(QUERY).matches);
  useEffect(() => {
    if (!supported()) return undefined;
    const media = globalThis.matchMedia(QUERY);
    const update = () => setWide(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return wide;
}
