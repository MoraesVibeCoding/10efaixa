import { useEffect, useMemo, useRef, useState } from 'react';
import type { DecisionView } from '../../engine/career';
import { careerCode } from '../../engine/careerCode';
import { MEETING_EVENT } from '../../engine/meeting';
import type { CreationInput } from '../../engine/player';
import { t } from '../../i18n';
import { runUntilDecision } from '../../state/careerRun';
import { clubName } from './clubText';
import { careerProgress, semesterLines, toDecisionPlayer } from './careerView';
import { cutForVisual } from './cenaArte';
import { Decision, type Anterior } from './Decision';
import { momentsBetween } from './moments';
import events from '../../data/events.json';
import { Cartao } from './Cartao';
import { LinhaDoTempo } from './LinhaDoTempo';
import { PROPOSAL_EVENT } from '../../engine/proposals';
import { Propostas } from './Propostas';
import { Reuniao, ReuniaoResposta } from './Reuniao';
import type { Look } from './look';
import type { RitmoId } from './Ritmo';
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
  /** Dia "AAAA-MM-DD" do desafio do dia (T57c); vai para o selo do cartão. */
  desafio?: string;
}

export function Career({ input, look, visual, seed, onRestart, ritmo = 'normal', initialChoices = [], onProgress, desafio }: CareerProps) {
  const [choices, setChoices] = useState(initialChoices);
  // T52: a reunião que o jogador acabou de fazer; a resposta dela aparece por cima da próxima tela
  const [asked, setAsked] = useState(null as { year: number; semestre: number } | null);
  // T51b: o semestre cujas frases o jogador já viu; a linha "Neste semestre" só aparece na primeira decisão depois dele
  const [seenSemester, setSeenSemester] = useState('');
  // T55b: no fim, "Sua história" vem antes do cartão
  const [showCard, setShowCard] = useState(false);
  // v2.47: os números da última decisão; na próxima, o overall, a idade e o valor rolam deles
  const [anterior, setAnterior] = useState(undefined as (Anterior & Pick<DecisionView, 'titles' | 'seasons'>) | undefined);
  const step = useMemo(() => runUntilDecision(input, seed, choices, ritmo), [input, seed, choices, ritmo]);
  const done = step.kind === 'done';
  // v2.47: título, acesso e rebaixamento desde a última decisão viram carimbo
  const momentos = useMemo(() => (step.kind === 'done' ? [] : momentsBetween(anterior, step.view)), [anterior, step]);
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
    const code = careerCode({ seed, ritmo, input, choices });
    // T57e: o link refaz esta carreira; o codec descarta nome e apelido
    const link = { seed, ritmo, input, visual: visual ?? '', choices, codigo: code, ...(desafio === undefined ? {} : { desafio }) };
    return (
      <div ref={box} className="carreira">
        {showCard ? <Cartao result={step.result} code={code} visual={visual} desafio={desafio} link={visual === undefined ? undefined : link} onRestart={onRestart} /> : <LinhaDoTempo result={step.result} onContinue={() => { setShowCard(true); }} />}
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
  if (eventId === MEETING_EVENT && view.reuniao) {
    // T52d: reunião em 3 ideias, no desenho da decisão (cena da sala de reuniões e o card do jogador de sempre)
    const meetingPlayer = toDecisionPlayer(view, input, look, visual, eventId);
    const meetingClub = view.clubId ? clubName(view.clubId).nome : t('ui.varzea');
    return (
      <div ref={box} className="carreira" data-temperamento={view.temperament}>
        <Reuniao
          key={index} ideias={view.reuniao} player={meetingPlayer} age={Math.floor(view.age)} progress={careerProgress(view.age)} anterior={anterior}
          scene={sceneOfCena('reuniao-comissao', meetingPlayer, visual, input.name, meetingClub)}
          onChoose={(choice) => {
            setAsked({ year: view.year, semestre: Number(view.state.semestre) });
            decide(choice);
          }}
        />
        {respostaEl}
      </div>
    );
  }
  if (eventId === PROPOSAL_EVENT) {
    // T28d: propostas de clube; sem clube atual (contrato rescindido) não há "Ficar"
    return (
      <div ref={box} className="carreira" data-temperamento={view.temperament}>
        <Propostas key={index} propostas={view.propostas ?? []} podeFicar={view.state.podeFicar === true} podeForcar={view.state.podeForcar === true} onChoose={decide} />
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
        scene={sceneFor(eventId, player, visual, input.name, clube)}
        player={player}
        state={view.state}
        ritmo={ritmo}
        semestre={semestre}
        anterior={anterior}
        momentos={momentos}
        onContinue={(choice) => {
          setAnterior({ overall: player.overall, age: Math.floor(view.age), marketValueEUR: player.marketValueEUR, titles: view.titles, seasons: view.seasons });
          decide(choice);
        }}
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

/** T60a: a cena pintada do evento, no corte de cabelo do visual, com o uniforme da vez (clube ou seleção) e o número. */
function sceneFor(eventId: string, player: ReturnType<typeof toDecisionPlayer>, visual: string | undefined, nome: string, clube: string) {
  const cena = events.eventos.find(function byId(e) { return e.id === eventId; })?.cena ?? 'assinatura-contrato';
  return sceneOfCena(cena, player, visual, nome, clube);
}

function sceneOfCena(cena: string, player: ReturnType<typeof toDecisionPlayer>, visual: string | undefined, nome: string, clube: string) {
  return {
    alt: t(`scenes.alt.${cena}`, { nome, clube }),
    pintada: { scene: cena, cut: cutForVisual(visual), clubId: player.uniforme ?? player.clubId, number: player.number },
  };
}
