import type { Prng } from './prng';
import cfg from '../data/minutes.json';

// T21: minutos pelo overall relativo ao elenco e pelo papel prometido; forma e moral por semestre.
export type Role = 'titular' | 'rodizio' | 'reserva' | 'promessa';
export interface MinutesInput { overall: number; clubRep: number; role: Role; form: number }

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Overall médio do elenco, estimado pela reputação do clube. */
export const squadLevel = (rep: number) => cfg.nivelElenco.base + rep * cfg.nivelElenco.porReputacao;

/** Fração dos minutos do semestre (0–1). */
export function minutesShare(i: MinutesInput, rng: Prng): number {
  const rel = i.overall - squadLevel(i.clubRep);
  const noise = (rng.next() * 2 - 1) * cfg.ruido;
  return clamp01(cfg.papel[i.role] + rel * cfg.porPontoRelativo + (i.form - 0.5) * cfg.pesoForma + noise);
}

/** Forma (0–1): média móvel do desempenho, que melhora com overall acima do elenco. */
export function updateForm(form: number, overall: number, clubRep: number, rng: Prng): number {
  const f = cfg.forma;
  const rating = clamp01(0.5 + (overall - squadLevel(clubRep)) / f.escala + (rng.next() * 2 - 1) * f.ruido);
  return clamp01(form * f.memoria + rating * (1 - f.memoria));
}

/** Moral (0–1): minutos acima/abaixo do prometido e resultado do time (−1 a 1). */
export function updateMorale(morale: number, minutes: number, role: Role, teamResult: number): number {
  return clamp01(morale + (minutes - cfg.papel[role]) * cfg.moral.pesoMinutos + teamResult * cfg.moral.pesoResultado);
}
