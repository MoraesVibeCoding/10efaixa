import { ancestry, cutOffset, invited, residenceCountry, teamStrength, type InviteInput } from './dualNationality';
import { callUp } from './nationalTeam';
import { createPrng } from './prng';
import { eligible, playTournament } from './tournaments';
import cfg from '../data/dualNationality.json';
import nt from '../data/nationalTeam.json';
import tour from '../data/nationalTournaments.json';

const inv = (over: Partial<InviteInput> = {}): InviteInput => ({ age: 24, brazilCaps: 0, visibility: 108, country: 'Itália', decided: false, ...over });

describe('dupla nacionalidade (T38, SPEC 6.11)', () => {
  it('ascendência: minoria das carreiras, sempre um país da lista, sempre 2 sorteios', () => {
    const rs = Array.from({ length: 2000 }, (_, s) => ancestry(createPrng(s)));
    const rate = rs.filter((r) => r !== null).length / rs.length;
    expect(rate).toBeGreaterThan(cfg.ascendencia.chance - 0.03);
    expect(rate).toBeLessThan(cfg.ascendencia.chance + 0.03);
    for (const r of rs) if (r) expect(Object.keys(cfg.ascendencia.paises)).toContain(r);
    const [a, b] = [createPrng(4), createPrng(4)];
    ancestry(a); b.next(); b.next();
    expect(a.next()).toBe(b.next());
  });

  it('residência: 5 temporadas numa das 6 ligas dão direito ao país da liga', () => {
    expect(residenceCountry('ESP', cfg.residencia.temporadas)).toBe('Espanha');
    expect(residenceCountry('ESP', cfg.residencia.temporadas - 1)).toBeNull();
    expect(residenceCountry('SAU', 10)).toBeNull();
  });

  it('força e corte: seleção mais fraca convoca com nota menor; nunca mais difícil que a folga', () => {
    expect(teamStrength('Itália')).toBe(tour.selecoes.resto['Itália']);
    expect(cutOffset('Japão')).toBeLessThan(cutOffset('Itália'));
    expect(cutOffset('Espanha')).toBe(-cfg.convite.folga);
  });

  it('convite só enquanto o Brasil não convocou, com país, idade mínima e nota suficiente; uma única vez', () => {
    const vis = nt.principal.lista + cutOffset('Itália');
    expect(invited(inv({ visibility: vis }))).toBe(true);
    expect(invited(inv({ visibility: vis - 1 }))).toBe(false);
    expect(invited(inv({ visibility: vis, brazilCaps: 1 }))).toBe(false);
    expect(invited(inv({ visibility: vis, country: null }))).toBe(false);
    expect(invited(inv({ visibility: vis, age: cfg.convite.idadeMin - 1 }))).toBe(false);
    expect(invited(inv({ visibility: vis, decided: true }))).toBe(false);
  });

  it('convocação pela outra seleção usa o corte dela', () => {
    const vis = nt.principal.lista + cutOffset('Japão');
    expect(callUp({ age: 25, visibility: vis, position: 'meia', caps: 0 }).rung).toBe('nenhum');
    expect(callUp({ age: 25, visibility: vis, position: 'meia', caps: 0, cutOffset: cutOffset('Japão') }).rung).toBe('lista');
  });

  it('torneios pela outra seleção: força do país; Copa América só para seleções das Américas', () => {
    const wins = (teamStrength?: number) => Array.from({ length: 3000 }, (_, s) =>
      playTournament({ tournament: 'copaDoMundo', rung: 'titular', overall: 84, mental: 70, teamStrength }, () => 'deixar', createPrng(s))).filter((r) => r.champion).length;
    expect(wins(teamStrength('Japão'))).toBeLessThan(wins());
    expect(eligible('copaAmerica', 'titular', 27, 'Itália')).toBe(false);
    expect(eligible('copaDoMundo', 'titular', 27, 'Itália')).toBe(true);
    expect(eligible('copaAmerica', 'titular', 27)).toBe(true);
  }, 30_000);
});
