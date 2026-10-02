import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import type { AvatarSpec } from '../../art/avatar';
import avatarData from '../../data/avatar.json';
import creationData from '../../data/creation.json';
import { CLUBS } from '../../engine/clubs';
import { checkName } from '../../engine/nameFilter';
import { createPrng } from '../../engine/prng';
import { t } from '../../i18n';
import { CREATION_STEPS, transition, type FlowState } from '../../state/flow';
import { Choices, NONE, named, swatches, withNone, type Option } from './Choices';
import { Figurinha } from './Figurinha';
import { PICKS, previewAvatar, randomLook, type Look } from './look';
import { DEFAULT_FIELD, FIELD_ERROR_ORDER, fieldErrors, type OnField } from './onField';
import { OnFieldStep } from './OnFieldStep';
import './Creation.css';

// T50 (SPEC 6.1, v2.30): criação em duas telas + tipo de início, na ordem de flow.json e pela máquina da T48.
// Tela 1 "quem é ele": identidade e visual (nada aqui mexe nos atributos). Tela 2 "em campo e cabeça": OnFieldStep.
export interface Identity { name: string; number: string; state: string; heartClub: string; celebration: string | null }
export interface CreationDraft { identity: Identity; look: Look; field: OnField }
export interface CreationProps {
  onExit: () => void; onFinish: (draft: CreationDraft) => void;
  /** Semente do sorteio do visual (o desafio diário passa a do dia). */
  seed?: number;
}
type Errors = Partial<Record<string, string>>;

const TOTAL = CREATION_STEPS.length;
function byName(a: { nome: string }, b: { nome: string }) { return a.nome.localeCompare(b.nome, 'pt-BR'); }
const BY_NAME = [...CLUBS].sort(byName);
/** Ordem do foco quando há erro, por tela: o primeiro campo inválido recebe o foco. */
const FIELD_ORDER: Record<string, readonly string[]> = { quemE: ['name', 'number', 'state', 'celebration'], emCampo: FIELD_ERROR_ORDER };

/** Erros da tela 1, como chaves de i18n de creation.error. */
function identityErrors(id: Identity): Errors {
  const errors: Errors = {};
  const name = checkName(id.name);
  if (name !== 'ok') errors.name = `creation.error.name.${name}`;
  const n = Number(id.number);
  if (!/^\d{1,2}$/.test(id.number.trim()) || n < 1 || n > 99) errors.number = 'creation.error.shirtNumber.invalid';
  if (!creationData.states.includes(id.state)) errors.state = 'creation.error.state.invalid';
  if (!id.celebration) errors.celebration = 'creation.error.celebration.invalid';
  return errors;
}

function progressText(step: number) {
  return t('ui.criacao.progresso', { passo: step + 1, total: TOTAL });
}

/** Frase da prévia para o leitor de tela. */
function describeLook(look: Look) {
  return t('ui.criacao.aparencia.descricao', {
    pele: t(`creation.skin.${look.skin}`).toLowerCase(), cabelo: t(`creation.hairStyle.${look.hairStyle}`).toLowerCase(),
    cor: t(`creation.hairColor.${look.hairColor}`).toLowerCase(), barba: t(`creation.beard.${look.beard ?? NONE}`).toLowerCase(),
    faixa: t(`creation.headband.${look.headband ?? NONE}`).toLowerCase(), chuteira: t(`creation.boots.${look.boots}`).toLowerCase(),
  });
}

