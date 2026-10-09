import { useEffect, useRef, useState } from 'react';
import events from '../../data/events.json';
import legacy from '../../data/legacy.json';
import album from '../../data/album.json';
import type { AvatarSpec } from '../../art/avatar';
import { ATTRIBUTES, toBand, type Attributes } from '../../engine/attributes';
import { applyOption, type Ctx } from '../../engine/events';
import { outcomeOf, outcomeVerdict, previewOf, riskOf, RISK_BANDS, timeOutOf, type Outcome, type Preview, type Risk } from '../../engine/preview';
import previewCfg from '../../data/preview.json';
import { eventLayers, format, t, type Params } from '../../i18n';
import { composeText } from '../../engine/contextText';
import { clubLine, clubName } from './clubText';
import { TrophyIcon } from './TrophyIcon';
import { Emblema } from './Emblema';
import { Bandeira } from './Bandeira';
import { Figurinha, medalOf } from './Figurinha';
import { Niveis } from './Niveis';
import { CenaPintada } from './CenaPintada';
import { useRolling } from '../useRolling';
import { MOTION } from '../motion';
import { Carimbo } from './Carimbo';
import type { Moment } from './moments';
import './Decision.css';

// T49 (amostra aprovada) e T51: uma decisão por tela, com a cena ao fundo. Só faixas e setas, nunca números de atributo.
export interface DecisionProps {
  eventId: string;
  age: number;
  /** Fração da carreira já vivida, de 0 a 1. */
  progress: number;
  /** T60a: com `pintada`, a cena é a pintura em camadas (uniforme do clube e número); sem ela, a imagem `src`. */
  scene: { src?: string; alt: string; pintada?: { scene: string; cut: string; clubId: string; number?: number } };
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
    /** Camisa da figurinha (v2.37): o clube ou "selecao:<país>" nos eventos da Seleção. Sem ela, a do clube. */
    uniforme?: string;
    /** v2.62: país da seleção principal, depois da estreia por ela: a bandeira ao lado do nome. */
    selecao?: string;
    /** v2.63: capitão do clube atual: o selo "C" ao lado do nome (a 10 vem do número). */
    capitao?: boolean;
    /** Marcos já alcançados ("selecao", "camisa10"): saem dos espaços vazios do álbum. */
    milestones?: string[];
    /** T25c: marcos vividos (primeiras vezes), do mais antigo ao mais novo: figurinhas do álbum e da gaveta. */
    marcos?: { id: string; ano: number; clubId: string }[];
    /** T25d: parâmetros de texto da memória da carreira ({mem_<id>_ano|anos|clube}) para citar o passado no texto do evento. */
    textoParams?: Params;
    /** T25e: etiquetas de contexto de agora (da mais forte para a mais fraca): escolhem a abertura e as frases de contexto do texto. */
    etiquetas?: string[];
    /** T51b: a faixa da torcida no clube atual (idolatria em palavras, idolatry.json). */
    torcida?: string;
  };
  /** v2.47: os números da decisão anterior; o overall, a idade e o valor rolam deles até os de agora. */
  anterior?: Anterior;
  /** v2.47: o que aconteceu desde a decisão anterior (título, acesso, rebaixamento): vira carimbo por cima da tela. */
  momentos?: Moment[];
  /** Situação atual do jogador (moral, torcida, patrimônio…): o resultado da escolha mostra o ganho e a perda reais sobre ela. */
  state?: Ctx;
  /** T51b: as frases do último semestre ("Seu passe melhorou."), só na primeira decisão depois dele. */
  semestre?: string[];
  /** Ritmo da carreira (T49b): no normal o resultado espera o jogador; no rápido segue sozinho depois de `resultadoMs`. */
  ritmo?: 'normal' | 'rapido' | 'completo';
  onChoose?: (optionId: string) => void;
  /** Chamado quando o resultado fecha, sozinho ou pelo botão, com a situação já atualizada. */
  onContinue?: (optionId: string, state: Ctx) => void;
}

export interface Anterior { overall: number; age: number; marketValueEUR?: number }

interface Season { age: number; clubId: string; overall: number; /** T51b: faixa da torcida naquele clube. */ torcida?: string }

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

