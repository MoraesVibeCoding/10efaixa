import { useEffect, useRef, useState } from 'react';
import type { MeetingResult } from '../../engine/meeting';
import type { Agrado, Idea, MeetingOptions } from '../../engine/meetingOptions';
import { t } from '../../i18n';
import { Career as CareerDrawer, PlayerBox, TRANSITION, type DecisionProps } from './Decision';
import { CenaPintada } from './CenaPintada';
import './Reuniao.css';

// T52d (SPEC 6.5, v2.53): reunião com a comissão em 3 ideias, no desenho aprovado: o card do jogador (o de sempre), a fala do
// treinador e três cartões selecionáveis (óbvia, mescla, ousada); "Propor ao técnico" só depois de escolher. Sem números.
const focusName = (f: string) => (f === 'bolaParada' || f === 'pernaRuim' ? t(`ui.reuniao.foco.${f}`) : t(`attributes.attribute.${f}`));
const IDEAS: Idea[] = ['obvia', 'mescla', 'ousada'];
const SCENE_SIZE = [1856, 2304] as const;

const ICON: Record<Idea, string> = {
  obvia: 'M5 4h14v17H5zM9 4V2h6v2M8 12h8M8 16h5',
  mescla: 'M12 4v16M5 8h14M5 8l-2 6h4zM19 8l-2 6h4zM8 20h8',
  ousada: 'M13 2 4 14h6l-1 8 9-12h-6z',
};

export interface ReuniaoProps {
  ideias: MeetingOptions;
  player: DecisionProps['player'];
  age: number;
  progress: number;
  scene: DecisionProps['scene'];
  anterior?: DecisionProps['anterior'];
  onChoose: (choice: string) => void;
}

function agradoText(a: Agrado) { return t(`ui.reuniao.agrado.${a}`); }

export function Reuniao({ ideias, player, age, progress, scene, anterior, onChoose }: ReuniaoProps) {
  const [picked, setPicked] = useState(null as Idea | null);
  const [career, setCareer] = useState(false);
  const opener = useRef(null as HTMLButtonElement | null);
  const title = useRef(null as HTMLHeadingElement | null);
  useEffect(() => { title.current?.focus(); }, []);
  // a gaveta "Minha carreira" fecha com Esc e devolve o foco à caixa do jogador, como na decisão
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !career) opener.current?.focus();
    wasOpen.current = career;
  }, [career]);
  useEffect(() => {
    if (!career) return undefined;
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setCareer(false); }
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); };
  }, [career]);
  const percent = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!picked) return;
    const { main, secondary } = ideias[picked].proposal;
    onChoose(`${main}|${secondary}`);
  }
  return (
    <main className="decisao reuniao" style={TRANSITION} data-tema="claro" data-evento="reuniao">
      {scene.pintada
        ? <CenaPintada {...scene.pintada} alt={scene.alt} inert={career} />
        : <img className="decisao__cena" src={scene.src} alt={scene.alt} width={SCENE_SIZE[0]} height={SCENE_SIZE[1]} inert={career} />}
      <div inert={career} className="faixa" role="progressbar" aria-label={t('ui.decisao.progresso')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-valuetext={t('ui.decisao.idade', { idade: age })}>
        <span className="faixa__feito" style={{ inlineSize: `${percent}%` }} />
      </div>
      <PlayerBox player={player} age={age} anterior={anterior} open={career} opener={opener} onOpen={() => { setCareer(true); }} inert={career} />
      <form className="decisao__painel vidro reuniao__painel" onSubmit={submit} inert={career} noValidate>
        <p className="reuniao__sala">{t('ui.reuniao.sala')}</p>
        <h1 className="decisao__titulo" ref={title} tabIndex={-1}>{t('ui.reuniao.titulo')}</h1>
        <p className="reuniao__fala"><strong>{t('ui.reuniao.treinador')}</strong> {t('ui.reuniao.fala', { nome: player.name })}</p>
        <div className="reuniao__ideias" role="radiogroup" aria-label={t('ui.reuniao.ideias')}>
          {IDEAS.map((id) => {
            const { proposal, agrado } = ideias[id];
            const names = { principal: focusName(proposal.main), secundario: focusName(proposal.secondary) };
            // a ideia óbvia vai sem dica de agrado e sem rótulo de sugestão (decisão do usuário, v2.53)
            const hint = id === 'obvia' ? null : agradoText(agrado);
            return (
              <label key={id} className={picked === id ? 'ideia ideia--marcada' : 'ideia'}>
                <input type="radio" name="ideia" className="sr-only" checked={picked === id} onChange={() => { setPicked(id); }} />
                <span className="ideia__icone" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2"><path d={ICON[id]} /></svg>
                  <span>{t(`ui.reuniao.ideia.${id}.nome`)}</span>
                </span>
                <span className="ideia__texto">
                  <span className="ideia__titulo">{t(`ui.reuniao.ideia.${id}.titulo`, names)}</span>
                  <span className="ideia__descricao">{t(`ui.reuniao.ideia.${id}.texto`)}</span>
                  {hint && <span className={`ideia__dica ideia__dica--${agrado}`}>{hint}</span>}
                </span>
              </label>
            );
          })}
        </div>
        <p className="reuniao__toque">{t('ui.reuniao.toque')}</p>
        <button type="submit" className="decisao__confirmar" disabled={picked === null}>{t('ui.reuniao.propor')}</button>
      </form>
      {career && <CareerDrawer player={player} onClose={() => { setCareer(false); }} />}
    </main>
  );
}

export { focusName };

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
