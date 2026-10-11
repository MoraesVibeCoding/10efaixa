import europe from '../data/europe.json';
import foreign from '../data/foreignClubs.json';

// v2.90: liga e copa nacional fora do Brasil levam o país do clube no id ("ligaNacional:ENG"), para o nome e o troféu
// de cada país. O motor guarda só a base (pontos de legado e prêmios não mudam); o país vem do clube do título.
const POR_PAIS = new Set(['ligaNacional', 'copaNacional']);
const COUNTRY = new Map<string, string>([
  ...europe.clubs.map((c) => [c.id, c.liga] as const),
  ...europe.foraDoEixo.clubs.map((c) => [c.id, c.liga] as const),
  ...europe.outros.clubs.map((c) => [c.id, c.pais] as const),
  ...foreign.clubs.map((c) => [c.id, c.pais] as const),
]);

/** Id do título para a tela: a competição e, na liga e na copa nacional, o país do clube. */
export function titleId(t: { competition: string; clubId?: string }): string {
  const pais = POR_PAIS.has(t.competition) && t.clubId ? COUNTRY.get(t.clubId) : undefined;
  return pais ? `${t.competition}:${pais}` : t.competition;
}

export const titleBase = (id: string) => id.split(':')[0]!;
export const titleCountry = (id: string): string | undefined => id.split(':')[1];

/** Países que podem aparecer num título (os nomes em competitions.json cobrem todos). */
export const TITLE_COUNTRIES = [...new Set(COUNTRY.values())];
