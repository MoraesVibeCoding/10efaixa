import { createPrng } from './prng';
import { canDecideToRetire, farewellOffer, retirementCheck, type RetireInput } from './retirement';
import cfg from '../data/retirement.json';

const s = (over: Partial<RetireInput> = {}): RetireInput =>
  ({ age: 28, overall: 82, startingOverall: 55, physical: 80, peakPhysical: 84, graveInjuries: 0, minutes: 0.7, temperament: 'frio', ...over });
const many = (i: RetireInput, n = 400) => Array.from({ length: n }, (_, seed) => retirementCheck(i, createPrng(seed)));

describe('aposentadoria (T34, SPEC 6.14)', () => {
  it('gatilho 4: 40 anos é limite absoluto', () => {
    expect(many(s({ age: 40 })).every((r) => r === 'idadeLimite')).toBe(true);
    expect(cfg.idadeLimite).toBe(40);
  });

  it('gatilho 1: decidir parar só a partir dos 30; chance cresce com a idade', () => {
    expect(canDecideToRetire(29)).toBe(false);
    expect(canDecideToRetire(30)).toBe(true);
    expect(many(s({ age: 29 })).every((r) => r === null)).toBe(true);
    const n = (age: number) => many(s({ age })).filter((r) => r === 'decisao').length;
    expect(n(30)).toBeGreaterThan(0);
    expect(n(37)).toBeGreaterThan(n(31));
  });

  it('gatilho 1: poucos minutos e temperamento pesam na decisão', () => {
    const n = (o: Partial<RetireInput>) => many(s({ age: 34, ...o })).filter((r) => r === 'decisao').length;
    expect(n({ minutes: 0.1 })).toBeGreaterThan(n({ minutes: 0.7 }));
    expect(n({ temperament: 'resenha' })).toBeGreaterThan(n({ temperament: 'lider' }));
  });

  it('gatilho 2: lesões graves acumuladas ou queda física forçam (a partir da idade mínima)', () => {
    expect(retirementCheck(s({ age: 33, graveInjuries: cfg.fisico.gravesParaForcar }), createPrng(1))).toBe('fisico');
    expect(retirementCheck(s({ age: 33, physical: 84 * cfg.fisico.fracaoDoAuge - 1, peakPhysical: 84 }), createPrng(1))).toBe('fisico');
    expect(retirementCheck(s({ age: 33, physical: 84 * cfg.fisico.fracaoDoAuge + 1, peakPhysical: 84 }), createPrng(999))).not.toBe('fisico');
    expect(retirementCheck(s({ age: 24, graveInjuries: cfg.fisico.gravesParaForcar }), createPrng(1))).toBeNull();
  });

  it('gatilho 3: overall de volta ao nível inicial encerra a carreira, só depois do auge', () => {
    expect(retirementCheck(s({ age: 29, overall: 55 }), createPrng(1))).toBe('overallInicial');
    expect(retirementCheck(s({ age: 17, overall: 55 }), createPrng(1))).toBeNull();
  });

  it('sempre um sorteio, qualquer que seja o resultado', () => {
    for (const i of [s({ age: 40 }), s({ age: 20 }), s({ age: 35 })]) {
      const [a, b] = [createPrng(9), createPrng(9)];
      retirementCheck(i, a); b.next();
      expect(a.next()).toBe(b.next());
    }
  });
});

describe('despedida: retorno ao clube formador e realizar o sonho (T34, SPEC 6.18)', () => {
  const f = { age: 34, clubId: 'real-madrid', formativeClub: 'santos', heartClub: null as string | null, done: false };
  const many2 = (i: typeof f) => Array.from({ length: 300 }, (_, seed) => farewellOffer(i, createPrng(seed)));

  it('só no fim de carreira e só uma vez', () => {
    expect(many2({ ...f, age: cfg.despedida.idadeMin - 1 }).every((r) => r === null)).toBe(true);
    expect(many2({ ...f, done: true }).every((r) => r === null)).toBe(true);
    expect(many2(f).some((r) => r?.kind === 'formador' && r.clubId === 'santos')).toBe(true);
  });

  it('clube de coração tem prioridade sobre o formador; nunca propõe o clube atual', () => {
    const rs = many2({ ...f, heartClub: 'palmeiras' }).filter((r) => r !== null);
    expect(rs.length).toBeGreaterThan(0);
    expect(rs.every((r) => r!.kind === 'coracao' && r!.clubId === 'palmeiras')).toBe(true);
    expect(many2({ ...f, clubId: 'santos' }).every((r) => r === null)).toBe(true);
    expect(many2({ ...f, clubId: 'palmeiras', heartClub: 'palmeiras' }).filter((r) => r !== null).every((r) => r!.kind === 'formador')).toBe(true);
  });
});
