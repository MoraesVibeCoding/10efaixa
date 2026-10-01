import { cutOffset, invited, residenceCountry, teamName, teamStrength, type InviteInput } from './dualNationality';
import { callUp } from './nationalTeam';
import { createPrng } from './prng';
import creation from '../data/creation.json';
import { eligible, playTournament } from './tournaments';
import cfg from '../data/dualNationality.json';
import nt from '../data/nationalTeam.json';
import tour from '../data/nationalTournaments.json';

const inv = (over: Partial<InviteInput> = {}): InviteInput => ({ age: 24, brazilCaps: 0, visibility: 108, country: 'italia', decided: false, ...over });

describe('dupla nacionalidade (T38, SPEC 6.11)', () => {
  it('países: os mesmos do sorteio da criação (SPEC 6.1), todos com seleção e força', () => {
    for (const id of Object.keys(creation.dualNationality.countries)) {
      expect(teamName(id) in tour.selecoes.resto).toBe(true);
      expect(teamStrength(id)).toBeGreaterThan(0);
    }
    expect(Object.values(cfg.residencia.ligas).every((id) => id in creation.dualNationality.countries)).toBe(true);
  });

  it('residência: 5 temporadas numa das 6 ligas dão direito ao país da liga', () => {
    expect(residenceCountry('ESP', cfg.residencia.temporadas)).toBe('espanha');
    expect(residenceCountry('ESP', cfg.residencia.temporadas - 1)).toBeNull();
    expect(residenceCountry('SAU', 10)).toBeNull();
  });

  it('força e corte: seleção mais fraca convoca com nota menor; nunca mais difícil que a folga', () => {
    expect(teamStrength('italia')).toBe(tour.selecoes.resto['Itália']);
    expect(cutOffset('italia')).toBeLessThan(cutOffset('espanha'));
    expect(cutOffset('espanha')).toBe(-cfg.convite.folga);
  });

  it('convite só enquanto o Brasil não convocou, com país, idade mínima e nota suficiente; uma única vez', () => {
    const vis = nt.principal.lista + cutOffset('italia');
    expect(invited(inv({ visibility: vis }))).toBe(true);
    expect(invited(inv({ visibility: vis - 1 }))).toBe(false);
    expect(invited(inv({ visibility: vis, brazilCaps: 1 }))).toBe(false);
    expect(invited(inv({ visibility: vis, country: null }))).toBe(false);
    expect(invited(inv({ visibility: vis, age: cfg.convite.idadeMin - 1 }))).toBe(false);
    expect(invited(inv({ visibility: vis, decided: true }))).toBe(false);
  });

  it('convocação pela outra seleção usa o corte dela', () => {
    const vis = nt.principal.lista + cutOffset('italia');
    expect(callUp({ age: 25, visibility: vis, position: 'meia', caps: 0 }).rung).toBe('nenhum');
    expect(callUp({ age: 25, visibility: vis, position: 'meia', caps: 0, cutOffset: cutOffset('italia') }).rung).toBe('lista');
  });

  it('torneios pela outra seleção: força do país; Copa América só para seleções das Américas', () => {
    const wins = (teamStrength?: number) => Array.from({ length: 3000 }, (_, s) =>
      playTournament({ tournament: 'copaDoMundo', rung: 'titular', overall: 84, mental: 70, teamStrength }, () => 'deixar', createPrng(s))).filter((r) => r.champion).length;
    expect(wins(teamStrength('italia'))).toBeLessThan(wins());
    expect(eligible('copaAmerica', 'titular', 27, teamName('italia'))).toBe(false);
    expect(eligible('copaDoMundo', 'titular', 27, teamName('italia'))).toBe(true);
    expect(eligible('copaAmerica', 'titular', 27)).toBe(true);
  }, 30_000);
});
