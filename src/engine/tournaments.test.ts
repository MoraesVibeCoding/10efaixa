import { autoChoice } from './events';
import { createPrng } from './prng';
import { TOURNAMENTS, eligible, playTournament, type Decide, type TournamentInput } from './tournaments';
import cfg from '../data/nationalTournaments.json';

const HEAVY = { timeout: 30_000 };
const i = (over: Partial<TournamentInput> = {}): TournamentInput => ({ tournament: 'copaDoMundo', rung: 'titular', overall: 88, mental: 80, ...over });
const auto = (temp: string): Decide => (event) => autoChoice(event, temp);
const always = (map: Record<string, string>): Decide => (event) => map[event] ?? autoChoice(event, 'lider');
const run = (input: TournamentInput, decide: Decide, n: number) => Array.from({ length: n }, (_, s) => playTournament(input, decide, createPrng(s)));

describe('torneios de seleções (T37, SPEC 6.11)', () => {
  it('formatos com fonte; o que não foi confirmado está marcado', () => {
    for (const t of TOURNAMENTS) {
      expect(cfg.torneios[t].fonte).toMatch(/^https:\/\//);
      expect(cfg.torneios[t].jogosGrupo).toBe(3);
    }
    expect(cfg.torneios.copaDoMundo.mataMata).toHaveLength(5);
    expect(cfg.torneios.copaAmerica.mataMata).toHaveLength(3);
    expect(cfg.torneios.olimpiadas.verificado).toBe(false);
  });

  it('só joga quem está no degrau certo: principal na Copa e na Copa América; Olímpica (ou principal até 23) nas Olimpíadas', () => {
    for (const t of ['copaDoMundo', 'copaAmerica'] as const) {
      expect(eligible(t, 'lista', 30)).toBe(true);
      expect(eligible(t, 'titular', 18)).toBe(true);
      expect(eligible(t, 'olimpica', 22)).toBe(false);
      expect(eligible(t, 'nenhum', 27)).toBe(false);
    }
    expect(eligible('olimpiadas', 'olimpica', 22)).toBe(true);
    expect(eligible('olimpiadas', 'titular', 23)).toBe(true);
    expect(eligible('olimpiadas', 'titular', 24)).toBe(false);
    expect(eligible('olimpiadas', 'sub20', 19)).toBe(false);
  });

  it('determinístico; fase válida; campeão joga todos os jogos do formato', () => {
    for (const t of TOURNAMENTS) {
      const rounds = cfg.torneios[t].mataMata;
      for (let s = 0; s < 200; s++) {
        const r = playTournament(i({ tournament: t, rung: t === 'olimpiadas' ? 'olimpica' : 'titular' }), auto('lider'), createPrng(s));
        expect(r).toEqual(playTournament(i({ tournament: t, rung: t === 'olimpiadas' ? 'olimpica' : 'titular' }), auto('lider'), createPrng(s)));
        expect(['grupos', ...rounds, 'campeao']).toContain(r.stage);
        expect(r.champion).toBe(r.stage === 'campeao');
        if (r.champion) expect(r.matches).toBe(3 + rounds.length);
        if (r.stage === 'grupos') expect(r.matches).toBe(3);
      }
    }
  });

  it('Brasil ganha a Copa numa frequência plausível (5% a 35%)', HEAVY, () => {
    const rate = run(i({ overall: 84 }), auto('lider'), 3000).filter((r) => r.champion).length / 3000;
    expect(rate).toBeGreaterThan(0.05);
    expect(rate).toBeLessThan(0.35);
  });

  it('craque titular aumenta a chance de título; quem só está na lista pesa menos', HEAVY, () => {
    const wins = (o: Partial<TournamentInput>) => run(i(o), always({ 'copa-penalti': 'deixar' }), 4000).filter((r) => r.champion).length;
    expect(wins({ overall: 97, rung: 'titular' })).toBeGreaterThan(wins({ overall: 97, rung: 'lista' }));
  });

  it('1 a 2 momentos de decisão por torneio, sempre do catálogo', () => {
    const seen = new Set<string>();
    for (const r of run(i(), auto('lider'), 400)) {
      expect(r.decisions.length).toBeGreaterThanOrEqual(1);
      expect(r.decisions.length).toBeLessThanOrEqual(2);
      for (const d of r.decisions) seen.add(d.event);
    }
    expect([...seen].sort()).toEqual(['copa-fora-posicao', 'copa-penalti', 'copa-sacrificio']);
  });

  it('pênalti decisivo: quem bate vira herói ou vilão; quem deixa nunca é vilão', () => {
    const bate = run(i(), always({ 'copa-penalti': 'bater' }), 1500);
    expect(bate.some((r) => r.villain)).toBe(true);
    expect(bate.filter((r) => r.villain).every((r) => !r.champion && r.decisions.some((d) => d.event === 'copa-penalti'))).toBe(true);
    expect(run(i(), always({ 'copa-penalti': 'deixar' }), 1500).some((r) => r.villain)).toBe(false);
    expect(bate.filter((r) => r.hero).every((r) => r.champion)).toBe(true);
    expect(bate.some((r) => r.hero)).toBe(true);
  });

  it('Mental alto converte mais pênaltis decisivos (menos vilões)', HEAVY, () => {
    const villains = (mental: number) => run(i({ mental }), always({ 'copa-penalti': 'bater' }), 4000).filter((r) => r.villain).length;
    expect(villains(95)).toBeLessThan(villains(50));
  });

  it('sacrifício: jogar pode custar lesão; poupar nunca', () => {
    const only = { 'copa-fora-posicao': 'aceitar' };
    expect(run(i(), always({ ...only, 'copa-sacrificio': 'jogar' }), 600).some((r) => r.injured)).toBe(true);
    expect(run(i(), always({ ...only, 'copa-sacrificio': 'poupar' }), 600).some((r) => r.injured)).toBe(false);
  });
});
