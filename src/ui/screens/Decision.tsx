import { useEffect, useRef, useState } from 'react';
import events from '../../data/events.json';
import legacy from '../../data/legacy.json';
import trophyArt from '../../data/trophyArt.json';
import { ATTRIBUTES, toBand, type Attributes } from '../../engine/attributes';
import bands from '../../data/bands.json';
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
    /** Temporadas já fechadas, da mais antiga para a mais recente: a trajetória da gaveta "Minha carreira". */
    seasons?: Season[];
    /** Atributos de agora. Na gaveta aparecem só em faixa (palavra e barra), nunca em número. */
    attributes?: Attributes;
  };
  /** Situação atual do jogador (moral, torcida, patrimônio…): o resultado da escolha mostra o ganho e a perda reais sobre ela. */
  state?: Ctx;
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
const MEDALS = tokens.medalha as unknown as Record<string, { nome: string }>;
// arte pintada de cada cartão (docs/arte/cartoes-over); sem a imagem, vale o degradê dos tokens
const CARD_ART = import.meta.glob('../../assets/cartoes-over/*.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const cardArt = (medal: string) => CARD_ART[`../../assets/cartoes-over/${medal}.webp`];
const clubOf = (id: string) => CLUBS.find((c) => c.id === id);

/** Títulos agrupados por competição, da mais pesada para a mais leve. */
function rankTitles(titles: string[]) {
  const counts: Record<string, number> = {};
  for (const id of titles) counts[id] = (counts[id] ?? 0) + 1;
  return Object.entries(counts).sort((a, b) => (TITLE_WEIGHT[b[0]] ?? 0) - (TITLE_WEIGHT[a[0]] ?? 0));
}

/** Escudo estilizado: só as duas cores e a sigla do clube, nunca o escudo oficial (SPEC 11). */
function Crest({ clubId, small = false }: { clubId: string; small?: boolean }) {
  const club = clubOf(clubId);
  if (!club) return null;
  // na trajetória o nome do clube vem escrito ao lado: o escudo pequeno é só cor
  if (small) {
    return (
    <svg className="escudo" viewBox="0 0 44 50" width="18" height="20" aria-hidden="true" focusable="false">
      <path d="M3 3h38v25c0 10-8 16-19 20C11 44 3 38 3 28z" fill={club.cores[0]} />
      <path d="M22 3h19v25c0 10-8 16-19 20z" fill={club.cores[1]} />
      <path d="M3 3h38v25c0 10-8 16-19 20C11 44 3 38 3 28z" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
    );
  }
  return (
    <svg className="escudo" viewBox="0 0 44 50" width="44" height="50" role="img" aria-label={t('ui.decisao.escudo', { clube: club.nome })}>
      <path d="M3 3h38v25c0 10-8 16-19 20C11 44 3 38 3 28z" fill={club.cores[0]} />
      <path d="M22 3h19v25c0 10-8 16-19 20z" fill={club.cores[1]} />
      <path d="M3 3h38v25c0 10-8 16-19 20C11 44 3 38 3 28z" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="22" y="27" textAnchor="middle" className="escudo__sigla">{club.sigla}</text>
    </svg>
  );
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
        onClick={(e) => { e.stopPropagation(); }} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
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
                    <td><span className="trajetoria__clube"><Crest clubId={s.clubId} small />{clubOf(s.clubId)?.nome}</span></td>
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
  const medal = MEDALS[band]!.nome;
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
          <button ref={opener} type="button" className="jogador__abrir" aria-haspopup="dialog" aria-expanded={career} onClick={() => { setCareer(true); }}>
            <span className="jogador__topo">
              <Crest clubId={player.clubId} />
              <span className="jogador__quem">
                <span className="jogador__nome">{player.name}</span>
                <span className="jogador__clube">{t('ui.decisao.clubePosicao', { posicao: t(`positions.${player.position}`), clube: club?.nome ?? '' })}</span>
                <span className="jogador__mais">
                  {t('ui.carreira.titulo')}
                  <svg viewBox="0 0 10 16" width="7" height="11" aria-hidden="true" focusable="false">
                    <path d="M1.5 1.5 8 8l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
                  </svg>
                </span>
              </span>
              <span className="over" data-medalha={medal} style={cardArt(medal) ? { backgroundImage: `url(${cardArt(medal)})` } : undefined}>
                <span className="over__rotulo">
                  {t('ui.decisao.over')}
                  <span className="sr-only">{t('ui.decisao.faixaOver', { faixa: t(`attributes.band.${band}`) })}</span>
                </span>
                <span className="over__numero">{player.overall}</span>
              </span>
            </span>
          </button>
          <dl className="ficha">
            <div>
              <dt>{t('ui.decisao.idadeRotulo')}</dt>
              <dd>{t('ui.decisao.idade', { idade: age })}</dd>
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
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {career && <Career player={player} onClose={() => { setCareer(false); opener.current?.focus(); }} />}
      {chosen !== null && <Result eventId={eventId} optionId={chosen} state={state} onDone={onDone} />}
    </main>
  );
}

function hasText(eventId: string): boolean {
  try { t(`events.${eventId}.texto`); return true; } catch { return false; }
}
