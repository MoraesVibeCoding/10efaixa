import { RUNGS, callUp, coachFor, visibility, type CallUpInput, type VisibilityInput } from './nationalTeam';
import cfg from '../data/nationalTeam.json';

const v = (over: Partial<VisibilityInput> = {}): VisibilityInput => ({ overall: 85, form: 0.6, minutes: 0.8, league: 'BRA-A', reputation: 80, ...over });
const c = (over: Partial<CallUpInput> = {}): CallUpInput => ({ age: 27, visibility: 0, position: 'meia', caps: 0, ...over });
const forma = { cycle: 0, preference: 'forma' as const };

describe('Seleção: treinador, visibilidade e degraus (T35, SPEC 6.11)', () => {
  it('treinador: o mesmo durante o ciclo, determinístico pela semente, com preferência válida', () => {
    expect(coachFor(2027, 5)).toEqual(coachFor(2030, 5));
    expect(coachFor(2031, 5).cycle).toBe(coachFor(2027, 5).cycle + 1);
    expect(coachFor(2026, 5).cycle).toBeLessThan(coachFor(2027, 5).cycle);
    const prefs = new Set(Array.from({ length: 60 }, (_, s) => coachFor(2027, s).preference));
    expect([...prefs].sort()).toEqual([...cfg.treinador.preferencias].sort());
    const cycles = new Set(Array.from({ length: 8 }, (_, k) => coachFor(2027 + 4 * k, 5).preference));
    expect(cycles.size).toBeGreaterThan(1);
  });

  it('visibilidade cresce com overall, forma, minutos, liga e reputação', () => {
    const base = visibility(v(), forma);
    expect(visibility(v({ overall: 86 }), forma)).toBeGreaterThan(base);
    expect(visibility(v({ form: 0.9 }), forma)).toBeGreaterThan(base);
    expect(visibility(v({ minutes: 1 }), forma)).toBeGreaterThan(base);
    expect(visibility(v({ reputation: 95 }), forma)).toBeGreaterThan(base);
    expect(visibility(v({ league: 'ENG' }), forma)).toBeGreaterThan(base);
    expect(base).toBeGreaterThan(visibility(v({ league: 'BRA-B' }), forma));
  });

  it('preferência do treinador: Europa, Brasileirão ou forma recente mudam a nota', () => {
    const eur = { cycle: 0, preference: 'europa' as const };
    const bra = { cycle: 0, preference: 'brasileirao' as const };
    expect(visibility(v({ league: 'ESP' }), eur) - visibility(v({ league: 'ESP' }), bra)).toBeCloseTo(cfg.visibilidade.preferencia);
    expect(visibility(v(), bra) - visibility(v(), eur)).toBeCloseTo(cfg.visibilidade.preferencia);
    const gain = (coach: typeof forma | typeof eur) => visibility(v({ form: 1 }), coach) - visibility(v({ form: 0 }), coach);
    expect(gain(forma)).toBeGreaterThan(gain(eur));
  });

  it('convocação segue a nota: nunca desce quando a visibilidade sobe', () => {
    for (const age of [16, 19, 22, 27]) {
      let prev = 0;
      for (let vis = 40; vis <= 130; vis++) {
        const r = callUp(c({ age, visibility: vis }));
        const level = RUNGS.indexOf(r.rung);
        expect(level).toBeGreaterThanOrEqual(prev);
        prev = level;
      }
      expect(prev).toBe(RUNGS.indexOf('titular'));
    }
  });

  it('degraus de base respeitam a idade; a principal não tem idade', () => {
    const p = cfg.principal;
    const [s17, s20, oli] = cfg.base;
    expect(callUp(c({ age: 16, visibility: s17!.corte })).rung).toBe('sub17');
    expect(callUp(c({ age: 16, visibility: s17!.corte - 1 })).rung).toBe('nenhum');
    expect(callUp(c({ age: 19, visibility: s20!.corte })).rung).toBe('sub20');
    expect(callUp(c({ age: 19, visibility: s17!.corte })).rung).toBe('nenhum');
    expect(callUp(c({ age: 22, visibility: oli!.corte })).rung).toBe('olimpica');
    expect(callUp(c({ age: 25, visibility: oli!.corte })).rung).toBe('nenhum');
    expect(callUp(c({ age: 17, visibility: p.lista })).rung).toBe('lista');
    expect(callUp(c({ visibility: p.reserva })).rung).toBe('reserva');
    expect(callUp(c({ visibility: p.titular })).rung).toBe('titular');
  });

  it('camisa 10: só titular de meio/ataque acima do corte', () => {
    const vis = cfg.principal.camisa10.corte;
    expect(callUp(c({ visibility: vis })).ten).toBe(true);
    expect(callUp(c({ visibility: vis - 1 })).ten).toBe(false);
    expect(callUp(c({ visibility: vis, position: 'zagueiro' })).ten).toBe(false);
  });

  it('faixa de capitão: corte, convocações mínimas e idade mínima; qualquer posição', () => {
    const k = cfg.principal.capitao;
    const ok = c({ visibility: k.corte, caps: k.convocacoesMin, age: k.idadeMin, position: 'goleiro' });
    expect(callUp(ok).captain).toBe(true);
    expect(callUp({ ...ok, caps: k.convocacoesMin - 1 }).captain).toBe(false);
    expect(callUp({ ...ok, age: k.idadeMin - 1 }).captain).toBe(false);
    expect(callUp({ ...ok, visibility: k.corte - 1 }).captain).toBe(false);
  });
});
