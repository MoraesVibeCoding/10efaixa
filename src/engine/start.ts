import { CLUBS } from './clubs';
import type { Prng } from './prng';
import neighbors from '../data/neighbors.json';
import cfg from '../data/start.json';
import texts from '../i18n/pt-BR/start.json';

// T20 (SPEC 6.1, 6.9): base de clube grande, peneira e várzea; Copinha, promoção e primeiro contrato.
export interface Offer { clubId: string; heartClub: boolean; minutes: 'alto' | 'medio' | 'baixo'; structure: number; competition: number }
export interface Contract { clubId: string; years: number; role: string }

const N = neighbors.vizinhos as Record<string, string[]>;
const byId = new Map(CLUBS.map((c) => [c.id, c]));
const byRep = (a: (typeof CLUBS)[number], b: (typeof CLUBS)[number]) => b.reputacao - a.reputacao || (a.id < b.id ? -1 : 1);
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const inDivs = (divs: (string | null)[]) => (c: (typeof CLUBS)[number]) => divs.includes(c.divisao);

/** Clubes do estado; se não chegar ao mínimo, completa com vizinhos e, por último, com o resto do país. */
export function eligibleClubs(uf: string, divs: (string | null)[], min: number): string[] {
  const pick = (pred: (c: (typeof CLUBS)[number]) => boolean) => CLUBS.filter((c) => inDivs(divs)(c) && pred(c)).sort(byRep);
  const out = pick((c) => c.uf === uf);
  if (out.length < min) out.push(...pick((c) => N[uf]!.includes(c.uf)));
  if (out.length < min) out.push(...pick((c) => c.uf !== uf && !N[uf]!.includes(c.uf)));
  return out.map((c) => c.id);
}

const pickOne = (rng: Prng, ids: string[], top: number) => ids[rng.int(0, Math.min(top, ids.length) - 1)]!;

/** Três ofertas de clubes grandes do estado ou da região; clube de coração elegível entra em destaque. */
export function baseOffers(p: { state: string; heartClub: string | null }, rng: Prng): Offer[] {
  const divs = cfg.base.divisoes;
  const heart = p.heartClub ? byId.get(p.heartClub) : undefined;
  const heartOk = !!heart && divs.includes(heart.divisao!) && (heart.uf === p.state || N[p.state]!.includes(heart.uf));
  const pool = eligibleClubs(p.state, divs, cfg.base.ofertas).filter((id) => id !== p.heartClub).slice(0, 6);
  for (let i = pool.length - 1; i > 0; i--) { const j = rng.int(0, i); [pool[i], pool[j]] = [pool[j]!, pool[i]!]; }
  const ids = [...(heartOk ? [heart!.id] : []), ...pool].slice(0, cfg.base.ofertas);
  return ids.map((id) => {
    const rep = byId.get(id)!.reputacao;
    return {
      clubId: id,
      heartClub: id === p.heartClub,
      minutes: rep >= 88 ? 'baixo' : rep >= 75 ? 'medio' : 'alto',
      structure: Math.round((0.8 + (rep / 100) * 0.4) * 100) / 100,
      competition: rep,
    };
  });
}

/** Peneira com três desfechos: aprovado, nova chance (segunda tentativa) ou clube menor. */
export function runPeneira(p: { state: string; startingOverall: number }, rng: Prng) {
  const c = cfg.peneira;
  const pA = clamp(c.aprovado.base + (p.startingOverall - c.aprovado.ref) * c.aprovado.porPonto, c.aprovado.min, c.aprovado.max);
  const passed = eligibleClubs(p.state, c.divisoesAprovado, 3);
  const smaller = eligibleClubs(p.state, c.divisoesMenor, 3);
  const u = rng.next();
  if (u < pA) return { outcome: 'aprovado', attempts: 1, clubId: pickOne(rng, passed, 8) };
  if (u < pA + (1 - pA) * c.novaChanceFracao) {
    const second = rng.next() < pA + c.bonusSegundaTentativa;
    return { outcome: 'novaChance', attempts: 2, clubId: pickOne(rng, second ? passed : smaller, 8) };
  }
  return { outcome: 'clubeMenor', attempts: 1, clubId: pickOne(rng, smaller, 8) };
}

/** Time fictício do bairro até um olheiro levar o jogador a um clube pequeno ou médio. */
export function runVarzea(p: { state: string; startingOverall: number }, rng: Prng) {
  const c = cfg.varzea;
  const pExit = clamp(c.saidaPorSemestre.base + (p.startingOverall - c.saidaPorSemestre.ref) * c.saidaPorSemestre.porPonto, 0.1, 0.9);
  let semesters = 1;
  while (semesters < c.semestresMax && rng.next() > pExit) semesters++;
  const teamKey = rng.int(0, texts.varzeaTeams.length - 1);
  return { semesters, teamKey, clubId: pickOne(rng, eligibleClubs(p.state, c.divisoes, 3), 10) };
}

/** Copinha: campanha pela força do clube e do jogador; destaque individual pelo overall. */
export function copinha(clubRep: number, overall: number, rng: Prng) {
  const c = cfg.copinha;
  const s = clubRep * c.pesoClube + overall * c.pesoJogador + (rng.next() * 2 - 1) * c.ruido;
  const [lo, hi] = c.faixa as [number, number];
  const idx = clamp(Math.floor(((s - lo) / (hi - lo)) * c.fases.length), 0, c.fases.length - 1);
  return { stage: c.fases[idx]!, highlight: overall + (rng.next() * 2 - 1) * c.destaque.ruido > c.destaque.ref };
}

/** Promoção ao profissional (17–20 anos): overall mínimo cresce com a reputação do clube; destaque na Copinha ajuda. */
export function promotion(p: { age: number; overall: number; clubId: string; highlight: boolean }) {
  const c = cfg.promocao;
  if (p.age < c.idadeMin) return { promoted: false, released: false };
  const need = c.overallBase + byId.get(p.clubId)!.reputacao * c.porReputacao - (p.highlight ? c.bonusDestaque : 0);
  if (p.overall >= need) {
    return { promoted: true, released: false, contract: { clubId: p.clubId, years: p.highlight ? c.anosContrato.destaque : c.anosContrato.normal, role: 'jovemPromessa' } };
  }
  return { promoted: false, released: p.age >= c.idadeMax };
}

export const firstContract = (clubId: string): Contract => ({ clubId, years: cfg.primeiroContrato.anos, role: cfg.primeiroContrato.papel });
