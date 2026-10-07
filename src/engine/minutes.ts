import type { Prng } from './prng';
import cfg from '../data/minutes.json';

// T21: minutos pelo overall relativo ao elenco e pelo papel prometido; forma e moral por semestre.
export const ROLES = ['joiaTitular', 'jovemRotacao', 'jovemPromessa', 'titularAbsoluto', 'titularRegular', 'disputa', 'reservaImediato', 'composicao'] as const;
export type Role = (typeof ROLES)[number];
interface RoleRule { id: Role; relMin: number | null; minutos: number }
const MINUTES_OF = Object.fromEntries([...cfg.papel.jovem, ...cfg.papel.adulto].map((r) => [r.id, r.minutos])) as Record<Role, number>;

/** Papel no elenco (T28g, SPEC v2.54): diferença entre o overall e o nível do elenco, em faixas de idade (cortes em dados). */
export function roleFor(overall: number, clubRep: number, age: number): Role {
  const rel = overall - squadLevel(clubRep);
  const rules: RoleRule[] = (age <= cfg.papel.idadeJovemMax ? cfg.papel.jovem : cfg.papel.adulto) as RoleRule[];
  return (rules.find((r) => r.relMin === null || rel >= r.relMin) as RoleRule).id;
}
export interface MinutesInput { overall: number; clubRep: number; role: Role; form: number }

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Overall médio do elenco, estimado pela reputação do clube. */
export const squadLevel = (rep: number) => cfg.nivelElenco.base + rep * cfg.nivelElenco.porReputacao;

/** Fração dos minutos do semestre (0–1). */
export function minutesShare(i: MinutesInput, rng: Prng): number {
  const rel = i.overall - squadLevel(i.clubRep);
  const noise = (rng.next() * 2 - 1) * cfg.ruido;
  return clamp01(MINUTES_OF[i.role] + rel * cfg.porPontoRelativo + (i.form - 0.5) * cfg.pesoForma + noise);
}

/** Forma (0–1): média móvel do desempenho, que melhora com overall acima do elenco. */
export function updateForm(form: number, overall: number, clubRep: number, rng: Prng): number {
  const f = cfg.forma;
  const rating = clamp01(0.5 + (overall - squadLevel(clubRep)) / f.escala + (rng.next() * 2 - 1) * f.ruido);
  return clamp01(form * f.memoria + rating * (1 - f.memoria));
}

/** Moral (0–1): minutos acima/abaixo do prometido e resultado do time (−1 a 1). */
export function updateMorale(morale: number, minutes: number, role: Role, teamResult: number): number {
  return clamp01(morale + (minutes - MINUTES_OF[role]) * cfg.moral.pesoMinutos + teamResult * cfg.moral.pesoResultado);
}

// T28c (SPEC 6.12, v2.28/v2.50): a proposta mostra os minutos previstos e o nível do clube em faixa de texto, sem número.
export type MinutesBand = 'muitos' | 'rodizio' | 'poucos';
export const LEVELS = ['semExpressao', 'baixa', 'media', 'boa', 'alta', 'gigante'] as const;
export type ClubLevelBand = (typeof LEVELS)[number];

/** Minutos previstos pelo papel prometido e pelo nível do jogador no elenco (forma neutra, sem ruído). */
export const expectedMinutes = (overall: number, clubRep: number, role: Role): number =>
  clamp01(MINUTES_OF[role] + (overall - squadLevel(clubRep)) * cfg.porPontoRelativo);

export function minutesBand({ overall, clubRep, role }: { overall: number; clubRep: number; role: Role }): MinutesBand {
  const share = expectedMinutes(overall, clubRep, role);
  return share >= cfg.faixas.minutos.muitos ? 'muitos' : share >= cfg.faixas.minutos.rodizio ? 'rodizio' : 'poucos';
}

/** Nível do clube pela reputação. */
export function clubLevelBand(rep: number): ClubLevelBand {
  const f = cfg.faixas.nivelClube;
  return LEVELS.find((l) => l !== 'gigante' && rep <= f[l]) ?? 'gigante';
}
