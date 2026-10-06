// v2.47: o que aconteceu desde a decisão anterior e merece carimbo (título, acesso, rebaixamento).
export type Moment = { kind: 'titulo'; competition: string } | { kind: 'acesso' } | { kind: 'rebaixamento' };

interface Snapshot { titles: { competition: string }[]; seasons: { clubId: string; division: string | null }[] }

const SERIE = /^BRA-([A-D])$/;

export function momentsBetween(antes: Snapshot | undefined, agora: Snapshot): Moment[] {
  if (!antes) return [];
  const out: Moment[] = agora.titles.slice(antes.titles.length).map((x) => ({ kind: 'titulo' as const, competition: x.competition }));
  for (let i = Math.max(1, antes.seasons.length); i < agora.seasons.length; i++) {
    const prev = agora.seasons[i - 1]!;
    const cur = agora.seasons[i]!;
    const a = SERIE.exec(prev.division ?? '')?.[1];
    const b = SERIE.exec(cur.division ?? '')?.[1];
    if (prev.clubId !== cur.clubId || !a || !b || a === b) continue;
    out.push({ kind: b < a ? 'acesso' : 'rebaixamento' });
  }
  return out;
}
