import { useState } from 'react';
import events from '../../data/events.json';
import legacy from '../../data/legacy.json';
import { CLUBS } from '../../engine/clubs';
import { temperamentsFor } from '../../engine/events';
import { previewOf, type Preview } from '../../engine/preview';
import { t } from '../../i18n';
import creation from '../../i18n/pt-BR/creation.json';
import tokens from '../theme/tokens.json';
import './Decision.css';

// T49 (amostra aprovada) e T51: uma decisão por tela, com a cena ao fundo. Só faixas e setas, nunca números de atributo.
export interface DecisionProps {
  eventId: string;
  age: number;
  /** Fração da carreira já vivida, de 0 a 1. */
  progress: number;
  scene: { src: string; alt: string };
  /** Quem decide. O overall aparece em número (SPEC v2.16); os atributos, um a um, seguem só em faixas e estrelas. */
  player: { name: string; position: string; clubId: string; overall: number; titles: string[] };
  /** Temperamento do jogador: a opção que combina com ele é marcada como "Seu jeito". */
  temperament?: string;
  onChoose?: (optionId: string) => void;
}

const TEMPERAMENTS = Object.keys(creation.temperament);

const ARROW = { sobe: 'M6 1 11 8H7.6v7H4.4V8H1z', desce: 'M6 15 1 8h3.4V1h3.2v7H11z', muda: 'M1 5.5 5 2v2.4h10v2.2H5V9zM15 10.5 11 14v-2.4H1V9.4h10V7z' };

function Arrows({ sentido, intensidade }: Pick<Preview, 'sentido' | 'intensidade'>) {
  const n = sentido === 'muda' ? 1 : intensidade;
  const w = sentido === 'muda' ? 16 : 12;
  return (
    <span className="previa__setas" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <svg key={i} viewBox={`0 0 ${w} 16`} width={w} height={16} focusable="false"><path d={ARROW[sentido]} fill="currentColor" /></svg>
      ))}
    </span>
  );
}

const TITLE_WEIGHT = legacy.titulos.pontos as Record<string, number>;
const clubOf = (id: string) => CLUBS.find((c) => c.id === id);
const metalOf = (id: string) => ((TITLE_WEIGHT[id] ?? 0) >= tokens.trofeu.ouroMin ? 'ouro' : (TITLE_WEIGHT[id] ?? 0) >= tokens.trofeu.prataMin ? 'prata' : 'bronze');

/** Títulos agrupados por competição, da mais pesada para a mais leve. */
function rankTitles(titles: string[]) {
  const counts: Record<string, number> = {};
  for (const id of titles) counts[id] = (counts[id] ?? 0) + 1;
  return Object.entries(counts).sort((a, b) => (TITLE_WEIGHT[b[0]] ?? 0) - (TITLE_WEIGHT[a[0]] ?? 0));
}

/** Escudo estilizado: só as duas cores e a sigla do clube, nunca o escudo oficial (SPEC 11). */
function Crest({ clubId }: { clubId: string }) {
  const club = clubOf(clubId);
  if (!club) return null;
  return (
    <svg className="escudo" viewBox="0 0 44 50" width="44" height="50" role="img" aria-label={t('ui.decisao.escudo', { clube: club.nome })}>
      <path d="M3 3h38v25c0 10-8 16-19 20C11 44 3 38 3 28z" fill={club.cores[0]} />
      <path d="M22 3h19v25c0 10-8 16-19 20z" fill={club.cores[1]} />
      <path d="M3 3h38v25c0 10-8 16-19 20C11 44 3 38 3 28z" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="22" y="27" textAnchor="middle" className="escudo__sigla">{club.sigla}</text>
    </svg>
  );
}

/** Um mini troféu por competição vencida; o balão só aparece quando há mais de um título dela. */
function Trophies({ titles }: { titles: string[] }) {
  const ranked = rankTitles(titles);
  if (!ranked.length) return null;
  return (
    <ul className="trofeus" aria-label={t('ui.decisao.titulosLista')}>
      {ranked.map(([id, n]) => (
        <li key={id} className={`trofeu trofeu--${metalOf(id)}`}>
          <svg
            viewBox="0 0 24 24" width="28" height="28" role="img" focusable="false"
            aria-label={n > 1 ? t('ui.decisao.trofeuVarios', { titulo: t(`ui.titulo.${id}`), n }) : t('ui.decisao.trofeu', { titulo: t(`ui.titulo.${id}`) })}
          >
            <path d="M7 3h10v2h3.5v3.2A4.3 4.3 0 0 1 16.6 12 5.2 5.2 0 0 1 13 14.4V17h3v4H8v-4h3v-2.6A5.2 5.2 0 0 1 7.4 12 4.3 4.3 0 0 1 3.5 8.2V5H7zm0 4H5.5v1.2c0 .9.6 1.7 1.5 2zm10 0v3.2c.9-.3 1.5-1.1 1.5-2V7z" fill="currentColor" />
          </svg>
          {n > 1 && <span className="trofeu__vezes" aria-hidden="true">{n}</span>}
        </li>
      ))}
    </ul>
  );
}

