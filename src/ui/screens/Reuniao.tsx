import { useEffect, useRef, useState } from 'react';
import type { MeetingResult } from '../../engine/meeting';
import type { Agrado, Idea, MeetingOptions } from '../../engine/meetingOptions';
import previewCfg from '../../data/preview.json';
import { t } from '../../i18n';
import { useSaida } from '../useSaida';
import { seguirVars, useSeguirSozinho } from '../useSeguirSozinho';
import { Career as CareerDrawer, CenaFoto, PaginaCabecalho, PlayerBox, TRANSITION, type DecisionProps } from './Decision';
import '../folha.css';
import './Reuniao.css';

// T52d (SPEC 6.5, v2.53): reunião com a comissão em 3 ideias, no desenho aprovado: o card do jogador (o de sempre), a fala do
// treinador e três cartões selecionáveis (óbvia, mescla, ousada); "Propor ao técnico" só depois de escolher. Sem números.
const focusName = (f: string) => (f === 'bolaParada' || f === 'pernaRuim' ? t(`ui.reuniao.foco.${f}`) : t(`attributes.attribute.${f}`));
const IDEAS: Idea[] = ['obvia', 'mescla', 'ousada'];

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
  /** v2.61: 1 = balanço do fim da temporada e planejamento do ano; 2 = meio da temporada. */
  semestre: 1 | 2;
  scene: DecisionProps['scene'];
  anterior?: DecisionProps['anterior'];
  /** v2.81 (Álbum): a linha da página, como na decisão. */
  pagina?: DecisionProps['pagina'];
  onChoose: (choice: string) => void;
}

function agradoText(a: Agrado) { return t(`ui.reuniao.agrado.${a}`); }

export function Reuniao({ ideias, player, age, progress, semestre, scene, anterior, pagina, onChoose }: ReuniaoProps) {
  const [picked, setPicked] = useState(null as Idea | null);
  const [career, setCareer] = useState(false);
  // v2.87 (pedido do usuário em 2026-10-11, como a decisão na v2.82): tocar marca; a marcada vale sozinha em decideMs (2 s),
  // tocar de novo nela decide na hora. O botão "Propor ao técnico" saiu. Com a gaveta aberta, o tempo espera.
  const sent = useRef(false);
  const [enviada, setEnviada] = useState(false);
  function propor(id: Idea) {
    if (sent.current) return;
    sent.current = true;
    setEnviada(true);
    const { main, secondary } = ideias[id].proposal;
    onChoose(`${main}|${secondary}`);
  }
  function tocar(id: Idea) {
    if (picked === id) propor(id);
    else if (!sent.current) setPicked(id);
  }
  useEffect(() => {
    if (picked === null || enviada || career) return undefined;
    const id = picked;
    const timer = setTimeout(() => { propor(id); }, previewCfg.decideMs);
    return () => { clearTimeout(timer); };
  }, [picked, enviada, career]);
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
  return (
    <main className="decisao reuniao" style={REUNIAO_VARS} data-tema="claro" data-evento="reuniao">
      <PaginaCabecalho pagina={pagina} progress={progress} age={age} inert={career} />
      <PlayerBox player={player} age={age} anterior={anterior} open={career} opener={opener} onOpen={() => { setCareer(true); }} inert={career} />
      {/* v2.81 (Álbum): a cena é uma foto colada na página, embaixo do card do jogador */}
      <CenaFoto scene={scene} inert={career} />
      <form className="decisao__painel reuniao__painel" onSubmit={(e) => { e.preventDefault(); }} inert={career} noValidate>
        <p className="reuniao__sala">{t('ui.reuniao.sala')}</p>
        <h1 className="decisao__titulo" ref={title} tabIndex={-1}>{t('ui.reuniao.titulo')}</h1>
        <p className="reuniao__fala"><strong>{t('ui.reuniao.treinador')}</strong> <q className="fala">{t(`ui.reuniao.fala.${semestre}`, { nome: player.name })}</q></p>
        <div className="reuniao__ideias" role="radiogroup" aria-label={t('ui.reuniao.ideias')}>
          {IDEAS.map((id) => {
            const { proposal, agrado } = ideias[id];
            const names = { principal: focusName(proposal.main), secundario: focusName(proposal.secondary) };
            // a ideia óbvia vai sem dica de agrado e sem rótulo de sugestão (decisão do usuário, v2.53)
            const hint = id === 'obvia' ? null : agradoText(agrado);
            return (
              <label key={id} className={picked === id ? 'ideia ideia--marcada' : 'ideia'}>
                {/* o clique (toque, espaço ou setas) marca; na já marcada, decide */}
                <input type="radio" name="ideia" className="sr-only" checked={picked === id} disabled={enviada && picked !== id} onChange={() => {}} onClick={() => { tocar(id); }} />
                <span className="ideia__icone" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2"><path d={ICON[id]} /></svg>
                  <span>{t(`ui.reuniao.ideia.${id}.nome`)}</span>
                </span>
                <span className="ideia__texto">
                  <span className="ideia__titulo">{t(`ui.reuniao.ideia.${id}.titulo`, names)}</span>
                  <span className="ideia__descricao">{t(`ui.reuniao.ideia.${id}.texto`)}</span>
                  {hint && <span className={`ideia__dica ideia__dica--${agrado}`}>{hint}</span>}
                </span>
                {/* o tempo correndo até a marcada valer sozinha */}
                {picked === id && !enviada && <span className="ideia__prazo" aria-hidden="true" />}
              </label>
            );
          })}
        </div>
        <p className="reuniao__toque">{t('ui.reuniao.toque')}</p>
      </form>
      {career && <CareerDrawer player={player} onClose={() => { setCareer(false); }} />}
    </main>
  );
}

