import { useEffect, useMemo, useRef, useState } from 'react';
import type { CareerResult } from '../../engine/career';
import { t } from '../../i18n';
import { cardModel } from '../../share/cardModel';
import { careerLinkFragment, type CareerLinkData } from '../../share/careerLink';
import { CARD_SIZE, drawCard, type CardImages, type CardVersion } from '../../share/drawCard';
import { cardFileName, downloadFile, shareCard, shareText } from '../../share/share';
import { loadCardImages } from './cardImages';
import { Emblema } from './Emblema';
import { Figurinha } from './Figurinha';
import { TrophyIcon } from './TrophyIcon';
import { clubName } from './clubText';
import { MOTION, reducedMotion } from '../motion';
import './Cartao.css';

// T55d (SPEC 6.15, v2.42): o cartão final em Canvas 2D, versão narrativa primeiro; o texto alternativo descreve a versão à vista.
// v2.81 (direção "Álbum", PR 4): a tela é a contracapa do álbum, em verde-noite, com o card grande de fim de carreira de
// frente e verso em HTML (a frente é a história; o verso, os números). O card vira uma vez sozinho depois que as metas se
// preenchem (sem movimento, não vira); depois, "Toque para virar". A imagem de compartilhar continua no Canvas, fora da
// vista, e acompanha o lado à vista (frente: versão narrativa; verso: estatística).
type Lado = 'frente' | 'verso';
/** Na frente do card, só jogos, gols e assistências (goleiro: jogos sem sofrer gol); o resto vai no verso. */
const FRENTE: ReadonlySet<string> = new Set(['jogos', 'gols', 'assistencias', 'semSofrerGol']);
function naFrente(x: { id: string }) { return FRENTE.has(x.id); }
function clubeDe(x: { clubId: string }) { return x.clubId; }
const VERSAO: Record<Lado, CardVersion> = { frente: 'narrativa', verso: 'estatistica' };

