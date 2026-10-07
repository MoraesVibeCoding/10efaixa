import { MEMORY_IDS, citationErrors, memKey, memoryCtx, type Memory } from './memory';
import events from '../data/events.json';
import ptEvents from '../i18n/pt-BR/events.json';
import { MILESTONES } from './milestones';

// T25d (SPEC 6.13c): memória da carreira. Cada memória tem id, ano, idade e clube; vira condição de evento (`mem.<id>`, `anos.<id>`)
// e texto ({mem_<id>_ano}, {mem_<id>_anos}, {mem_<id>_clube}). Os marcos da T25c também são memórias.
const m = (id: string, year: number, clubId = 'bahia', age = 20): Memory => ({ id, year, age, clubId });

describe('memória da carreira (T25d)', () => {
  it('os ids são únicos e incluem os 20 marcos e os fatos de história (final perdida, lesão grave, troca pelo rival, recusa da Europa)', () => {
    expect(new Set(MEMORY_IDS).size).toBe(MEMORY_IDS.length);
    for (const marco of MILESTONES) expect(MEMORY_IDS).toContain(marco.id);
    for (const id of ['perdeuFinal', 'lesaoGrave', 'trocouPeloRival', 'recusouEuropa']) expect(MEMORY_IDS).toContain(id);
  });

  it('memKey troca hífen por sublinhado (placeholder só aceita letras, números e _)', () => {
    expect(memKey('primeiro-gol-no-clube')).toBe('primeiro_gol_no_clube');
    expect(memKey('perdeuFinal')).toBe('perdeuFinal');
  });

  it('contexto do evento: mem.<id> verdadeiro e anos.<id> desde a última vez; o que não aconteceu é falso e -1', () => {
    const ctx = memoryCtx([m('perdeuFinal', 2030), m('lesaoGrave', 2031), m('lesaoGrave', 2035)], 2038);
    expect(ctx['mem.perdeuFinal']).toBe(true);
    expect(ctx['anos.perdeuFinal']).toBe(8);
    expect(ctx['anos.lesaoGrave']).toBe(3); // a mais recente conta
    expect(ctx['mem.recusouEuropa']).toBe(false);
    expect(ctx['anos.recusouEuropa']).toBe(-1);
    expect(Object.keys(ctx)).toHaveLength(MEMORY_IDS.length * 2);
  });

  it('sem memória nenhuma, tudo falso', () => {
    const ctx = memoryCtx([], 2030);
    for (const id of MEMORY_IDS) expect(ctx[`mem.${id}`]).toBe(false);
  });

  describe('citação do passado no texto só vale com a memória garantida pela condição do evento', () => {
    const events = [
      { id: 'a', condicoes: [['mem.perdeuFinal', '==', true]] },
      { id: 'b', condicoes: [] },
      { id: 'c', condicoes: [['mem.lesaoGrave', '==', true]] },
    ];
    it('texto que cita {mem_perdeuFinal_anos} com a condição: ok', () => {
      expect(citationErrors(events, { a: 'Faz {mem_perdeuFinal_anos} anos daquela final.' })).toEqual([]);
    });
    it('citar sem a condição, ou citar memória que a condição não garante: erro', () => {
      expect(citationErrors(events, { b: 'Faz {mem_perdeuFinal_anos} anos.' })).toHaveLength(1);
      expect(citationErrors(events, { c: 'Faz {mem_perdeuFinal_ano} anos.' })).toHaveLength(1);
    });
    it('citar memória que não existe: erro; placeholder comum ({nome}) não conta', () => {
      expect(citationErrors(events, { a: '{nome} lembra de {mem_inventada_ano}.' })).toHaveLength(1);
      expect(citationErrors(events, { b: '{nome} entra em campo.' })).toEqual([]);
    });
  });
});

describe('catálogo de eventos e memória (T25d)', () => {
  it('condições por memória (mem.*, anos.*) só usam ids de memória conhecidos', () => {
    for (const e of events.eventos as { id: string; condicoes: unknown[][] }[]) {
      for (const c of e.condicoes) {
        const key = String(c[0]);
        if (/^(mem|anos)\./.test(key)) expect(MEMORY_IDS, `${e.id}: ${key}`).toContain(key.split('.').slice(1).join('.'));
      }
    }
  });

  it('nenhum texto do catálogo cita memória sem exigir a memória na condição', () => {
    const texts = Object.fromEntries(Object.entries(ptEvents as Record<string, { texto?: string }>).map(([id, v]) => [id, v.texto ?? '']));
    expect(citationErrors(events.eventos as { id: string; condicoes: unknown[][] }[], texts)).toEqual([]);
  });
});
