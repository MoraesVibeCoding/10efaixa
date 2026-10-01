import { assignNumber, canGetArmband, canGetTen, mostUsedNumber, rosterNumbers } from './shirt';
import { createPrng } from './prng';

describe('número da camisa, a 10 e a faixa (T24)', () => {
  it('elenco sempre tem a 10 ocupada e números válidos', () => {
    for (let s = 0; s < 100; s++) {
      const r = rosterNumbers(createPrng(s));
      expect(r.has(10)).toBe(true);
      for (const n of r) expect(n >= 1 && n <= 99).toBe(true);
    }
  });

  it('número mantido se livre', () => {
    expect(assignNumber(7, new Set([1, 2, 3]))).toBe(7);
  });

  it('número ocupado: recebe outro livre, nunca a 10', () => {
    const taken = new Set([7, 8, 9, 11]);
    const n = assignNumber(7, taken);
    expect(taken.has(n)).toBe(false);
    expect(n).not.toBe(10);
  });

  it('a 10 nunca vem na chegada, mesmo escolhida e livre', () => {
    expect(assignNumber(10, new Set())).not.toBe(10);
  });

  it('a 10 só por evento: melhor do elenco e querido pela torcida', () => {
    expect(canGetTen({ overall: 85, squadLevel: 75, idolatry: 60 })).toBe(true);
    expect(canGetTen({ overall: 85, squadLevel: 75, idolatry: 10 })).toBe(false);
    expect(canGetTen({ overall: 76, squadLevel: 75, idolatry: 90 })).toBe(false);
  });

  it('faixa de capitão por evento; Líder tem caminho mais curto', () => {
    const p = { overall: 78, squadLevel: 75, idolatry: 25, age: 22, seasonsAtClub: 1 };
    expect(canGetArmband({ ...p, temperament: 'lider' })).toBe(true);
    expect(canGetArmband({ ...p, temperament: 'resenha' })).toBe(false);
    expect(canGetArmband({ ...p, idolatry: 45, age: 27, seasonsAtClub: 4, temperament: 'resenha' })).toBe(true);
  });

  it('cartão: número mais usado na carreira', () => {
    expect(mostUsedNumber([{ number: 7, semesters: 6 }, { number: 10, semesters: 9 }, { number: 7, semesters: 4 }])).toBe(7);
  });
});
