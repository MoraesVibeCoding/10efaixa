import { useEffect, useRef } from 'react';
import { t } from '../../i18n';
import { CenaPintada, cutForVisual } from './CenaPintada';
import { Figurinha } from './Figurinha';
import { Niveis } from './Niveis';
import type { Reveal } from './revealView';
import './Revelacao.css';

// T49i (SPEC 6.1, 7; v2.34): o sorteio revelado num <dialog> modal de vidro. A figurinha "cola" no álbum (animação
// desligada com prefers-reduced-motion), o Over em número, o selo "Diamante bruto" e os atributos só em faixa.
// showModal (MDN: Chrome 37, Safari 15.4, Firefox 98) prende o foco, deixa o resto inerte e fecha com Esc (evento cancel).
export interface RevelacaoProps { name: string; number?: number; visual?: string; reveal: Reveal; onContinue: () => void }

export function Revelacao({ name, number, visual, reveal, onContinue }: RevelacaoProps) {
  const dialog = useRef(null as HTMLDialogElement | null);
  const title = useRef(null as HTMLHeadingElement | null);
  const done = useRef(false);
  function finish() {
    if (done.current) return;
    done.current = true;
    onContinue();
  }
  useEffect(() => {
    const el = dialog.current;
    if (!el || el.open) return;
    // sem showModal (navegador antigo), abre sem modal: a tela nunca fica vazia
    if (typeof el.showModal === 'function') el.showModal();
    else el.setAttribute('open', '');
    // v2.69: o foco abre no título (antes ia ao botão do fim e, em 360 px, rolava o título para fora da tela)
    title.current?.focus();
  }, []);
  // Esc pede para fechar: em vez de só sumir, segue para a carreira, como o botão
  function onCancel(e: React.SyntheticEvent) {
    e.preventDefault();
    finish();
  }
  return (
    <div className="revelacao__palco">
      {/* v2.69: a cena do vestiário ao fundo, com o uniforme neutro (ainda não há clube) */}
      <CenaPintada scene="vestiario" cut={cutForVisual(visual)} clubId="" alt="" decorativa />
      <dialog ref={dialog} className="revelacao vidro" aria-labelledby="revelacao-titulo" aria-describedby="revelacao-sub" onCancel={onCancel}>
        <h1 id="revelacao-titulo" className="revelacao__titulo" ref={title} tabIndex={-1}>{t('ui.revelacao.titulo')}</h1>
        <p id="revelacao-sub" className="revelacao__sub">{t('ui.revelacao.subtitulo', { nome: name })}</p>
        <div className="revelacao__figurinha">
          <Figurinha moldura tamanho="grande" name={name} number={number} overall={reveal.overall} visual={visual} />
        </div>
        {reveal.isDiamond ? <Diamante /> : null}
        <h2 id="revelacao-fortes" className="revelacao__rotulo">{t('ui.revelacao.fortes')}</h2>
        <ul className="revelacao__fortes" aria-labelledby="revelacao-fortes">
          {reveal.fortes.map((id) => <li key={id}>{t(`attributes.attribute.${id}`)}</li>)}
        </ul>
        <p className="revelacao__apoio">{t('ui.revelacao.fortesApoio')}</p>
        <details className="revelacao__todos">
          <summary>{t('ui.revelacao.verTodos')}</summary>
          <h2 id="revelacao-atributos" className="revelacao__rotulo">{t('ui.revelacao.atributos')}</h2>
          <Niveis items={reveal.bands} labelledBy="revelacao-atributos" rotulos={{ fraco: t('ui.revelacao.cru') }} />
        </details>
        <button type="button" className="revelacao__comecar" onClick={finish}>{t('ui.revelacao.seguir')}</button>
      </dialog>
    </div>
  );
}

/** Selo dourado do diamante bruto (bônus de teto da várzea): cor de raridade, com o texto da medalha de ouro. */
function Diamante() {
  return (
    <p className="revelacao__selo" data-medalha="ouro">
      <strong>{t('ui.revelacao.diamante')}</strong>
      <span>{t('ui.revelacao.diamanteFrase')}</span>
    </p>
  );
}
