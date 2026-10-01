import { europeanSeason, firstEditionAfter, hostOf, isEditionYear, startYear } from './calendar';

describe('calendário (6.8)', () => {
  it('ano inicial vem do relógio do aparelho', () => {
    expect(startYear(new Date('2026-09-30T12:00:00'))).toBe(2026);
    expect(startYear(new Date('2031-01-02T12:00:00'))).toBe(2031);
  });

  it('Copa do Mundo a cada 4 anos a partir de 2026; Olimpíadas a partir de 2028', () => {
    for (const y of [2026, 2030, 2034, 2058]) expect(isEditionYear('copaDoMundo', y)).toBe(true);
    for (const y of [2027, 2028, 2029, 2022]) expect(isEditionYear('copaDoMundo', y)).toBe(false);
    for (const y of [2028, 2032, 2036]) expect(isEditionYear('olimpiadas', y)).toBe(true);
    expect(isEditionYear('olimpiadas', 2030)).toBe(false);
  });

  it('Copa América entre as Copas do Mundo', () => {
    for (let y = 2026; y < 2070; y++) {
      if (isEditionYear('copaAmerica', y)) expect(isEditionYear('copaDoMundo', y)).toBe(false);
    }
    expect(isEditionYear('copaAmerica', 2028)).toBe(true);
  });

  it('começando em 2026, a primeira Copa possível é a de 2030', () => {
    expect(firstEditionAfter('copaDoMundo', 2026)).toBe(2030);
    expect(firstEditionAfter('copaDoMundo', 2027)).toBe(2030);
    expect(firstEditionAfter('copaDoMundo', 2030)).toBe(2034);
    expect(firstEditionAfter('olimpiadas', 2026)).toBe(2028);
  });

  it('sedes reais onde definidas', () => {
    expect(hostOf('copaDoMundo', 2030, 1)).toEqual(['Marrocos', 'Portugal', 'Espanha']);
    expect(hostOf('copaDoMundo', 2034, 999)).toEqual(['Arábia Saudita']);
    expect(hostOf('olimpiadas', 2028, 1)).toEqual(['Los Angeles']);
    expect(hostOf('olimpiadas', 2032, 1)).toEqual(['Brisbane']);
  });

  it('sedes futuras sorteadas: estáveis pela semente, variam entre carreiras', () => {
    expect(hostOf('copaDoMundo', 2038, 7)).toEqual(hostOf('copaDoMundo', 2038, 7));
    const hosts = new Set(Array.from({ length: 50 }, (_, s) => hostOf('copaDoMundo', 2038, s).join('/')));
    expect(hosts.size).toBeGreaterThan(3);
    expect(hostOf('copaDoMundo', 2038, 7).length).toBeGreaterThan(0);
  });

  it('Copa América repete as 5 últimas sedes reais, em ordem, igual em toda carreira', () => {
    const seq = [2028, 2032, 2036, 2040, 2044, 2048].map((y) => hostOf('copaAmerica', y, 123).join('/'));
    expect(seq).toEqual(['Chile', 'Estados Unidos', 'Brasil', 'Brasil', 'Estados Unidos', 'Chile']);
    expect(hostOf('copaAmerica', 2036, 1)).toEqual(hostOf('copaAmerica', 2036, 999));
  });

  it('sede de ano sem edição é vazia', () => {
    expect(hostOf('copaDoMundo', 2031, 1)).toEqual([]);
  });

  it('temporada europeia: 2º semestre abre, 1º semestre do ano seguinte fecha', () => {
    expect(europeanSeason(2026, 2)).toBe('2026/27');
    expect(europeanSeason(2027, 1)).toBe('2026/27');
    expect(europeanSeason(2099, 2)).toBe('2099/00');
  });
});
