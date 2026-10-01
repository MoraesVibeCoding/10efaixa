import type { Prng } from './prng';
import cfg from '../data/dualNationality.json';
import nt from '../data/nationalTeam.json';
import tour from '../data/nationalTournaments.json';

// T38 (SPEC 6.11): dupla nacionalidade. Convite só enquanto o Brasil não convocou; aceitar é definitivo.
export interface InviteInput { age: number; brazilCaps: number; visibility: number; country: string | null; decided: boolean }


const STRENGTH: Record<string, number> = { ...tour.selecoes.americas, ...tour.selecoes.resto };

/** Ascendência sorteada na criação (sempre 2 sorteios): a maioria não tem. */
export function ancestry(rng: Prng): string | null {
  const [u1, u2] = [rng.next(), rng.next()];
  if (u1 >= cfg.ascendencia.chance) return null;
  const entries = Object.entries(cfg.ascendencia.paises);
  let roll = u2 * entries.reduce((sum, [, w]) => sum + w, 0);
  for (const [country, w] of entries) if ((roll -= w) < 0) return country;
  return entries.at(-1)![0];
}

/** Naturalização por residência: temporadas seguidas ou não na mesma liga europeia. */
export const residenceCountry = (league: string, seasons: number): string | null =>
  seasons >= cfg.residencia.temporadas ? (cfg.residencia.ligas as Record<string, string>)[league] ?? null : null;

export const teamStrength = (country: string): number => STRENGTH[country] ?? tour.brasil.forca;

/** Quanto o corte da outra seleção fica abaixo do corte do Brasil (seleção mais fraca convoca com nota menor). */
export const cutOffset = (country: string): number =>
  Math.min(0, (teamStrength(country) - tour.brasil.forca) * cfg.convite.cortePorPontoDeForca) - cfg.convite.folga;

/** Convite: uma vez, só sem convocação pela principal do Brasil, quando a outra seleção já convocaria. */
export const invited = (i: InviteInput): boolean =>
  !i.decided && i.country !== null && i.brazilCaps === 0 && i.age >= cfg.convite.idadeMin
  && i.visibility >= nt.principal.lista + cutOffset(i.country);
