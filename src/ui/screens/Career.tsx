import { useEffect, useMemo, useRef, useState } from 'react';
import type { CareerResult, DecisionView } from '../../engine/career';
import { MEETING_EVENT } from '../../engine/meeting';
import type { CreationInput } from '../../engine/player';
import { t } from '../../i18n';
import { runUntilDecision } from '../../state/careerRun';
import { clubName } from './clubText';
import { careerProgress, semesterLines, toDecisionPlayer } from './careerView';
import { Decision } from './Decision';
import { Emblema } from './Emblema';
import { Historia } from './Historia';
import { Reuniao, ReuniaoResposta } from './Reuniao';
import type { Look } from './look';
import type { RitmoId } from './Ritmo';
import scene from '../../assets/amostra/assinatura-contrato.webp';
import './Career.css';

// T51 (b): a carreira jogada de verdade. Cada escolha entra na lista e o motor refaz a carreira até a próxima decisão
// (careerRun.ts). A cena ainda é a amostra da T49 até as cenas pintadas entrarem por evento (Frente 2).
export interface CareerProps {
  input: CreationInput; look: Look; /** Id do visual escolhido (v2.36). */ visual?: string; seed: number; onRestart: () => void;
  /** Ritmo escolhido depois da revelação (T53a): no Rápido um toque decide e o resultado fecha sozinho. */
  ritmo?: RitmoId;
  /** Escolhas já feitas (T54): ao continuar uma carreira salva, ela é refeita até a próxima decisão. */
  initialChoices?: string[];
  /** Chamado ao começar e a cada decisão (T54, salvar a cada decisão); `done` quando a carreira terminou. */
  onProgress?: (choices: string[], done: boolean) => void;
}

export function Career({ input, look, visual, seed, onRestart, ritmo = 'normal', initialChoices = [], onProgress }: CareerProps) {
  const [choices, setChoices] = useState(initialChoices);
  // T52: a reunião que o jogador acabou de fazer; a resposta dela aparece por cima da próxima tela
  const [asked, setAsked] = useState(null as { year: number; semestre: number } | null);
  // T51b: o semestre cujas frases o jogador já viu; a linha "Neste semestre" só aparece na primeira decisão depois dele
  const [seenSemester, setSeenSemester] = useState('');
  // T55b: no fim, "Sua história" vem antes do cartão
  const [showCard, setShowCard] = useState(false);
  const step = useMemo(() => runUntilDecision(input, seed, choices, ritmo), [input, seed, choices, ritmo]);
  const done = step.kind === 'done';
  useEffect(() => { onProgress?.(choices, done); }, [choices, done, onProgress]);
  const box = useRef(null as HTMLDivElement | null);
  // tela nova a cada decisão: o foco vai para o título, senão o leitor de tela fica perdido no corpo da página
  useEffect(() => {
    if (choices.length === 0) return;
    const h1 = box.current?.querySelector('h1');
    if (!h1) return;
    h1.tabIndex = -1;
    h1.focus();
  }, [choices.length, showCard]);

  if (step.kind === 'done') {
    return (
      <div ref={box} className="carreira">
        {showCard ? <CareerEnd result={step.result} onRestart={onRestart} /> : <Historia result={step.result} onContinue={() => { setShowCard(true); }} />}
      </div>
    );
  }
  const { view, eventId, index } = step;
  const semKey = view.ultimoSemestre ? `${view.ultimoSemestre.year}-${view.ultimoSemestre.semestre}` : '';
  const semestre = semKey !== seenSemester && view.ultimoSemestre ? semesterLines(view.ultimoSemestre.frases) : undefined;
  function decide(choice: string) {
    setSeenSemester(semKey);
    setChoices([...choices, choice]);
  }
  const resposta = answerOf(view.meetings, asked);
  const respostaEl = resposta ? <ReuniaoResposta key={`${asked!.year}-${asked!.semestre}`} resposta={resposta} onDone={() => { setAsked(null); }} /> : null;
  if (eventId === MEETING_EVENT) {
    return (
      <div ref={box} className="carreira" data-temperamento={view.temperament}>
        <Reuniao key={index} sugestao={String(view.state.sugestao)} onChoose={(choice) => {
          setAsked({ year: view.year, semestre: Number(view.state.semestre) });
          decide(choice);
        }} />
        {respostaEl}
      </div>
    );
  }
  const player = toDecisionPlayer(view, input, look, visual, eventId);
  const clube = view.clubId ? clubName(view.clubId).nome : t('ui.varzea');
  return (
    <div ref={box} className="carreira" data-temperamento={view.temperament} data-semestre={semKey}>
      <Decision
        key={index}
        eventId={eventId}
        age={Math.floor(view.age)}
        progress={careerProgress(view.age)}
        scene={{ src: scene, alt: t('scenes.alt.assinatura-contrato', { nome: input.name, clube }) }}
        player={player}
        state={view.state}
        ritmo={ritmo}
        semestre={semestre}
        onContinue={decide}
      />
      {respostaEl}
    </div>
  );
}