export function Creation({ onExit, onFinish, seed = Date.now() }: CreationProps) {
  const rng = useRef(null as ReturnType<typeof createPrng> | null);
  rng.current ??= createPrng(seed);
  const [flow, setFlow] = useState({ screen: 'criacao', step: 0 } as FlowState);
  const [identity, setIdentity] = useState({ name: '', number: '10', state: '', heartClub: '', celebration: null } as Identity);
  const [look, setLook] = useState(() => { return randomLook(rng.current!); });
  const [field, setField] = useState(DEFAULT_FIELD);
  const [errors, setErrors] = useState({} as Errors);
  const titleRef = useRef(null as HTMLHeadingElement | null);
  const shown = useRef(flow.step);
  const ids = useId();
  const step = CREATION_STEPS[flow.step]!;
  const avatar = useMemo(() => { return previewAvatar(look); }, [look]);

  // Tela nova: o foco vai para o título, e o leitor de tela anuncia onde a pessoa está (não roda na abertura).
  useEffect(() => {
    if (shown.current === flow.step) return;
    shown.current = flow.step;
    titleRef.current?.focus();
  }, [flow.step]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = stepErrors(step, identity, field);
    const first = (FIELD_ORDER[step] ?? []).find((k) => found[k]);
    if (first) {
      setErrors(found);
      e.currentTarget.querySelector<HTMLElement>(`[data-campo="${first}"]`)?.focus();
      return;
    }
    if (flow.step === TOTAL - 1) { onFinish({ identity, look, field }); return; }
    setFlow(transition(flow, 'AVANCAR'));
  };
  const back = () => {
    const next = transition(flow, 'VOLTAR');
    if (next.screen !== 'criacao') { onExit(); return; }
    setErrors({});
    setFlow(next);
  };
  const change = (k: keyof Identity, v: string) => {
    setIdentity({ ...identity, [k]: v });
    const { [k]: _, ...rest } = errors;
    setErrors(rest);
  };
  const changeField = (next: OnField) => {
    setErrors(Object.fromEntries(Object.entries(errors).filter(([k]) => next[k as keyof OnField] === field[k as keyof OnField])));
    setField(next);
  };
  const ctx = { ids, identity, look, avatar, errors, change, setLook, reroll: () => setLook(randomLook(rng.current!)), field, changeField };

  return (
    <main className="criacao">
      <form className="criacao__form" onSubmit={submit} noValidate>
        <header className="criacao__topo">
          <p className="criacao__progresso">{progressText(flow.step)}</p>
          <span className="criacao__trilho" aria-hidden="true"><span style={{ inlineSize: `${((flow.step + 1) / TOTAL) * 100}%` }} /></span>
          <h1 className="criacao__titulo" ref={titleRef} tabIndex={-1}>{t(`ui.criacao.passos.${step}`)}</h1>
        </header>
        <div className="criacao__passo">{stepBody(step, ctx)}</div>
        <footer className="criacao__acoes">
          <button type="button" className="criacao__botao" onClick={back}>{t('ui.criacao.voltar')}</button>
          <button type="submit" className="criacao__botao criacao__botao--principal">{t('ui.criacao.avancar')}</button>
        </footer>
      </form>
    </main>
  );
}

interface StepCtx {
  ids: string; identity: Identity; look: Look; avatar: AvatarSpec; errors: Errors;
  change: (k: keyof Identity, v: string) => void; setLook: (l: Look) => void; reroll: () => void;
  field: OnField; changeField: (f: OnField) => void;
}

/** Erros da tela atual (as que não validam nada devolvem vazio). */
function stepErrors(step: string, identity: Identity, field: OnField): Errors {
  if (step === 'quemE') return identityErrors(identity);
  if (step === 'emCampo') return fieldErrors(field);
  return {};
}

/** Conteúdo de cada tela; as que ainda não existem mostram o aviso. */
function stepBody(step: string, c: StepCtx) {
  if (step === 'quemE') { return <IdentityStep c={c} />; }
  if (step === 'emCampo') { return <OnFieldStep ids={c.ids} field={c.field} errors={c.errors} onChange={c.changeField} />; }
  return <p className="criacao__dica">{t('ui.criacao.pendente')}</p>;
}

/** Erro do campo, ou null; com erro, a mensagem passa a ser a descrição do campo. */
function errorProps(c: StepCtx, k: keyof Identity) {
  const key = c.errors[k];
  return { 'aria-invalid': key ? true : undefined, 'aria-describedby': key ? `${c.ids}-${k}-erro` : undefined, 'data-campo': k };
}

function FieldError({ c, k }: { c: StepCtx; k: keyof Identity }) {
  const key = c.errors[k];
  return <p id={`${c.ids}-${k}-erro`} className="criacao__erro" hidden={!key}>{key ? t(key) : null}</p>;
}

