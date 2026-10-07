import { dailySeed, dayKeyBR } from './daily';

// T57a (SPEC 6.15, v2.49): semente do dia. A data é parâmetro; o motor nunca lê o relógio.
describe('desafio do dia (T57a)', () => {
  it('dayKeyBR usa o fuso de Brasília (UTC−3): 02:59 UTC ainda é o dia anterior', () => {
    expect(dayKeyBR(new Date('2026-10-07T02:59:59Z'))).toBe('2026-10-06');
    expect(dayKeyBR(new Date('2026-10-07T03:00:00Z'))).toBe('2026-10-07');
  });

  it('dayKeyBR vira o ano à meia-noite de Brasília', () => {
    expect(dayKeyBR(new Date('2027-01-01T02:59:59Z'))).toBe('2026-12-31');
    expect(dayKeyBR(new Date('2027-01-01T03:00:00Z'))).toBe('2027-01-01');
  });

  it('mesma data, mesma semente (inteiro de 32 bits sem sinal)', () => {
    const s = dailySeed('2026-10-07');
    expect(dailySeed('2026-10-07')).toBe(s);
    expect(Number.isInteger(s) && s >= 0 && s <= 0xffffffff).toBe(true);
  });

  it('dias vizinhos têm sementes diferentes', () => {
    const seeds = new Set(['2026-10-06', '2026-10-07', '2026-10-08'].map(dailySeed));
    expect(seeds.size).toBe(3);
  });

  it('rejeita data fora do formato AAAA-MM-DD ou inexistente', () => {
    for (const bad of ['', '2026-1-7', '07/10/2026', '2026-13-01', '2026-02-30', '2026-10-07T00:00']) {
      expect(() => dailySeed(bad)).toThrow();
    }
  });
});
