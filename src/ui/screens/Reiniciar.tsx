import { useEffect, useRef } from 'react';
import { t } from '../../i18n';
import './Reiniciar.css';

// v2.56: botão fixo de reiniciar a carreira (canto superior direito, todas as telas depois da abertura) e o aviso antes de apagar.
// O aviso é um `div role="alertdialog"` (não `<dialog>`: o modal nativo travou no Safari do iPhone na resposta da reunião).
// Abre com o foco em "Continuar jogando" (a opção segura); Esc e o fundo cancelam; Tab fica preso nos dois botões.
export interface ReiniciarProps { open: boolean; onOpen: () => void; onCancel: () => void; onConfirm: () => void }

export function Reiniciar({ open, onOpen, onCancel, onConfirm }: ReiniciarProps) {
  const opener = useRef(null as HTMLButtonElement | null);
  const cancel = useRef(null as HTMLButtonElement | null);
  const confirm = useRef(null as HTMLButtonElement | null);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) cancel.current?.focus();
    else if (wasOpen.current) opener.current?.focus();
    wasOpen.current = open;
  }, [open]);
  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { e.stopPropagation(); onCancel(); return; }
    if (e.key !== 'Tab') return;
    const first = cancel.current;
    const last = confirm.current;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  }
  return (
    <>
      <button ref={opener} type="button" className="reiniciar__botao" aria-haspopup="dialog" aria-label={t('ui.reiniciar.botao')} title={t('ui.reiniciar.botao')} onClick={onOpen}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" fill="currentColor" /></svg>
      </button>
      {open && (
        <div className="reiniciar__fundo" onClick={onCancel}>
          <div
            className="reiniciar__aviso" role="alertdialog" aria-modal="true" aria-labelledby="reiniciar-titulo" aria-describedby="reiniciar-texto"
            onClick={(e) => { e.stopPropagation(); }} onKeyDown={onKey}
          >
            <h2 id="reiniciar-titulo">{t('ui.reiniciar.titulo')}</h2>
            <p id="reiniciar-texto">{t('ui.reiniciar.texto')}</p>
            <div className="reiniciar__acoes">
              <button ref={cancel} type="button" onClick={onCancel}>{t('ui.reiniciar.cancelar')}</button>
              <button ref={confirm} type="button" className="reiniciar__apagar" onClick={onConfirm}>{t('ui.reiniciar.confirmar')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
