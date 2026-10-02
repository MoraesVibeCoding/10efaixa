import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { checkName } from '../../engine/nameFilter';
import { t } from '../../i18n';
import { CREATION_STEPS, transition, type FlowState } from '../../state/flow';
import './Creation.css';

// T50 (SPEC 6.1): assistente de criação, um passo por tela, na ordem de flow.json. A navegação usa a máquina da T48.
// Passos sem tela ainda mostram um aviso e deixam seguir; cada fatia da T50 troca um aviso pela tela de verdade.
export interface CreationDraft { name: string }
export interface CreationProps { onExit: () => void; onFinish: (draft: CreationDraft) => void }

const TOTAL = CREATION_STEPS.length;

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
  const [draft, setDraft] = useState({ name: '' } as CreationDraft);
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

  return (
    <main className="criacao">
      <form className="criacao__form" onSubmit={submit} noValidate>
        <header className="criacao__topo">
          <p className="criacao__progresso">{progressText(flow.step)}</p>
          <span className="criacao__trilho" aria-hidden="true"><span style={{ inlineSize: `${((flow.step + 1) / TOTAL) * 100}%` }} /></span>
          <h1 className="criacao__titulo" ref={titleRef} tabIndex={-1}>{t(`ui.criacao.passos.${step}`)}</h1>
        </header>
        <div className="criacao__passo">
          {step === 'nome'
            ? <NameStep ids={ids} value={draft.name} error={error} inputRef={inputRef} onChange={changeName} />
            : <p className="criacao__dica">{t('ui.criacao.pendente')}</p>}
        </div>
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
