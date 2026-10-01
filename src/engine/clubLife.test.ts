import { CLUBS } from './clubs';
import { semesterClubLife, type ClubLifeState } from './clubLife';
import { createPrng } from './prng';
import cfg from '../data/clubLife.json';

const byId = new Map(CLUBS.map((c) => [c.id, c]));
const base: ClubLifeState = { clubId: 'bahia', coachRelation: 0.8, salaryDelays: 0, age: 25, minutes: 0.8, expectedRank: 8, actualRank: 8 };
const rate = (s: ClubLifeState, f: (r: ReturnType<typeof semesterClubLife>) => boolean, n = 2000) =>
  Array.from({ length: n }, (_, i) => semesterClubLife(s, createPrng(i))).filter(f).length / n;

describe('vida de clube (T23)', () => {
  it('troca de técnico é mais provável quando o time fica abaixo do esperado', () => {
    expect(rate({ ...base, actualRank: 18 }, (r) => r.coachChanged)).toBeGreaterThan(rate(base, (r) => r.coachChanged) + 0.2);
  });

  it('novo técnico: relação recomeça do valor inicial', () => {
    const r = Array.from({ length: 500 }, (_, i) => semesterClubLife({ ...base, actualRank: 20 }, createPrng(i))).find((x) => x.coachChanged)!;
    expect(r.coachRelation).toBe(cfg.tecnico.relacaoInicial);
  });

  it('salário atrasa mais em clube pequeno', () => {
    expect(rate({ ...base, clubId: 'athletic-mg' }, (r) => r.salaryDelayed)).toBeGreaterThan(rate({ ...base, clubId: 'flamengo' }, (r) => r.salaryDelayed));
  });

  it('salário atrasado habilita pedir para sair; sem atraso, não', () => {
    const delayed = Array.from({ length: 500 }, (_, i) => semesterClubLife({ ...base, clubId: 'athletic-mg' }, createPrng(i)));
    for (const r of delayed) expect(r.canRequestLeave).toBe(r.salaryDelays >= cfg.salario.atrasosParaPedirSaida);
    expect(delayed.some((r) => r.canRequestLeave)).toBe(true);
    expect(delayed.some((r) => !r.salaryDelayed && r.salaryDelays === 0 && !r.canRequestLeave)).toBe(true);
  });

  it('empréstimo: oferecido a jovem com poucos minutos, para clube menor do estado ou vizinho', () => {
    const young = Array.from({ length: 300 }, (_, i) => semesterClubLife({ ...base, clubId: 'palmeiras', age: 19, minutes: 0.1 }, createPrng(i)));
    const offers = young.map((r) => r.loanOffer).filter((x): x is string => !!x);
    expect(offers.length).toBeGreaterThan(50);
    for (const id of offers) expect(byId.get(id)!.reputacao).toBeLessThan(byId.get('palmeiras')!.reputacao);
    expect(rate({ ...base, age: 30, minutes: 0.1 }, (r) => r.loanOffer !== null)).toBe(0);
    expect(rate({ ...base, age: 19, minutes: 0.9 }, (r) => r.loanOffer !== null)).toBe(0);
  });
});
