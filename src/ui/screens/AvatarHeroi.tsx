import { VISUAIS, cycle, visualOf } from './look';
import { Choices, type Option } from './Choices';
import { t } from '../../i18n';
import './AvatarHeroi.css';

// T50g (SPEC 7, v2.35; v2.36): avatar-herói da criação. A imagem pintada do visual escolhido, o nome ("Visual N"),
// as setas e a fileira de miniaturas. Os 10 visuais são um grupo de rádio; as setas só andam por ele. Só visual: nunca entra no motor.
const ART = import.meta.glob('../../assets/visuais/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const artOf = (id: string) => ART[`../../assets/visuais/${id}.webp`];
const IDS = VISUAIS.map((v) => v.id);

export interface AvatarHeroiProps { id: string; value: string; number: string; onChange: (visualId: string) => void }

function Chevron({ left }: { left?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={left ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}

export function AvatarHeroi({ id, value, number, onChange }: AvatarHeroiProps) {
  const current = visualOf(value);
  const options: Option[] = VISUAIS.map((v) => ({ id: v.id, label: t('ui.criacao.visuais.nome', { n: v.n }), thumb: artOf(v.id) ?? null }));
  /** Função declarada (não seta): o guarda do i18n lê "=>" entre tags JSX como texto solto. */
  function go(step: number) { onChange(cycle(IDS, value, step)); }
  return (
    <div className="heroi">
      <div className="heroi__palco">
        <img className="heroi__retrato" src={artOf(value)} alt="" />
        {/^\d{1,2}$/.test(number) ? <span className="heroi__numero" aria-hidden="true">{number}</span> : null}
        <div className="heroi__legenda">
          <div>
            <span className="heroi__rotulo">{t('ui.criacao.aparencia.seuAvatar')}</span>
            <strong className="heroi__nome">{t('ui.criacao.visuais.nome', { n: current.n })}</strong>
          </div>
          <div className="heroi__setas">
            <button type="button" className="heroi__seta" aria-label={t('ui.criacao.visuais.anterior')} onClick={() => go(-1)}><Chevron left /></button>
            <button type="button" className="heroi__seta" aria-label={t('ui.criacao.visuais.proximo')} onClick={() => go(1)}><Chevron /></button>
          </div>
        </div>
      </div>
      <Choices id={`${id}-visual`} name="visual" legend={t('ui.criacao.visuais.titulo')} options={options} value={value}
        onChange={onChange} variant="miniaturas" />
    </div>
  );
}