function IdentityStep({ c }: { c: StepCtx }) {
  const { ids, identity: id, change } = c;
  return (
    <div className="quem">
      <div className="quem__topo">
        <div className="criacao__previa">
          <Figurinha name={id.name} avatar={c.avatar} />
          <p className="sr-only" role="status">{describeLook(c.look)}</p>
        </div>
        <div className="quem__campos">
          <Field id={`${ids}-nome`} label={t('ui.criacao.quemE.nome')}>
            <input id={`${ids}-nome`} type="text" value={id.name} autoComplete="off" spellCheck={false} maxLength={24}
              {...errorProps(c, 'name')} onChange={(e) => change('name', e.target.value)} />
            <FieldError c={c} k="name" />
          </Field>
          <div className="quem__linha">
            <Field id={`${ids}-numero`} label={t('ui.criacao.quemE.numero')}>
              <input id={`${ids}-numero`} type="text" inputMode="numeric" value={id.number} maxLength={2} autoComplete="off"
                {...errorProps(c, 'number')} onChange={(e) => change('number', e.target.value)} />
              <FieldError c={c} k="number" />
            </Field>
            <Field id={`${ids}-estado`} label={t('ui.criacao.quemE.estado')}>
              <select id={`${ids}-estado`} value={id.state} {...errorProps(c, 'state')} onChange={(e) => change('state', e.target.value)}>
                <option value="">{t('ui.criacao.quemE.escolhaEstado')}</option>
                {creationData.states.map((uf) => <option key={uf} value={uf}>{t(`creation.state.${uf}`)}</option>)}
              </select>
              <FieldError c={c} k="state" />
            </Field>
          </div>
          <Field id={`${ids}-clube`} label={t('ui.criacao.quemE.clube')}>
            <select id={`${ids}-clube`} value={id.heartClub} onChange={(e) => change('heartClub', e.target.value)}>
              <option value="">{t('ui.criacao.quemE.nenhum')}</option>
              <ClubOptions state={id.state} />
            </select>
          </Field>
        </div>
      </div>
      <Choices id={`${ids}-comemoracao`} legend={t('ui.criacao.quemE.comemoracao')} name="celebration" value={id.celebration ?? ''}
        options={named(creationData.celebrations, 'creation.celebration')} onChange={(v) => change('celebration', v)}
        error={c.errors.celebration ? t(c.errors.celebration) : null} />
      <LookSection c={c} />
    </div>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return <div className="criacao__campo"><label htmlFor={id}>{label}</label>{children}</div>;
}

/** Clubes de coração: os do estado natal primeiro (6.1), em ordem alfabética. */
function ClubOptions({ state }: { state: string }) {
  const option = (club: { id: string; nome: string }) => <option key={club.id} value={club.id}>{club.nome}</option>;
  if (!state) { return <>{BY_NAME.map(option)}</>; }
  return (
    <>
      <optgroup label={t('ui.criacao.quemE.doEstado')}>{BY_NAME.filter((k) => k.uf === state).map(option)}</optgroup>
      <optgroup label={t('ui.criacao.quemE.outros')}>{BY_NAME.filter((k) => k.uf !== state).map(option)}</optgroup>
    </>
  );
}

/** Visual (v2.30): na própria tela, sorteado ao abrir, "Sortear" ao lado do título e tudo editável. */
function LookSection({ c }: { c: StepCtx }) {
  const { ids, look, setLook } = c;
  const set = (k: keyof Look, v: string) => setLook({ ...look, [k]: (k === 'beard' || k === 'headband') && v === NONE ? null : v });
  const groups: { key: keyof Look; legend: string; options: Option[] }[] = [
    { key: 'skin', legend: 'pele', options: swatches(avatarData.skinTones, 'creation.skin') },
    { key: 'hairStyle', legend: 'cabelo', options: named(avatarData.styles.hair, 'creation.hairStyle') },
    { key: 'hairColor', legend: 'corDoCabelo', options: swatches(avatarData.hairColors, 'creation.hairColor') },
    { key: 'beard', legend: 'barba', options: withNone(named(avatarData.styles.beards, 'creation.beard'), 'creation.beard') },
    { key: 'headband', legend: 'faixa', options: withNone(swatches(PICKS.faixas, 'creation.headband'), 'creation.headband') },
    { key: 'boots', legend: 'chuteira', options: swatches(PICKS.chuteiras, 'creation.boots') },
  ];
  return (
    <section className="criacao__secao" aria-labelledby={`${ids}-visual`}>
      <div className="criacao__secao-topo">
        <h2 id={`${ids}-visual`}>{t('ui.criacao.quemE.visual')}</h2>
        <button type="button" className="criacao__sortear" onClick={c.reroll}>{t('ui.criacao.quemE.sortear')}</button>
      </div>
      {groups.map((g) => (
        <Choices key={g.key} id={`${ids}-${g.key}`} name={g.key} legend={t(`ui.criacao.aparencia.${g.legend}`)} options={g.options}
          value={look[g.key] ?? NONE} onChange={(v) => set(g.key, v)} />
      ))}
    </section>
  );
}
