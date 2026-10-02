import { useState } from 'react';
import events from '../../data/events.json';
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

export function Decision({ eventId, age, progress, scene, temperament, onChoose }: DecisionProps) {
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
