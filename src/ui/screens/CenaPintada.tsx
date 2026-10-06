import { kitOf, shirtPaint } from '../../art/kits';
import { numberColor, sceneArt } from './cenaArte';
import './CenaPintada.css';

export { CUTS, creationScene, cutForVisual, numberColor, sceneArt } from './cenaArte';

// T60a (SPEC v2.12, arte final): a cena pintada ao fundo da decisão, em camadas como a figurinha: a pintura com o
// uniforme em cinza, a camisa no padrão e nas cores do clube e o calção (multiplicados pelo cinza, recortados pelas
// máscaras) e o número nas costas quando o jogador está de uniforme. O quadro tem a proporção da pintura e cobre a
// tela, então as máscaras e o número usam as mesmas coordenadas da imagem.
export function CenaPintada({ scene, cut, clubId, number, alt, inert, decorativa = false }: { scene: string; cut: string; clubId: string; number?: number; alt: string; inert?: boolean; decorativa?: boolean }) {
  const art = sceneArt(scene, cut);
  if (!art) return null;
  const kit = kitOf(clubId);
  const frame = { '--cena-proporcao': `${art.largura} / ${art.altura}`, '--cena-razao': art.largura / art.altura } as React.CSSProperties;
  const camisa = { '--camisa-cor': kit.camisa[0], '--camisa-desenho': shirtPaint(kit), '--mascara': `url(${art.camisa})` } as React.CSSProperties;
  return (
    <div className="cena" data-cena={scene} role={decorativa ? undefined : 'img'} aria-label={decorativa ? undefined : alt} aria-hidden={decorativa || undefined} style={frame} inert={inert}>
      <img className="cena__pintura" src={art.src} alt="" width={art.largura} height={art.altura} fetchPriority="high" />
      <span className="cena__camisa" style={camisa} aria-hidden="true" />
      {art.calcao && <span className="cena__calcao" style={{ '--calcao-cor': kit.calcao, '--mascara': `url(${art.calcao})` } as React.CSSProperties} aria-hidden="true" />}
      {art.numero && number !== undefined && (
        <span
          className="cena__numero" aria-hidden="true"
          style={{ left: `${art.numero[0] * 100}%`, top: `${art.numero[1] * 100}%`, '--numero-altura': art.numero[2] * 0.85, '--numero-cor': numberColor(kit) } as React.CSSProperties}
        >
          {number}
        </span>
      )}
    </div>
  );
}