// v2.87: o tempo da barra da ideia marcada é o mesmo da decisão
const REUNIAO_VARS = { ...TRANSITION, '--decide-ms': `${previewCfg.decideMs}ms` } as React.CSSProperties;

export { focusName };

type Foco = string | undefined;
export type ReuniaoRespostaProps = {
  resposta: Pick<MeetingResult, 'response' | 'reason' | 'focus'>;
  /** v2.88: o que o jogador pediu (principal e apoio) e qual das 3 ideias era: decidem o carimbo e o "de → para". */
  pedido: { main: string; secondary: string }; ideia?: Idea;
  player: DecisionProps['player']; age: number; progress: number; pagina?: DecisionProps['pagina']; scene: DecisionProps['scene'];
  onDone: () => void;
};

/** Um foco do plano: o nome, o papel (principal ou apoio) e o jeito (fora: caiu do pedido; novo: o técnico trouxe; ok: combinado). */
function Chip({ foco, papel, jeito }: { foco: Foco; papel?: 'principal' | 'apoio'; jeito?: 'fora' | 'novo' | 'ok' }) {
  if (!foco) return null;
  return (
    <span className={jeito ? `plano__chip plano__chip--${jeito}` : 'plano__chip'}>
      {focusName(foco)}
      {papel && <small>{t(`ui.reuniao.resposta.plano.${papel}`)}</small>}
    </span>
  );
}

/** O quadro do plano: "Treino do semestre" quando aceita; "Você pediu" e "O técnico quer" na outra ideia; na recusa, o treino normal. */
function Plano({ resposta, pedido }: Pick<ReuniaoRespostaProps, 'resposta' | 'pedido'>) {
  const { response, focus } = resposta;
  const ficou = new Set<string | undefined>([focus.main, focus.secondary]);
  // o foco pedido que não ficou no plano sai riscado (na recusa, os dois)
  function fora(f: string) { return response === 'recusa' || !ficou.has(f) ? 'fora' as const : undefined; }
  return (
    <ul className={`plano plano--${response}`} aria-label={t('ui.reuniao.resposta.plano.titulo')}>
      {response === 'aceita' ? (
        <li><span className="plano__rotulo">{t('ui.reuniao.resposta.plano.treino')}</span>
          <span className="plano__chips"><Chip foco={focus.main} papel="principal" jeito="ok" /><Chip foco={focus.secondary} papel="apoio" jeito="ok" /></span></li>
      ) : (
        <>
          <li><span className="plano__rotulo">{t('ui.reuniao.resposta.plano.pediu')}</span>
            <span className="plano__chips"><Chip foco={pedido.main} jeito={fora(pedido.main)} /><Chip foco={pedido.secondary} jeito={fora(pedido.secondary)} /></span></li>
          {response === 'contrapropoe' ? (
            <li><span className="plano__rotulo">{t('ui.reuniao.resposta.plano.quer')}</span>
              <span className="plano__chips"><Chip foco={focus.main} papel="principal" jeito="novo" /><Chip foco={focus.secondary} papel="apoio" /></span></li>
          ) : (
            <li><span className="plano__rotulo">{t('ui.reuniao.resposta.plano.segue')}</span>
              <span className="plano__chips"><span className="plano__normal">{t('ui.reuniao.resposta.plano.normal')}</span></span></li>
          )}
        </>
      )}
    </ul>
  );
}