/** `link` (T57e): dados do link da carreira; presente só na carreira jogada agora (ao rever um link não há "Copiar link"). */
/** `onJogar` (T57d): presente só ao rever um link; mostra o aviso de só leitura e "Jogar este desafio". */
/** `desafio` = dia "AAAA-MM-DD" do desafio do dia (T57c); ausente = carreira livre, sem selo. */
export function Cartao({ result, code, visual, desafio, link, onJogar, onRestart }: { result: CareerResult; code: string; visual?: string; desafio?: string; link?: CareerLinkData; onJogar?: () => void; onRestart: () => void }) {
  const [lado, setLado] = useState('frente' as Lado);
  const version = VERSAO[lado];
  // vira uma vez sozinho; um toque antes disso cancela a virada automática
  const tocou = useRef(false);
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const timer = setTimeout(() => { if (!tocou.current) setLado('verso'); }, MOTION.virarFimMs);
    return () => { clearTimeout(timer); };
  }, []);
  function virar() { tocou.current = true; setLado((l) => (l === 'frente' ? 'verso' : 'frente')); }
  const canvas = useRef(null as HTMLCanvasElement | null);
  const model = useMemo(() => cardModel(result, code), [result, code]);
  const idolos = useMemo(() => new Set(model.idolos.map(clubeDe)), [model]);
  const [images, setImages] = useState({} as CardImages);
  useEffect(() => {
    let live = true;
    void loadCardImages(result, visual).then((imgs) => { if (live) setImages(imgs); });
    return () => { live = false; };
  }, [visual, result]);
  // T56: a imagem fica pronta antes do toque, porque o compartilhamento nativo exige o gesto do usuário (MDN)
  const [file, setFile] = useState(null as File | null);
  const [status, setStatus] = useState('');
  useEffect(() => {
    // o jsdom não desenha (getContext devolve null); o desenho é testado em drawCard.test.ts
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    drawCard(ctx, model, version, images);
    setFile(null);
    el.toBlob(function ready(blob) { if (blob) setFile(new File([blob], cardFileName(model.codigo), { type: 'image/png' })); }, 'image/png');
  }, [model, version, images]);
  const nativeShare = typeof navigator.canShare === 'function';
  async function share() {
    if (file) setStatus(t(`ui.compartilhar.${await shareCard(file, shareText(model), navigator, downloadFile)}`));
  }
  function download() {
    if (!file) return;
    downloadFile(file);
    setStatus(t('ui.compartilhar.baixado'));
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(shareText(model));
      setStatus(t('ui.compartilhar.copiado'));
    } catch {
      setStatus(t('ui.compartilhar.naoCopiou'));
    }
  }

  async function copyLink() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}${careerLinkFragment(link)}`);
      setStatus(t('ui.compartilhar.linkCopiado'));
    } catch {
      setStatus(t('ui.compartilhar.naoCopiou'));
    }
  }

  return (
    <main className="cartao cartao--contracapa" data-tema="escuro">
      <p className="cartao__topo">
        <span>{t('ui.fim.topo')}</span>
        <span>{t('ui.fim.anos', { de: result.seasons[0]?.year ?? '', ate: result.seasons.at(-1)?.year ?? '' })}</span>
      </p>
      <h1 className="sr-only">{t('ui.cartao.titulo')}</h1>
      {desafio && <p className="cartao__selo">{t('ui.cartao.desafio', { data: `${desafio.slice(8, 10)}/${desafio.slice(5, 7)}` })}</p>}
      {onJogar && <p className="cartao__aviso">{t('ui.rever.aviso')}</p>}
      {/* o card é papel (tema claro) sobre a contracapa escura */}
      <div className="fim" data-lado={lado} data-tema="claro">
        <div className="fim__card">
          <section className="fim__face fim__frente" aria-hidden={lado === 'frente' ? undefined : true} inert={lado !== 'frente'}>
            <div className="fim__foto">
              <Figurinha moldura tamanho="grande" name={model.nome} number={model.numero} overall={model.auge.overall} clubId={model.clubeFigurinha} visual={visual} />
              <span className="fim__aos">{t('ui.fim.aos', { idade: model.auge.idade })}</span>
            </div>
            <p className="fim__veredito">{model.veredito}</p>
            <p className="fim__quem"><strong>{model.nome}</strong> <span>{model.posicao}</span></p>
            <ul className="fim__metas" aria-label={t('ui.fim.metas.titulo')}>
              <li data-feita={String(model.metas.dez)}><span className="fim__meta-marca" aria-hidden="true">10</span>{t(model.metas.dez ? 'ui.fim.metas.dez' : 'ui.fim.metas.semDez')}</li>
              <li data-feita={String(model.metas.faixa)}><span className="fim__meta-marca fim__meta-marca--faixa" aria-hidden="true" />{t(model.metas.faixa ? 'ui.fim.metas.faixa' : 'ui.fim.metas.semFaixa')}</li>
            </ul>
            <ul className="fim__numeros">
              {model.numeros.filter(naFrente).map((x) => <li key={x.id}><strong>{x.valor}</strong><span>{x.nome}</span></li>)}
            </ul>
          </section>
          <section className="fim__face fim__verso" aria-hidden={lado === 'verso' ? undefined : true} inert={lado !== 'verso'}>
            <p className="fim__manchete">{model.manchete}</p>
            <dl className="fim__ficha">
              <div><dt>{t('ui.fim.verso.arco')}</dt><dd>{model.arco}</dd></div>
              {model.sonho && (
                <div><dt>{t('ui.fim.verso.sonho')}</dt><dd className="fim__sonho" data-realizado={String(model.sonho.realizado)}>
                  <Emblema clubId={model.sonho.clubId} size={22} />
                  {t(model.sonho.realizado ? 'ui.fim.verso.sonhoSim' : 'ui.fim.verso.sonhoNao', { prep: clubName(model.sonho.clubId).prep, clube: clubName(model.sonho.clubId).nome })}
                </dd></div>
              )}
              <div><dt>{t('ui.fim.verso.clubes')}</dt><dd className="fim__clubes">
                {model.clubes.map((c, i) => (
                  <span key={`${c}-${i}`} className={idolos.has(c) ? 'fim__clube fim__clube--idolo' : 'fim__clube'}>
                    <Emblema clubId={c} size={24} label />
                    {idolos.has(c) ? <span className="sr-only">{t('ui.fim.verso.idolo')}</span> : null}
                  </span>
                ))}
              </dd></div>
              {model.selecaoLinha && <div><dt>{t('ui.fim.verso.selecao')}</dt><dd>{model.selecaoLinha}</dd></div>}
              {model.tacas.length > 0 && (
                <div><dt>{t('ui.fim.verso.estante')}</dt><dd>
                  <ul className="fim__estante">
                    {model.tacas.map((x) => <li key={x.id}><TrophyIcon id={x.id} size={26} />{x.n > 1 && <span className="fim__taca-n" aria-hidden="true">{x.n}</span>}<span className="sr-only">{t(`ui.titulo.${x.id}`)}</span></li>)}
                  </ul>
                </dd></div>
              )}
            </dl>
            <h2 id="fim-auge" className="fim__rotulo">{t('ui.fim.verso.auge')}</h2>
            <ul className="fim__chips" aria-labelledby="fim-auge">
              {[...model.radar].sort((a, b) => b.valor - a.valor).map((a, i) => <li key={a.id} className={i < 3 ? 'fim__chip fim__chip--top' : 'fim__chip'}><strong>{a.valor}</strong><span>{a.nome}</span></li>)}
            </ul>
            <p className="fim__codigo">{t('ui.fim.verso.codigo', { codigo: model.codigo })}</p>
          </section>
        </div>
        <button type="button" className="fim__virar" onClick={virar}>{t('ui.fim.virar')}</button>
      </div>
      {/* a imagem de compartilhar (Canvas 1080×1350), fora da vista: o card acima já mostra tudo o que ela tem */}
      <canvas ref={canvas} className="cartao__imagem" aria-hidden="true" data-versao={version} width={CARD_SIZE.width} height={CARD_SIZE.height} />
      <div className="cartao__acoes">
        {/* v2.71 (momento 10): uma ação principal só, a primeira que existir: jogar (rever), compartilhar ou baixar a imagem */}
        {onJogar && <button type="button" className="cartao__principal" onClick={onJogar}>{t('ui.rever.jogar')}</button>}
        {nativeShare && <button type="button" className={onJogar ? undefined : 'cartao__principal'} disabled={!file} onClick={() => { void share(); }}>{t('ui.compartilhar.compartilhar')}</button>}
        <button type="button" className={onJogar || nativeShare ? undefined : 'cartao__principal'} disabled={!file} onClick={download}>{t('ui.compartilhar.baixar')}</button>
        <button type="button" onClick={() => { void copy(); }}>{t('ui.compartilhar.copiar')}</button>
        {link && <button type="button" onClick={() => { void copyLink(); }}>{t('ui.compartilhar.copiarLink')}</button>}
      </div>
      <p className="cartao__status" role="status">{status}</p>
      <button type="button" className="cartao__nova" onClick={onRestart}>{t('ui.fim.novaCarreira')}</button>
    </main>
  );
}
