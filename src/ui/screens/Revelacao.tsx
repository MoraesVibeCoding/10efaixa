import { useEffect, useRef, useState } from 'react';
import bands from '../../data/bands.json';
import type { CreationInput } from '../../engine/player';
import { t } from '../../i18n';
import { Bandeira } from './Bandeira';
import { clubName } from './clubText';
import { START_AGE, START_YEAR } from './careerView';
import { Emblema } from './Emblema';
import { Figurinha } from './Figurinha';
import { Niveis } from './Niveis';
import { MOTION } from '../motion';
import { useRolling } from '../useRolling';
import type { Reveal } from './revealView';
import './Revelacao.css';

// T49i (SPEC 6.1, 7; v2.34): o sorteio revelado num <dialog> modal (showModal, MDN: Chrome 37, Safari 15.4, Firefox 98, prende o
// foco, deixa o resto inerte e fecha com Esc pelo evento cancel). v2.81 (direção "Álbum"): a página 1 do álbum, com o card
// grande "Nasce um jogador" de frente e verso. Frente: a figurinha com o Over, o selo da origem, a linha do jogador e as duas
// metas do jogo ainda vazias (a 10 e a faixa). Verso: a ficha, os pontos fortes em estrelas (só palavras para o leitor de
// tela, nunca número) e o sonho, que é o clube de coração. A aparência não entra na ficha: só altura e compleição pesam.
export interface RevelacaoProps { input: CreationInput; visual?: string; reveal: Reveal; onContinue: () => void }

const STARS: Record<string, number> = {};
for (const b of bands) STARS[b.key] = Math.round(b.stars);

/** Estrelas de uma faixa (cinco no máximo); o leitor de tela ouve a palavra da faixa. */
function Estrelas({ band }: { band: string }) {
  const n = STARS[band] ?? 1;
  return (
    <span className="nasce__estrelas" role="img" aria-label={t(`attributes.band.${band}`)}>
      {Array.from({ length: 5 }, (_, i) => <span key={i} className={i < n ? 'nasce__estrela nasce__estrela--cheia' : 'nasce__estrela'} aria-hidden="true" />)}
    </span>
  );
}

