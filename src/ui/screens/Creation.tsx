import shirtCfg from '../../data/shirt.json';
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import type { AvatarSpec } from '../../art/avatar';
import creationData from '../../data/creation.json';
import { CLUBS } from '../../engine/clubs';
import type { CreationInput } from '../../engine/player';
import { checkName } from '../../engine/nameFilter';
import { createPrng } from '../../engine/prng';
import { t } from '../../i18n';
import { transition, type FlowState } from '../../state/flow';
import { Choices } from './Choices';
import { AvatarHeroi } from './AvatarHeroi';
import { Figurinha } from './Figurinha';
import { VISUAIS, lookOf, previewAvatar, randomVisual, visualOf, type Look } from './look';
import { DEFAULT_FIELD, FIELD_ERROR_ORDER, fieldErrors, type OnField } from './onField';
import { OnFieldStep } from './OnFieldStep';
import { toCreationInput } from './draft';
import { firstStepOf, pageOf, pagesFor } from './pages';
import { CenaPintada, creationScene, cutForVisual } from './CenaPintada';
import { useWide } from './useWide';
import './Creation.css';

// T50 (SPEC 6.1, v2.30; v2.35): criação em quatro telas, na ordem de flow.json e pela máquina da T48.
// Tela 1 "quem é ele": identidade. Tela 2 "seu visual" (nada aqui mexe nos atributos). Tela 3 "em campo e cabeça": OnFieldStep.
// Tela 4: tipo de início (origem). No computador, as telas 1 e 2 são uma página só (pages.ts).
// v2.68: a comemoração saiu da criação (vem do marco do primeiro gol)
export interface Identity { name: string; number: string; state: string; heartClub: string }
/** O que a criação entrega: o motor recebe só o CreationInput; o visual vai à parte (aparência nunca mexe no jogo). */
export interface CreationResult { input: CreationInput; look: Look; /** Id do visual escolhido (visuais.json): a arte pintada. `look` são as peças da arte provisória dele. */ visual: string }
export interface CreationProps {
  onExit: () => void; onFinish: (result: CreationResult) => void;
  /** Semente do sorteio do visual (o desafio diário passa a do dia). */
  seed?: number;
}
type Errors = Partial<Record<string, string>>;

function byName(a: { nome: string }, b: { nome: string }) { return a.nome.localeCompare(b.nome, 'pt-BR'); }
const BY_NAME = [...CLUBS].sort(byName);
/** Ordem do foco quando há erro, por tela: o primeiro campo inválido recebe o foco. */
const FIELD_ORDER: Record<string, readonly string[]> = { quemE: ['name', 'number', 'state'], visual: [], emCampo: FIELD_ERROR_ORDER, origem: ['origin'] };
const ORIGINS = Object.keys(creationData.origins);

/** Erros da tela 1, como chaves de i18n de creation.error. */
function identityErrors(id: Identity): Errors {
  const errors: Errors = {};
  const name = checkName(id.name);
  if (name !== 'ok') errors.name = `creation.error.name.${name}`;
  const n = Number(id.number);
  if (!/^\d{1,2}$/.test(id.number.trim()) || n < 1 || n > 99) errors.number = 'creation.error.shirtNumber.invalid';
  else if (shirtCfg.reservados.includes(n)) errors.number = 'creation.error.shirtNumber.reserved';
  if (!creationData.states.includes(id.state)) errors.state = 'creation.error.state.invalid';
  return errors;
}

function progressText(page: number, total: number) {
  return t('ui.criacao.progresso', { passo: page + 1, total });
}

