import { useEffect, useRef, useState } from 'react';
import { t } from '../../i18n';
import type { SavePeek } from '../../state/save';
import arte from '../../assets/abertura.webp';
import './Abertura.css';

// T48 (SPEC 7, v2.34): a abertura. Arte do túnel (docs/arte/abertura) com o "10" gigante "carimbando" nas costas do
// jogador (animação desligada com prefers-reduced-motion), a marca no amarelo da braçadeira e "Nova carreira".
// T54 (v2.39): com carreira salva, "Continuar" vem primeiro e "Nova carreira" pergunta antes de apagar.
export interface AberturaProps { saved: SavePeek; onNew: () => void; onContinue: () => void }

export function Abertura({ saved, onNew, onContinue }: AberturaProps) {
  const first = useRef(null as HTMLButtonElement | null);
  const [asking, setAsking] = useState(false);
  useEffect(() => { first.current?.focus(); }, []);
  const hasSave = saved.status !== 'nenhum';
  const name = saved.status === 'salvo' ? saved.name : null;
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
        {hasSave && (
          <button ref={first} type="button" className="abertura__botao" onClick={onContinue}>
            {name ? t('ui.abertura.continuar', { nome: name }) : t('ui.abertura.continuarSemNome')}
          </button>
        )}
        <button ref={hasSave ? undefined : first} type="button" className={hasSave ? 'abertura__botao abertura__botao--secundario' : 'abertura__botao'}
          onClick={() => { if (hasSave) { setAsking(true); } else { onNew(); } }}>
          {t('ui.abertura.novaCarreira')}
        </button>
      </footer>
      {asking && <Confirm name={name} onConfirm={onNew} onCancel={() => { setAsking(false); }} />}
    </main>
  );
}

/** "Começar outra carreira?": uma carreira salva por vez, então começar outra apaga a atual (v2.39). */
function Confirm({ name, onConfirm, onCancel }: { name: string | null; onConfirm: () => void; onCancel: () => void }) {
  const dialog = useRef(null as HTMLDialogElement | null);
  useEffect(() => {
    const el = dialog.current;
    if (!el || el.open) return;
    if (typeof el.showModal === 'function') el.showModal();
    else el.setAttribute('open', '');
  }, []);
  function onCancelEvent(e: React.SyntheticEvent) {
    e.preventDefault();
    onCancel();
  }
  return (
    <dialog ref={dialog} className="abertura__confirmar" role="alertdialog" aria-labelledby="abertura-confirmar-titulo" aria-describedby="abertura-confirmar-texto" onCancel={onCancelEvent}>
      <h2 id="abertura-confirmar-titulo">{t('ui.abertura.confirmar.titulo')}</h2>
      <p id="abertura-confirmar-texto">{name ? t('ui.abertura.confirmar.texto', { nome: name }) : t('ui.abertura.confirmar.textoSemNome')}</p>
      <div className="abertura__confirmar-acoes">
        <button type="button" autoFocus onClick={onCancel}>{t('ui.abertura.confirmar.cancelar')}</button>
        <button type="button" className="abertura__apagar" onClick={onConfirm}>{t('ui.abertura.confirmar.apagar')}</button>
      </div>
    </dialog>
  );
}
