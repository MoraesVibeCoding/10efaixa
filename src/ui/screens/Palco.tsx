import { useEffect, useRef, useState } from 'react';
import { t } from '../../i18n';
import { reducedMotion } from '../motion';
import { TrophyIcon } from './TrophyIcon';
import './Palco.css';

/** Peças do confete: posição, atraso e cor fixos (nada de sorteio na tela). */
const CONFETE = Array.from({ length: 18 }, (_, i) => ({ x: (i * 37) % 100, atraso: (i * 83) % 600, cor: i % 3 }));

// v2.71 (revisão /impeccable, momento 4): o título tem palco. Os títulos do ano juntos, numa janela modal sobre o fundo escurecido;
// a tela atrás fica inerte (quem chama cuida disso) e "Seguir" ou Esc fecham.
export function Palco({ titulos, onClose }: { titulos: string[]; onClose: () => void }) {
  const seguir = useRef(null as HTMLButtonElement | null);
  const [mexe] = useState(() => !reducedMotion());
  const grupos: { id: string; n: number }[] = [];
  for (const id of titulos) {
    const g = grupos.find((x) => x.id === id);
    if (g) g.n++; else grupos.push({ id, n: 1 });
  }
  useEffect(() => { seguir.current?.focus(); }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="palco">
      {mexe && (
        <div className="palco__confete" aria-hidden="true">
          {CONFETE.map((c, i) => <i key={i} data-cor={c.cor} style={{ insetInlineStart: `${c.x}%`, animationDelay: `${c.atraso}ms` }} />)}
        </div>
      )}
      <div className="palco__caixa" role="dialog" aria-modal="true" aria-labelledby="palco-titulo">
        <h2 id="palco-titulo" className="palco__titulo">{t('ui.momento.titulo')}</h2>
        <ul className="palco__tacas">
          {grupos.map(({ id, n }) => (
            <li key={id} className="palco__taca">
              <TrophyIcon id={id} size={96} />
              <span className="palco__nome">{t(`ui.titulo.${id}`)}</span>
              {n > 1 && <span className="palco__vezes">{t('ui.palco.vezes', { n })}</span>}
            </li>
          ))}
        </ul>
        <button ref={seguir} type="button" className="palco__seguir" onClick={onClose}>{t('ui.palco.seguir')}</button>
      </div>
    </div>
  );
}
