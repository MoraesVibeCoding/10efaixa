import { createPrng } from './prng';
import { canDecideToRetire, retirementCheck, suggestsRetiring, type RetireInput } from './retirement';
import cfg from '../data/retirement.json';

const s = (over: Partial<RetireInput> = {}): RetireInput =>
  ({ age: 28, overall: 82, startingOverall: 55, physical: 80, peakPhysical: 84, graveInjuries: 0, ...over });
const many = (i: RetireInput, n = 400) => Array.from({ length: n }, (_, seed) => retirementCheck(i, createPrng(seed)));

describe('aposentadoria (T34, SPEC 6.14)', () => {
  it('gatilho 4: 40 anos é limite absoluto', () => {
    expect(many(s({ age: 40 })).every((r) => r === 'idadeLimite')).toBe(true);
    expect(cfg.idadeLimite).toBe(40);
  });

  // v2.85: parar por decisão é escolha na tela de propostas, dos 34 em diante; a checagem de fim de temporada só tem os gatilhos forçados
  it('gatilho 1: sem sorteio de "decidiu parar"; o card de parar só a partir dos 34', () => {
    expect(canDecideToRetire(cfg.fimDeCarreira.idadeMin - 1)).toBe(false);
    expect(canDecideToRetire(cfg.fimDeCarreira.idadeMin)).toBe(true);
    for (const age of [30, 33, 35, 38]) expect(many(s({ age })).every((r) => r === null)).toBe(true);
  });

  it('gatilho 1 no automático: a sugestão de parar segue a idade do temperamento, um ano antes com poucos minutos', () => {
    const a = cfg.fimDeCarreira.pararAuto;
    expect(suggestsRetiring({ age: 33, minutes: 0.05, temperament: 'resenha' })).toBe(false);
    expect(suggestsRetiring({ age: a.idade.lider - 1, minutes: 0.7, temperament: 'lider' })).toBe(false);
    expect(suggestsRetiring({ age: a.idade.lider, minutes: 0.7, temperament: 'lider' })).toBe(true);
    expect(suggestsRetiring({ age: a.idade.lider - a.anosAntesComMinutosBaixos, minutes: a.minutosBaixos / 2, temperament: 'lider' })).toBe(true);
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
