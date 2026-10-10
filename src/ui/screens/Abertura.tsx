import { useEffect, useRef, useState } from 'react';
import { t } from '../../i18n';
import type { SavePeek } from '../../state/save';
import arte from '../../assets/abertura.webp';
import { Figurinha } from './Figurinha';
import './Abertura.css';

// T48 (SPEC 7, v2.34): a abertura. Arte do túnel (docs/arte/abertura) com o "10" gigante "carimbando" nas costas do
// jogador (animação desligada com prefers-reduced-motion), a marca no amarelo da braçadeira e "Nova carreira".
// T54 (v2.39): com carreira salva, "Continuar" vem primeiro e "Nova carreira" pergunta antes de apagar.
// T57c (v2.49): "Desafio do dia" (`dia` = "AAAA-MM-DD" de Brasília) ao lado de "Nova carreira"; também pergunta antes de apagar.
// v2.81 (direção "Álbum", proposta A): a abertura é a capa do álbum, em verde-noite com faixas de grama. A arte do túnel é a
// figurinha da capa (moldura de ouro, selo "Álbum da carreira", o "10" carimbado nas costas); "Desafio do dia" é pequeno;
// com carreira salva, o card pequeno do jogador e "Continuar" primeiro. A capa se monta numa animação curta (luzes, a
// figurinha cola, o 10 carimba, brilho e botões); um toque pula para o fim. Nada gira.
export interface AberturaProps { saved: SavePeek; onNew: () => void; onDesafio: () => void; dia: string; onContinue: () => void }
type Starting = 'nova' | 'desafio';

export function Abertura({ saved, onNew, onDesafio, dia, onContinue }: AberturaProps) {
  const first = useRef(null as HTMLButtonElement | null);
  const [asking, setAsking] = useState(null as Starting | null);
  // um toque (ou tecla) na capa pula a animação de montagem
  const [pronta, setPronta] = useState(false);
  useEffect(() => { first.current?.focus(); }, []);
  const hasSave = saved.status !== 'nenhum';
  const name = saved.status === 'salvo' ? saved.name : null;
  const run = (what: Starting) => { if (what === 'desafio') onDesafio(); else onNew(); };
  function start(what: Starting) { if (hasSave) setAsking(what); else run(what); }
  return (
    <main className="abertura" data-tema="escuro" data-pronta={pronta || undefined} onPointerDown={() => { setPronta(true); }} onKeyDown={() => { setPronta(true); }}>
      <header className="abertura__topo">
        <h1 className="abertura__marca" aria-label={t('ui.abertura.titulo')}>
          <span aria-hidden="true">{t('ui.abertura.marca.dez')}</span>
          <span className="abertura__marca-e" aria-hidden="true">{t('ui.abertura.marca.e')}</span>
          <span aria-hidden="true">{t('ui.abertura.marca.faixa')}</span>
        </h1>
        <p className="abertura__lema">{t('ui.abertura.lema')}</p>
      </header>
      <div className="abertura__figurinha">
        <div className="abertura__arte">
          <img src={arte} alt={t('ui.abertura.arteAlt')} width="928" height="1152" fetchPriority="high" />
          <span className="abertura__numero" aria-hidden="true">10</span>
          <span className="abertura__brilho" aria-hidden="true" />
        </div>
        <span className="abertura__selo">{t('ui.abertura.selo')}</span>
      </div>
      <footer className="abertura__acoes">
        {saved.status === 'salvo' && (
          <div className="abertura__salvo">
            <Figurinha tamanho="pequena" name={saved.name} number={saved.shirtNumber} position={saved.position} visual={saved.visual} />
            <span className="abertura__salvo-texto">
              <strong>{saved.name}</strong>
              <span>{t('ui.abertura.salvoLinha', { posicao: t(`positions.${saved.position}`), numero: saved.shirtNumber })}</span>
            </span>
          </div>
        )}
        {hasSave && (
          <button ref={first} type="button" className="abertura__botao" onClick={onContinue}>
            {name ? t('ui.abertura.continuar', { nome: name }) : t('ui.abertura.continuarSemNome')}
          </button>
        )}
        <div className="abertura__secundarios">
          <button ref={hasSave ? undefined : first} type="button" className={hasSave ? 'abertura__botao abertura__botao--secundario abertura__botao--pequeno' : 'abertura__botao'}
            onClick={() => { start('nova'); }}>
            {t('ui.abertura.novaCarreira')}
          </button>
          <button type="button" className="abertura__botao abertura__botao--secundario abertura__botao--pequeno" onClick={() => { start('desafio'); }}>
            {t('ui.abertura.desafio', { data: `${dia.slice(8, 10)}/${dia.slice(5, 7)}` })}
          </button>
        </div>
        <p className="abertura__aviso">{t('ui.abertura.avisoLegal')}</p>
      </footer>
      {asking && <Confirm name={name} onConfirm={() => { run(asking); }} onCancel={() => { setAsking(null); }} />}
    </main>
  );
}

/** "Começar outra carreira?": uma carreira salva por vez, então começar outra apaga a atual (v2.39). */
export function Confirm({ name, onConfirm, onCancel }: { name: string | null; onConfirm: () => void; onCancel: () => void }) {
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
