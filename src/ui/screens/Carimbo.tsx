import { useEffect, useState } from 'react';
import { t } from '../../i18n';
import { MOTION } from '../motion';
import type { Moment } from './moments';
import { TrophyIcon } from './TrophyIcon';
import './Carimbo.css';

// v2.47: o carimbo do momento (título, acesso, rebaixamento) por cima da decisão, um por vez, e some sozinho.
// Não bloqueia a tela (sem foco, sem clique); o leitor de tela ouve o texto pela região viva.
export function Carimbo({ momentos }: { momentos: Moment[] }) {
  const [i, setI] = useState(-1);
  useEffect(() => { if (momentos.length > 0) setI(0); }, [momentos]);
  const atual = i >= 0 ? momentos[i] : undefined;
  useEffect(() => {
    if (!atual) return undefined;
    const ms = atual.kind === 'titulo' ? MOTION.celebracaoMs : MOTION.carimboMs;
    const id = setTimeout(() => { setI(i + 1); }, ms);
    return () => clearTimeout(id);
  }, [atual, i]);
  return (
    <div className="carimbo" role="status">
      {atual ? (
        <p key={i} className="carimbo__selo" data-momento={atual.kind}>
          {atual.kind === 'titulo' ? <span className="carimbo__trofeu"><TrophyIcon id={atual.competition} size={96} /></span> : null}
          {t(`ui.momento.${atual.kind}`)}{' '}
          {atual.kind === 'titulo' ? <span className="carimbo__sub">{t(`ui.titulo.${atual.competition}`)}</span> : null}
        </p>
      ) : null}
    </div>
  );
}

