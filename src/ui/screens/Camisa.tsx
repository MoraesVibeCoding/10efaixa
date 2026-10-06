import { kitOf } from '../../art/kits';
import './Camisa.css';

// T50h: a camisa dos retratos pintados vem em cinza (docs/arte/processar_visuais.py) com a máscara dela ao lado,
// visual-NN-camisa.webp. Esta camada pinta a cor principal do clube só na máscara, multiplicada pelo cinza: as dobras ficam.
const MASKS = import.meta.glob('../../assets/visuais/*-camisa.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

/** Cor da camisa sobre o retrato do visual. Sem clube, a cor neutra do uniforme (kitOf). Decorativa. */
export function Camisa({ visual, clubId = '', className = '' }: { visual: string; clubId?: string; className?: string }) {
  const mask = MASKS[`../../assets/visuais/${visual}-camisa.webp`];
  if (!mask) { return null; }
  const style = { '--camisa-cor': kitOf(clubId).camisa[0], '--camisa-mascara': `url(${mask})` } as React.CSSProperties;
  return <span className={`camisa ${className}`.trim()} style={style} aria-hidden="true" />;
}
