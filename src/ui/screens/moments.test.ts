import { describe, expect, it } from 'vitest';
import { momentsBetween } from './moments';

// a temporada fechada (com ano) e o retrato do momento da decisão: ano, clube e divisão de agora
const s = (year: number, clubId: string, division: string | null) => ({ year, clubId, division });
const snap = (year: number, clubId: string | null, divisao: string | null, seasons: ReturnType<typeof s>[], titles: { competition: string }[] = []) => ({ year, clubId, divisao, seasons, titles });

describe('momentos entre decisões (v2.47)', () => {
  it('sem decisão anterior, nenhum carimbo', () => {
    expect(momentsBetween(undefined, snap(2030, 'bahia', 'BRA-A', [], [{ competition: 'serieA' }]))).toEqual([]);
  });

  it('títulos novos desde a decisão anterior viram carimbo, os antigos não', () => {
    const antes = snap(2030, 'bahia', 'BRA-A', [], [{ competition: 'estadual' }]);
    const agora = snap(2031, 'bahia', 'BRA-A', [s(2030, 'bahia', 'BRA-A')], [{ competition: 'estadual' }, { competition: 'serieA' }]);
    expect(momentsBetween(antes, agora)).toEqual([{ kind: 'titulo', competition: 'serieA' }]);
  });

  it('acesso e rebaixamento só no mesmo clube, entre Séries A–D, com a série nova', () => {
    const antes = snap(2030, 'bahia', 'BRA-B', []);
    expect(momentsBetween(antes, snap(2031, 'bahia', 'BRA-A', [s(2030, 'bahia', 'BRA-B')]))).toEqual([{ kind: 'acesso', serie: 'A' }]);
    expect(momentsBetween(antes, snap(2031, 'bahia', 'BRA-C', [s(2030, 'bahia', 'BRA-B')]))).toEqual([{ kind: 'rebaixamento', serie: 'C' }]);
    // troca de clube não é acesso; liga europeia não entra
    expect(momentsBetween(antes, snap(2031, 'santos', 'BRA-A', [s(2030, 'bahia', 'BRA-B')]))).toEqual([]);
    expect(momentsBetween(snap(2030, 'x', 'ENG', []), snap(2031, 'x', 'BRA-A', [s(2030, 'x', 'ENG')]))).toEqual([]);
  });

  it('título vem antes do acesso (a celebração abre a sequência)', () => {
    const antes = snap(2030, 'bahia', 'BRA-B', []);
    const agora = snap(2031, 'bahia', 'BRA-A', [s(2030, 'bahia', 'BRA-B')], [{ competition: 'serieB' }]);
    expect(momentsBetween(antes, agora).map((m) => m.kind)).toEqual(['titulo', 'acesso']);
  });

  // pedido do usuário (2026-10-11): "às vezes, ao ser campeão, aparece o carimbo de rebaixamento". A queda de 2031 só
  // aparecia no fim de 2032 (quando a temporada da Série B fechava), junto com o título daquele ano.
  it('o rebaixamento carimba logo depois da queda, e não um ano depois junto com o título seguinte', () => {
    const em2031 = snap(2031, 'bahia', 'BRA-A', [s(2030, 'bahia', 'BRA-A')]);
    const em2032 = snap(2032, 'bahia', 'BRA-B', [s(2030, 'bahia', 'BRA-A'), s(2031, 'bahia', 'BRA-A')]);
    expect(momentsBetween(em2031, em2032)).toEqual([{ kind: 'rebaixamento', serie: 'B' }]);
    // fim de 2032: campeão da Série B. Só o título e o acesso; a queda já foi carimbada
    const em2033 = snap(2033, 'bahia', 'BRA-A', [...em2032.seasons, s(2032, 'bahia', 'BRA-B')], [{ competition: 'serieB' }]);
    expect(momentsBetween(em2032, em2033)).toEqual([{ kind: 'titulo', competition: 'serieB' }, { kind: 'acesso', serie: 'A' }]);
  });

  it('duas decisões na mesma temporada não repetem o carimbo', () => {
    const a = snap(2032, 'bahia', 'BRA-B', [s(2031, 'bahia', 'BRA-A')]);
    expect(momentsBetween(a, { ...a })).toEqual([]);
  });
});
