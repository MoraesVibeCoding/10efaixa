import { CLUBS } from './clubs';
import { STATE_UFS, initialStates, simulateStates, validateStates, type StateWorld } from './states';
import raw from '../data/states.json';
import creation from '../data/creation.json';

const byId = new Map(CLUBS.map((c) => [c.id, c]));
const club = (id: string) => ({ strength: byId.get(id)!.reputacao, uf: byId.get(id)!.uf });
const elite = (w: StateWorld, uf: string) => w[uf]!.groups.flat();

const RELEGATED: Record<string, number> = { SP: 2, RJ: 1, MG: 2, RS: 2, PR: 2, SC: 3, BA: 2, PE: 1, GO: 2, CE: 0 };

describe('estaduais (T18)', () => {
  it('dados válidos: clubes existem, UF confere, refs de chaveamento resolvem, fonte presente', () => {
    expect(validateStates(raw)).toEqual([]);
    expect(STATE_UFS.sort()).toEqual(Object.keys(RELEGATED).sort());
    for (const uf of STATE_UFS) expect(raw.estaduais[uf as keyof typeof raw.estaduais].fonte).toMatch(/https?:\/\//);
  });

  it('Cearense marcado como não verificado', () => {
    expect(raw.estaduais.CE.verificado).toBe(false);
  });

  it('determinístico pela semente', () => {
    expect(simulateStates(initialStates(), club, 5)).toEqual(simulateStates(initialStates(), club, 5));
  });

  it('campeão sempre definido nos 27 estados, e é da própria UF', () => {
    for (let seed = 0; seed < 20; seed++) {
      const r = simulateStates(initialStates(), club, seed);
      expect(Object.keys(r.champions).sort()).toEqual([...creation.states].sort());
      for (const [uf, id] of Object.entries(r.champions)) expect(byId.get(id)!.uf).toBe(uf);
    }
  });

  it('campeão dos 10 estaduais completos sai da elite', () => {
    const w = initialStates();
    const r = simulateStates(w, club, 9);
    for (const uf of STATE_UFS) expect(elite(w, uf)).toContain(r.champions[uf]);
  });

  it.each(Object.entries(RELEGATED))('%s: rebaixa %i e sobe o mesmo número (elite de tamanho fixo)', (uf, n) => {
    const w = initialStates();
    const r = simulateStates(w, club, 3).states[uf]!;
    expect(r.relegated).toHaveLength(n);
    expect(r.promoted).toHaveLength(n);
    for (const id of r.relegated) expect(elite(w, uf)).toContain(id);
    for (const id of r.promoted) expect(w[uf]!.pool).toContain(id);
  });

  it('20 temporadas: elite e divisão de acesso mantêm tamanho e o mesmo conjunto de clubes', () => {
    let w = initialStates();
    const sizes = (x: StateWorld) => STATE_UFS.map((uf) => [elite(x, uf).length, x[uf]!.pool.length]);
    const sets = (x: StateWorld) => STATE_UFS.map((uf) => [...elite(x, uf), ...x[uf]!.pool].sort());
    const [s0, c0] = [sizes(w), sets(w)];
    for (let seed = 0; seed < 20; seed++) {
      w = simulateStates(w, club, 100 + seed).next;
      expect(sizes(w)).toEqual(s0);
      expect(sets(w)).toEqual(c0);
      for (const uf of STATE_UFS) expect(new Set(elite(w, uf)).size).toBe(elite(w, uf).length);
    }
  });

  it('grupos cruzados: cada clube só enfrenta os outros grupos (RS 6 jogos; MG e GO 8)', () => {
    const r = simulateStates(initialStates(), club, 2).states;
    const games = (uf: string) => r[uf]!.firstPhase.flat().map((x) => x.wins + x.draws + x.losses);
    expect(new Set(games('RS'))).toEqual(new Set([6]));
    expect(new Set(games('MG'))).toEqual(new Set([8]));
    expect(new Set(games('GO'))).toEqual(new Set([8]));
  });

  it('Paulistão em potes: 8 jogos por clube', () => {
    const r = simulateStates(initialStates(), club, 4).states.SP!;
    expect(new Set(r.firstPhase.flat().map((x) => x.wins + x.draws + x.losses))).toEqual(new Set([8]));
  });

  it('Mineiro: semifinalistas são os 3 líderes de grupo e o melhor 2º', () => {
    const r = simulateStates(initialStates(), club, 6).states.MG!;
    const leaders = r.firstPhase.map((g) => g[0]!.id);
    const semis = r.knockout[0]!.flatMap((t) => [t.a, t.b]);
    for (const l of leaders) expect(semis).toContain(l);
    expect(semis).toHaveLength(4);
  });

  it('estadual simplificado funciona com só 2 clubes (AP, RO, TO, MS)', () => {
    const r = simulateStates(initialStates(), club, 1);
    for (const uf of ['AP', 'RO', 'TO', 'MS']) expect(r.champions[uf]).toBeTruthy();
  });

  it('recusa estado com clube de outra UF', () => {
    const bad = structuredClone(raw);
    bad.estaduais.BA.grupos[0]![0] = 'flamengo';
    expect(validateStates(bad).length).toBeGreaterThan(0);
  });
});
