import { useEffect, useMemo, useRef, useState } from 'react';
import type { CareerResult } from '../../engine/career';
import type { CreationInput } from '../../engine/player';
import { t } from '../../i18n';
import { runUntilDecision } from '../../state/careerRun';
import { clubName } from './clubText';
import { careerProgress, toDecisionPlayer } from './careerView';
import { Decision } from './Decision';
import { Emblema } from './Emblema';
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
}

export function Career({ input, look, visual, seed, onRestart, ritmo = 'normal' }: CareerProps) {
  const [choices, setChoices] = useState([] as string[]);
  const step = useMemo(() => runUntilDecision(input, seed, choices), [input, seed, choices]);
  const box = useRef(null as HTMLDivElement | null);
  // tela nova a cada decisão: o foco vai para o título, senão o leitor de tela fica perdido no corpo da página
  useEffect(() => {
    if (choices.length === 0) return;
    const h1 = box.current?.querySelector('h1');
    if (!h1) return;
    h1.tabIndex = -1;
    h1.focus();
  }, [choices.length]);

  if (step.kind === 'done') return <div ref={box} className="carreira"><CareerEnd result={step.result} onRestart={onRestart} /></div>;
  const { view, eventId, index } = step;
  const player = toDecisionPlayer(view, input, look, visual, eventId);
  const clube = view.clubId ? clubName(view.clubId).nome : t('ui.varzea');
  return (
    <div ref={box} className="carreira" data-temperamento={view.temperament}>
      <Decision
        key={index}
        eventId={eventId}
        age={Math.floor(view.age)}
        progress={careerProgress(view.age)}
        scene={{ src: scene, alt: t('scenes.alt.assinatura-contrato', { nome: input.name, clube }) }}
        player={player}
        state={view.state}
        ritmo={ritmo}
        onContinue={(choice) => setChoices([...choices, choice])}
      />
    </div>
  );
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
