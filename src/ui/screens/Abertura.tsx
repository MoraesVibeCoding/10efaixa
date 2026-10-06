import { useEffect, useRef } from 'react';
import { t } from '../../i18n';
import arte from '../../assets/abertura.webp';
import './Abertura.css';

// T48 (SPEC 7, v2.34): a abertura. Arte do túnel (docs/arte/abertura) com o "10" gigante "carimbando" nas costas do
// jogador (animação desligada com prefers-reduced-motion), a marca no amarelo da braçadeira e "Nova carreira".
// "Continuar" entra com o save (T54).
export function Abertura({ onNew }: { onNew: () => void }) {
  const button = useRef(null as HTMLButtonElement | null);
  useEffect(() => { button.current?.focus(); }, []);
  return (
    <main className="abertura" data-tema="escuro">
      <div className="abertura__arte">
        <img src={arte} alt={t('ui.abertura.arteAlt')} width="928" height="1152" fetchPriority="high" />
        <span className="abertura__numero" aria-hidden="true">10</span>
      </div>
      <header className="abertura__topo">
        <h1 className="abertura__marca">{t('ui.abertura.titulo')}</h1>
        <p className="abertura__lema">{t('ui.abertura.lema')}</p>
      </header>
      <footer className="abertura__acoes">
        <button ref={button} type="button" className="abertura__botao" onClick={onNew}>{t('ui.abertura.novaCarreira')}</button>
      </footer>
    </main>
  );
}