export function Revelacao({ input, visual, reveal, onContinue }: RevelacaoProps) {
  const dialog = useRef(null as HTMLDialogElement | null);
  const title = useRef(null as HTMLHeadingElement | null);
  const done = useRef(false);
  const [lado, setLado] = useState('frente' as 'frente' | 'verso');
  // v2.71 (momento 1): o Over conta do 1 até o sorteado, passando pelos metais; sem movimento, já é o final
  const over = useRolling(reveal.overall, 1, MOTION.revelarMs);
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
  const estado = t(`creation.state.${input.state}`);
  const band: Record<string, string> = {};
  for (const b of reveal.bands) band[b.id] = b.band;
  const coracao = input.heartClub ? clubName(input.heartClub) : null;
  const naFrente = lado === 'frente';
  return (
    <div className="revelacao__palco">
      <dialog ref={dialog} className="revelacao" aria-labelledby="revelacao-titulo" aria-describedby="revelacao-sub" onCancel={onCancel}>
        <p className="pagina__topo">
          <span>{t('ui.pagina.numero', { n: 1 })}</span>
          <span>{t('ui.pagina.temporada', { ano: START_YEAR })}</span>
        </p>
        <h1 id="revelacao-titulo" className="revelacao__titulo" ref={title} tabIndex={-1}>{t('ui.revelacao.titulo')}</h1>
        <p id="revelacao-sub" className="revelacao__sub">{t('ui.revelacao.subtitulo', { nome: input.name })}</p>
        <div className="nasce" data-lado={lado}>
          <div className="nasce__card">
            <section className="nasce__face nasce__frente" aria-hidden={naFrente ? undefined : true} inert={!naFrente}>
              <div className="revelacao__figurinha">
                <Figurinha moldura tamanho="grande" name={input.name} number={input.shirtNumber} overall={reveal.overall} mostrado={over} visual={visual} />
                <span className="nasce__origem">{t(`ui.revelacao.origem.${input.origin}`)}</span>
              </div>
              <p className="nasce__linha">
                <Bandeira pais="brasil" />
                <span>{t('ui.revelacao.linha', { posicao: t(`positions.${input.position}`), estado, idade: START_AGE })}</span>
              </p>
              {reveal.isDiamond ? <Diamante /> : null}
              <ul className="nasce__metas" aria-label={t('ui.revelacao.metas.titulo')}>
                <li><span className="nasce__meta-marca" aria-hidden="true">10</span><span className="nasce__meta-texto">{t('ui.revelacao.metas.dez')}</span></li>
                <li><span className="nasce__meta-marca nasce__meta-marca--faixa" aria-hidden="true" /><span className="nasce__meta-texto">{t('ui.revelacao.metas.faixa')}</span></li>
              </ul>
            </section>
            <section className="nasce__face nasce__verso" aria-hidden={naFrente ? true : undefined} inert={naFrente}>
              <h2 className="nasce__ficha-titulo">
                <span>{t('ui.revelacao.ficha.titulo')}</span>
                <span className="nasce__camisa">{t('ui.revelacao.ficha.camisa', { n: input.shirtNumber })}</span>
              </h2>
              <dl className="nasce__ficha">
                <div><dt>{t('ui.revelacao.ficha.origem')}</dt><dd>{t('ui.revelacao.ficha.origemValor', { origem: t(`creation.origin.${input.origin}`), estado })}</dd></div>
                <div><dt>{t('ui.revelacao.ficha.estilo')}</dt><dd>{t('ui.revelacao.ficha.estiloValor', { estilo: t(`archetypes.archetype.${input.archetypeId}`), pe: t(`ui.revelacao.ficha.pe.${input.foot}`) })}</dd></div>
                <div><dt>{t('ui.revelacao.ficha.fisico')}</dt><dd>{t('ui.revelacao.ficha.fisicoValor', { altura: (input.biotype.heightCm / 100).toFixed(2).replace('.', ','), compleicao: t(`creation.build.${input.biotype.build}`).toLowerCase() })}</dd></div>
                <div><dt>{t('ui.revelacao.ficha.temperamento')}</dt><dd><strong>{t(`creation.temperament.${input.temperament}`)}</strong> {t(`creation.temperamentDica.${input.temperament}`)}</dd></div>
              </dl>
              <h3 id="revelacao-fortes" className="revelacao__rotulo">{t('ui.revelacao.fortes')}</h3>
              <ul className="nasce__fortes" aria-labelledby="revelacao-fortes">
                {reveal.fortes.map((id) => <li key={id}><span>{t(`attributes.attribute.${id}`)}</span><Estrelas band={band[id] ?? 'fraco'} /></li>)}
              </ul>
              <p className="nasce__sonho">
                <span className="nasce__sonho-rotulo">{t('ui.revelacao.ficha.sonho')}</span>
                {coracao && input.heartClub
                  ? <span className="nasce__sonho-valor"><Emblema clubId={input.heartClub} size={24} />{t('ui.revelacao.ficha.sonhoClube', { prep: coracao.prep, clube: coracao.nome })}</span>
                  : <span className="nasce__sonho-valor">{t('ui.revelacao.ficha.semSonho')}</span>}
              </p>
              <details className="revelacao__todos">
                <summary>{t('ui.revelacao.verTodos')}</summary>
                <h3 id="revelacao-atributos" className="revelacao__rotulo">{t('ui.revelacao.atributos')}</h3>
                <Niveis items={reveal.bands} labelledBy="revelacao-atributos" rotulos={{ fraco: t('ui.revelacao.cru') }} />
              </details>
            </section>
          </div>
          <button type="button" className="nasce__virar" aria-pressed={!naFrente} onClick={() => { setLado(naFrente ? 'verso' : 'frente'); }}>
            {t('ui.revelacao.virar')}
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M13 8a5 5 0 1 1-1.5-3.6M13 2v3h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
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
