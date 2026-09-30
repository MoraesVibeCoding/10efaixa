import { ATTRIBUTES, type Attribute, type Attributes } from './attributes';
import { ageCurve } from './ageCurves';
import { applyBiotype, heightAt, type Build, type Growth } from './biotype';
import type { Prng } from './prng';
import cfg from '../data/evolution.json';

// Seção 6.4. Ordem fixa por semestre: compleição → altura e tetos → atributos → idade.
export type Focus = Attribute | 'bolaParada' | 'pernaRuim';
export const FOCI: readonly string[] = [...ATTRIBUTES, 'bolaParada', 'pernaRuim'];

export interface EvoState {
  age: number;
  attributes: Attributes;
  /** Tetos antes do biotipo; os tetos efetivos são recalculados quando altura ou compleição mudam. */
  baseCaps: Attributes;
  caps: Attributes;
  predictedHeightCm: number;
  growth: Growth;
  build: Build;
  buildPush: number;
  buildChanged: boolean;
}

export interface SemesterContext {
  focus: { main?: Focus; secondary?: Focus };
  staffQuality: number;
  minutes: number;
  morale: number;
}

const inRange = (x: number, lo: number, hi: number) => Number.isFinite(x) && x >= lo && x <= hi;

function validate({ focus, staffQuality, minutes, morale }: SemesterContext) {
  if (!inRange(minutes, 0, 1)) throw new RangeError(`minutes fora de 0–1: ${minutes}`);
  if (!inRange(morale, 0, 1)) throw new RangeError(`morale fora de 0–1: ${morale}`);
  if (!inRange(staffQuality, cfg.staffQuality.min, cfg.staffQuality.max)) {
    throw new RangeError(`staffQuality fora da faixa: ${staffQuality}`);
  }
  for (const f of [focus.main, focus.secondary]) {
    if (f !== undefined && !FOCI.includes(f)) throw new RangeError(`foco inválido: ${f}`);
  }
  if (focus.main && focus.main === focus.secondary) throw new RangeError('foco principal igual ao secundário');
}

const STEPS: Build[] = ['franzino', 'atletico', 'forte'];

/** Foco principal repetido empurra a compleição; muda um degrau, uma vez na carreira (6.17). */
function nextBuild(s: EvoState, main: Focus | undefined): Pick<EvoState, 'build' | 'buildPush' | 'buildChanged'> {
  const { threshold, noFranzinoFromAge, towardForte, towardFranzino } = cfg.build;
  if (s.buildChanged) return s;
  const dir = main && towardForte.includes(main) ? 1 : main && towardFranzino.includes(main) ? -1 : 0;
  const buildPush = Math.max(-threshold, Math.min(threshold, s.buildPush + dir));
  if (Math.abs(buildPush) < threshold) return { build: s.build, buildPush, buildChanged: false };
  const target = STEPS[STEPS.indexOf(s.build) + Math.sign(buildPush)];
  if (!target || (target === 'franzino' && s.age >= noFranzinoFromAge)) {
    return { build: s.build, buildPush, buildChanged: false };
  }
  return { build: target, buildPush: 0, buildChanged: true };
}

/** Um semestre de evolução. Pura: não altera o estado de entrada. Consome 2 sorteios por atributo. */
export function evolveSemester(state: EvoState, ctx: SemesterContext, rng: Prng): EvoState {
  validate(ctx);
  const { main, secondary } = ctx.focus;
  const build = nextBuild(state, main);
  const caps = applyBiotype(state.baseCaps, {
    heightCm: heightAt(state.predictedHeightCm, state.growth, state.age),
    build: build.build,
  });

  const minutes = cfg.minMinutesFactor + (1 - cfg.minMinutesFactor) * ctx.minutes;
  const morale = cfg.morale.min + cfg.morale.span * ctx.morale;
  const attributes = { ...state.attributes };
  for (const a of ATTRIBUTES) {
    const role = a === main ? 'main' : a === secondary ? 'secondary' : 'none';
    const c = ageCurve(a, state.age);
    const cur = state.attributes[a];
    const noise = 1 + (rng.next() * 2 - 1) * cfg.noise;
    const delta = c > 0
      ? cfg.basePerSemester * c * cfg.focusGrow[role] * ctx.staffQuality * minutes * morale
        * Math.max(0, 1 - (cur / caps[a]) ** cfg.k) * noise
      : cfg.basePerSemester * c * cfg.focusDecline[role];
    const whole = Math.floor(delta);
    const step = whole + (rng.next() < delta - whole ? 1 : 0);
    attributes[a] = Math.max(1, Math.min(caps[a], cur + step));
  }

  return { ...state, ...build, caps, attributes, age: state.age + 0.5 };
}
