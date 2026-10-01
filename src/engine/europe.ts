import { CLUBS } from './clubs';
import { FOREIGN } from './cups';
import data from '../data/europe.json';

// T29 (SPEC 6.10, 6.12): 6 ligas europeias, pool UEFA de outras ligas e ligas fora do eixo.
// A reputação ordena dentro da liga; o bônus de nível da liga compara elencos entre ligas.
export interface EuroClub { id: string; nome: string; sigla: string; liga: string; reputacao: number; rivais: string[] }

export function validateEurope(d: unknown): string[] {
  const x = d as typeof data;
  const errors: string[] = [];
  const byId = new Map(x.clubs.map((c) => [c.id, c]));
  for (const [liga, def] of Object.entries(x.ligas)) {
    const n = x.clubs.filter((c) => c.liga === liga).length;
    if (n !== def.clubes) errors.push(`${liga}: ${n} clubes, esperado ${def.clubes}`);
    if (!/^https:\/\//.test(def.fonte)) errors.push(`${liga}: fonte ausente`);
  }
  for (const c of x.clubs) {
    if (!(c.liga in x.ligas)) errors.push(`${c.id}: liga desconhecida`);
    if (!Number.isInteger(c.reputacao) || c.reputacao < 1 || c.reputacao > 100) errors.push(`${c.id}: reputação fora de 1–100`);
    for (const r of c.rivais) {
      const o = byId.get(r);
      if (!o) errors.push(`${c.id}: rival inexistente ${r}`);
      else if (o.liga !== c.liga) errors.push(`${c.id}: rival ${r} é de outra liga`);
      else if (!o.rivais.includes(c.id)) errors.push(`${c.id}: rivalidade com ${r} não é simétrica`);
    }
  }
  for (const c of x.foraDoEixo.clubs) if (!(c.liga in x.foraDoEixo.ligas)) errors.push(`${c.id}: liga fora do eixo desconhecida`);
  return errors;
}

const errs = validateEurope(data);
if (errs.length) throw new Error(`europe.json inválido:\n${errs.join('\n')}`);

export const EUROPE = data.clubs as EuroClub[];
export const EURO_LEAGUES = Object.keys(data.ligas);
export const europeClubsIn = (liga: string) => EUROPE.filter((c) => c.liga === liga);

const EURO = new Map(EUROPE.map((c) => [c.id, c]));
const BONUS = new Map<string, number>([
  ...EUROPE.map((c) => [c.id, data.ligas[c.liga as keyof typeof data.ligas].bonusNivel] as const),
  ...data.outros.clubs.map((c) => [c.id, data.outros.bonusNivel] as const),
  ...data.foraDoEixo.clubs.map((c) => [c.id, data.foraDoEixo.ligas[c.liga as keyof typeof data.foraDoEixo.ligas].bonusNivel] as const),
]);
const REP = new Map<string, number>([
  ...CLUBS.map((c) => [c.id, c.reputacao] as const), ...FOREIGN.map((c) => [c.id, c.reputacao] as const),
  ...EUROPE.map((c) => [c.id, c.reputacao] as const), ...data.outros.clubs.map((c) => [c.id, c.reputacao] as const),
  ...data.foraDoEixo.clubs.map((c) => [c.id, c.reputacao] as const),
]);

/** Bônus de nível da liga do clube (0 para Brasil e América do Sul). */
export const levelBonus = (id: string) => BONUS.get(id) ?? 0;
/** Reputação comparável entre ligas: reputação + bônus de nível. Vale para qualquer clube do jogo. */
export const effectiveRep = (id: string) => (REP.get(id) ?? 50) + levelBonus(id);
export const areEuroRivals = (a: string, b: string) => EURO.get(a)?.rivais.includes(b) ?? false;
