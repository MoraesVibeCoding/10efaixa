import { useEffect, useRef, useState } from 'react';
import events from '../../data/events.json';
import legacy from '../../data/legacy.json';
import album from '../../data/album.json';
import type { AvatarSpec } from '../../art/avatar';
import trophyArt from '../../data/trophyArt.json';
import { ATTRIBUTES, toBand, type Attributes } from '../../engine/attributes';
import bands from '../../data/bands.json';
import { applyOption, type Ctx } from '../../engine/events';
import { outcomeOf, outcomeVerdict, previewOf, riskOf, RISK_BANDS, timeOutOf, type Outcome, type Preview, type Risk } from '../../engine/preview';
import previewCfg from '../../data/preview.json';
import { t } from '../../i18n';
import { clubName } from './clubText';
import { Emblema } from './Emblema';
import { Figurinha } from './Figurinha';
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
    /** Valor de mercado em euros (v2.33): não é atributo, então aparece em número. */
    marketValueEUR?: number;
    /** Temporadas já fechadas, da mais antiga para a mais recente: a trajetória da gaveta "Minha carreira". */
    seasons?: Season[];
    /** Atributos de agora. Na gaveta aparecem só em faixa (palavra e barra), nunca em número. */
    attributes?: Attributes;
    /** Número da camisa e aparência: a figurinha (v2.26). */
    number?: number;
    avatar?: AvatarSpec;
    /** Id do visual escolhido na criação (v2.36): a figurinha usa o retrato pintado dele. */
    visual?: string;
    /** Marcos já alcançados ("selecao", "camisa10"): saem dos espaços vazios do álbum. */
    milestones?: string[];
  };
  /** Situação atual do jogador (moral, torcida, patrimônio…): o resultado da escolha mostra o ganho e a perda reais sobre ela. */
  state?: Ctx;
  /** Ritmo da carreira (T49b): no normal o resultado espera o jogador; no rápido segue sozinho depois de `resultadoMs`. */
  ritmo?: 'normal' | 'rapido';
  onChoose?: (optionId: string) => void;
  /** Chamado quando o resultado fecha, sozinho ou pelo botão, com a situação já atualizada. */
  onContinue?: (optionId: string, state: Ctx) => void;
}

interface Season { age: number; clubId: string; overall: number }

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
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency, notation: 'compact', minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(amount);

/** Títulos agrupados por competição, da mais pesada para a mais leve. */
function rankTitles(titles: string[]) {
  const counts: Record<string, number> = {};
  for (const id of titles) counts[id] = (counts[id] ?? 0) + 1;
  return Object.entries(counts).sort((a, b) => (TITLE_WEIGHT[b[0]] ?? 0) - (TITLE_WEIGHT[a[0]] ?? 0));
}

// troféu de cada competição (provisório até o lote 5); sem peça, o ícone genérico abaixo
const TROPHY_FILES = import.meta.glob('../../assets/art/provisoria/detalhe/detalhe__trofeu-*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const trophySrc = (id: string) => {
  const piece = (trophyArt.pecas as Record<string, string>)[id];
  return piece ? TROPHY_FILES[`../../assets/art/provisoria/detalhe/detalhe__trofeu-${piece}.svg`] : undefined;
};

const TROPHY = 'M7 3h10v2h3.5v3.2A4.3 4.3 0 0 1 16.6 12 5.2 5.2 0 0 1 13 14.4V17h3v4H8v-4h3v-2.6A5.2 5.2 0 0 1 7.4 12 4.3 4.3 0 0 1 3.5 8.2V5H7zm0 4H5.5v1.2c0 .9.6 1.7 1.5 2zm10 0v3.2c.9-.3 1.5-1.1 1.5-2V7z';

/** Imagem decorativa: o nome da competição vem escrito ao lado. */
function TrophyIcon({ id }: { id: string }) {
  const src = trophySrc(id);
  return src
    ? <img className="trofeu__arte" src={src} alt="" width="32" height="32" />
    : <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d={TROPHY} fill="currentColor" /></svg>;
}

