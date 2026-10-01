import { RUNGS, callUp, coachFor, rungLevel, selectionEffect, updatePrestige, visibility, type CallUp, type CallUpInput, type VisibilityInput } from './nationalTeam';
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

describe('efeito Seleção e decaimento (T36, SPEC 6.11)', () => {
  const cu = (rung: CallUp['rung'], ten = false, captain = false): CallUp => ({ rung, ten, captain });
  const e = cfg.efeito;

  it('nível cresce por degrau; camisa 10 e faixa somam; teto 1', () => {
    const levels = RUNGS.map((r) => rungLevel(cu(r)));
    for (let i = 1; i < levels.length; i++) expect(levels[i]).toBeGreaterThan(levels[i - 1]!);
    expect(rungLevel(cu('titular', true))).toBeGreaterThan(rungLevel(cu('titular')));
    expect(rungLevel(cu('titular', true, true))).toBeCloseTo(1);
  });

  it('prestígio sobe ao nível da convocação e cai aos poucos sem ela', () => {
    const up = updatePrestige(0, cu('titular'));
    expect(up).toBeCloseTo(e.nivel.titular);
    const d1 = updatePrestige(up, cu('nenhum'));
    expect(d1).toBeCloseTo(up * e.decaimentoPorSemestre);
    expect(d1).toBeGreaterThan(0.5 * up);
    let p = up;
    for (let i = 0; i < 20; i++) p = updatePrestige(p, cu('nenhum'));
    expect(p).toBeLessThan(0.05);
    // degrau menor não derruba de uma vez: vale o maior entre o decaído e o novo nível
    expect(updatePrestige(up, cu('lista'))).toBeCloseTo(Math.max(up * e.decaimentoPorSemestre, e.nivel.lista));
  });

  it('bônus proporcionais ao prestígio: minutos no clube, reunião, mercado', () => {
    const [lo, hi] = [selectionEffect(0.5, cu('lista'), 'lista'), selectionEffect(1, cu('titular', true, true), 'titular')];
    expect(hi.clubMinutes).toBeGreaterThan(lo.clubMinutes);
    expect(hi.marketMultiplier).toBeCloseTo(1 + e.mercado.valor);
    expect(hi.extraOffers).toBeGreaterThan(lo.extraOffers);
    expect(hi.meetingStatus).toBe(1);
    const zero = selectionEffect(0, cu('nenhum'), 'nenhum');
    expect(zero).toEqual({ clubMinutes: 0, meetingStatus: 0, marketMultiplier: 1, extraOffers: 0, mentalBonus: 1, injuryRisk: 1, moraleDelta: 0 });
  });

  it('contrapartidas só com convocação ativa para a principal: desfalque, desgaste e Mental extra', () => {
    const active = selectionEffect(0.8, cu('titular'), 'titular');
    const former = selectionEffect(0.8, cu('nenhum'), 'nenhum');
    expect(active.injuryRisk).toBeCloseTo(1 + e.contrapartidas.riscoLesao);
    expect(active.mentalBonus).toBeGreaterThan(1);
    expect(active.clubMinutes).toBeCloseTo(0.8 * e.minutosNoClube - e.contrapartidas.desfalque);
    expect(former.injuryRisk).toBe(1);
    expect(former.mentalBonus).toBe(1);
    expect(former.clubMinutes).toBeCloseTo(0.8 * e.minutosNoClube);
    expect(selectionEffect(0.2, cu('sub20'), 'sub20').injuryRisk).toBe(1);
  });

  it('ser cortado da principal derruba a moral', () => {
    expect(selectionEffect(0.6, cu('nenhum'), 'reserva').moraleDelta).toBe(e.contrapartidas.corteMoral);
    expect(selectionEffect(0.6, cu('lista'), 'reserva').moraleDelta).toBe(0);
    expect(selectionEffect(0.2, cu('nenhum'), 'sub20').moraleDelta).toBe(0);
  });
});
