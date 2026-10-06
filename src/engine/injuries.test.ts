import { autoChoice, eligibleEvents, sceneOf } from './events';
import { GRAVE_OPTIONS, decayRelapse, graveDecision, injuryRisk, semesterInjury, type InjuryInput } from './injuries';
import { createPrng } from './prng';

const base: InjuryInput = { age: 25, build: 'atletico', minutes: 0.8, riskMultiplier: 1, relapseRisk: 0 };
const rate = (i: InjuryInput, n = 5000) => Array.from({ length: n }, (_, s) => semesterInjury(i, createPrng(s))).filter((r) => r.severity !== 'nenhuma').length / n;

describe('lesões (T31)', () => {
  it('compleição influencia o risco: franzino > atlético > forte', () => {
    expect(injuryRisk({ ...base, build: 'franzino' })).toBeGreaterThan(injuryRisk(base));
    expect(injuryRisk(base)).toBeGreaterThan(injuryRisk({ ...base, build: 'forte' }));
    expect(rate({ ...base, build: 'franzino' })).toBeGreaterThan(rate({ ...base, build: 'forte' }));
  });

  it('foco físico (reunião), idade, minutos e recaída aumentam o risco', () => {
    expect(injuryRisk({ ...base, riskMultiplier: 1.45 })).toBeGreaterThan(injuryRisk(base));
    expect(injuryRisk({ ...base, age: 34 })).toBeGreaterThan(injuryRisk(base));
    expect(injuryRisk({ ...base, minutes: 1 })).toBeGreaterThan(injuryRisk({ ...base, minutes: 0.1 }));
    expect(injuryRisk({ ...base, relapseRisk: 0.4 })).toBeGreaterThan(injuryRisk(base));
  });

  it('gravidades: leve é mais comum que média, e média mais que grave; minutos perdidos crescem com a gravidade', () => {
    const rs = Array.from({ length: 20000 }, (_, s) => semesterInjury(base, createPrng(s)));
    const n = (k: string) => rs.filter((r) => r.severity === k).length;
    expect(n('leve')).toBeGreaterThan(n('media'));
    expect(n('media')).toBeGreaterThan(n('grave'));
    expect(n('grave')).toBeGreaterThan(0);
    const lost = (k: string) => rs.find((r) => r.severity === k)!.minutesLost;
    expect(lost('grave')).toBeGreaterThan(lost('media'));
    expect(lost('media')).toBeGreaterThan(lost('leve'));
    expect(rs.find((r) => r.severity === 'nenhuma')!.minutesLost).toBe(0);
  });

  it('lesão grave: três opções trocando tempo fora por risco de recaída', () => {
    expect(GRAVE_OPTIONS).toEqual(['operar', 'conservador', 'voltar-antes']);
    const [op, cons, early] = GRAVE_OPTIONS.map(graveDecision);
    expect(op!.semestersOut).toBeGreaterThan(cons!.semestersOut);
    expect(cons!.semestersOut).toBeGreaterThan(early!.semestersOut);
    expect(op!.relapseRisk).toBeLessThan(cons!.relapseRisk);
    expect(cons!.relapseRisk).toBeLessThan(early!.relapseRisk);
    expect(early!.physicalLoss).toBeGreaterThan(op!.physicalLoss);
    expect(() => graveDecision('rezar')).toThrow(RangeError);
  });

  it('risco de recaída diminui com o tempo', () => {
    expect(decayRelapse(0.4)).toBeLessThan(0.4);
    expect(decayRelapse(0)).toBe(0);
  });

  it('dilema no catálogo com cena de hospital e política por temperamento', () => {
    expect(eligibleEvents({ lesaoGrave: true })).toContain('lesao-grave');
    expect(sceneOf('lesao-grave')).toBe('hospital');
    expect(autoChoice('lesao-grave', 'frio')).toBe('operar');
    expect(autoChoice('lesao-grave', 'lider')).toBe('voltar-antes');
    expect(autoChoice('lesao-grave', 'resenha')).toBe('conservador');
  });
});
