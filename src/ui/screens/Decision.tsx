import { useState } from 'react';
import events from '../../data/events.json';
import legacy from '../../data/legacy.json';
import { toBand } from '../../engine/attributes';
import { CLUBS } from '../../engine/clubs';
import { temperamentsFor } from '../../engine/events';
import { previewOf, type Preview } from '../../engine/preview';
import { t } from '../../i18n';
import creation from '../../i18n/pt-BR/creation.json';
import './Decision.css';

// T49 (amostra aprovada) e T51: uma decisão por tela, com a cena ao fundo. Só faixas e setas, nunca números de atributo.
export interface DecisionProps {
  eventId: string;
  age: number;
  /** Fração da carreira já vivida, de 0 a 1. */
  progress: number;
  scene: { src: string; alt: string };
  /** Quem decide: o nível entra como número, mas só estrelas e faixa vão para a tela (SPEC: nenhum número de atributo antes do cartão). */
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

const STAR = 'M8 .8 10.2 5.6l5.2.6-3.9 3.6 1.1 5.2L8 12.4 3.4 15l1.1-5.2L.6 6.2l5.2-.6z';
const TITLE_WEIGHT = legacy.titulos.pontos as Record<string, number>;

function Stars({ value, label }: { value: number; label: string }) {
  return (
    <span className="estrelas" role="img" aria-label={label}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 16 16" width="16" height="16" focusable="false">
          <path d={STAR} className="estrelas__vazia" />
          <path d={STAR} className="estrelas__cheia" style={{ clipPath: `inset(0 ${100 - Math.min(1, Math.max(0, value - i)) * 100}% 0 0)` }} />
        </svg>
      ))}
    </span>
  );
}

/** Escudo estilizado: só as duas cores e a sigla do clube, nunca o escudo oficial (SPEC 11). */
function Crest({ clubId }: { clubId: string }) {
  const club = CLUBS.find((c) => c.id === clubId);
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

function Trophies({ titles }: { titles: string[] }) {
  const counts = new Map<string, number>();
  for (const id of titles) counts.set(id, (counts.get(id) ?? 0) + 1);
  const ranked = [...counts].sort((a, b) => (TITLE_WEIGHT[b[0]] ?? 0) - (TITLE_WEIGHT[a[0]] ?? 0));
  const shown = ranked.slice(0, 3);
  const hidden = ranked.slice(3).reduce((n, [, c]) => n + c, 0);
  return (
    <p className="trofeus">
      <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true" focusable="false">
        <path d="M5 2h8v5a4 4 0 0 1-8 0zM5 3.5H2.2V5A2.8 2.8 0 0 0 5 7.8M13 3.5h2.8V5A2.8 2.8 0 0 1 13 7.8M9 11v3M5.5 16h7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
      </svg>
      <strong>{titles.length === 0 ? t('ui.decisao.semTitulos') : titles.length === 1 ? t('ui.decisao.umTitulo') : t('ui.decisao.titulos', { n: titles.length })}</strong>
      {shown.map(([id, n]) => <span key={id}>{n > 1 ? `${t(`ui.titulo.${id}`)} ×${n}` : t(`ui.titulo.${id}`)}</span>)}
      {hidden > 0 && <span>{t('ui.decisao.maisTitulos', { n: hidden })}</span>}
    </p>
  );
}

export function Decision({ eventId, age, progress, scene, player, temperament, onChoose }: DecisionProps) {
  const band = toBand(player.overall);
  const club = CLUBS.find((c) => c.id === player.clubId);
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
          <div className="jogador__nivel">
            <Stars value={band.stars} label={t('ui.decisao.nivel', { faixa: t(`attributes.band.${band.key}`) })} />
            <span aria-hidden="true">{t(`attributes.band.${band.key}`)}</span>
          </div>
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
