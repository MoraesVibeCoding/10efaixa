import { titleBase, titleCountry } from '../../engine/titleId';
import { hasText, t } from '../../i18n';

// v2.90: onde procurar o nome de liga e de copa nacional de cada país (competitions.json)
const CHAVES: Record<string, string[]> = {
  ligaNacional: ['competitions.europa.liga', 'competitions.foraDoEixo', 'competitions.outrasLigas'],
  copaNacional: ['competitions.europa.copa'],
};

/** Nome do título na tela: "Liga Inglesa", "Copa da Espanha"; sem país, o nome de sempre (ui.titulo). */
export function tituloNome(id: string): string {
  const base = titleBase(id);
  const pais = titleCountry(id);
  const chave = pais ? CHAVES[base]?.map((k) => `${k}.${pais}`).find(hasText) : undefined;
  return t(chave ?? `ui.titulo.${base}`);
}
