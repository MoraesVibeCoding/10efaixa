import { useEffect, useMemo, useRef, useState } from 'react';
import type { CareerResult } from '../../engine/career';
import { t } from '../../i18n';
import { cardModel } from '../../share/cardModel';
import { CARD_SIZE, drawCard, type CardImages, type CardVersion } from '../../share/drawCard';
import { loadImage } from '../../share/loadImage';
import './Cartao.css';

// T55d (SPEC 6.15, v2.42): o cartão final em Canvas 2D, versão narrativa primeiro; o texto alternativo descreve a versão à vista.
const PORTRAITS = import.meta.glob('../../assets/visuais/visual-[0-9][0-9].webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const MASKS = import.meta.glob('../../assets/visuais/*-camisa.webp', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const VERSIONS: CardVersion[] = ['narrativa', 'estatistica'];

export function Cartao({ result, code, visual, onRestart }: { result: CareerResult; code: string; visual?: string; onRestart: () => void }) {
  const [version, setVersion] = useState('narrativa' as CardVersion);
  const canvas = useRef(null as HTMLCanvasElement | null);
  const model = useMemo(() => cardModel(result, code), [result, code]);
  const [images, setImages] = useState({} as CardImages);
  useEffect(() => {
    let live = true;
    const base = '../../assets/visuais/';
    void Promise.all([loadImage(visual && PORTRAITS[`${base}${visual}.webp`]), loadImage(visual && MASKS[`${base}${visual}-camisa.webp`]), document.fonts?.ready])
      .then(([portrait, mask]) => {
        if (live) setImages({ portrait, mask, makeCanvas: (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h }) });
      });
    return () => { live = false; };
  }, [visual]);
  useEffect(() => {
    // o jsdom não desenha (getContext devolve null); o desenho é testado em drawCard.test.ts
    const ctx = canvas.current?.getContext('2d');
    if (ctx) drawCard(ctx, model, version, images);
  }, [model, version, images]);

  return (
    <main className="cartao" data-tema="claro">
      <h1 className="cartao__titulo">{t('ui.cartao.titulo')}</h1>
      <div className="cartao__versoes" role="group" aria-label={t('ui.cartao.versoes')}>
        {VERSIONS.map((v) => (
          <button key={v} type="button" aria-pressed={version === v} onClick={() => { setVersion(v); }}>{t(`ui.cartao.${v}`)}</button>
        ))}
      </div>
      <canvas ref={canvas} className="cartao__imagem" role="img" aria-label={model.alt[version]} width={CARD_SIZE.width} height={CARD_SIZE.height} />
      <button type="button" className="cartao__nova" onClick={onRestart}>{t('ui.fim.novaCarreira')}</button>
    </main>
  );
}
