import { t } from '../../i18n';
import { clubName } from './clubText';
import { emblemArt } from './emblemArt';
import './Emblema.css';

export function Emblema({ clubId, size, label = false }: { clubId: string; size: number; label?: boolean }) {
  const { id, version, src, sigla } = emblemArt(clubId, size);
  const { nome, prep } = clubName(clubId);
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
