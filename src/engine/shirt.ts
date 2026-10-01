import type { Prng } from './prng';
import cfg from '../data/shirt.json';

// T24 (SPEC 6.7): número mantido se livre; a 10 e a faixa do clube só por evento.
const RESERVED = new Set(cfg.reservados);

/** Números já ocupados no elenco que o jogador encontra (a 10 sempre tem dono). */
export function rosterNumbers(rng: Prng): Set<number> {
  const out = new Set<number>(RESERVED);
  const [lo, hi] = cfg.elenco.faixaComum as [number, number];
  while (out.size < cfg.elenco.numerosOcupados) out.add(rng.next() < 0.85 ? rng.int(lo, hi) : rng.int(hi + 1, cfg.elenco.faixaMax));
  return out;
}

/** Mantém o número se livre; senão, o próximo livre (dando a volta), nunca um reservado (a 10). */
export function assignNumber(desired: number, taken: Set<number>): number {
  const free = (n: number) => !taken.has(n) && !RESERVED.has(n);
  if (free(desired)) return desired;
  for (let k = 1; k < cfg.elenco.faixaMax; k++) {
    const n = ((desired - 1 + k) % cfg.elenco.faixaMax) + 1;
    if (free(n)) return n;
  }
  throw new RangeError('sem número livre');
}

/** Evento da 10: referência do time (bem acima do elenco) e querido pela torcida. */
export const canGetTen = (p: { overall: number; squadLevel: number; idolatry: number }) =>
  p.overall >= p.squadLevel + cfg.dez.margemSobreElenco && p.idolatry >= cfg.dez.idolatriaMin;

/** Evento da faixa: veterania no clube e idolatria; Líder tem caminho curto (6.17). */
export function canGetArmband(p: { overall: number; squadLevel: number; idolatry: number; age: number; seasonsAtClub: number; temperament: string }): boolean {
  const f = cfg.faixa;
  const req = p.temperament === 'lider' ? { ...f, ...f.lider } : f;
  return p.age >= req.idadeMin && p.seasonsAtClub >= req.temporadasNoClube && p.idolatry >= req.idolatriaMin
    && p.overall >= p.squadLevel + f.margemSobreElenco;
}

/** Número mais usado na carreira (soma de semestres por número), para o cartão final. */
export function mostUsedNumber(history: { number: number; semesters: number }[]): number {
  const total = new Map<number, number>();
  for (const h of history) total.set(h.number, (total.get(h.number) ?? 0) + h.semesters);
  return [...total].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0]![0];
}
