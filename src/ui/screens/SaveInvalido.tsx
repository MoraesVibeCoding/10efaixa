import { useEffect, useRef } from 'react';
import { t } from '../../i18n';
import './Creation.css';

// T54 (SPEC 6.16): save danificado ou de versão que este jogo não abre. Mensagem clara e opção de recomeçar; "Voltar"
// leva à abertura sem apagar nada. Mesma casca da criação.
export function SaveInvalido({ reason, onRestart, onBack }: { reason: 'danificado' | 'versao'; onRestart: () => void; onBack: () => void }) {
  const title = useRef(null as HTMLHeadingElement | null);
  useEffect(() => { title.current?.focus(); }, []);
  return (
    <main className="criacao">
      <div className="criacao__form">
        <header className="criacao__topo">
          <h1 className="criacao__titulo" ref={title} tabIndex={-1}>{t('ui.saveInvalido.titulo')}</h1>
        </header>
        <div className="criacao__passo">
          <p>{t(`ui.saveInvalido.${reason}`)}</p>
          <p className="criacao__dica">{t('ui.saveInvalido.dica')}</p>
        </div>
        <footer className="criacao__acoes">
          <button type="button" className="criacao__botao" onClick={onBack}>{t('ui.criacao.voltar')}</button>
          <button type="button" className="criacao__botao criacao__botao--principal" onClick={onRestart}>{t('ui.saveInvalido.recomecar')}</button>
        </footer>
      </div>
    </main>
  );
}
