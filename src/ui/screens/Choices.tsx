import { useEffect, useRef } from 'react';
import { t } from '../../i18n';
import { revealChecked } from './reveal';

// T50 (v2.30): grupo de escolha da criação. Rádio nativo (setas trocam a opção, Tab passa de grupo) numa faixa que
// desliza para o lado, ou desenhado sobre o campinho (variante "campo", posições).
export interface Option {
  id: string; label: string; swatch?: string;
  /** Nome completo para o leitor de tela quando o texto visível é uma sigla ("GOL" → "Goleiro"). */
  full?: string;
  /** Frase dentro do cartão (variante "cartoes"), lida como descrição da opção. */
  detail?: string;
  /** Variante "miniaturas": a imagem do busto (`null` enquanto carrega). Só a presença da chave liga a miniatura. */
  thumb?: string | null;
}

export const NONE = 'nenhuma';
export const swatches = (list: { id: string; hex: string }[], prefix: string): Option[] =>
  list.map((o) => ({ id: o.id, label: t(`${prefix}.${o.id}`), swatch: o.hex }));
export const named = (list: readonly string[], prefix: string): Option[] => list.map((id) => ({ id, label: t(`${prefix}.${id}`) }));
export const withNone = (opts: Option[], prefix: string): Option[] => [{ id: NONE, label: t(`${prefix}.${NONE}`) }, ...opts];

export interface ChoicesProps {
  id: string; name: string; legend: string; options: Option[]; value: string; onChange: (v: string) => void;
  error?: string | null;
  /** Frase sobre a opção escolhida (efeito, traço); vira descrição do grupo. */
  hint?: string | null;
  variant?: 'faixa' | 'campo' | 'cartoes' | 'miniaturas';
}

/** Ids das descrições do grupo: o erro primeiro, depois a frase da escolha. */
function describedBy(id: string, error: string | null, hint: string | null) {
  const ids = [error ? `${id}-erro` : '', hint ? `${id}-dica` : ''].filter(Boolean).join(' ');
  return ids || undefined;
}

export function Choices({ id, name, legend, options, value, onChange, error = null, hint = null, variant = 'faixa' }: ChoicesProps) {
  const list = useRef(null as HTMLDivElement | null);
  useEffect(() => { revealChecked(list.current); }, [value]);
  return (
    <div className={`escolhas escolhas--${variant}`}>
      <span id={`${id}-rotulo`} className="escolhas__rotulo">{legend}</span>
      <div className="escolhas__lista" ref={list} role="radiogroup" aria-labelledby={`${id}-rotulo`}
        aria-describedby={describedBy(id, error, hint)} aria-invalid={error ? true : undefined}>
        {options.map((o, i) => (
          <label key={o.id} className={o.swatch ? 'escolha escolha--cor' : 'escolha'} data-opcao={o.id}>
            <input className="escolha__input sr-only" type="radio" name={name} value={o.id} checked={value === o.id}
              data-campo={i === 0 ? name : undefined} onChange={() => onChange(o.id)} {...detailProps(`${id}-${o.id}`, o)} />
            <ChoiceMark option={o} id={`${id}-${o.id}-nome`} />
            <OptionDetail option={o} id={`${id}-${o.id}-detalhe`} />
          </label>
        ))}
      </div>
      <p id={`${id}-dica`} className="criacao__dica escolhas__dica" hidden={!hint}>{hint}</p>
      <p id={`${id}-erro`} className="criacao__erro escolhas__erro" hidden={!error}>{error}</p>
    </div>
  );
}

/** Com frase, o nome do rádio é só o nome do cartão e a frase vira a descrição (clicar na frase ainda marca a opção). */
function detailProps(base: string, o: Option) {
  if (!o.detail) return {};
  return { 'aria-labelledby': `${base}-nome`, 'aria-describedby': `${base}-detalhe` };
}

function OptionDetail({ option, id }: { option: Option; id: string }) {
  if (!option.detail) { return null; }
  return <span id={id} className="escolha__detalhe">{option.detail}</span>;
}

/** Cor vira amostra e sigla vira texto curto, com o nome completo escondido para o leitor de tela. */
function ChoiceMark({ option, id }: { option: Option; id: string }) {
  if ('thumb' in option) {
    return (
      <span className="escolha__marca escolha__marca--miniatura" title={option.label}>
        {option.thumb ? <img className="escolha__miniatura" src={option.thumb} alt="" /> : <span className="escolha__espera" aria-hidden="true" />}
        <span className="sr-only">{option.label}</span>
      </span>
    );
  }
  if (option.full) {
    return (
      <span className="escolha__marca">
        <span aria-hidden="true">{option.label}</span>
        <span className="sr-only">{option.full}</span>
      </span>
    );
  }
  if (!option.swatch) { return <span id={id} className="escolha__marca">{option.label}</span>; }
  return (
    <span className="escolha__marca" title={option.label}>
      <span className="escolha__amostra" style={{ background: option.swatch }} aria-hidden="true" />
      <span className="sr-only">{option.label}</span>
    </span>
  );
}
