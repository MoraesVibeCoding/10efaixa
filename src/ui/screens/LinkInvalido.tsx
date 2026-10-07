import { useEffect, useRef } from 'react';
import { t } from '../../i18n';
import './Creation.css';

// T57d (SPEC 6.15, v2.49): link de carreira que não abre (incompleto, alterado ou de outra versão). Mensagem clara e
// volta à abertura; nada é apagado. Mesma casca da criação, como o aviso de save inválido.
export function LinkInvalido({ onBack }: { onBack: () => void }) {
  const title = useRef(null as HTMLHeadingElement | null);
  useEffect(() => { title.current?.focus(); }, []);
  return (
    <main className="criacao">
      <div className="criacao__form">
        <header className="criacao__topo">
          <h1 className="criacao__titulo" ref={title} tabIndex={-1}>{t('ui.linkInvalido.titulo')}</h1>
        </header>
        <div className="criacao__passo"><p>{t('ui.linkInvalido.texto')}</p></div>
        <footer className="criacao__acoes">
          <button type="button" className="criacao__botao criacao__botao--principal" onClick={onBack}>{t('ui.linkInvalido.voltar')}</button>
        </footer>
      </div>
    </main>
  );
}
