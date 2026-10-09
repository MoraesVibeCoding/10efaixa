import { useEffect, useRef } from 'react';
import type { CareerResult } from '../../engine/career';
import { timelineOf } from '../../engine/timeline';
import { t } from '../../i18n';
import { clubName } from './clubText';
import { Emblema } from './Emblema';
import { TrophyIcon } from './TrophyIcon';
import './LinhaDoTempo.css';

// T55h (SPEC 6.15, v2.51): "Sua carreira", antes do cartão final: uma linha por temporada com idade, clube e divisão,
// Over (número: exceção do overall, SPEC v2.51) e os títulos do ano. As frases antigas seguem no cartão narrativo.
// v2.65: a Seleção do ano dentro do card, quando houve convocação.
// v2.66 (direção B "Súmula"): placar da carreira no topo e a faixa do Over em cada ano (a curva da carreira de relance);
// um traço marca a troca de clube e a Seleção vem num selo amarelo.
/** Nome da divisão pelo id do mercado; id novo sem texto cai em "Outra liga" em vez de quebrar a tela. */
export function divisionLabel(division: string | null): string {
  if (division === null) return '';
  try { return t(`ui.linhaDoTempo.divisao.${division}`); } catch { return t('ui.linhaDoTempo.outraLiga'); }
}

const num = (n: number) => n.toLocaleString('pt-BR');

export function LinhaDoTempo({ result, onContinue }: { result: CareerResult; onContinue: () => void }) {
  const rows = timelineOf(result);
  const title = useRef(null as HTMLHeadingElement | null);
  useEffect(() => { title.current?.focus(); }, []);
  const placar = [
    [num(result.stats.games), 'jogos'], [num(result.stats.goals), 'gols'], [num(result.titles.length), 'titulos'], [String(result.peakOverall), 'auge'],
  ] as const;
  return (
    <main className="linha" data-tema="claro">
      <header className="linha__placar" role="group" aria-label={t('ui.linhaDoTempo.placar.titulo')}>
        <p className="linha__nome">{result.player.name}</p>
        <div className="linha__placar-nums">
          {placar.map(([v, k]) => (
            <span key={k} className={k === 'auge' ? 'linha__placar-n linha__placar-n--auge' : 'linha__placar-n'}><b>{v}</b><span>{t(`ui.linhaDoTempo.placar.${k}`)}</span></span>
          ))}
        </div>
      </header>
      <h1 className="linha__titulo" ref={title} tabIndex={-1}>{t('ui.linhaDoTempo.titulo')}</h1>
      <ol className="linha__lista">
        {rows.map((r) => (
          <li key={r.year} className={['linha__item', r.peak && 'linha__item--auge', r.newClub && 'linha__item--troca'].filter(Boolean).join(' ')}>
            <span className="linha__idade"><span aria-hidden="true">{r.age}</span><span className="sr-only">{t('ui.linhaDoTempo.idade', { n: r.age })}</span></span>
            <span className="linha__clube">
              <Emblema clubId={r.clubId} size={20} />
              {clubName(r.clubId).nome}
            </span>
            <span className="linha__over"><span className="sr-only">{t('ui.linhaDoTempo.overSr')} </span>{r.overall}</span>
            <span className="linha__faixa" aria-hidden="true"><span style={{ inlineSize: `${r.overall}%` }} /></span>
            {(r.division !== null || r.newClub || r.peak) && (
              <span className="linha__divisao">
                {divisionLabel(r.division)}
                {r.newClub && <strong className="linha__novo">{r.division !== null ? ' · ' : ''}{t('ui.linhaDoTempo.novoClube')}</strong>}
                {r.peak && <strong className="linha__auge">{t('ui.linhaDoTempo.auge')}</strong>}
              </span>
            )}
            {r.division !== null && (
              <span className="linha__numeros">
                <span>{t('ui.linhaDoTempo.jogos', { n: r.games })}</span>
                <span>{t('ui.linhaDoTempo.gols', { n: r.goals })}</span>
                <span>{t('ui.linhaDoTempo.assistencias', { n: r.assists })}</span>
              </span>
            )}
            {r.selecao && (
              <span className="linha__selecao" role="group" aria-label={t('ui.linhaDoTempo.selecao.titulo')}>
                <strong className="linha__selecao-degrau">
                  {t(`ui.linhaDoTempo.selecao.degrau.${r.selecao.rung}`)}
                  {r.selecao.ten && ` · ${t('ui.linhaDoTempo.selecao.camisa10')}`}
                  {r.selecao.captain && ` · ${t('ui.linhaDoTempo.selecao.capitao')}`}
                </strong>
                <span className="linha__numeros">
                  <span>{t('ui.linhaDoTempo.jogos', { n: r.selecao.games })}</span>
                  <span>{t('ui.linhaDoTempo.gols', { n: r.selecao.goals })}</span>
                  <span>{t('ui.linhaDoTempo.assistencias', { n: r.selecao.assists })}</span>
                </span>
                {r.selecao.tournaments.map((x) => (
                  <span key={x.tournament} className="linha__selecao-torneio">
                    {t('ui.linhaDoTempo.selecao.torneio', { torneio: t(`ui.linhaDoTempo.selecao.nomes.${x.tournament}`), fase: t(`ui.linhaDoTempo.selecao.fase.${x.stage}`) })}
                  </span>
                ))}
              </span>
            )}
            {r.titles.length > 0 && (
              <span className="linha__titulos">
                {r.titles.map((c, k) => (
                  <span key={`${c}-${k}`} className="linha__taca"><TrophyIcon id={c} size={28} />{t(`ui.titulo.${c}`)}</span>
                ))}
              </span>
            )}
          </li>
        ))}
      </ol>
      <button type="button" className="linha__cartao" onClick={onContinue}>{t('ui.linhaDoTempo.verCartao')}</button>
    </main>
  );
}
