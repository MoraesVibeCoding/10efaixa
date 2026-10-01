import cfg from '../data/dualNationality.json';
import nt from '../data/nationalTeam.json';
import tour from '../data/nationalTournaments.json';

// T38 (SPEC 6.11): dupla nacionalidade. Convite só enquanto o Brasil não convocou; aceitar é definitivo.
export interface InviteInput { age: number; brazilCaps: number; visibility: number; country: string | null; decided: boolean }


const STRENGTH: Record<string, number> = { ...tour.selecoes.americas, ...tour.selecoes.resto };

/** Descoberta no meio da carreira (6.1): temporadas, seguidas ou não, na liga do país. */
export const residenceCountry = (league: string, seasons: number): string | null =>
  seasons >= cfg.residencia.temporadas ? (cfg.residencia.ligas as Record<string, string>)[league] ?? null : null;

/** Nome da seleção (chave da tabela de forças) a partir do id do país da criação. */
export const teamName = (country: string): string => (cfg.selecao as Record<string, string>)[country] ?? country;
export const teamStrength = (country: string): number => STRENGTH[teamName(country)] ?? tour.brasil.forca;

/** Quanto o corte da outra seleção fica abaixo do corte do Brasil (seleção mais fraca convoca com nota menor). */
export const cutOffset = (country: string): number =>
  Math.min(0, (teamStrength(country) - tour.brasil.forca) * cfg.convite.cortePorPontoDeForca) - cfg.convite.folga;

/** Convite: uma vez, só sem convocação pela principal do Brasil, quando a outra seleção já convocaria. */
export const invited = (i: InviteInput): boolean =>
  !i.decided && i.country !== null && i.brazilCaps === 0 && i.age >= cfg.convite.idadeMin
  && i.visibility >= nt.principal.lista + cutOffset(i.country);
