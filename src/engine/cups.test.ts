import { CLUBS, clubsIn } from './clubs';
import {
  FOREIGN, brazilQualifiers, copaDoBrasil, copaDoBrasilEntrants, copaDoNordeste, countryOf,
  foreignQualifiers, libertadores, nordesteGroups, sulAmericana,
} from './cups';
import { createPrng } from './prng';
import cups from '../data/cups.json';

const all = new Map([...CLUBS.map((c) => [c.id, c.reputacao] as const), ...FOREIGN.map((c) => [c.id, c.reputacao] as const)]);
const club = (id: string) => ({ strength: all.get(id)!, uf: '' });
const serieA = clubsIn('A').map((c) => c.id);
const ties = (phases: { ties?: { a: string; b: string; winner: string }[] }[]) => phases.flatMap((p) => p.ties ?? []);

describe('Copa do Brasil (T19a)', () => {
  const champions = ['fortaleza', 'botafogo-pb', 'barra-sc', 'paysandu'];
  const entrants = copaDoBrasilEntrants(serieA, champions);

  it('102 clubes por cotas de federação, sem Série A nem os 4 campeões, sem repetir', () => {
    expect(entrants).toHaveLength(102);
    expect(new Set(entrants).size).toBe(102);
    expect(entrants.some((id) => serieA.includes(id) || champions.includes(id))).toBe(false);
  });

  it('cotas: SP tem 6 vagas e RR (última federação) tem 3, quando há clubes', () => {
    const uf = (id: string) => CLUBS.find((c) => c.id === id)!.uf;
    expect(entrants.filter((id) => uf(id) === 'SP').length).toBeGreaterThanOrEqual(6);
    expect(entrants.filter((id) => uf(id) === 'RR')).toHaveLength(3);
  });

  it('126 clubes; fases com 14, 44, 24, 12, 16, 8, 4, 2 e 1 confrontos; campeão e vice definidos', () => {
    const r = copaDoBrasil(entrants, champions, serieA, club, 7);
    expect(r.phases.map((p) => p.ties!.length)).toEqual([14, 44, 24, 12, 16, 8, 4, 2, 1]);
    const final = r.phases.at(-1)!.ties![0]!;
    expect(r.champion).toBe(final.winner);
    expect([final.a, final.b]).toContain(r.runnerUp);
    expect(r.runnerUp).not.toBe(r.champion);
  });

  it('Série A entra só na 5ª fase; campeões entram na 3ª', () => {
    const r = copaDoBrasil(entrants, champions, serieA, club, 8);
    const before5 = ties(r.phases.slice(0, 4)).flatMap((t) => [t.a, t.b]);
    expect(before5.some((id) => serieA.includes(id))).toBe(false);
    expect(ties(r.phases.slice(0, 2)).flatMap((t) => [t.a, t.b]).some((id) => champions.includes(id))).toBe(false);
    expect(r.phases[4]!.ties!.flatMap((t) => [t.a, t.b]).filter((id) => serieA.includes(id))).toHaveLength(20);
  });

  it('campeão que já está na Série A entra na 5ª fase; a vaga da 3ª fase passa ao mais forte ainda fora', () => {
    const withA = ['vitoria', 'botafogo-pb', 'barra-sc'];
    const e = copaDoBrasilEntrants(serieA, withA);
    const r = copaDoBrasil(e, withA, serieA, club, 2);
    const ids = ties(r.phases.slice(0, 5)).flatMap((t) => [t.a, t.b]);
    expect(r.phases.map((p) => p.ties!.length)).toEqual([14, 44, 24, 12, 16, 8, 4, 2, 1]);
    expect(ids.filter((id) => id === 'vitoria')).toHaveLength(r.phases[4]!.ties!.some((t) => t.a === 'vitoria' || t.b === 'vitoria') ? 1 : 0);
    expect(r.phases[2]!.ties!.flatMap((t) => [t.a, t.b])).not.toContain('vitoria');
  });

  it('determinística pela semente', () => {
    expect(copaDoBrasil(entrants, champions, serieA, club, 3)).toEqual(copaDoBrasil(entrants, champions, serieA, club, 3));
  });

  it('fonte oficial registrada', () => {
    expect(cups.copaDoBrasil.fonte).toMatch(/cbf\.com\.br/);
  });
});

describe('Copa do Nordeste (T19b)', () => {
  const groups = cups.copaDoNordeste.participantes2026;

  it('20 clubes, 4 grupos de 5; cada um joga os 5 do grupo pareado (5 jogos)', () => {
    const r = copaDoNordeste(groups, club, 4);
    expect(r.groups.flat()).toHaveLength(20);
    expect(new Set(r.groups.flat().map((x) => x.wins + x.draws + x.losses))).toEqual(new Set([5]));
  });

  it('quartas com os 2 melhores de cada grupo; campeão definido', () => {
    const r = copaDoNordeste(groups, club, 5);
    const qf = r.phases[0]!.ties!.flatMap((t) => [t.a, t.b]).sort();
    expect(qf).toEqual(r.groups.flatMap((g) => g.slice(0, 2).map((x) => x.id)).sort());
    expect(r.champion).toBe(r.phases.at(-1)!.ties![0]!.winner);
  });

  it('participantes de anos seguintes: cotas por estado, 4 grupos de 5, sem repetir', () => {
    const g = nordesteGroups(createPrng(1));
    expect(g).toHaveLength(4);
    expect(g.every((x) => x.length === 5)).toBe(true);
    expect(new Set(g.flat()).size).toBe(20);
    const uf = (id: string) => CLUBS.find((c) => c.id === id)!.uf;
    for (const [state, n] of Object.entries(cups.copaDoNordeste.vagasPorEstado)) {
      expect(g.flat().filter((id) => uf(id) === state)).toHaveLength(n);
    }
  });
});