/** A resposta da reunião que o jogador acabou de fazer, no histórico de reuniões da carreira (T52). Função declarada:
 * o guarda do i18n lê "=>" seguido de JSX como texto solto. */
function answerOf(meetings: DecisionView['meetings'], asked: { year: number; semestre: number } | null) {
  if (!asked) return undefined;
  return meetings.find(function same(m) { return m.year === asked.year && m.semestre === asked.semestre; });
}

/** Clubes na ordem em que passou, sem repetir a passagem seguida (renovação, volta de empréstimo). */
function clubsOf(result: CareerResult) {
  const ids: string[] = [];
  for (const s of result.spells) if (ids.at(-1) !== s.clubId) ids.push(s.clubId);
  return ids;
}

function titleCounts(result: CareerResult) {
  const counts = new Map<string, number>();
  for (const x of result.titles) counts.set(x.competition, (counts.get(x.competition) ?? 0) + 1);
  return [...counts];
}

function CareerEnd({ result, onRestart }: { result: CareerResult; onRestart: () => void }) {
  const titles = titleCounts(result);
  return (
    <main className="fim" data-tema="claro">
      <h1 className="fim__titulo">{t('ui.fim.titulo')}</h1>
      <p className="fim__nome">{result.player.name}</p>
      <p className="fim__apelido">{t('ui.fim.apelido', { apelido: result.nickname })}</p>
      <section className="fim__bloco" aria-labelledby="fim-veredito">
        <h2 id="fim-veredito">{t('ui.fim.veredito')}</h2>
        <p className="fim__veredito">{t(`legacy.veredito.${result.legacy.verdict}`)}</p>
        <p className="fim__manchete">{result.headline}</p>
        <p>{result.comment}</p>
      </section>
      <section className="fim__bloco" aria-labelledby="fim-clubes">
        <h2 id="fim-clubes">{t('ui.fim.clubes')}</h2>
        <ul className="fim__lista">
          {clubsOf(result).map((id, i) => (
            <li key={`${id}-${i}`}><Emblema clubId={id} size={24} />{clubName(id).nome}</li>
          ))}
        </ul>
      </section>
      <section className="fim__bloco" aria-labelledby="fim-titulos">
        <h2 id="fim-titulos">{t('ui.fim.titulos')}</h2>
        {titles.length ? (
          <ul className="fim__lista">
            {titles.map(([id, n]) => <li key={id}>{t(`ui.titulo.${id}`)}{n > 1 && <strong>{t('ui.decisao.vezes', { n })}</strong>}</li>)}
          </ul>
        ) : <p>{t('ui.fim.nenhumTitulo')}</p>}
      </section>
      <button type="button" className="fim__nova" onClick={onRestart}>{t('ui.fim.novaCarreira')}</button>
    </main>
  );
}
