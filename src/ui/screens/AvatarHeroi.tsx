import { cycle, previewAvatar, type Look } from './look';
import { Choices, type Option } from './Choices';
import { useBust, useBusts } from './useBust';
import { t } from '../../i18n';
import './AvatarHeroi.css';

// T50g (SPEC 7, v2.35): avatar-herói da criação. O busto grande, o nome do cabelo, as setas e a fileira de miniaturas.
// O cabelo continua um grupo de rádio (as miniaturas): as setas só andam por ele. Só visual: nunca entra no motor.
export interface AvatarHeroiProps { id: string; look: Look; number: string; styles: readonly string[]; onChange: (hairStyle: string) => void }

function Chevron({ left }: { left?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={left ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}

export function AvatarHeroi({ id, look, number, styles, onChange }: AvatarHeroiProps) {
  const bust = useBust(previewAvatar(look), '');
  const thumbs = useBusts(styles.map((h) => previewAvatar({ ...look, hairStyle: h })), '');
  const options: Option[] = styles.map((h, i) => ({ id: h, label: t(`creation.hairStyle.${h}`), thumb: thumbs[i] }));
  /** Função declarada (não seta): o guarda do i18n lê "=>" entre tags JSX como texto solto. */
  function go(step: number) { onChange(cycle(styles, look.hairStyle, step)); }
  return (
    <div className="heroi">
      <div className="heroi__palco">
        {/^\d{1,2}$/.test(number) ? <span className="heroi__numero" aria-hidden="true">{number}</span> : null}
        {bust && <img className="heroi__busto" src={bust} alt="" />}
        <div className="heroi__legenda">
          <div>
            <span className="heroi__rotulo">{t('ui.criacao.aparencia.seuAvatar')}</span>
            <strong className="heroi__nome">{t(`creation.hairStyle.${look.hairStyle}`)}</strong>
          </div>
          <div className="heroi__setas">
            <button type="button" className="heroi__seta" aria-label={t('ui.criacao.aparencia.cabeloAnterior')} onClick={() => go(-1)}><Chevron left /></button>
            <button type="button" className="heroi__seta" aria-label={t('ui.criacao.aparencia.cabeloProximo')} onClick={() => go(1)}><Chevron /></button>
          </div>
        </div>
      </div>
      <Choices id={`${id}-hairStyle`} name="hairStyle" legend={t('ui.criacao.aparencia.cabelo')} options={options} value={look.hairStyle}
        onChange={onChange} variant="miniaturas" />
    </div>
  );
}
