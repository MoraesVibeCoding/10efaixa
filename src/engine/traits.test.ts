import type { Focus } from './evolution';
import { progressTraits, type TraitState } from './traits';

const base = (over: Partial<TraitState> = {}): TraitState =>
  ({ position: 'atacante', traits: ['faroDeGol'], progress: {}, ...over });

const run = (s: TraitState, focus: { main?: Focus; secondary?: Focus }, n: number) => {
  const unlocked: string[] = [];
  for (let i = 0; i < n; i++) {
    const r = progressTraits(s, focus);
    unlocked.push(...r.unlocked);
    s = { position: r.position, traits: r.traits, latentTrait: r.latentTrait, progress: r.progress };
  }
  return { s, unlocked };
};

describe('progressão de traços por foco', () => {
  it('linha: Perna ruim como principal desbloqueia Ambidestro em 4 semestres, uma vez só', () => {
    expect(run(base(), { main: 'pernaRuim' }, 3).s.traits).not.toContain('ambidestro');
    const { s, unlocked } = run(base(), { main: 'pernaRuim' }, 10);
    expect(s.traits).toContain('ambidestro');
    expect(unlocked).toEqual(['ambidestro']);
  });

  it('linha: Bola parada leva ao traço Bola parada', () => {
    expect(run(base(), { main: 'bolaParada' }, 4).s.traits).toContain('bolaParada');
  });

  it('secundário rende metade: 8 semestres', () => {
    expect(run(base(), { main: 'passe', secondary: 'pernaRuim' }, 7).s.traits).not.toContain('ambidestro');
    expect(run(base(), { main: 'passe', secondary: 'pernaRuim' }, 8).s.traits).toContain('ambidestro');
  });

  it('Goleiro-líbero (Cobrador latente) desbloqueia Cobrador no ritmo normal', () => {
    const gk = base({ position: 'goleiro', traits: ['saidaRapida'], latentTrait: 'cobrador' });
    const { s, unlocked } = run(gk, { main: 'bolaParada' }, 4);
    expect(s.traits).toContain('cobrador');
    expect(s.traits).not.toContain('bolaParada');
    expect(unlocked).toEqual(['cobrador']);
  });

  it('outros goleiros tentam Cobrador bem mais devagar (4×)', () => {
    const gk = base({ position: 'goleiro', traits: ['milagre'] });
    expect(run(gk, { main: 'bolaParada' }, 15).s.traits).not.toContain('cobrador');
    expect(run(gk, { main: 'bolaParada' }, 16).s.traits).toContain('cobrador');
  });

  it('quem já tem o traço não progride nele (Mágico com Bola parada)', () => {
    const r = progressTraits(base({ traits: ['bolaParada'] }), { main: 'bolaParada' });
    expect(r.progress.bolaParada ?? 0).toBe(0);
    expect(r.unlocked).toEqual([]);
  });

  it('foco em atributo não mexe em traços; estado de entrada não é alterado', () => {
    const s = base({ progress: { ambidestro: 0.5 } });
    const frozen = structuredClone(s);
    expect(progressTraits(s, { main: 'passe', secondary: 'forca' }).progress).toEqual({ ambidestro: 0.5 });
    expect(s).toEqual(frozen);
  });
});
