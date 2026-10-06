import creationData from '../../data/creation.json';
import { archetypesFor } from '../../engine/archetypes';
import { BUILDS } from '../../engine/biotype';
import { MENTALITIES } from '../../engine/mentality';
import { t } from '../../i18n';
import { Choices, named, type Option } from './Choices';
import { FIELD_SLOTS, POSITIONS, RANGES, hintOf, meters, slotOf, styleHint, withSlot, type OnField } from './onField';

// T50d (SPEC 6.1, 6.2, 6.17, v2.30): tela 2 "em campo e cabeça". A lógica pura fica em onField.ts.
export interface OnFieldStepProps {
  ids: string; field: OnField; errors: Partial<Record<string, string>>; onChange: (f: OnField) => void;
  /** v2.46: número da camisa, que aparece na camisa marcada do campo. */
  number?: string;
}

export function OnFieldStep({ ids, field: f, errors, onChange, number = '' }: OnFieldStepProps) {
  const err = (k: string) => (errors[k] ? t(errors[k]!) : null);
  // v2.46: 9 camisas; a marcada leva o número do jogador e o leitor de tela ouve a vaga por extenso
  const slot = slotOf(f);
  const positions: Option[] = FIELD_SLOTS.map((s) => ({
    id: s.id, label: s.id === slot && number ? number : t(`ui.criacao.emCampo.sigla.${s.id}`),
    full: s.side ? t(`ui.criacao.emCampo.vaga.${s.id}`) : t(`positions.${s.position}`),
  }));
  const range = f.position ? RANGES[f.position] : { min: Math.min(...POSITIONS.map((p) => RANGES[p].min)), max: Math.max(...POSITIONS.map((p) => RANGES[p].max)) };
  return (
    <div className="campo">
      <Choices id={`${ids}-posicao`} name="position" legend={t('ui.criacao.emCampo.posicao')} options={positions} variant="campo"
        value={slot} onChange={(v) => onChange(withSlot(f, v))} error={err('position')} />
      <StyleChoices ids={ids} field={f} error={err('archetypeId')} onChange={onChange} />
      <Choices id={`${ids}-perna`} name="foot" legend={t('ui.criacao.emCampo.perna')} options={named(creationData.feet, 'creation.foot')}
        value={f.foot} onChange={(v) => onChange({ ...f, foot: v })} />
      <div className="escolhas escolhas--altura">
        <label htmlFor={`${ids}-altura`} className="escolhas__rotulo">{t('ui.criacao.emCampo.altura')}</label>
        <div className="altura">
          <input id={`${ids}-altura`} type="range" min={range.min} max={range.max} step={1} value={f.heightCm}
            aria-valuetext={t('ui.criacao.emCampo.metros', { altura: meters(f.heightCm) })} aria-describedby={`${ids}-altura-dica`}
            onChange={(e) => onChange({ ...f, heightCm: Number(e.target.value) })} />
          <output htmlFor={`${ids}-altura`} className="altura__valor">{t('ui.criacao.emCampo.metros', { altura: meters(f.heightCm) })}</output>
        </div>
        <p id={`${ids}-altura-dica`} className="criacao__dica escolhas__dica">{t('ui.criacao.emCampo.alturaDica')}</p>
      </div>
      <Choices id={`${ids}-compleicao`} name="build" legend={t('ui.criacao.emCampo.compleicao')} options={named(BUILDS, 'creation.build')}
        value={f.build} onChange={(v) => onChange({ ...f, build: v })} hint={hintOf('creation.buildDica', f.build)} />
      <Choices id={`${ids}-temperamento`} name="temperament" legend={t('ui.criacao.emCampo.temperamento')}
        options={named(creationData.temperaments, 'creation.temperament')} value={f.temperament ?? ''}
        onChange={(v) => onChange({ ...f, temperament: v })} error={err('temperament')} hint={hintOf('creation.temperamentDica', f.temperament)} />
      <Choices id={`${ids}-mentalidade`} name="mentality" legend={t('ui.criacao.emCampo.mentalidade')} options={named(MENTALITIES, 'creation.mentality')}
        value={f.mentality ?? ''} onChange={(v) => onChange({ ...f, mentality: v })} hint={hintOf('creation.mentalityDica', f.mentality)} />
    </div>
  );
}

/** Estilo: só os arquétipos da posição; sem posição, pede a posição primeiro. */
function StyleChoices({ ids, field: f, error, onChange }: { ids: string; field: OnField; error: string | null; onChange: (f: OnField) => void }) {
  if (!f.position) {
    return (
      <div className="escolhas">
        <span className="escolhas__rotulo">{t('ui.criacao.emCampo.estilo')}</span>
        <p className="criacao__dica">{t('ui.criacao.emCampo.estiloPrimeiro')}</p>
      </div>
    );
  }
  const options = archetypesFor(f.position).map((a) => ({ id: a.id, label: t(`archetypes.archetype.${a.id}`) }));
  return (
    <Choices id={`${ids}-estilo`} name="archetypeId" legend={t('ui.criacao.emCampo.estilo')} options={options}
      value={f.archetypeId ?? ''} onChange={(v) => onChange({ ...f, archetypeId: v })} error={error} hint={styleHint(f.archetypeId)} />
  );
}
