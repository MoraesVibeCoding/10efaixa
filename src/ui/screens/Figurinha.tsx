import { useEffect, useState } from 'react';
import type { AvatarSpec } from '../../art/avatar';
import { kitOf } from '../../art/kits';
import { toBand } from '../../engine/attributes';
import { t } from '../../i18n';
import tokens from '../theme/tokens.json';
import { clubName } from './clubText';
import { Emblema } from './Emblema';
import { bustSvg, svgUri } from './portrait';
import './Figurinha.css';

// T49c (SPEC v2.26): o jogador como figurinha de álbum. Fundo creme com as faixas do clube nos ombros;
// o busto tem o contorno branco e a linha marinho do recorte de álbum, que separam a camisa da faixa em qualquer cor.
export interface FigurinhaProps {
  name: string; number?: number;
  /** Sem overall, posição e clube (criação, T50): sem cartão do OVR, emblema e linha do clube; faixas no uniforme neutro. */
  overall?: number; position?: string; clubId?: string;
  /** Aparência do jogador; o uniforme vem do clube. Sem ela, a figurinha fica só com o fundo. */
  avatar?: AvatarSpec;
}

const MEDALS = tokens.medalha as unknown as Record<string, { nome: string }>;
const CARD_ART = import.meta.glob('../../assets/cartoes-over/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

function clubLine(position: string, clubId: string) {
  const { nome, prep } = clubName(clubId);
  return t('ui.figurinha.posicaoNoClube', { posicao: t(`positions.${position}`), prep, clube: nome });
}

function useBust(avatar: AvatarSpec | undefined, clubId: string) {
  const [uri, setUri] = useState(null as string | null);
  useEffect(() => {
    if (!avatar) return undefined;
    const kit = kitOf(clubId);
    let alive = true;
    void bustSvg({ ...avatar, uniform1: kit.camisa[0]!, uniform2: kit.camisa[1] ?? kit.detalhe }).then((svg) => { if (alive) setUri(svgUri(svg)); });
    return () => { alive = false; };
  }, [avatar, clubId]);
  return avatar ? uri : null;
}

export function Figurinha({ name, number, overall, position, clubId = '', avatar }: FigurinhaProps) {
  const kit = kitOf(clubId);
  const bust = useBust(avatar, clubId);
  const stripes = { '--faixa1': kit.camisa[0], '--faixa2': kit.camisa[1] ?? kit.detalhe } as React.CSSProperties;
  return (
    <span className="figurinha">
      <span className="figurinha__foto" style={stripes}>
        {bust && <img className="figurinha__retrato" src={bust} alt="" width="220" height="220" />}
        {number !== undefined && <span className="figurinha__numero" aria-hidden="true">{number}</span>}
        {clubId ? <span className="figurinha__emblema"><Emblema clubId={clubId} size={30} /></span> : null}
        {overall === undefined ? null : <OverCard overall={overall} />}
      </span>
      <span className="figurinha__nome">{name}</span>
      {clubId && position ? <span className="figurinha__clube">{clubLine(position, clubId)}</span> : null}
    </span>
  );
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
