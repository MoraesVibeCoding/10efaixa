import bands from '../../data/bands.json';
import { t } from '../../i18n';
import './Niveis.css';

// Os atributos em faixa (SPEC 6.3): a palavra e uma barra de seis degraus, um por faixa. Nenhum número.
// Usado na gaveta "Minha carreira" (decisão) e na revelação do jogador (T49i).
const BAND_KEYS = bands.map((b) => { return b.key; });

/** `rotulos` (v2.69) troca a palavra de alguma faixa nesta lista (a revelação chama a mais baixa de "Cru"). */
export function Niveis({ items, labelledBy, rotulos = {} }: { items: { id: string; band: string }[]; labelledBy: string; rotulos?: Partial<Record<string, string>> }) {
  return (
    <ul className="niveis" aria-labelledby={labelledBy}>
      {items.map(({ id, band }) => {
        const filled = BAND_KEYS.indexOf(band) + 1;
        return (
          <li key={id}>
            <span className="niveis__nome">{t(`attributes.attribute.${id}`)}</span>
            <span className="niveis__faixa">{rotulos[band] ?? t(`attributes.band.${band}`)}</span>
            <span className="nivel" aria-hidden="true">
              {bands.map((b, i) => <i key={b.key} data-cheio={i < filled ? '' : undefined} />)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
