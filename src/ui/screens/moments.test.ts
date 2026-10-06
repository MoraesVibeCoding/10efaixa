import { describe, expect, it } from 'vitest';
import { momentsBetween } from './moments';

const s = (clubId: string, division: string | null) => ({ clubId, division });

describe('momentos entre decisões (v2.47)', () => {
  it('sem decisão anterior, nenhum carimbo', () => {
    expect(momentsBetween(undefined, { titles: [{ competition: 'serieA' }], seasons: [] })).toEqual([]);
  });

  it('títulos novos desde a decisão anterior viram carimbo, os antigos não', () => {
    const antes = { titles: [{ competition: 'estadual' }], seasons: [] };
    const agora = { titles: [{ competition: 'estadual' }, { competition: 'serieA' }], seasons: [] };
    expect(momentsBetween(antes, agora)).toEqual([{ kind: 'titulo', competition: 'serieA' }]);
  });

  it('acesso e rebaixamento só no mesmo clube, entre Séries A–D', () => {
    const antes = { titles: [], seasons: [s('bahia', 'BRA-B')] };
    expect(momentsBetween(antes, { titles: [], seasons: [s('bahia', 'BRA-B'), s('bahia', 'BRA-A')] })).toEqual([{ kind: 'acesso' }]);
    expect(momentsBetween(antes, { titles: [], seasons: [s('bahia', 'BRA-B'), s('bahia', 'BRA-C')] })).toEqual([{ kind: 'rebaixamento' }]);
    // troca de clube não é acesso; liga europeia não entra
    expect(momentsBetween(antes, { titles: [], seasons: [s('bahia', 'BRA-B'), s('santos', 'BRA-A')] })).toEqual([]);
    expect(momentsBetween({ titles: [], seasons: [s('x', 'ENG')] }, { titles: [], seasons: [s('x', 'ENG'), s('x', 'BRA-A')] })).toEqual([]);
  });

  it('título vem antes do acesso (a celebração abre a sequência)', () => {
    const antes = { titles: [], seasons: [s('bahia', 'BRA-B')] };
    const agora = { titles: [{ competition: 'serieB' }], seasons: [s('bahia', 'BRA-B'), s('bahia', 'BRA-A')] };
    expect(momentsBetween(antes, agora).map((m) => m.kind)).toEqual(['titulo', 'acesso']);
  });
});
