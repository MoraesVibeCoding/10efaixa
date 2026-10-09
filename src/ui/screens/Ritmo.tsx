import { useEffect, useRef, useState } from 'react';
import { t } from '../../i18n';
import { CenaPintada, cutForVisual } from './CenaPintada';
import { Choices } from './Choices';
import './Creation.css';
import './Ritmo.css';

// T53a (SPEC 6.16): o ritmo da carreira, escolhido depois da revelação. Mesma casca e mesmos cartões da criação.
// O ritmo muda como a decisão se joga (no Rápido um toque decide e o resultado fecha sozinho); a quantidade de
// decisões por temporada de cada ritmo entra na T53.
export type RitmoId = 'rapido' | 'normal' | 'completo';
const RITMOS: RitmoId[] = ['rapido', 'normal', 'completo'];

/** `visual` (v2.69): o recorte do jogador na cena do túnel ao fundo. */
export function Ritmo({ onChoose, onBack, visual }: { onChoose: (ritmo: RitmoId) => void; onBack: () => void; visual?: string }) {
  const [value, setValue] = useState('normal' as RitmoId);
  const title = useRef(null as HTMLHeadingElement | null);
  useEffect(() => { title.current?.focus(); }, []);
  const options = RITMOS.map((id) => ({ id, label: t(`ui.ritmo.${id}.nome`), detail: t(`ui.ritmo.${id}.detalhe`) }));
  function submit(e: React.FormEvent) {
    e.preventDefault();
    onChoose(value);
  }
  return (
    <main className="criacao">
      {/* v2.69: cena ao fundo, como nos passos da criação (antes a tela ficava com meia tela vazia) */}
      <CenaPintada scene="estadio" cut={cutForVisual(visual)} clubId="" alt="" decorativa />
      <form className="criacao__form vidro" onSubmit={submit} noValidate>
        <header className="criacao__topo">
          <h1 className="criacao__titulo" ref={title} tabIndex={-1}>{t('ui.ritmo.titulo')}</h1>
        </header>
        <div className="criacao__passo ritmo">
          <Choices id="ritmo" name="ritmo" legend={t('ui.ritmo.legenda')} options={options} variant="cartoes" value={value} onChange={(v) => setValue(v as RitmoId)} />
        </div>
        <footer className="criacao__acoes">
          <button type="button" className="criacao__botao" onClick={onBack}>{t('ui.criacao.voltar')}</button>
          <button type="submit" className="criacao__botao criacao__botao--principal">{t('ui.ritmo.comecar')}</button>
        </footer>
      </form>
    </main>
  );
}
