import { recolor, uniformColors } from '../../art/avatar';
import { kitOf } from '../../art/kits';
import emblems from '../../data/emblems.json';
import { t } from '../../i18n';
import { clubName } from './clubText';
import { svgUri } from './portrait';
import './Emblema.css';

// T49d (SPEC v2.26): emblema original do clube, ou o escudo genérico. As peças usam as cores-chave do uniforme,
// trocadas aqui pelas cores do clube (kits.json); abaixo de `simplesAbaixoDePx` entra a versão simplificada.
const PIECES = import.meta.glob('../../assets/art/provisoria/emblema/*.svg', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const piece = (id: string, version: string) => PIECES[`../../assets/art/provisoria/emblema/emblema__${id}-${version}.svg`]!;
const OWN = new Set(Object.keys(emblems.clubes));

export function Emblema({ clubId, size, label = false }: { clubId: string; size: number; label?: boolean }) {
  const kit = kitOf(clubId);
  const id = OWN.has(clubId) ? clubId : 'generico';
  const version = size < emblems.simplesAbaixoDePx ? 'simples' : 'completo';
  const src = svgUri(recolor(piece(id, version), uniformColors(kit.camisa[0]!, kit.camisa[1] ?? kit.detalhe)));
  const { nome, sigla, prep } = clubName(clubId);
  const name = t('ui.emblema.de', { prep, clube: nome });
  return (
    <span
      className="emblema" data-emblema={id} data-versao={version} style={{ inlineSize: size, blockSize: size }}
      role={label ? 'img' : undefined} aria-label={label ? name : undefined} aria-hidden={label ? undefined : true}
    >
      <img src={src} alt="" width={size} height={size} />
      {id === 'generico' && version === 'completo' && <span className="emblema__sigla" aria-hidden="true" style={{ fontSize: Math.round(size * 0.24) }}>{sigla}</span>}
    </span>
  );
}
