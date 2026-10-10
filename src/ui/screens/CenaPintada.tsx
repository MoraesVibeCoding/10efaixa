import { kitOf, shirtPaint } from '../../art/kits';
import cortes from '../../data/cortes.json';
import foco from '../../data/cenaFoco.json';
import { useEffect, useState } from 'react';
import { sceneFrame } from './sceneFrame';
import type { Livre } from '../useLivreMeio';
import { numberColor, sceneArt } from './cenaArte';
import './CenaPintada.css';

export { CUTS, creationScene, cutForVisual, numberColor, sceneArt } from './cenaArte';

// T60a (SPEC v2.12, arte final): a cena pintada ao fundo da decisão, em camadas como a figurinha: a pintura com o
// uniforme em cinza, a camisa no padrão e nas cores do clube e o calção (multiplicados pelo cinza, recortados pelas
// máscaras) e o número nas costas quando o jogador está de uniforme. O quadro tem a proporção da pintura e cobre a
// tela, então as máscaras e o número usam as mesmas coordenadas da imagem.
/** v2.62: o número nas costas só nas cenas listadas em cortes.json (hoje nenhuma: ficava torto com o jogador de lado). */
const NUMERO_NAS_CENAS: readonly string[] = cortes.numeroNasCenas;

/** v2.70: altura do ponto focal (a cabeça) de cada cena, em fração da pintura (cenaFoco.json). */
const FOCO = foco.cenas as Record<string, number>;

/** v2.70: o tamanho da janela, para posicionar a cena pelo ponto focal (só quando a tela mede o espaço livre). */
function useJanela(ativo: boolean) {
  const [j, setJ] = useState(() => ({ w: typeof window === 'undefined' ? 0 : window.innerWidth, h: typeof window === 'undefined' ? 0 : window.innerHeight }));
  useEffect(() => {
    if (!ativo) return undefined;
    const r = () => setJ({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, [ativo]);
  return j;
}

/** v2.71: a última cena mostrada; a mesma de novo (decisão seguinte no mesmo lugar) entra sem fade. */
let ultimaCena = '';

/** `livre` (v2.70): onde o ponto focal deve cair na tela e o fim da caixa do topo (px); sem ele, a cena fica ancorada a 30% como antes.
 * `foto` (v2.81, Álbum): a cena vira uma foto dentro do quadro que a contém (`.decisao__foto`), cobrindo-o com o ponto
 * focal no meio da altura, por CSS (unidades de contêiner); sem medir a tela. */
export function CenaPintada({ scene, cut, clubId, number, alt, inert, decorativa = false, numeroNasCenas = NUMERO_NAS_CENAS, livre, foto = false }: { scene: string; cut: string; clubId: string; number?: number; alt: string; inert?: boolean; decorativa?: boolean; numeroNasCenas?: readonly string[]; livre?: Livre; foto?: boolean }) {
  const janela = useJanela(livre !== undefined);
  const chave = `${scene}|${cut}|${clubId}`;
  const [repete] = useState(() => chave === ultimaCena);
  useEffect(() => { ultimaCena = chave; }, [chave]);
  const art = sceneArt(scene, cut);
  if (!art) return null;
  const kit = kitOf(clubId);
  const razao = art.largura / art.altura;
  const posicao = livre === undefined || !janela.w ? null
    : sceneFrame({ largura: janela.w, altura: janela.h, razao, focoY: FOCO[scene] ?? foco.padrao, livreMeio: livre.meio, topoLivre: livre.topo });
  const frame = {
    '--cena-proporcao': `${art.largura} / ${art.altura}`, '--cena-razao': razao, '--foco-y': FOCO[scene] ?? foco.padrao,
    ...(posicao ? { inlineSize: `${posicao.width}px`, insetInlineStart: `${posicao.left}px`, insetBlockStart: `${posicao.top}px` } : {}),
  } as React.CSSProperties;
  const camisa = { '--camisa-cor': kit.camisa[0], '--camisa-desenho': shirtPaint(kit), '--mascara': `url(${art.camisa})` } as React.CSSProperties;
  return (
    <div className={foto ? 'cena cena--foto' : 'cena'} data-cena={scene} data-repete={repete || undefined} role={decorativa ? undefined : 'img'} aria-label={decorativa ? undefined : alt} aria-hidden={decorativa || undefined} style={frame} inert={inert}>
      <img className="cena__pintura" src={art.src} alt="" width={art.largura} height={art.altura} fetchPriority="high" />
      <span className="cena__camisa" style={camisa} aria-hidden="true" />
      {art.calcao && <span className="cena__calcao" style={{ '--calcao-cor': kit.calcao, '--mascara': `url(${art.calcao})` } as React.CSSProperties} aria-hidden="true" />}
      {art.numero && number !== undefined && numeroNasCenas.includes(scene) && (
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