describe('Libertadores e Sul-Americana (T19c)', () => {
  const table = [...serieA];
  const br = brazilQualifiers(table, 'gremio', 'internacional');
  const fq = foreignQualifiers(createPrng(2), []);

  it('vagas brasileiras: 5 na fase de grupos, 2 na Fase 2, 6 na Sul-Americana, sem repetir', () => {
    expect(br.libGroups).toHaveLength(5);
    expect(br.libF2).toHaveLength(2);
    expect(br.sud).toHaveLength(6);
    expect(new Set([...br.libGroups, ...br.libF2, ...br.sud]).size).toBe(13);
    expect(br.libGroups).toContain('gremio');
    expect(br.libF2).toContain('internacional');
  });

  it('campeão da Copa do Brasil já classificado pela Série A: a vaga desce na tabela', () => {
    const q = brazilQualifiers(table, table[0]!, table[1]!);
    expect(q.libGroups).toEqual(table.slice(0, 5));
    expect(q.libF2).toEqual(table.slice(5, 7));
    expect(q.sud).toEqual(table.slice(7, 13));
  });

  it('estrangeiros: 21 na fase de grupos (ARG 5 + CHI/COL 2 + 6 países × 2), 11 na Fase 2, 6 na Fase 1; Sul-Americana 6 + 32', () => {
    expect(fq.libGroups).toHaveLength(21); // + 5 brasileiros + 2 atuais campeões = 28 diretos
    expect(fq.libF2).toHaveLength(11);
    expect(fq.libF1).toHaveLength(6);
    expect(fq.sudGroups).toHaveLength(6);
    expect(Object.values(fq.sudNational).flat()).toHaveLength(32);
    const ids = [...fq.libGroups, ...fq.libF2, ...fq.libF1, ...fq.sudGroups, ...Object.values(fq.sudNational).flat()];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('Libertadores com 47 clubes (com 2 atuais campeões): fases 3, 8, 4; 8 grupos de 4; mata-mata até a final', () => {
    const holders = ['river-plate', 'flamengo'];
    const f = foreignQualifiers(createPrng(3), holders);
    const b = brazilQualifiers(table.filter((id) => !holders.includes(id)), 'gremio', 'internacional');
    const r = libertadores({ groups: [...holders, ...f.libGroups, ...b.libGroups], f2: [...f.libF2, ...b.libF2], f1: f.libF1 }, club, 9);
    expect(r.preliminary.map((p) => p.ties!.length)).toEqual([3, 8, 4]);
    expect(r.groups).toHaveLength(8);
    expect(r.groups.every((g) => g.length === 4)).toBe(true);
    expect(r.knockout.map((p) => p.ties!.length)).toEqual([8, 4, 2, 1]);
    expect(r.f3Losers).toHaveLength(4);
    expect(r.thirds).toHaveLength(8);
    expect(r.champion).toBe(r.knockout.at(-1)!.ties![0]!.winner);
  });

  it('grupos evitam clubes do mesmo país (fora quem veio da Fase 3)', () => {
    const r = libertadores({ groups: [...fq.libGroups, ...br.libGroups, 'river-plate', 'botafogo'], f2: [...fq.libF2, ...br.libF2], f1: fq.libF1 }, club, 11);
    const fromF3 = new Set(r.preliminary[2]!.ties!.map((t) => t.winner));
    for (const g of r.groups) {
      const countries = g.filter((x) => !fromF3.has(x.id)).map((x) => countryOf(x.id));
      expect(new Set(countries).size).toBe(countries.length);
    }
  });

  it('Sul-Americana: fase nacional 16 jogos; 32 nos grupos; playoffs com 3ºs da Libertadores; campeão definido', () => {
    const lib = libertadores({ groups: [...fq.libGroups, ...br.libGroups, 'river-plate', 'botafogo'], f2: [...fq.libF2, ...br.libF2], f1: fq.libF1 }, club, 12);
    const r = sulAmericana({ groups: [...fq.sudGroups, ...br.sud], national: fq.sudNational }, lib.f3Losers, lib.thirds, club, 13);
    expect(r.national.ties!.length).toBe(16);
    expect(r.groups.flat()).toHaveLength(32);
    expect(r.playoffs.ties!.length).toBe(8);
    expect(r.knockout.map((p) => p.ties!.length)).toEqual([8, 4, 2, 1]);
    expect(r.champion).toBe(r.knockout.at(-1)!.ties![0]!.winner);
  });
});
