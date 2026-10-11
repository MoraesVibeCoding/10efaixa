// v2.47: o que aconteceu desde a decisão anterior e merece carimbo (título, acesso, rebaixamento).
export type Moment = { kind: 'titulo'; competition: string } | { kind: 'acesso' | 'rebaixamento'; serie: string };

/** O retrato de uma decisão: as temporadas fechadas e, v2.84, o ano, o clube e a divisão de agora. */
interface Snapshot {
  titles: { competition: string }[];
  seasons: { year: number; clubId: string; division: string | null }[];
  year: number; clubId: string | null; divisao: string | null;
}

const SERIE = /^BRA-([A-D])$/;

// v2.84: a divisão de cada ano, com a temporada em andamento no fim (a divisão dela já vale desde o começo do ano).
// Antes a comparação usava só as temporadas fechadas, e a queda de 2031 só carimbava no fim de 2032, junto com o
// título daquele ano ("ao ser campeão, aparece o carimbo de rebaixamento").
function linha(s: Snapshot) {
  const anos = s.seasons.filter((x) => x.year < s.year);
  return s.clubId ? [...anos, { year: s.year, clubId: s.clubId, division: s.divisao }] : anos;
}

export function momentsBetween(antes: Snapshot | undefined, agora: Snapshot): Moment[] {
  if (!antes) return [];
  const out: Moment[] = agora.titles.slice(antes.titles.length).map((x) => ({ kind: 'titulo' as const, competition: x.competition }));
  const anos = linha(agora);
  for (let i = 1; i < anos.length; i++) {
    const prev = anos[i - 1]!;
    const cur = anos[i]!;
    // só as viradas de ano que a decisão anterior ainda não tinha visto
    if (cur.year <= antes.year) continue;
    const a = SERIE.exec(prev.division ?? '')?.[1];
    const b = SERIE.exec(cur.division ?? '')?.[1];
    if (prev.clubId !== cur.clubId || !a || !b || a === b) continue;
    out.push({ kind: b < a ? 'acesso' : 'rebaixamento', serie: b });
  }
  return out;
}