/** Uma etiqueta por competição vencida, com o nome; o ×N só aparece quando há mais de um título dela. */
function Trophies({ titles }: { titles: string[] }) {
  return (
    <ul className="trofeus" aria-label={t('ui.decisao.titulosLista')}>
      {rankTitles(titles).map(([id, n]) => (
        <li key={id} className="trofeu">
          <TrophyIcon id={id} />
          <span>{t(`ui.titulo.${id}`)}</span>
          {n > 1 && <strong>{t('ui.decisao.vezes', { n })}</strong>}
        </li>
      ))}
    </ul>
  );
}

const BAND_KEYS = bands.map((b) => { return b.key; });

/** Os dez atributos em faixa: a palavra e uma barra de seis degraus, um por faixa. Nenhum número (SPEC 6.3). */
function Levels({ attributes }: { attributes: Attributes }) {
  return (
    <ul className="niveis" aria-labelledby="gaveta-atributos">
      {ATTRIBUTES.map((id) => {
        const band = toBand(attributes[id]).key;
        const filled = BAND_KEYS.indexOf(band) + 1;
        return (
          <li key={id}>
            <span className="niveis__nome">{t(`attributes.attribute.${id}`)}</span>
            <span className="niveis__faixa">{t(`attributes.band.${band}`)}</span>
            <span className="nivel" aria-hidden="true">
              {bands.map((b, i) => <i key={b.key} data-cheio={i < filled ? '' : undefined} />)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

const GOALS = album.metas as { id: string; titulo?: string; marco?: string }[];

/** Metas do álbum ainda não alcançadas: nem o título conquistado, nem o marco da carreira. */
function missingGoals(titles: string[], milestones: string[]) {
  return GOALS.filter((g) => {
    const won = g.titulo ? titles.includes(g.titulo) : false;
    const reached = g.marco ? milestones.includes(g.marco) : false;
    return !won && !reached;
  });
}

/** Álbum da carreira (v2.26): as conquistas em cromo e, tracejadas, as metas que ainda faltam. */
function Album({ titles, milestones }: { titles: string[]; milestones: string[] }) {
  const missing = missingGoals(titles, milestones);
  return (
    <section className="album" aria-labelledby="album-titulo">
      <h2 id="album-titulo">{t('ui.album.titulo')}</h2>
      <ul className="album__cromos" aria-label={t('ui.album.conquistas')}>
        {rankTitles(titles).map(([id, n]) => (
          <li key={id} className="album__cromo">
            <TrophyIcon id={id} />
            <span>{t(`ui.titulo.${id}`)}</span>
            {n > 1 && <strong>{t('ui.decisao.vezes', { n })}</strong>}
          </li>
        ))}
      </ul>
      <ul className="album__cromos" aria-label={t('ui.album.faltam')}>
        {missing.map((g) => <li key={g.id} className="album__vazio">{t(`ui.album.meta.${g.id}`)}</li>)}
      </ul>
    </section>
  );
}

function recentFirst(seasons: Season[]) {
  return [...seasons].reverse();
}

/** Gaveta "Minha carreira" (SPEC v2.21): o que saiu da tela de decisão para ela caber no celular. Fecha pelo botão, por Esc ou tocando fora. */
function Career({ player, onClose }: { player: DecisionProps['player']; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => { close.current?.focus(); }, []);
  const seasons = recentFirst(player.seasons ?? []);
  return (
    <div className="gaveta" onClick={onClose}>
      <div
        className="gaveta__folha" role="dialog" aria-modal="true" aria-labelledby="gaveta-titulo"
        onClick={(e) => { e.stopPropagation(); }}
      >
        <header className="gaveta__topo">
          <h2 id="gaveta-titulo">{t('ui.carreira.titulo')}</h2>
          <button ref={close} type="button" className="gaveta__fechar" aria-label={t('ui.carreira.fechar')} onClick={onClose}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M2 2l12 12M14 2 2 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" /></svg>
          </button>
        </header>
        {player.attributes && (
          <section className="gaveta__bloco">
            <h3 id="gaveta-atributos">{t('ui.carreira.atributos')}</h3>
            <Levels attributes={player.attributes} />
          </section>
        )}
        <section className="gaveta__bloco">
          <h3>{t('ui.carreira.titulos')}</h3>
          {player.titles.length ? <Trophies titles={player.titles} /> : <p className="gaveta__vazio">{t('ui.decisao.nenhumTitulo')}</p>}
        </section>
        <section className="gaveta__bloco">
          <h3 id="gaveta-trajetoria">{t('ui.carreira.trajetoria')}</h3>
          {seasons.length === 0 && <p className="gaveta__vazio">{t('ui.carreira.semTrajetoria')}</p>}
          {seasons.length > 0 && (
            <table className="trajetoria" aria-labelledby="gaveta-trajetoria">
              <thead>
                <tr>
                  <th scope="col">{t('ui.carreira.colIdade')}</th>
                  <th scope="col">{t('ui.carreira.colClube')}</th>
                  <th scope="col">{t('ui.carreira.colOver')}</th>
                </tr>
              </thead>
              <tbody>
                {seasons.map((s) => (
                  <tr key={s.age}>
                    <td>{s.age}</td>
                    <td><span className="trajetoria__clube"><Emblema clubId={s.clubId} size={20} />{clubName(s.clubId).nome}</span></td>
                    <td>{s.overall}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}

// as cenas são pintadas em 4:5 (docs/briefing-arte.md); largura e altura reservam o espaço antes de a imagem chegar
const SCENE_SIZE = [1856, 2304] as const;

/** Tarja de risco da opção: a faixa em palavras e um medidor de 4 segmentos num tom só (o medidor repete o texto, por isso fica oculto ao leitor de tela). */
function RiskBanner({ risk }: { risk: Risk }) {
  const lit = RISK_BANDS.indexOf(risk.faixa) + 1;
  return (
    <span className="opcao__risco">
      {t('ui.risco.tarja', { tipo: t(`ui.risco.tipo.${risk.tipo}`), faixa: t(`ui.risco.${risk.faixa}`) })}
      <span className="medidor" aria-hidden="true">
        {RISK_BANDS.map((b, i) => <s key={b} data-cheio={i < lit ? '' : undefined} />)}
      </span>
    </span>
  );
}

/** Tempo fora de campo em palavras: semestres viram meses, e 12 meses viram um ano. */
function timeOutText(semesters: number): string {
  const months = Math.round(semesters * 6);
  if (months % 12 !== 0) return t('ui.fora.meses', { n: months });
  return months === 12 ? t('ui.fora.ano') : t('ui.fora.anos', { n: months / 12 });
}

const SENSES = [['sobe', 'ganha'], ['desce', 'emTroca'], ['muda', 'muda']] as const;

/** Em todo campo, subir é ganho e descer é custo (engine/preview): a prévia sai em linhas, uma por sentido que a opção tem. */
function previewLines(preview: Preview[]) {
  const lines: { sentido: string; rotulo: string; itens: Preview[] }[] = [];
  for (const [sentido, rotulo] of SENSES) {
    const itens = preview.filter((p) => p.sentido === sentido);
    if (itens.length) lines.push({ sentido, rotulo, itens });
  }
  return lines;
}

const SIGN = { up: '+', down: '−' };

function outcomeText(o: Outcome): string {
  const sinal = o.delta > 0 ? SIGN.up : SIGN.down;
  const abs = Math.abs(o.delta);
  if (o.unidade === 'dinheiro') return t('ui.resultado.dinheiro', { sinal, valor: money(abs, 'BRL') });
  if (o.unidade === 'porcento') return t('ui.resultado.porcento', { sinal, n: Math.round(abs * 100) });
  return t('ui.resultado.pontos', { sinal, n: Math.round(o.unidade === 'pontos100' ? abs * 100 : abs) });
}

/** O que a escolha rendeu de verdade, por cima da tela desfocada; fecha pelo botão ou Esc e, no ritmo Rápido, sozinho depois de um instante. */
function Result({ eventId, optionId, state, auto, onDone }: { eventId: string; optionId: string; state: Ctx; auto: boolean; onDone: () => void }) {
  const outcome = outcomeOf(state, eventId, optionId);
  const verdict = outcomeVerdict(outcome);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    button.current?.focus();
    if (!auto) return undefined;
    const timer = setTimeout(onDone, previewCfg.resultadoMs);
    return () => clearTimeout(timer);
  }, [onDone, auto]);
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

export function Decision({ eventId, age, progress, scene, player, state = {}, ritmo = 'normal', onChoose, onContinue }: DecisionProps) {
  const [career, setCareer] = useState(false);
  // sem genérico aqui: a guarda de texto fora do i18n confunde o genérico com JSX
  const opener = useRef(null as HTMLButtonElement | null);
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
  // gaveta ou resultado abertos: o resto da tela fica inerte e o Esc vale de qualquer ponto (T49b)
  const overlay = career || chosen !== null;
  // o foco volta para a caixa do jogador só depois que o painel deixou de ser inerte: o navegador recusa foco em inerte
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !career) opener.current?.focus();
    wasOpen.current = career;
  }, [career]);
  useEffect(() => {
    if (!overlay) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (career) setCareer(false);
      else onDone();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [overlay, career, onDone]);

  return (
    <main className="decisao" data-tema="claro" data-evento={eventId} data-resultado={chosen === null ? 'fechado' : 'aberto'}>
      <img className="decisao__cena" src={scene.src} alt={scene.alt} width={SCENE_SIZE[0]} height={SCENE_SIZE[1]} fetchPriority="high" inert={overlay} />
      <div
        inert={overlay} className="faixa" role="progressbar" aria-label={t('ui.decisao.progresso')}
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-valuetext={t('ui.decisao.idade', { idade: age })}
      >
        <span className="faixa__feito" style={{ inlineSize: `${percent}%` }} />
      </div>
      <div className="decisao__painel" inert={overlay}>
        <button ref={opener} type="button" className="jogador__abrir" aria-haspopup="dialog" aria-expanded={career} onClick={() => { setCareer(true); }}>
          <Figurinha name={player.name} number={player.number} overall={player.overall} position={player.position} clubId={player.clubId} avatar={player.avatar} visual={player.visual} />
          <span className="jogador__mais">
            {t('ui.carreira.titulo')}
            <svg viewBox="0 0 10 16" width="7" height="11" aria-hidden="true" focusable="false">
              <path d="M1.5 1.5 8 8l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
            </svg>
          </span>
        </button>
        <h1 className="decisao__titulo">{t(`events.${eventId}.titulo`)}</h1>
        <ul className="selos" aria-label={t('ui.decisao.ficha')}>
          <li>{t('ui.decisao.idade', { idade: age })}</li>
          <li>{t(`ui.papel.${player.role}`)}</li>
          <li>{t('ui.decisao.porMes', { valor: money(player.monthlySalary.amount, player.monthlySalary.currency) })}</li>
          {player.marketValueEUR === undefined ? null : <li>{t('ui.decisao.valor', { valor: money(player.marketValueEUR, 'EUR') })}</li>}
        </ul>
        {text && <p className="decisao__historia">{text}</p>}
        <div className="decisao__opcoes" role="group" aria-label={t('ui.decisao.opcoes')}>
          {options.map((o) => {
            const preview = previewOf(eventId, o.id);
            const risk = riskOf(eventId, o.id);
            const out = timeOutOf(eventId, o.id);
            return (
              <button
                key={o.id} type="button" className="opcao" data-opcao-id={o.id} aria-pressed={chosen === o.id} disabled={chosen !== null && chosen !== o.id}
                onClick={() => { if (chosen === null) { setChosen(o.id); onChoose?.(o.id); } }}
              >
                {risk && <RiskBanner risk={risk} />}
                <span className="opcao__rotulo">{t(`events.${eventId}.opcoes.${o.id}`)}</span>
                <span className="opcao__previa">
                  {preview.length === 0 && out === null && <span className="previa">{t('ui.decisao.semPrevia')}</span>}
                  {previewLines(preview).map((line) => (
                    <span key={line.sentido} className={`previa__linha previa--${line.sentido}`}>
                      <span className="previa__rotulo">{t(`ui.decisao.${line.rotulo}`)}</span>
                      <span className="previa__itens">
                      {line.itens.map((p) => (
                        <span key={p.campo} className="previa">
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
                    </span>
                  ))}
                  {out !== null && <span className="opcao__fora">{timeOutText(out)}</span>}
                </span>
              </button>
            );
          })}
        </div>
        <Album titles={player.titles} milestones={player.milestones ?? []} />
      </div>
      {career && <Career player={player} onClose={() => { setCareer(false); }} />}
      {chosen !== null && <Result eventId={eventId} optionId={chosen} state={state} auto={ritmo === 'rapido'} onDone={onDone} />}
    </main>
  );
}

function hasText(eventId: string): boolean {
  try { t(`events.${eventId}.texto`); return true; } catch { return false; }
}
