import { useEffect, useRef } from 'react';
import type { CareerResult } from '../../engine/career';
import { timelineOf } from '../../engine/timeline';
import { t } from '../../i18n';
import { clubName } from './clubText';
import { Emblema } from './Emblema';
import { TrophyIcon } from './TrophyIcon';
import './LinhaDoTempo.css';

// T55h (SPEC 6.15, v2.51): "Sua carreira", antes do cartão final: uma linha por temporada com idade, clube e divisão,
// Over (número: exceção do overall, SPEC v2.51) e os títulos do ano. v2.65: a Seleção do ano dentro do card, quando houve convocação. As frases antigas seguem no cartão narrativo.
/** Nome da divisão pelo id do mercado; id novo sem texto cai em "Outra liga" em vez de quebrar a tela. */
export function divisionLabel(division: string | null): string {
  if (division === null) return '';
  try { return t(`ui.linhaDoTempo.divisao.${division}`); } catch { return t('ui.linhaDoTempo.outraLiga'); }
}

export function LinhaDoTempo({ result, onContinue }: { result: CareerResult; onContinue: () => void }) {
  const rows = timelineOf(result);
  const title = useRef(null as HTMLHeadingElement | null);
  useEffect(() => { title.current?.focus(); }, []);
  return (
    <main className="linha" data-tema="claro">
      <h1 className="linha__titulo" ref={title} tabIndex={-1}>{t('ui.linhaDoTempo.titulo')}</h1>
      <p className="linha__nome">{result.player.name}</p>
      <ol className="linha__lista">
        {rows.map((r) => (
          <li key={r.year} className={r.peak ? 'linha__item linha__item--auge' : 'linha__item'}>
            <span className="linha__idade">{t('ui.linhaDoTempo.idade', { n: r.age })}</span>
            <span className="linha__clube">
              <Emblema clubId={r.clubId} size={20} />
              {clubName(r.clubId).nome}
            </span>
            {(r.division !== null || r.newClub) && (
              <span className="linha__divisao">
                {divisionLabel(r.division)}
                {r.newClub && <strong className="linha__novo">{r.division !== null ? ' · ' : ''}{t('ui.linhaDoTempo.novoClube')}</strong>}
              </span>
            )}
            <span className="linha__over">{t('ui.linhaDoTempo.over', { n: r.overall })}</span>
            {r.peak && <strong className="linha__auge">{t('ui.linhaDoTempo.auge')}</strong>}
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
