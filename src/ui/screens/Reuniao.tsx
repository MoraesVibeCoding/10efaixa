import { useEffect, useRef, useState } from 'react';
import { ATTRIBUTES } from '../../engine/attributes';
import { parseProposal, type MeetingResult } from '../../engine/meeting';
import { t } from '../../i18n';
import { Choices } from './Choices';
import './Creation.css';
import './Reuniao.css';

// T52 (SPEC 6.5, v2.40): reunião com a comissão no meio da temporada. O jogador propõe o foco principal e o
// secundário (10 atributos, bola parada ou perna ruim); a tela abre com a sugestão do preparador. Sem números.
const FOCI = [...ATTRIBUTES, 'bolaParada', 'pernaRuim'] as const;
const focusName = (f: string) => (f === 'bolaParada' || f === 'pernaRuim' ? t(`ui.reuniao.foco.${f}`) : t(`attributes.attribute.${f}`));

export function Reuniao({ sugestao, onChoose }: { sugestao: string; onChoose: (choice: string) => void }) {
  const suggested = parseProposal(sugestao) ?? { main: FOCI[0], secondary: FOCI[1] };
  const [main, setMain] = useState(suggested.main as string);
  const [secondary, setSecondary] = useState(suggested.secondary as string);
  const title = useRef(null as HTMLHeadingElement | null);
  useEffect(() => { title.current?.focus(); }, []);
  const options = FOCI.map((id) => ({ id, label: focusName(id) }));
  // principal e secundário nunca iguais: escolher num o que está no outro troca os dois
  function pickMain(v: string) { if (v === secondary) setSecondary(main); setMain(v); }
  function pickSecondary(v: string) { if (v === main) setMain(secondary); setSecondary(v); }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    onChoose(`${main}|${secondary}`);
  }
  return (
    <main className="criacao reuniao">
      <form className="criacao__form" onSubmit={submit} noValidate>
        <header className="criacao__topo">
          <h1 className="criacao__titulo" ref={title} tabIndex={-1}>{t('ui.reuniao.titulo')}</h1>
        </header>
        <div className="criacao__passo">
          <p>{t('ui.reuniao.texto')}</p>
          <p className="criacao__dica">{t('ui.reuniao.sugestao', { principal: focusName(suggested.main), secundario: focusName(suggested.secondary) })}</p>
          <Choices id="reuniao-principal" name="principal" legend={t('ui.reuniao.principal')} options={options} value={main} onChange={pickMain} />
          <Choices id="reuniao-secundario" name="secundario" legend={t('ui.reuniao.secundario')} options={options} value={secondary} onChange={pickSecondary} />
        </div>
        <footer className="criacao__acoes reuniao__acoes">
          <button type="submit" className="criacao__botao criacao__botao--principal">{t('ui.reuniao.propor')}</button>
        </footer>
      </form>
    </main>
  );
}

export type ReuniaoRespostaProps = { resposta: Pick<MeetingResult, 'response' | 'reason' | 'focus'>; onDone: () => void };

/** A resposta da comissão, por cima da próxima tela: aceita, contrapropõe (o clube precisa de outra coisa) ou recusa. */
export function ReuniaoResposta({ resposta, onDone }: ReuniaoRespostaProps) {
  const dialog = useRef(null as HTMLDialogElement | null);
  const button = useRef(null as HTMLButtonElement | null);
  const done = useRef(false);
  function finish() {
    if (done.current) return;
    done.current = true;
    onDone();
  }
  useEffect(() => {
    const el = dialog.current;
    if (el && !el.open) {
      if (typeof el.showModal === 'function') el.showModal();
      else el.setAttribute('open', '');
    }
    button.current?.focus();
  }, []);
  const { response, reason, focus } = resposta;
  const text = response === 'recusa'
    ? t(`ui.reuniao.resposta.recusa.${reason ?? 'score'}`)
    : t(`ui.reuniao.resposta.${response}.texto`, { principal: focusName(focus.main ?? ''), secundario: focusName(focus.secondary ?? '') });
  function onCancel(e: React.SyntheticEvent) { e.preventDefault(); finish(); }
  return (
    <dialog ref={dialog} className="reuniao__resposta" aria-labelledby="reuniao-resposta-titulo" onCancel={onCancel}>
      <h2 id="reuniao-resposta-titulo">{t(`ui.reuniao.resposta.${response}.titulo`)}</h2>
      <p>{text}</p>
      <button ref={button} type="button" onClick={finish}>{t('ui.resultado.seguir')}</button>
    </dialog>
  );
}