/** A resposta da comissão. v2.88 (pedido do usuário: a folha pequena "ficava muito escondida"): uma página do álbum, como o
 *  resultado da decisão: a linha da página, o card do jogador, a foto da sala com o carimbo e, no papel, o rótulo, o título,
 *  o texto e o quadro do plano. Carimbo (decisão do usuário): "TOPOU" quando a comissão aceita a ideia 2 ou 3 (a 1 é o plano
 *  do técnico); "RECUSOU" na recusa; nenhum na outra ideia. Sem "Seguir": fecha sozinha (resultadoMs quando aceita;
 *  respostaLongaMs quando o plano muda), dois toques passam, Enter, Espaço e Esc também. É um `div role="alertdialog"` (o
 *  `<dialog>` nativo travou no Safari do iPhone); o foco abre na página e o Tab fica nela. */
export function ReuniaoResposta({ resposta, pedido, ideia, player, age, progress, pagina, scene, onDone }: ReuniaoRespostaProps) {
  const page = useRef(null as HTMLDivElement | null);
  const done = useRef(false);
  function finish() {
    if (done.current) return;
    done.current = true;
    onDone();
  }
  // a página sai (150 ms) antes de seguir; Esc segue na hora
  const { saindo, fechar } = useSaida(finish);
  useEffect(() => { page.current?.focus({ preventScroll: true }); }, []);
  const { response, reason, focus } = resposta;
  const ms = response === 'aceita' ? previewCfg.resultadoMs : previewCfg.respostaLongaMs;
  const seguir = useSeguirSozinho(fechar, ms);
  const carimbo = response === 'recusa' ? 'recusou' : response === 'aceita' && ideia !== undefined && ideia !== 'obvia' ? 'topou' : null;
  const text = response === 'recusa'
    ? t(`ui.reuniao.resposta.recusa.${reason ?? 'score'}`)
    : t(`ui.reuniao.resposta.${response}.texto`, { principal: focusName(focus.main ?? ''), secundario: focusName(focus.secondary ?? '') });
  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { e.stopPropagation(); finish(); return; }
    if (e.key === 'Tab') { e.preventDefault(); page.current?.focus(); return; }
    seguir.onKeyDown(e);
  }
  return (
    <div
      ref={page} tabIndex={-1} style={seguirVars(ms)} className="decisao reuniao reuniao__resposta" data-tema="claro" data-resposta={response} data-saindo={saindo || undefined}
      role="alertdialog" aria-modal="true" aria-labelledby="reuniao-resposta-titulo" onKeyDown={onKey} onClick={seguir.onClick}
    >
      <PaginaCabecalho pagina={pagina} progress={progress} age={age} inert />
      <PlayerBox player={player} age={age} open={false} opener={{ current: null }} onOpen={() => {}} inert />
      <CenaFoto scene={scene} inert={false}>
        {carimbo && <span className={`decisao__carimbo resultado__veredito decisao__carimbo--${carimbo === 'topou' ? 'positivo' : 'negativo'}`} aria-hidden="true">{t(`ui.reuniao.resposta.carimbo.${carimbo}`)}</span>}
      </CenaFoto>
      <div className="decisao__painel reuniao__resposta-painel">
        <p className="reuniao__sala">{t('ui.reuniao.resposta.rotulo')}</p>
        <h2 id="reuniao-resposta-titulo" className="decisao__titulo">{t(`ui.reuniao.resposta.${response}.titulo`)}</h2>
        <p className="reuniao__resposta-texto">{text}</p>
        <Plano resposta={resposta} pedido={pedido} />
        <p className="reuniao__resposta-dica">{t('ui.resultado.dica')}</p>
        {/* o tempo correndo até a resposta fechar sozinha */}
        <span className="reuniao__resposta-prazo" aria-hidden="true" />
      </div>
    </div>
  );
}
