import { CLUBS } from './clubs';
import { heartClubOptions } from './heartClub';

describe('opções de clube de coração (6.18)', () => {
  it('todos os clubes brasileiros, sem repetir', () => {
    const opts = heartClubOptions('BA');
    expect(new Set(opts).size).toBe(CLUBS.length);
  });

  it('clubes do estado natal primeiro, por reputação', () => {
    const opts = heartClubOptions('BA');
    const ba = CLUBS.filter((c) => c.uf === 'BA');
    expect(opts.slice(0, ba.length).sort()).toEqual(ba.map((c) => c.id).sort());
    expect(opts[0]).toBe('bahia');
  });

  it('estado sem clube: lista só por reputação', () => {
    const opts = heartClubOptions('XX');
    expect(opts[0]).toBe('flamengo');
  });
});
