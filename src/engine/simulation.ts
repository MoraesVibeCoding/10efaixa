import { ATTRIBUTES, type Attributes } from './attributes';
import { archetypesFor } from './archetypes';
import { BUILDS, heightAt } from './biotype';
import { evolveSemester, type EvoState } from './evolution';
import { staffMeeting } from './meeting';
import { POSITIONS, overall, type Position } from './overall';
import { createPlayer, type Player } from './player';
import { createPrng, type Prng } from './prng';
import biotype from '../data/biotype.json';
import creation from '../data/creation.json';
import cfg from '../data/simulation.json';

// T13: carreira = trajetória dos atributos (sem clubes, minutos reais nem aposentadoria ainda).
export interface CareerResult {
  player: Player;
  heightCm: number;
  peakOverall: number;
  peakAge: number;
  peakAttributes: Attributes;
}

const pick = <T>(rng: Prng, xs: readonly T[]) => xs[rng.int(0, xs.length - 1)]!;
const between = (rng: Prng, [lo, hi]: number[]) => lo! + rng.next() * (hi! - lo!);

export function simulateCareer(seed: number): CareerResult {
  const rng = createPrng(seed);
  const position = pick(rng, POSITIONS);
  const arch = pick(rng, archetypesFor(position));
  const range = biotype.heightRangesCm[position];
  const r = createPlayer({
    name: 'Jogador Simulado', shirtNumber: rng.int(1, 99), state: pick(rng, creation.states), position,
    archetypeId: arch.id, biotype: { heightCm: rng.int(range.min, range.max), build: pick(rng, BUILDS) },
    temperament: pick(rng, creation.temperaments), celebration: pick(rng, creation.celebrations),
    origin: pick(rng, Object.keys(creation.origins)), foot: pick(rng, creation.feet),
  }, rng);
  if (!r.ok) throw new Error(`criação simulada inválida: ${r.errors.join(', ')}`);
  const player = r.player;

  // Reunião automática (ritmo Rápido): pede os dois atributos mais fortes do arquétipo.
  const [main, secondary] = [...ATTRIBUTES].sort((a, b) => arch.distribution[b] - arch.distribution[a]);
  let s: EvoState = {
    age: cfg.startAge, attributes: player.attributes, baseCaps: player.baseCaps, caps: player.caps,
    predictedHeightCm: player.biotype.heightCm, growth: player.growth,
    build: player.biotype.build, originalBuild: player.biotype.build, buildPush: 0,
  };
  let best = { peakOverall: overall(s.attributes, position, arch.overallWeightBonus), peakAge: s.age, peakAttributes: s.attributes };

  while (s.age < cfg.endAge) {
    const morale = between(rng, cfg.morale);
    const { focus } = staffMeeting({
      proposal: { main: main!, secondary: secondary! }, morale, coachRelation: between(rng, cfg.morale),
      nationalTeamStatus: 0, clubNeed: pick(rng, ATTRIBUTES),
    });
    s = evolveSemester(s, {
      focus, morale, minutes: between(rng, cfg.minutes), staffQuality: between(rng, cfg.staffQuality),
    }, rng);
    const ov = overall(s.attributes, position, arch.overallWeightBonus);
    if (ov > best.peakOverall) best = { peakOverall: ov, peakAge: s.age, peakAttributes: s.attributes };
  }
  return { player, heightCm: heightAt(player.biotype.heightCm, player.growth, cfg.endAge), ...best };
}

export type HeightBucket = 'baixo' | 'medio' | 'alto';
type Agg = { n: number; overall: number; jogoAereo: number; drible: number; velocidade: number };

export interface MassReport {
  careers: number;
  msPerCareer: number;
  byOrigin: Record<string, { n: number; startOverall: number; potential: number; peakOverall: number; p10: number; p50: number; p90: number; max: number; peakAge: number; excelente: number; lendario: number }>;
  byPosition: Record<Position, { n: number; peakOverall: number }>;
  diamondRateVarzea: number;
  height: Record<Position, Record<HeightBucket, Agg>>;
}

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const pct = (sorted: number[], p: number) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] ?? 0;
const round1 = (x: number) => Math.round(x * 10) / 10;
/** % (uma casa) com auge ≥ limite. */
const share = (xs: number[], min: number) => round1((100 * xs.filter((x) => x >= min).length) / (xs.length || 1));

/** Terço da faixa de altura da posição (a altura final pode sair um pouco da faixa pelo estirão). */
function bucket(position: Position, cm: number): HeightBucket {
  const { min, max } = biotype.heightRangesCm[position];
  const third = (max - min) / 3;
  return cm < min + third ? 'baixo' : cm < min + 2 * third ? 'medio' : 'alto';
}

export function runMass(n: number, seed: number): MassReport {
  const t0 = performance.now();
  const results = Array.from({ length: n }, (_, i) => simulateCareer(seed * 1_000_003 + i));
  const msPerCareer = (performance.now() - t0) / n;

  const byOrigin: MassReport['byOrigin'] = {};
  for (const origin of Object.keys(creation.origins)) {
    const rs = results.filter((c) => c.player.origin === origin);
    const peaks = rs.map((c) => c.peakOverall).sort((a, b) => a - b);
    byOrigin[origin] = {
      n: rs.length, startOverall: round1(mean(rs.map((c) => c.player.startingOverall))),
      potential: round1(mean(rs.map((c) => c.player.potential))), peakOverall: round1(mean(peaks)),
      p10: pct(peaks, 0.1), p50: pct(peaks, 0.5), p90: pct(peaks, 0.9), max: peaks.at(-1) ?? 0,
      peakAge: round1(mean(rs.map((c) => c.peakAge))),
      excelente: share(peaks, 75), lendario: share(peaks, 85),
    };
  }

  const byPosition = {} as MassReport['byPosition'];
  const height = {} as MassReport['height'];
  for (const p of POSITIONS) {
    const rs = results.filter((c) => c.player.position === p);
    byPosition[p] = { n: rs.length, peakOverall: round1(mean(rs.map((c) => c.peakOverall))) };
    height[p] = {} as Record<HeightBucket, Agg>;
    for (const b of ['baixo', 'medio', 'alto'] as const) {
      const hs = rs.filter((c) => bucket(p, c.heightCm) === b);
      height[p][b] = {
        n: hs.length, overall: round1(mean(hs.map((c) => c.peakOverall))),
        jogoAereo: round1(mean(hs.map((c) => c.peakAttributes.jogoAereo))),
        drible: round1(mean(hs.map((c) => c.peakAttributes.drible))),
        velocidade: round1(mean(hs.map((c) => c.peakAttributes.velocidade))),
      };
    }
  }

  const varzea = results.filter((c) => c.player.origin === 'varzea');
  return {
    careers: n, msPerCareer: Math.round(msPerCareer * 1000) / 1000, byOrigin, byPosition, height,
    diamondRateVarzea: varzea.length ? varzea.filter((c) => c.player.isDiamond).length / varzea.length : 0,
  };
}