/** Os dez atributos de agora em faixa, nunca em número (SPEC 6.3). */
function Levels({ attributes }: { attributes: Attributes }) {
  return <Niveis items={ATTRIBUTES.map((id) => ({ id, band: toBand(attributes[id]).key }))} labelledBy="gaveta-atributos" />;
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
function Album({ titles, milestones, marcos }: { titles: string[]; milestones: string[]; marcos: { id: string; ano: number; clubId: string }[] }) {
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
      {marcos.length > 0 && (
        <ul className="album__cromos" aria-label={t('ui.carreira.marcos')}>
          {marcos.map((m) => <li key={`${m.id}@${m.clubId}`} className="album__cromo"><span>{marcoLabel(m)}</span></li>)}
        </ul>
      )}
      <ul className="album__cromos" aria-label={t('ui.album.faltam')}>
        {missing.map((g) => <li key={g.id} className="album__vazio">{t(`ui.album.meta.${g.id}`)}</li>)}
      </ul>
    </section>
  );
}

/** "Primeiro gol · Flamengo · 2027": a figurinha de um marco. */
function marcoLabel(m: { id: string; ano: number; clubId: string }): string {
  return t('ui.album.cromoMarco', { marco: t(`ui.album.marco.${m.id}`), clube: clubName(m.clubId).nome, ano: m.ano });
}

function recentFirst(seasons: Season[]) {
  return [...seasons].reverse();
}

