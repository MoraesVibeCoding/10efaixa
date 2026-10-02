import { useEffect, useRef, useState } from 'react';
import events from '../../data/events.json';
import legacy from '../../data/legacy.json';
import { toBand } from '../../engine/attributes';
import { CLUBS } from '../../engine/clubs';
import { applyOption, type Ctx } from '../../engine/events';
import { outcomeOf, outcomeVerdict, previewOf, type Outcome, type Preview } from '../../engine/preview';
import previewCfg from '../../data/preview.json';
import { t } from '../../i18n';
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
  player: {
    name: string; position: string; clubId: string; overall: number; titles: string[];
    /** Papel no elenco (titular, rodízio, reserva…): é o tempo de jogo que o jogador vê. */
    role: string;
    monthlySalary: { amount: number; currency: 'BRL' | 'EUR' };
  };
  /** Situação atual do jogador (moral, torcida, patrimônio…): o resultado da escolha mostra o ganho e a perda reais sobre ela. */
  state?: Ctx;
  onChoose?: (optionId: string) => void;
  /** Chamado quando o resultado fecha, sozinho ou pelo botão, com a situação já atualizada. */
  onContinue?: (optionId: string, state: Ctx) => void;
}

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
const money = (amount: number, currency: string) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency, notation: 'compact', maximumFractionDigits: 1 }).format(amount);
const MEDALS = tokens.medalha as unknown as Record<string, { nome: string }>;
const clubOf = (id: string) => CLUBS.find((c) => c.id === id);

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

/** A linha comporta cinco itens: cinco troféus, ou quatro e o contador do resto. */
function shownTitles(titles: string[]) {
  const all = rankTitles(titles);
  const ranked = all.length > 5 ? all.slice(0, 4) : all;
  let shown = 0;
  for (const [, count] of ranked) shown += count;
  return { ranked, rest: titles.length - shown };
}

/** Um mini troféu por competição vencida; o balão só aparece quando há mais de um título dela. */
function Trophies({ titles }: { titles: string[] }) {
  const { ranked, rest } = shownTitles(titles);
  if (!ranked.length) return null;
  return (
    <ul className="trofeus" aria-label={t('ui.decisao.titulosLista')}>
      {ranked.map(([id, n]) => (
        <li key={id} className="trofeu">
          <svg
            viewBox="0 0 24 24" width="30" height="30" role="img" focusable="false"
            aria-label={n > 1 ? t('ui.decisao.trofeuVarios', { titulo: t(`ui.titulo.${id}`), n }) : t('ui.decisao.trofeu', { titulo: t(`ui.titulo.${id}`) })}
          >
            <path d="M7 3h10v2h3.5v3.2A4.3 4.3 0 0 1 16.6 12 5.2 5.2 0 0 1 13 14.4V17h3v4H8v-4h3v-2.6A5.2 5.2 0 0 1 7.4 12 4.3 4.3 0 0 1 3.5 8.2V5H7zm0 4H5.5v1.2c0 .9.6 1.7 1.5 2zm10 0v3.2c.9-.3 1.5-1.1 1.5-2V7z" fill="currentColor" />
          </svg>
          {n > 1 && <span className="trofeu__vezes" aria-hidden="true">{t('ui.decisao.vezes', { n })}</span>}
        </li>
      ))}
      {rest > 0 && (
        <li className="trofeu trofeu--resto">
          <span aria-hidden="true">{t('ui.decisao.maisTitulos', { n: rest })}</span>
          <span className="sr-only">{t('ui.decisao.maisTitulosLeitor', { n: rest })}</span>
        </li>
      )}
    </ul>
  );
}

const SIGN = { up: '+', down: '−' };

function outcomeText(o: Outcome): string {
  const sinal = o.delta > 0 ? SIGN.up : SIGN.down;
  const abs = Math.abs(o.delta);
  if (o.unidade === 'dinheiro') return t('ui.resultado.dinheiro', { sinal, valor: money(abs, 'BRL') });
  if (o.unidade === 'porcento') return t('ui.resultado.porcento', { sinal, n: Math.round(abs * 100) });
  return t('ui.resultado.pontos', { sinal, n: Math.round(o.unidade === 'pontos100' ? abs * 100 : abs) });
}

