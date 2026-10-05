import type { AvatarSpec } from '../../art/avatar';
import { kitOf } from '../../art/kits';
import { toBand } from '../../engine/attributes';
import { t } from '../../i18n';
import tokens from '../theme/tokens.json';
import { clubName } from './clubText';
import { Emblema } from './Emblema';
import { useBust } from './useBust';
import './Figurinha.css';

// T49c (SPEC v2.26): o jogador como figurinha de álbum. Fundo creme com as faixas do clube nos ombros;
// o busto tem o contorno branco e a linha marinho do recorte de álbum, que separam a camisa da faixa em qualquer cor.
export interface FigurinhaProps {
  name: string; number?: number;
  /** Sem overall, posição e clube (criação, T50): sem cartão do OVR, emblema e linha do clube; faixas no uniforme neutro. */
  overall?: number; position?: string; clubId?: string;
  /** Aparência do jogador; o uniforme vem do clube. Sem ela, a figurinha fica só com o fundo. */
  avatar?: AvatarSpec;
  /** v2.36: id do visual escolhido (visuais.json). Com ele, a figurinha usa o retrato pintado, não o busto em desenho. */
  visual?: string;
  /** v2.34: moldura metálica pela faixa de overall (precisa de `overall`; sem ele vale a figurinha comum). */
  moldura?: boolean;
  tamanho?: 'pequena' | 'grande';
}

const MEDALS = tokens.medalha as unknown as Record<string, { nome: string }>;
const PAINTED = import.meta.glob('../../assets/visuais/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const paintedOf = (id: string | undefined) => (id ? PAINTED[`../../assets/visuais/${id}.webp`] : undefined);
const CARD_ART = import.meta.glob('../../assets/cartoes-over/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

function clubLine(position: string, clubId: string) {
  const { nome, prep } = clubName(clubId);
  return t('ui.figurinha.posicaoNoClube', { posicao: t(`positions.${position}`), prep, clube: nome });
}

export function Figurinha({ name, number, overall, position, clubId = '', avatar, visual, moldura = false, tamanho = 'pequena' }: FigurinhaProps) {
  const kit = kitOf(clubId);
  const painted = paintedOf(visual);
  const drawn = useBust(painted ? undefined : avatar, clubId);
  const bust = painted ?? drawn;
  const portraitClass = painted ? 'figurinha__retrato figurinha__retrato--pintado' : 'figurinha__retrato';
  const stripes = { '--faixa1': kit.camisa[0], '--faixa2': kit.camisa[1] ?? kit.detalhe } as React.CSSProperties;
  if (moldura && overall !== undefined) {
    return <Moldurada {...{ name, number, overall, bust, stripes, tamanho, portraitClass }} />;
  }
  const comum = (
    <span className="figurinha">
      <span className="figurinha__foto" style={stripes}>
        {bust && <img className={portraitClass} src={bust} alt="" width="220" height="220" />}
        {number !== undefined && <span className="figurinha__numero" aria-hidden="true">{number}</span>}
        {clubId ? <span className="figurinha__emblema"><Emblema clubId={clubId} size={30} /></span> : null}
        {overall === undefined ? null : <OverCard overall={overall} />}
      </span>
      <span className="figurinha__nome">{name}</span>
      {clubId && position ? <span className="figurinha__clube">{clubLine(position, clubId)}</span> : null}
    </span>
  );
  return comum;
}

function OverCard({ overall }: { overall: number }) {
  const medal = MEDALS[toBand(overall).key]!.nome;
  const art = CARD_ART[`../../assets/cartoes-over/${medal}.webp`];
  return (
    <span className="figurinha__over over" data-medalha={medal} style={art ? { backgroundImage: `url(${art})` } : undefined}>
      <span className="sr-only">{t('ui.figurinha.over')}{t('ui.decisao.faixaOver', { faixa: t(`attributes.band.${toBand(overall).key}`) })}</span>
      <span className="over__numero">{overall}</span>
    </span>
  );
}

// v2.34: a figurinha dentro da moldura do metal da faixa; a arte vem de `medalha` (tokens) pela faixa de bands.json.
function Moldurada({ name, number, overall, bust, stripes, tamanho, portraitClass }: { name: string; number?: number; overall: number; bust: string | null; stripes: React.CSSProperties; tamanho: 'pequena' | 'grande'; portraitClass: string }) {
  const band = toBand(overall);
  const medal = MEDALS[band.key]!.nome;
  const art = CARD_ART[`../../assets/cartoes-over/${medal}.webp`];
  return (
    <span className={`figurinha figurinha--moldura figurinha--${tamanho}`} data-medalha={medal} style={art ? { backgroundImage: `url(${art})` } : undefined}>
      <span className="figurinha__foto" style={stripes}>
        {bust && <img className={portraitClass} src={bust} alt="" width="220" height="220" />}
        <span className="sr-only">{t('ui.figurinha.over')} {overall}{t('ui.decisao.faixaOver', { faixa: t(`attributes.band.${band.key}`) })}</span>
        <span className="figurinha__over-grande" aria-hidden="true">{overall}</span>
      </span>
      <span className="figurinha__tarja">
        <span className={tamanho === 'pequena' ? 'figurinha__tarja-nome sr-only' : 'figurinha__tarja-nome'}>{name}</span>
        {number !== undefined && <span className="figurinha__tarja-numero">{number}</span>}
      </span>
    </span>
  );
}