export function Creation({ onExit, onFinish, seed = Date.now() }: CreationProps) {
  const rng = useRef(null as ReturnType<typeof createPrng> | null);
  rng.current ??= createPrng(seed);
  const [flow, setFlow] = useState({ screen: 'criacao', step: 0 } as FlowState);
  const [identity, setIdentity] = useState({ name: '', number: '7', state: '', heartClub: '' } as Identity);
  const [visualId, setVisualId] = useState(() => { return randomVisual(rng.current!); });
  const [field, setField] = useState(DEFAULT_FIELD);
  const [origin, setOrigin] = useState(null as string | null);
  const [errors, setErrors] = useState({} as Errors);
  const wide = useWide();
  const pages = pagesFor(wide);
  const pageIndex = pageOf(flow.step, wide);
  const page = pages[pageIndex]!;
  const titleRef = useRef(null as HTMLHeadingElement | null);
  const shown = useRef(pageIndex);
  const ids = useId();
  const look = lookOf(visualId);
  const avatar = useMemo(() => { return previewAvatar(lookOf(visualId)); }, [visualId]);

  // Página nova: o foco vai para o título, e o leitor de tela anuncia onde a pessoa está (não roda na abertura).
  useEffect(() => {
    if (shown.current === pageIndex) return;
    shown.current = pageIndex;
    titleRef.current?.focus();
  }, [pageIndex]);

  /** Anda na máquina da T48 até o começo da página pedida (no computador, uma página pula dois passos). */
  const goTo = (target: number, event: 'AVANCAR' | 'VOLTAR') => {
    let next = flow;
    while (next.screen === 'criacao' && next.step !== target) next = transition(next, event);
    setFlow(next);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = Object.assign({}, ...page.map((s) => stepErrors(s, identity, field, origin))) as Errors;
    const first = page.flatMap((s) => FIELD_ORDER[s] ?? []).find((k) => found[k]);
    if (first) {
      setErrors(found);
      e.currentTarget.querySelector<HTMLElement>(`[data-campo="${first}"]`)?.focus();
      return;
    }
    if (pageIndex === pages.length - 1) { onFinish({ input: toCreationInput(identity, field, origin!), look, visual: visualId }); return; }
    goTo(firstStepOf(pages[pageIndex + 1]!), 'AVANCAR');
  };
  const back = () => {
    if (pageIndex === 0) { onExit(); return; }
    setErrors({});
    goTo(firstStepOf(pages[pageIndex - 1]!), 'VOLTAR');
  };
  const chooseOrigin = (v: string) => { setOrigin(v); setErrors({}); };
  const change = (k: keyof Identity, v: string) => {
    setIdentity({ ...identity, [k]: v });
    const { [k]: _, ...rest } = errors;
    setErrors(rest);
  };
  const changeField = (next: OnField) => {
    setErrors(Object.fromEntries(Object.entries(errors).filter(([k]) => next[k as keyof OnField] === field[k as keyof OnField])));
    setField(next);
  };
  const ctx = {
    ids, identity, visualId, avatar, errors, change, setVisualId, field, changeField, origin, chooseOrigin,
  };

  return (
    <main className="criacao">
      {/* T60b: cena pintada ao fundo do passo (decorativa), uniforme neutro: ainda não há clube */}
      <CenaPintada scene={creationScene(page[0]!, origin)} cut={cutForVisual(visualId)} clubId="" alt="" decorativa />
      <form className={page.length > 1 ? 'criacao__form criacao__form--larga vidro' : 'criacao__form vidro'} onSubmit={submit} noValidate>
        <header className="criacao__topo">
          <p className="criacao__progresso">{progressText(pageIndex, pages.length)}</p>
          <span className="criacao__trilho" aria-hidden="true"><span style={{ inlineSize: `${((pageIndex + 1) / pages.length) * 100}%` }} /></span>
          <h1 className="criacao__titulo" ref={titleRef} tabIndex={-1}>{t(`ui.criacao.passos.${page[0]}`)}</h1>
        </header>
        <div className="criacao__passo">{page.map((s, i) => <PageColumn key={s} step={s} sub={i > 0} c={ctx} />)}</div>
        <footer className="criacao__acoes">
          <button type="button" className="criacao__botao" onClick={back}>{t('ui.criacao.voltar')}</button>
          <button type="submit" className="criacao__botao criacao__botao--principal">{t('ui.criacao.avancar')}</button>
        </footer>
      </form>
    </main>
  );
}

interface StepCtx {
  ids: string; identity: Identity; visualId: string; avatar: AvatarSpec; errors: Errors;
  change: (k: keyof Identity, v: string) => void; setVisualId: (id: string) => void;
  field: OnField; changeField: (f: OnField) => void; origin: string | null; chooseOrigin: (v: string) => void;
}

/** Erros de um passo, como chaves de i18n de creation.error. */
function stepErrors(step: string, identity: Identity, field: OnField, origin: string | null): Errors {
  if (step === 'quemE') return identityErrors(identity);
  if (step === 'emCampo') return fieldErrors(field);
  if (step === 'origem' && !origin) return { origin: 'creation.error.origin.invalid' };
  return {};
}

/** Um passo dentro da página; o segundo passo de uma página (computador) ganha o próprio título. */
function PageColumn({ step, sub, c }: { step: string; sub: boolean; c: StepCtx }) {
  if (!sub) { return <div className="criacao__coluna">{stepBody(step, c)}</div>; }
  return (
    <section className="criacao__coluna" aria-labelledby={`${c.ids}-${step}-titulo`}>
      <h2 id={`${c.ids}-${step}-titulo`} className="criacao__subtitulo">{t(`ui.criacao.passos.${step}`)}</h2>
      {stepBody(step, c)}
    </section>
  );
}

/** Conteúdo de cada passo. */
function stepBody(step: string, c: StepCtx) {
  if (step === 'quemE') { return <IdentityStep c={c} />; }
  if (step === 'visual') { return <VisualStep c={c} />; }
  if (step === 'emCampo') { return <OnFieldStep ids={c.ids} field={c.field} errors={c.errors} onChange={c.changeField} number={c.identity.number} />; }
  return <OriginStep c={c} />;
}

/** Tipo de início (6.1): três cartões com a frase de cada origem, sem números; o teto é o mesmo para todos. */
function OriginStep({ c }: { c: StepCtx }) {
  const options = ORIGINS.map((id) => ({ id, label: t(`creation.origin.${id}`), detail: t(`ui.criacao.origem.${id}`) }));
  return (
    <div className="origem">
      <Choices id={`${c.ids}-origem`} name="origin" legend={t('ui.criacao.origem.titulo')} options={options} variant="cartoes"
        value={c.origin ?? ''} onChange={c.chooseOrigin} error={c.errors.origin ? t(c.errors.origin) : null} />
      <p className="criacao__dica">{t('ui.criacao.origem.teto')}</p>
    </div>
  );
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
          <Figurinha name={id.name} avatar={c.avatar} visual={c.visualId} />
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
    </div>
  );
}

/** Tela 2 (v2.35; v2.36): escolha entre os 10 visuais prontos, com o avatar-herói. */
function VisualStep({ c }: { c: StepCtx }) {
  const n = visualOf(c.visualId).n;
  return (
    <div className="quem">
      <AvatarHeroi id={c.ids} value={c.visualId} number={c.identity.number} onChange={c.setVisualId} />
      <p className="sr-only" role="status">{t('ui.criacao.visuais.descricao', { n, total: VISUAIS.length })}</p>
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