export function Decision({ eventId, age, progress, scene, player, temperament, onChoose }: DecisionProps) {
  const club = clubOf(player.clubId);
  const [chosen, setChosen] = useState<string | null>(null);
  const options = events.eventos.find((e) => e.id === eventId)?.opcoes ?? [];
  const percent = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  const text = hasText(eventId) ? t(`events.${eventId}.texto`) : null;

  return (
    <main className="decisao" data-tema="escuro">
      <img className="decisao__cena" src={scene.src} alt={scene.alt} />
      <div className="decisao__painel">
        <div
          className="faixa" role="progressbar" aria-label={t('ui.decisao.progresso')}
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-valuetext={t('ui.decisao.idade', { idade: age })}
        >
          <span className="faixa__feito" style={{ inlineSize: `${percent}%` }} />
        </div>
        <section className="jogador" aria-label={t('ui.decisao.jogador')}>
          <Crest clubId={player.clubId} />
          <div className="jogador__quem">
            <p className="jogador__nome">{player.name}</p>
            <p className="jogador__clube">{t('ui.decisao.clubePosicao', { posicao: t(`positions.${player.position}`), clube: club?.nome ?? '' })}</p>
          </div>
          <p className="jogador__over">
            <span className="jogador__over-rotulo">{t('ui.decisao.over')}</span>
            <span className="jogador__over-numero">{player.overall}</span>
          </p>
          <Trophies titles={player.titles} />
        </section>
        <header className="decisao__cabeca">
          <p className="decisao__idade" aria-hidden="true">
            <span className="decisao__numero">{age}</span>
            <span className="decisao__anos">{t('ui.decisao.anos')}</span>
          </p>
          <div className="decisao__texto">
            <h1>{t(`events.${eventId}.titulo`)}</h1>
            {text && <p>{text}</p>}
          </div>
        </header>
        <div className="decisao__opcoes" role="group" aria-label={t('ui.decisao.opcoes')}>
          {options.map((o) => {
            const preview = previewOf(eventId, o.id);
            const profiles = temperamentsFor(eventId, o.id, TEMPERAMENTS);
            const mine = !!temperament && profiles.includes(temperament);
            return (
              <button
                key={o.id} type="button" className="opcao" aria-pressed={chosen === o.id}
                onClick={() => { setChosen(o.id); onChoose?.(o.id); }}
              >
                {profiles.length > 0 && (
                  <span className={`opcao__perfil${mine ? ' opcao__perfil--meu' : ''}`}>
                    {t('ui.decisao.perfis', {
                      rotulo: t(mine ? 'ui.decisao.seuJeito' : 'ui.decisao.jeito'),
                      perfis: profiles.map((p) => t(`creation.temperament.${p}`)).join(' · '),
                    })}
                  </span>
                )}
                <span className="opcao__rotulo">{t(`events.${eventId}.opcoes.${o.id}`)}</span>
                <span className="opcao__previa">
                  {preview.length === 0 && <span className="previa">{t('ui.decisao.semPrevia')}</span>}
                  {preview.map((p) => (
                    <span key={p.campo} className={`previa previa--${p.sentido}`}>
                      <span>
                        {t(`preview.campo.${p.campo}`)}
                        <span className="sr-only">
                          {t('ui.decisao.previa', { sentido: t(`preview.sentido.${p.sentido}`), intensidade: p.sentido === 'muda' ? '' : t(`preview.intensidade.${p.intensidade}`) })}
                        </span>
                      </span>
                      <Arrows sentido={p.sentido} intensidade={p.intensidade} />
                    </span>
                  ))}
                </span>
                <svg className="opcao__seta" viewBox="0 0 10 16" width="10" height="16" aria-hidden="true" focusable="false">
                  <path d="M1.5 1.5 8 8l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function hasText(eventId: string): boolean {
  try { t(`events.${eventId}.texto`); return true; } catch { return false; }
}
