import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import type { AvatarSpec } from '../../art/avatar';
import avatarData from '../../data/avatar.json';
import { checkName } from '../../engine/nameFilter';
import { t } from '../../i18n';
import { CREATION_STEPS, transition, type FlowState } from '../../state/flow';
import { Figurinha } from './Figurinha';
import './Creation.css';

// T50 (SPEC 6.1): assistente de criação, um passo por tela, na ordem de flow.json. A navegação usa a máquina da T48.
// Passos sem tela ainda mostram um aviso e deixam seguir; cada fatia da T50 troca um aviso pela tela de verdade.
/** Aparência (6.17): só visual. Nunca entra em CreationInput nem no motor. */
export interface Look { skin: string; hairStyle: string; hairColor: string; beard: string | null; headband: string | null; boots: string }
export interface CreationDraft { name: string; look: Look }
export interface CreationProps { onExit: () => void; onFinish: (draft: CreationDraft) => void }

const TOTAL = CREATION_STEPS.length;
const LOOK_FROM = CREATION_STEPS.indexOf('aparencia');
const PICKS = avatarData.escolhas;
const NONE = 'nenhuma';
/** A figurinha ao vivo aparece do passo da aparência em diante. */
function showsPreview(step: number) { return step >= LOOK_FROM; }
const hexOf = (list: { id: string; hex: string }[], id: string | null) => list.find((o) => o.id === id)?.hex ?? null;

/** Avatar da prévia: a aparência escolhida sobre um corpo padrão (altura e compleição chegam no passo do biotipo). */
function previewAvatar(look: Look): AvatarSpec {
  return {
    skin: look.skin, hairStyle: look.hairStyle, hairColor: look.hairColor, beard: look.beard, expression: 'neutra',
    heightCm: 178, build: 'atletico', age: 16, uniform1: '#000000', uniform2: '#000000',
    boots: hexOf(PICKS.chuteiras, look.boots)!, headband: hexOf(PICKS.faixas, look.headband),
  };
}

/** Frase da prévia para o leitor de tela. */
function describeLook(look: Look) {
  return t('ui.criacao.aparencia.descricao', {
    pele: t(`creation.skin.${look.skin}`).toLowerCase(), cabelo: t(`creation.hairStyle.${look.hairStyle}`).toLowerCase(),
    cor: t(`creation.hairColor.${look.hairColor}`).toLowerCase(), barba: t(`creation.beard.${look.beard ?? NONE}`).toLowerCase(),
    faixa: t(`creation.headband.${look.headband ?? NONE}`).toLowerCase(), chuteira: t(`creation.boots.${look.boots}`).toLowerCase(),
  });
}

/** Chave de i18n do erro do passo, ou null quando o passo pode avançar. */
function stepError(step: string, draft: CreationDraft): string | null {
  if (step !== 'nome') return null;
  const check = checkName(draft.name);
  return check === 'ok' ? null : `creation.error.name.${check}`;
}

function progressText(step: number) {
  return t('ui.criacao.progresso', { passo: step + 1, total: TOTAL });
}

export function Creation({ onExit, onFinish }: CreationProps) {
  const [flow, setFlow] = useState({ screen: 'criacao', step: 0 } as FlowState);
  const [draft, setDraft] = useState({ name: '', look: { ...PICKS.padrao } } as CreationDraft);
  const [error, setError] = useState(null as string | null);
  const titleRef = useRef(null as HTMLHeadingElement | null);
  const inputRef = useRef(null as HTMLInputElement | null);
  const shown = useRef(flow.step);
  const ids = useId();
  const step = CREATION_STEPS[flow.step]!;

  // Passo novo: o foco vai para o título, e o leitor de tela anuncia onde a pessoa está (não roda na abertura).
  useEffect(() => {
    if (shown.current === flow.step) return;
    shown.current = flow.step;
    titleRef.current?.focus();
  }, [flow.step]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = stepError(step, draft);
    if (err) { setError(err); inputRef.current?.focus(); return; }
    if (flow.step === TOTAL - 1) { onFinish(draft); return; }
    setFlow(transition(flow, 'AVANCAR'));
  };
  const back = () => {
    const next = transition(flow, 'VOLTAR');
    if (next.screen !== 'criacao') { onExit(); return; }
    setError(null);
    setFlow(next);
  };
  const changeName = (name: string) => { setDraft({ ...draft, name }); setError(null); };
  const changeLook = (look: Look) => setDraft({ ...draft, look });
  const avatar = useMemo(() => { return previewAvatar(draft.look); }, [draft.look]);

  return (
    <main className="criacao">
      <form className="criacao__form" onSubmit={submit} noValidate>
        <header className="criacao__topo">
          <p className="criacao__progresso">{progressText(flow.step)}</p>
          <span className="criacao__trilho" aria-hidden="true"><span style={{ inlineSize: `${((flow.step + 1) / TOTAL) * 100}%` }} /></span>
          <h1 className="criacao__titulo" ref={titleRef} tabIndex={-1}>{t(`ui.criacao.passos.${step}`)}</h1>
        </header>
        {showsPreview(flow.step) ? <LivePreview name={draft.name} avatar={avatar} look={draft.look} /> : null}
        <div className="criacao__passo">{stepBody(step, { ids, draft, error, inputRef, changeName, changeLook })}</div>
        <footer className="criacao__acoes">
          <button type="button" className="criacao__botao" onClick={back}>{t('ui.criacao.voltar')}</button>
          <button type="submit" className="criacao__botao criacao__botao--principal">{t('ui.criacao.avancar')}</button>
        </footer>
      </form>
    </main>
  );
}

