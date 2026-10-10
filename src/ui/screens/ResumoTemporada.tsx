import { useEffect, useRef } from 'react';
import type { SeasonSummary } from '../../engine/seasonSummary';
import { t } from '../../i18n';
import { clubName } from './clubText';
import { semesterLines } from './careerView';
import { coachComment, direction, variation } from './resumoText';
import { TrophyIcon } from './TrophyIcon';
import { medalOf } from './Figurinha';
import { useRolling } from '../useRolling';
import { useSaida } from '../useSaida';
import './ResumoTemporada.css';

// v2.61 (SPEC 6.15): o resumo da temporada, num card por cima da próxima tela (Normal e Completo). Os números do ano são jogos, gols e
// assistências; o Over vai de-para com a variação em %; os atributos entram só em palavras (CLAUDE.md); o comentário do técnico
// tem até 3 frases montadas pelas chaves do motor. É um `div role="alertdialog"` (não `<dialog>`: o modal nativo travou no Safari do iPhone).
// Abre com o foco em "Continuar"; Esc fecha; Tab fica preso no único botão.
/** v2.62: `torcida` = faixa da idolatria no clube da temporada (o que a torcida vê em você), em palavras. */
export interface ResumoTemporadaProps { resumo: SeasonSummary; torcida?: string; onClose: () => void }

export function ResumoTemporada({ resumo, torcida, onClose }: ResumoTemporadaProps) {
  const close = useRef(null as HTMLButtonElement | null);
  // v2.72: o card sai (150 ms) antes de fechar; Esc fecha na hora (ação de teclado não anima)
  const { saindo, fechar } = useSaida(onClose);
  useEffect(() => { close.current?.focus(); }, []);
  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
    if (e.key === 'Tab') { e.preventDefault(); close.current?.focus(); }
  }
  const linhas = semesterLines(resumo.mudancas);
  const fala = coachComment(resumo.comentario);
  // v2.71 (momento 2): o Over rola do de ao para dentro da medalha, que troca de metal se a faixa mudou
  const over = useRolling(resumo.overallPara, resumo.overallDe);
  const medalha = medalOf(over);
  const troca = medalOf(resumo.overallDe).nome !== medalOf(resumo.overallPara).nome;
  return (
    <div className="resumo__fundo" data-saindo={saindo || undefined}>
      <div className="resumo" role="alertdialog" aria-modal="true" aria-labelledby="resumo-titulo" onKeyDown={onKey}>
        <h2 id="resumo-titulo" className="resumo__titulo">{t('ui.resumoTemporada.titulo')}</h2>
        <p className="resumo__onde">{`${clubName(resumo.clubId).nome} · ${t('ui.resumoTemporada.idade', { n: resumo.age })}`}</p>
        {torcida && <p className="resumo__torcida">{t('ui.idolatria.selo', { faixa: t(`ui.idolatria.faixa.${torcida}`) })}</p>}
        {/* v2.67: ano sem jogo como profissional (base, várzea): uma frase no lugar dos quadrinhos zerados */}
        {resumo.partidas > 0 ? (
          <ul className="resumo__numeros" aria-label={t('ui.resumoTemporada.numeros')}>
            <li><span>{t('ui.resumoTemporada.partidas')}</span><strong>{resumo.partidas}</strong></li>
            <li><span>{t('ui.resumoTemporada.gols')}</span><strong>{resumo.gols}</strong></li>
            <li><span>{t('ui.resumoTemporada.assistencias')}</span><strong>{resumo.assistencias}</strong></li>
          </ul>
        ) : <p className="resumo__formacao">{t('ui.resumoTemporada.semJogos')}</p>}
        <p className="resumo__over">
          <span className={`resumo__medalha${troca ? ' resumo__medalha--troca' : ''}`} aria-hidden="true" data-medalha={medalha.nome} style={medalha.art ? { backgroundImage: `url(${medalha.art})` } : undefined}>{over}</span>
          <span>{t('ui.resumoTemporada.over', { de: resumo.overallDe, para: resumo.overallPara })}</span>
          <strong className="resumo__variacao" data-sentido={direction(resumo.pct)}>{variation(resumo.pct)}</strong>
        </p>
        {linhas.length > 0 && (
          <ul className="resumo__atributos" aria-label={t('ui.resumoTemporada.atributos')}>
            {linhas.map((l) => <li key={l}>{l}</li>)}
          </ul>
        )}
        {resumo.titulos.length > 0 && (
          <ul className="resumo__titulos" aria-label={t('ui.resumoTemporada.titulos')}>
            {resumo.titulos.map((c, k) => <li key={`${c}-${k}`}><TrophyIcon id={c} size={32} />{t(`ui.titulo.${c}`)}</li>)}
          </ul>
        )}
        <section className="resumo__tecnico" aria-label={t('ui.resumoTemporada.tecnico')}>
          <h3>{t('ui.resumoTemporada.tecnico')}</h3>
          <p data-testid="comentario">{fala.join(' ')}</p>
        </section>
        <button ref={close} type="button" className="resumo__continuar" onClick={fechar}>{t('ui.resumoTemporada.continuar')}</button>
      </div>
    </div>
  );
}
