import { useEffect, useMemo, useRef, useState } from 'react';
import type { CareerResult } from '../../engine/career';
import { t } from '../../i18n';
import { cardModel } from '../../share/cardModel';
import { careerLinkFragment, type CareerLinkData } from '../../share/careerLink';
import { CARD_SIZE, drawCard, type CardImages, type CardVersion } from '../../share/drawCard';
import { cardFileName, downloadFile, shareCard, shareText } from '../../share/share';
import { loadCardImages } from './cardImages';
import './Cartao.css';

// T55d (SPEC 6.15, v2.42): o cartão final em Canvas 2D, versão narrativa primeiro; o texto alternativo descreve a versão à vista.
const VERSIONS: CardVersion[] = ['narrativa', 'estatistica'];

/** `link` (T57e): dados do link da carreira; presente só na carreira jogada agora (ao rever um link não há "Copiar link"). */
/** `onJogar` (T57d): presente só ao rever um link; mostra o aviso de só leitura e "Jogar este desafio". */
/** `desafio` = dia "AAAA-MM-DD" do desafio do dia (T57c); ausente = carreira livre, sem selo. */
export function Cartao({ result, code, visual, desafio, link, onJogar, onRestart }: { result: CareerResult; code: string; visual?: string; desafio?: string; link?: CareerLinkData; onJogar?: () => void; onRestart: () => void }) {
  const [version, setVersion] = useState('narrativa' as CardVersion);
  const canvas = useRef(null as HTMLCanvasElement | null);
  const model = useMemo(() => cardModel(result, code), [result, code]);
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
    <main className="cartao" data-tema="claro">
      <h1 className="cartao__titulo">{t('ui.cartao.titulo')}</h1>
      {desafio && <p className="cartao__selo">{t('ui.cartao.desafio', { data: `${desafio.slice(8, 10)}/${desafio.slice(5, 7)}` })}</p>}
      {onJogar && <p className="cartao__aviso">{t('ui.rever.aviso')}</p>}
      <div className="cartao__versoes" role="group" aria-label={t('ui.cartao.versoes')}>
        {VERSIONS.map((v) => (
          <button key={v} type="button" aria-pressed={version === v} onClick={() => { setVersion(v); }}>{t(`ui.cartao.${v}`)}</button>
        ))}
      </div>
      <canvas ref={canvas} className="cartao__imagem" role="img" aria-label={model.alt[version]} width={CARD_SIZE.width} height={CARD_SIZE.height} />
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
