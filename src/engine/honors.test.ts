import type { Ctx } from './events';
import { HONORS, honorsOf } from './honors';
import { checkName } from './nameFilter';
import cfg from '../data/honors.json';
import ptBR from '../i18n/pt-BR/legacy.json';

// T55a (SPEC 6.15, v2.28): honrarias bem-humoradas, critérios em dados, zoando só o próprio jogador.
const f = (over: Ctx = {}): Ctx => ({
  posicao: 'meia', clubes: 3, lesoesGraves: 0, vermelhos: 0, assistencias: 0, gols: 0, semSofrerGol: 0,
  mudancasPosicao: 0, idadeFinal: 33, titulos: 3, jogos: 400, ...over,
});
const corte = (id: string, campo: string) => cfg.honrarias.find((h) => h.id === id)!.condicoes.find((c) => c[0] === campo)![2] as number;

describe('honrarias (T55a)', () => {
  it('as 10 honrarias aprovadas, cada uma com texto pt-BR que passa no filtro de palavras', () => {
    expect([...HONORS].sort()).toEqual(['canelaDeVidro', 'chaveNoGol', 'chuteiraAposentada', 'fielAteOFim', 'gandula', 'garcom', 'juizBolso', 'pescador', 'rodouMala', 'tacaDoChurrasco']);
    for (const id of HONORS) {
      const text = (ptBR.honraria as Record<string, string>)[id];
      expect(text, id).toBeTruthy();
      expect(checkName(text!), id).not.toBe('blocked');
    }
  });

  it('carreira comum não ganha honraria', () => {
    expect(honorsOf(f())).toEqual([]);
  });

  it.each([
    ['rodouMala', { clubes: corte('rodouMala', 'clubes') }],
    ['fielAteOFim', { clubes: 1 }],
    ['canelaDeVidro', { lesoesGraves: corte('canelaDeVidro', 'lesoesGraves') }],
    ['juizBolso', { vermelhos: corte('juizBolso', 'vermelhos') }],
    ['garcom', { assistencias: corte('garcom', 'assistencias') }],
    ['pescador', { gols: corte('pescador', 'gols') }],
    ['chaveNoGol', { posicao: 'goleiro', semSofrerGol: corte('chaveNoGol', 'semSofrerGol') }],
    ['gandula', { mudancasPosicao: corte('gandula', 'mudancasPosicao') }],
    ['chuteiraAposentada', { idadeFinal: corte('chuteiraAposentada', 'idadeFinal') }],
    ['tacaDoChurrasco', { titulos: 0, jogos: corte('tacaDoChurrasco', 'jogos') }],
  ])('%s dispara só pelo seu critério', (id, over) => {
    expect(honorsOf(f(over))).toEqual([id]);
  });

  it('"Fechou o gol" é só de goleiro; "Taça do churrasco" exige zero título', () => {
    expect(honorsOf(f({ posicao: 'zagueiro', semSofrerGol: 9999 }))).toEqual([]);
    expect(honorsOf(f({ titulos: 1, jogos: 9999 }))).toEqual([]);
  });

  it('várias honrarias saem na ordem dos dados (da mais rara para a mais comum)', () => {
    const all = honorsOf(f({ clubes: 99, lesoesGraves: 99, vermelhos: 99, mudancasPosicao: 99, idadeFinal: 99 }));
    expect(all).toEqual(HONORS.filter((id) => all.includes(id)));
    expect(all.length).toBe(5);
  });
});