/** O que a escolha rendeu de verdade, por cima da tela desfocada; fecha sozinho depois de um instante ou pelo botão. */
function Result({ eventId, optionId, state, onDone }: { eventId: string; optionId: string; state: Ctx; onDone: () => void }) {
  const outcome = outcomeOf(state, eventId, optionId);
  const verdict = outcomeVerdict(outcome);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    button.current?.focus();
    const timer = setTimeout(onDone, previewCfg.resultadoMs);
    return () => clearTimeout(timer);
  }, [onDone]);
  return (
    <div className="resultado">
      <div className={`resultado__caixa caixa resultado--${verdict}`} role="dialog" aria-modal="true" aria-label={t(`ui.resultado.${verdict}`)}>
        <p className="resultado__veredito" aria-hidden="true">{t(`ui.resultado.${verdict}`)}</p>
        <p className="resultado__escolha">{t(`events.${eventId}.opcoes.${optionId}`)}</p>
        {outcome.length === 0 && <p className="resultado__vazio">{t('ui.resultado.semEfeito')}</p>}
        {outcome.length > 0 && (
          <ul className="resultado__lista">
            {outcome.map((o) => (
              <li key={o.campo} className={o.delta > 0 ? 'resultado__ganho' : 'resultado__perda'}>
                <span>{t(`preview.campo.${o.campo}`)}</span>
                <strong>{outcomeText(o)}</strong>
              </li>
            ))}
          </ul>
        )}
        <button ref={button} type="button" className="resultado__seguir" onClick={onDone}>{t('ui.resultado.seguir')}</button>
      </div>
    </div>
  );
}

export function Decision({ eventId, age, progress, scene, player, state = {}, onChoose, onContinue }: DecisionProps) {
  const club = clubOf(player.clubId);
  const band = toBand(player.overall).key;
  const [chosen, setChosen] = useState<string | null>(null);
  // o resultado fecha uma vez só, venha do tempo ou do botão
  const done = useRef(false);
  const finish = useRef(() => {});
  finish.current = () => {
    if (done.current || chosen === null) return;
    done.current = true;
    onContinue?.(chosen, applyOption(state, eventId, chosen));
  };
  const [onDone] = useState(() => () => finish.current());
  const options = events.eventos.find((e) => e.id === eventId)?.opcoes ?? [];
  const percent = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  const text = hasText(eventId) ? t(`events.${eventId}.texto`) : null;

  return (
    <main className="decisao" data-tema="claro" data-resultado={chosen === null ? 'fechado' : 'aberto'}>
      <img className="decisao__cena" src={scene.src} alt={scene.alt} />
      <div
        className="faixa" role="progressbar" aria-label={t('ui.decisao.progresso')}
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-valuetext={t('ui.decisao.idade', { idade: age })}
      >
        <span className="faixa__feito" style={{ inlineSize: `${percent}%` }} />
      </div>
      <div className="decisao__painel">
        <section className="jogador caixa" aria-label={t('ui.decisao.jogador')}>
          <div className="jogador__topo">
            <Crest clubId={player.clubId} />
            <div className="jogador__quem">
              <p className="jogador__nome">{player.name}</p>
              <p className="jogador__clube">{t('ui.decisao.clubePosicao', { posicao: t(`positions.${player.position}`), clube: club?.nome ?? '' })}</p>
            </div>
            <p className="over" data-medalha={MEDALS[band]!.nome}>
              <span className="over__rotulo">
                {t('ui.decisao.over')}
                <span className="sr-only">{t('ui.decisao.faixaOver', { faixa: t(`attributes.band.${band}`) })}</span>
              </span>
              <span className="over__numero">{player.overall}</span>
            </p>
          </div>
          <dl className="ficha">
            <div>
              <dt>{t('ui.decisao.idadeRotulo')}</dt>
              <dd><span>{age}</span>&nbsp;{t('ui.decisao.anos')}</dd>
            </div>
            <div>
              <dt>{t('ui.decisao.tempoDeJogo')}</dt>
              <dd>{t(`ui.papel.${player.role}`)}</dd>
            </div>
            <div>
              <dt>{t('ui.decisao.salario')}</dt>
              <dd>{money(player.monthlySalary.amount, player.monthlySalary.currency)}</dd>
            </div>
          </dl>
          <div className="jogador__titulos">
            <p className="jogador__titulos-rotulo">{t('ui.decisao.titulosRotulo')}</p>
            {player.titles.length ? <Trophies titles={player.titles} /> : <p className="jogador__sem-titulos">{t('ui.decisao.nenhumTitulo')}</p>}
          </div>
        </section>
        <header className="decisao__cabeca">
          <h1>{t(`events.${eventId}.titulo`)}</h1>
          {text && <p className="decisao__historia">{text}</p>}
        </header>
        <div className="decisao__opcoes" role="group" aria-label={t('ui.decisao.opcoes')}>
          {options.map((o) => {
            const preview = previewOf(eventId, o.id);
            return (
              <button
                key={o.id} type="button" className="opcao" aria-pressed={chosen === o.id} disabled={chosen !== null && chosen !== o.id}
                onClick={() => { if (chosen === null) { setChosen(o.id); onChoose?.(o.id); } }}
              >
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
      {chosen !== null && <Result eventId={eventId} optionId={chosen} state={state} onDone={onDone} />}
    </main>
  );
}

function hasText(eventId: string): boolean {
  try { t(`events.${eventId}.texto`); return true; } catch { return false; }
}