/** Gaveta "Minha carreira" (SPEC v2.21): o que saiu da tela de decisão para ela caber no celular. Fecha pelo botão, por Esc ou tocando fora. */
export function Career({ player, onClose }: { player: DecisionProps['player']; onClose: () => void }) {
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
          <h3>{t('ui.carreira.marcos')}</h3>
          {(player.marcos ?? []).length === 0 && <p className="gaveta__vazio">{t('ui.carreira.semMarcos')}</p>}
          {(player.marcos ?? []).length > 0 && (
            <ul className="album__cromos">
              {(player.marcos ?? []).map((m) => <li key={`${m.id}@${m.clubId}`} className="album__cromo"><span>{marcoLabel(m)}</span></li>)}
            </ul>
          )}
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
                  <th scope="col">{t('ui.idolatria.coluna')}</th>
                  <th scope="col">{t('ui.carreira.colOver')}</th>
                </tr>
              </thead>
              <tbody>
                {seasons.map((s) => (
                  <tr key={s.age}>
                    <td>{s.age}</td>
                    <td><span className="trajetoria__clube"><Emblema clubId={s.clubId} size={20} />{clubName(s.clubId).nome}</span></td>
                    <td>{s.torcida ? t(`ui.idolatria.faixa.${s.torcida}`) : null}</td>
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

function riskText(risk: Risk): string {
  return t('ui.risco.tarja', { tipo: t(`ui.risco.tipo.${risk.tipo}`), faixa: t(`ui.risco.${risk.faixa}`) });
}

/** Medidor de risco da opção (v2.34): 4 segmentos num tom só; a faixa em palavras vai para o leitor de tela aqui e, por escrito, para o detalhe da marcada. */
function RiskMeter({ risk }: { risk: Risk }) {
  const lit = RISK_BANDS.indexOf(risk.faixa) + 1;
  return (
    <span className="opcao__risco">
      <span className="sr-only">{riskText(risk)}</span>
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
  if (o.unidade === 'palavra') return t('ui.resultado.palavra', { sinal });
  if (o.unidade === 'porcento') return t('ui.resultado.porcento', { sinal, n: Math.round(abs * 100) });
  return t('ui.resultado.pontos', { sinal, n: Math.round(o.unidade === 'pontos100' ? abs * 100 : abs) });
}

/** O que a escolha rendeu de verdade, por cima da tela desfocada; fecha pelo botão ou Esc e, no ritmo Rápido, sozinho depois de um instante. */
function Result({ eventId, optionId, state, tags, auto, onDone }: { eventId: string; optionId: string; state: Ctx; tags: readonly string[]; auto: boolean; onDone: () => void }) {
  const outcome = outcomeOf(state, eventId, optionId, tags);
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

/** Contagem de títulos na ficha do topo (v2.34): a lista completa fica na gaveta. */
/** v2.62: os títulos agrupados por competição, na ordem em que vieram, com a quantidade de cada. */
function trophyGroups(titles: string[]): { id: string; n: number }[] {
  const out: { id: string; n: number }[] = [];
  for (const id of titles) {
    const g = out.find((x) => x.id === id);
    if (g) g.n++; else out.push({ id, n: 1 });
  }
  return out;
}

/** O que o leitor de tela ouve no botão da opção: cada consequência em palavras, o risco e o tempo fora (a tela mostra isso só no detalhe da marcada). */
function optionSpeech(eventId: string, optionId: string): string {
  const preview = previewOf(eventId, optionId);
  const out = timeOutOf(eventId, optionId);
  const parts = preview.map((p) => `${t(`preview.campo.${p.campo}`)}${t('ui.decisao.previa', { sentido: t(`preview.sentido.${p.sentido}`), intensidade: p.sentido === 'muda' ? '' : t(`preview.intensidade.${p.intensidade}`) })}`.trim());
  if (out !== null) parts.push(timeOutText(out));
  if (!parts.length) parts.push(t('ui.decisao.semPrevia'));
  return parts.join('. ');
}

/** Detalhe da opção marcada (v2.34): risco e tempo fora por escrito, depois "Você ganha / Em troca" com as setas. */
function Detail({ eventId, optionId }: { eventId: string; optionId: string }) {
  const preview = previewOf(eventId, optionId);
  const risk = riskOf(eventId, optionId);
  const out = timeOutOf(eventId, optionId);
  return (
    <section className="decisao__detalhe" aria-label={t(`events.${eventId}.opcoes.${optionId}`)}>
      {(risk || out !== null) && (
        <p className="detalhe__risco">
          {risk && <span>{riskText(risk)}</span>}
          {out !== null && <span className="opcao__fora">{timeOutText(out)}</span>}
        </p>
      )}
      {preview.length === 0 && out === null && <p className="previa">{t('ui.decisao.semPrevia')}</p>}
      {previewLines(preview).map((line) => (
        <p key={line.sentido} className={`previa__linha previa--${line.sentido}`}>
          <span className="previa__rotulo">{t(`ui.decisao.${line.rotulo}`)}</span>
          <span className="previa__itens">
            {line.itens.map((p) => (
              <span key={p.campo} className="previa">
                <span>{t(`preview.campo.${p.campo}`)}</span>
                <Arrows sentido={p.sentido} intensidade={p.intensidade} />
              </span>
            ))}
          </span>
        </p>
      ))}
    </section>
  );
}

/** Prévia curta (v2.38): no ritmo Rápido tocar já decide, então cada opção mostra numa linha o campo com as setas e o
 * tempo fora. Oculta ao leitor de tela, que já ouve tudo isso no nome do botão. */
function ShortPreview({ eventId, optionId }: { eventId: string; optionId: string }) {
  const out = timeOutOf(eventId, optionId);
  const preview = previewOf(eventId, optionId);
  return (
    <span className="opcao__resumo" aria-hidden="true">
      {preview.length === 0 && out === null && <span>{t('ui.decisao.semPrevia')}</span>}
      {preview.map((p) => (
        <span key={p.campo} className={`previa previa--${p.sentido}`}>
          {t(`preview.campo.${p.campo}`)}
          <Arrows sentido={p.sentido} intensidade={p.intensidade} />
        </span>
      ))}
      {out !== null && <span className="opcao__fora">{timeOutText(out)}</span>}
    </span>
  );
}

/** Caixa do jogador no topo (v2.34, variação B): figurinha pequena com moldura (abre "Minha carreira"), o Over grande e a ficha. */
function ageText(idade: number) { return t('ui.decisao.idade', { idade }); }
function valueText(valor: number) { return t('ui.decisao.valor', { valor: money(valor, 'EUR') }); }

/** v2.47: o texto que rola fica escondido do leitor de tela, que recebe só o valor final. */
function Rolled({ final, shown }: { final: string; shown: string }) {
  return shown === final ? final : <><span aria-hidden="true">{shown}</span><span className="sr-only">{final}</span></>;
}

export function PlayerBox({ player, age, anterior, open, opener, onOpen, inert }: {
  player: DecisionProps['player']; age: number; anterior?: Anterior; open: boolean; opener: React.RefObject<HTMLButtonElement | null>; onOpen: () => void; inert: boolean;
}) {
  const over = useRolling(player.overall, anterior?.overall);
  const idade = useRolling(age, anterior?.age);
  const valor = useRolling(player.marketValueEUR ?? 0, anterior?.marketValueEUR);
  const medal = medalOf(player.overall);
  return (
    <header className="decisao__topo vidro" inert={inert}>
      <button ref={opener} type="button" className="jogador__abrir" aria-haspopup="dialog" aria-expanded={open} onClick={onOpen}>
        <Figurinha moldura tamanho="pequena" name={player.name} number={player.number} overall={player.overall} position={player.position} clubId={player.clubId} uniforme={player.uniforme} avatar={player.avatar} visual={player.visual} />
        <span className="jogador__quem">
          <span className="jogador__nome"><span aria-hidden="true">{player.name}</span>{player.selecao ? <Bandeira pais={player.selecao} /> : null}
            {/* v2.63: a 10 e a faixa são conquistas: selos ao lado do nome enquanto valem */}
            {player.number === 10 && <span className="selo-conquista"><span aria-hidden="true">{t('ui.decisao.selo10')}</span><span className="sr-only">{t('ui.decisao.selo10Texto')}</span></span>}
            {player.capitao && <span className="selo-conquista"><span aria-hidden="true">{t('ui.decisao.seloCapitao')}</span><span className="sr-only">{t('ui.decisao.seloCapitaoTexto')}</span></span>}</span>
          <span className="jogador__clube"><Emblema clubId={player.clubId} size={18} />{clubLine(player.position, player.clubId)}</span>
          <span className="jogador__mais">
            {t('ui.carreira.titulo')}
            <svg viewBox="0 0 10 16" width="7" height="11" aria-hidden="true" focusable="false">
              <path d="M1.5 1.5 8 8l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
            </svg>
          </span>
        </span>
      </button>
      {/* v2.62: idade, salário e valor entre o nome e o Over */}
      <ul className="decisao__dados" aria-label={t('ui.decisao.ficha')}>
        <li><Rolled final={ageText(age)} shown={ageText(idade)} /></li>
        <li>{t('ui.decisao.porMes', { valor: money(player.monthlySalary.amount, player.monthlySalary.currency) })}</li>
        {player.marketValueEUR === undefined ? null : <li><Rolled final={valueText(player.marketValueEUR)} shown={valueText(valor)} /></li>}
      </ul>
      {/* v2.62: a medalha da faixa por trás do número, do bronze ao diamante, marca a evolução */}
      <div className="decisao__over">
        <p className="decisao__over-medalha" aria-hidden="true" data-medalha={medal.nome} style={medal.art ? { backgroundImage: `url(${medal.art})` } : undefined}>
          <span className="decisao__over-rotulo">{t('ui.figurinha.over')}</span>
          <span className="decisao__over-numero">{over}</span>
        </p>
        {/* v2.62: o papel (tempo de jogo) embaixo do Over */}
        <p className="decisao__papel">{t(`ui.papel.${player.role}`)}</p>
      </div>
      {/* v2.62: embaixo, só as taças: uma por competição, com a quantidade numa bolinha */}
      {player.titles.length > 0 && (
        <ul className="tacas" aria-label={t('ui.decisao.titulosLinha')}>
          {trophyGroups(player.titles).map(({ id, n }) => (
            <li key={id} className="taca">
              <TrophyIcon id={id} size={26} />
              {n > 1 && <span className="taca__qtd" aria-hidden="true">{n}</span>}
              <span className="sr-only">{n > 1 ? t('ui.decisao.tacaQtd', { nome: t(`ui.titulo.${id}`), n }) : t(`ui.titulo.${id}`)}</span>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

export function Decision({ eventId, age, progress, scene, player, anterior, momentos, state = {}, ritmo = 'normal', semestre, onChoose, onContinue }: DecisionProps) {
  const [career, setCareer] = useState(false);
  // sem genérico aqui: a guarda de texto fora do i18n confunde o genérico com JSX
  const opener = useRef(null as HTMLButtonElement | null);
  // v2.34: no Normal tocar marca e "Confirmar escolha" decide; no Rápido tocar já decide
  const [marked, setMarked] = useState(null as string | null);
  const [chosen, setChosen] = useState<string | null>(null);
  const rapido = ritmo === 'rapido';
  // o resultado fecha uma vez só, venha do tempo ou do botão
  const done = useRef(false);
  const finish = useRef(() => {});
  finish.current = () => {
    if (done.current || chosen === null) return;
    done.current = true;
    onContinue?.(chosen, applyOption(state, eventId, chosen));
  };
  const [onDone] = useState(() => () => finish.current());
  function decide(id: string) {
    if (chosen !== null) return;
    setChosen(id);
    onChoose?.(id);
  }
  const options = events.eventos.find((e) => e.id === eventId)?.opcoes ?? [];
  const percent = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  const text = eventText(eventId, player.etiquetas ?? [], player.textoParams);
  const pressed = chosen ?? marked;
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
    <main className="decisao" style={TRANSITION} data-tema="claro" data-evento={eventId} data-resultado={chosen === null ? 'fechado' : 'aberto'}>
      {scene.pintada
        ? <CenaPintada {...scene.pintada} alt={scene.alt} inert={overlay} />
        : <img className="decisao__cena" src={scene.src} alt={scene.alt} width={SCENE_SIZE[0]} height={SCENE_SIZE[1]} fetchPriority="high" inert={overlay} />}
      <div
        inert={overlay} className="faixa" role="progressbar" aria-label={t('ui.decisao.progresso')}
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-valuetext={t('ui.decisao.idade', { idade: age })}
      >
        <span className="faixa__feito" style={{ inlineSize: `${percent}%` }} />
      </div>
      <PlayerBox player={player} age={age} anterior={anterior} open={career} opener={opener} onOpen={() => { setCareer(true); }} inert={overlay} />
      <div className="decisao__painel vidro" inert={overlay}>
        {semestre && semestre.length > 0 ? <p className="decisao__semestre"><strong>{t('ui.evolucao.titulo')}:</strong> {semestre.join(' ')}</p> : null}
        <h1 className="decisao__titulo">{t(`events.${eventId}.titulo`)}</h1>
        {text && <p className="decisao__historia">{text}</p>}
        <div className="decisao__opcoes" role="group" aria-label={t('ui.decisao.opcoes')}>
          {options.map((o) => {
            const risk = riskOf(eventId, o.id);
            return (
              <button
                key={o.id} type="button" className="opcao" data-opcao-id={o.id} aria-pressed={pressed === o.id} disabled={chosen !== null && chosen !== o.id}
                onClick={() => { if (rapido) { decide(o.id); } else if (chosen === null) { setMarked(o.id); } }}
              >
                <span className="opcao__texto">
                  <span className="opcao__rotulo">{t(`events.${eventId}.opcoes.${o.id}`)}</span>
                  {rapido ? <ShortPreview eventId={eventId} optionId={o.id} /> : null}
                </span>
                <span className="sr-only">{optionSpeech(eventId, o.id)}</span>
                {risk && <RiskMeter risk={risk} />}
              </button>
            );
          })}
        </div>
        {!rapido && marked === null && <p className="decisao__detalhe decisao__detalhe--vazio">{t('ui.decisao.marque')}</p>}
        {!rapido && marked !== null && <Detail eventId={eventId} optionId={marked} />}
        {!rapido && (
          <button type="button" className="decisao__confirmar" disabled={marked === null || chosen !== null} onClick={() => { if (marked !== null) { decide(marked); } }}>
            {t('ui.decisao.confirmar')}
          </button>
        )}
      </div>
      <Album titles={player.titles} milestones={player.milestones ?? []} marcos={player.marcos ?? []} />
      {career && <Career player={player} onClose={() => { setCareer(false); }} />}
      <Carimbo momentos={momentos ?? NONE} />
      {chosen !== null && <Result eventId={eventId} optionId={chosen} state={state} tags={player.etiquetas ?? []} auto={rapido} onDone={onDone} />}
    </main>
  );
}

/** v2.47: a duração das transições vem dos dados (motion.json). */
const NONE: Moment[] = [];
export const TRANSITION = { '--transicao': `${MOTION.transicaoMs}ms` } as React.CSSProperties;

/** O texto da situação em camadas (T25e): abertura, base e frases de contexto pelas etiquetas; sem texto (ou com parâmetro faltando), nada. */
function eventText(eventId: string, tags: readonly string[], params?: Params): string | null {
  const layers = eventLayers(eventId);
  if (!layers) return null;
  try { return format(composeText(layers, tags), params); } catch { return null; }
}
