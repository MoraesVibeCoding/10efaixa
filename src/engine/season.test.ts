import { CLUBS, clubsIn } from './clubs';
import { simulateSeason, validateMatchConfig, type Divisions, type Row } from './season';
import leagues from '../data/leagues.json';

const byId = new Map(CLUBS.map((c) => [c.id, c]));
const club = (id: string) => ({ strength: byId.get(id)!.reputacao, uf: byId.get(id)!.uf });
const start = (): Divisions => ({ A: clubsIn('A').map((c) => c.id), B: clubsIn('B').map((c) => c.id), C: clubsIn('C').map((c) => c.id), D: clubsIn('D').map((c) => c.id) });
const ids = (rows: Row[]) => rows.map((r) => r.id);
const table = (r: ReturnType<typeof simulateSeason>, div: 'A' | 'B' | 'C' | 'D', phase = 0) => r.phases[div][phase]!.groups!;

describe('temporada com acesso e rebaixamento (T17)', () => {
  it('determinística pela semente; sementes diferentes divergem', () => {
    expect(simulateSeason(start(), club, 7)).toEqual(simulateSeason(start(), club, 7));
    expect(simulateSeason(start(), club, 1).champions).not.toEqual(simulateSeason(start(), club, 99).champions);
  });

  it('30 temporadas: tamanhos 20/20/20/96, sem duplicata, mesmo conjunto de clubes', () => {
    let d = start();
    const all = [...d.A, ...d.B, ...d.C, ...d.D].sort();
    for (let s = 0; s < 30; s++) {
      d = simulateSeason(d, club, 1000 + s).next;
      expect([d.A.length, d.B.length, d.C.length, d.D.length]).toEqual([20, 20, 20, 96]);
      expect([...d.A, ...d.B, ...d.C, ...d.D].sort()).toEqual(all);
    }
  });

  it('Série A: campeão é o 1º; 4 últimos caem', () => {
    const r = simulateSeason(start(), club, 3);
    const t = ids(table(r, 'A')[0]!);
    expect(r.champions.A).toBe(t[0]);
    expect(r.relegated.A).toEqual(t.slice(16));
  });

  it('Série B: 1º e 2º sobem; 2 vencedores dos playoffs 3º×6º e 4º×5º sobem; 4 últimos caem', () => {
    const r = simulateSeason(start(), club, 4);
    const t = ids(table(r, 'B')[0]!);
    expect(r.promoted.B).toHaveLength(4);
    expect(r.promoted.B.slice(0, 2)).toEqual(t.slice(0, 2));
    const playoffs = r.phases.B[1]!.ties!;
    expect(playoffs.map((x) => [x.a, x.b])).toEqual([[t[2], t[5]], [t[3], t[4]]]);
    expect(r.promoted.B.slice(2).sort()).toEqual(playoffs.map((x) => x.winner).sort());
    expect(r.relegated.B).toEqual(t.slice(16));
    expect(r.champions.B).toBe(t[0]);
  });

  it('Série C: turno único com mando equilibrado; quadrangulares por posição [1,4,5,8] e [2,3,6,7]; 4 sobem; 2 caem', () => {
    const r = simulateSeason(start(), club, 5);
    const first = table(r, 'C')[0]!;
    expect(first.every((x) => x.points >= 0 && x.wins + x.draws + x.losses === 19)).toBe(true);
    expect(first.every((x) => x.home === 9 || x.home === 10)).toBe(true);
    const t = ids(first);
    const groups = table(r, 'C', 1).map((g) => ids(g).sort());
    expect(groups).toEqual([[t[0], t[3], t[4], t[7]].sort(), [t[1], t[2], t[5], t[6]].sort()]);
    const q = table(r, 'C', 1).map(ids);
    expect(r.promoted.C.sort()).toEqual([q[0]![0], q[0]![1], q[1]![0], q[1]![1]].sort());
    expect(r.relegated.C).toEqual(t.slice(18));
    expect([q[0]![0], q[1]![0]]).toContain(r.champions.C);
  });

  it('Série D: 16 grupos de 6 com todos os 96; mata-mata até a final; os 2 finalistas sobem', () => {
    const r = simulateSeason(start(), club, 6);
    const groups = table(r, 'D');
    expect(groups).toHaveLength(16);
    expect(groups.every((g) => g.length === 6)).toBe(true);
    expect(groups.flat().map((x) => x.id).sort()).toEqual(start().D.sort());
    const ko = r.phases.D.slice(1).map((p) => p.ties!.length);
    expect(ko).toEqual([32, 16, 8, 4, 2, 1]);
    const final = r.phases.D.at(-1)!.ties![0]!;
    expect(r.promoted.D.sort()).toEqual([final.a, final.b].sort());
    expect(r.champions.D).toBe(final.winner);
  });

  it('Série D: chaveamento oficial em pares de grupos (1º×4º, 2º×3º, 3º×2º, 4º×1º)', () => {
    const r = simulateSeason(start(), club, 8);
    const [g1, g2] = table(r, 'D').map(ids) as [string[], string[]];
    const first = r.phases.D[1]!.ties!.slice(0, 4).map((x) => [x.a, x.b]);
    expect(first).toEqual([[g1[0], g2[3]], [g1[1], g2[2]], [g1[2], g2[1]], [g1[3], g2[0]]]);
  });

  it('tabela coerente com a força: correlação de Spearman média ≥ 0,5 na Série A', () => {
    let sum = 0;
    const n = 100;
    for (let s = 0; s < n; s++) {
      const t = ids(table(simulateSeason(start(), club, s), 'A')[0]!);
      const byStrength = [...t].sort((a, b) => club(b).strength - club(a).strength);
      const d2 = t.reduce((acc, id, i) => acc + (i - byStrength.indexOf(id)) ** 2, 0);
      sum += 1 - (6 * d2) / (20 * (20 * 20 - 1));
    }
    expect(sum / n).toBeGreaterThanOrEqual(0.5);
  });

  it('20 temporadas em menos de 100 ms (orçamento da carreira: 50 ms no total)', () => {
    let d = start();
    const t0 = performance.now();
    for (let s = 0; s < 20; s++) d = simulateSeason(d, club, s).next;
    expect(performance.now() - t0).toBeLessThan(100);
  });

  it.each([
    ['clube em duas divisões', (d: Divisions) => { d.B[0] = d.A[0]!; }],
    ['Série A com 19 clubes', (d: Divisions) => { d.A.pop(); }],
    ['Série D com 95 clubes', (d: Divisions) => { d.D.pop(); }],
  ])('recusa entrada inválida: %s', (_, mutate) => {
    const d = start();
    mutate(d);
    expect(() => simulateSeason(d, club, 1)).toThrow(RangeError);
  });

  it('config do modelo de partida válida; recusa drawBase fora de (0,1) e scale ≤ 0', () => {
    expect(validateMatchConfig(leagues.match)).toEqual([]);
    expect(validateMatchConfig({ ...leagues.match, drawBase: 1.2 })).not.toEqual([]);
    expect(validateMatchConfig({ ...leagues.match, scale: 0 })).not.toEqual([]);
  });
});