interface NameStepProps {
  ids: string; value: string; error: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>; onChange: (v: string) => void;
}

/** Nome: a dica descreve o campo; com erro, a mensagem do filtro passa a ser a descrição. */
function NameStep({ ids, value, error, inputRef, onChange }: NameStepProps) {
  const hint = `${ids}-dica`;
  const err = `${ids}-erro`;
  return (
    <div className="criacao__campo">
      <label htmlFor={`${ids}-nome`}>{t('ui.criacao.nome.rotulo')}</label>
      <input
        id={`${ids}-nome`} ref={inputRef} type="text" value={value} autoComplete="off" spellCheck={false}
        enterKeyHint="next" aria-invalid={error ? true : undefined} aria-describedby={error ? err : hint}
        onChange={(e) => onChange(e.target.value)}
      />
      <p id={hint} className="criacao__dica" hidden={!!error}>{t('ui.criacao.nome.dica')}</p>
      <p id={err} className="criacao__erro" role="alert" hidden={!error}>{error ? t(error) : null}</p>
    </div>
  );
}

interface StepCtx {
  ids: string; draft: CreationDraft; error: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>; changeName: (v: string) => void; changeLook: (l: Look) => void;
}

/** Conteúdo de cada passo; os que ainda não têm tela mostram o aviso. */
function stepBody(step: string, c: StepCtx) {
  if (step === 'nome') { return <NameStep ids={c.ids} value={c.draft.name} error={c.error} inputRef={c.inputRef} onChange={c.changeName} />; }
  if (step === 'aparencia') { return <LookStep look={c.draft.look} onChange={c.changeLook} />; }
  return <p className="criacao__dica">{t('ui.criacao.pendente')}</p>;
}

/** Figurinha ao vivo (T50): muda a cada escolha; a frase da prévia é anunciada com educação (role="status"). */
function LivePreview({ name, avatar, look }: { name: string; avatar: AvatarSpec; look: Look }) {
  return (
    <div className="criacao__previa">
      <Figurinha name={name} avatar={avatar} />
      <p className="criacao__dica">{t('ui.criacao.aparencia.aviso')}</p>
      <p className="sr-only" role="status">{describeLook(look)}</p>
    </div>
  );
}

interface Option { id: string; label: string; swatch?: string }

const swatches = (list: { id: string; hex: string }[], prefix: string): Option[] =>
  list.map((o) => ({ id: o.id, label: t(`${prefix}.${o.id}`), swatch: o.hex }));
const named = (ids: string[], prefix: string): Option[] => ids.map((id) => ({ id, label: t(`${prefix}.${id}`) }));
const withNone = (opts: Option[], prefix: string): Option[] => [{ id: NONE, label: t(`${prefix}.${NONE}`) }, ...opts];

/** Aparência: grupos de rádio nativos (setas do teclado trocam a opção; Tab passa de grupo). */
function LookStep({ look, onChange }: { look: Look; onChange: (l: Look) => void }) {
  const set = (k: keyof Look, v: string) => onChange({ ...look, [k]: (k === 'beard' || k === 'headband') && v === NONE ? null : v });
  const groups: { key: keyof Look; legend: string; options: Option[] }[] = [
    { key: 'skin', legend: 'pele', options: swatches(avatarData.skinTones, 'creation.skin') },
    { key: 'hairStyle', legend: 'cabelo', options: named(avatarData.styles.hair, 'creation.hairStyle') },
    { key: 'hairColor', legend: 'corDoCabelo', options: swatches(avatarData.hairColors, 'creation.hairColor') },
    { key: 'beard', legend: 'barba', options: withNone(named(avatarData.styles.beards, 'creation.beard'), 'creation.beard') },
    { key: 'headband', legend: 'faixa', options: withNone(swatches(PICKS.faixas, 'creation.headband'), 'creation.headband') },
    { key: 'boots', legend: 'chuteira', options: swatches(PICKS.chuteiras, 'creation.boots') },
  ];
  return (
    <div className="criacao__grupos">
      {groups.map((g) => (
        <Choices key={g.key} name={g.key} legend={t(`ui.criacao.aparencia.${g.legend}`)} options={g.options}
          value={look[g.key] ?? NONE} onChange={(v) => set(g.key, v)} />
      ))}
    </div>
  );
}

function Choices({ name, legend, options, value, onChange }: { name: string; legend: string; options: Option[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="escolhas">
      <legend>{legend}</legend>
      <div className="escolhas__lista">
        {options.map((o) => (
          <label key={o.id} className={o.swatch ? 'escolha escolha--cor' : 'escolha'}>
            <input className="escolha__input sr-only" type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} />
            <ChoiceMark option={o} />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Cor vira amostra com o nome escondido para o leitor de tela; o resto é texto. */
function ChoiceMark({ option }: { option: Option }) {
  if (!option.swatch) { return <span className="escolha__marca">{option.label}</span>; }
  return (
    <span className="escolha__marca" title={option.label}>
      <span className="escolha__amostra" style={{ background: option.swatch }} aria-hidden="true" />
      <span className="sr-only">{option.label}</span>
    </span>
  );
}
