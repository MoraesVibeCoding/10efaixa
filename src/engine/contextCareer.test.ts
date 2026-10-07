import { autoDecide, simulateCareer, type Decider } from './career';
import { createPrng } from './prng';
import { randomInput } from './simulation';

// T25e: o sorteio de catálogo dentro da carreira. Um evento sintético de catálogo (sorteio: true) entra no JSON de eventos só neste teste.
vi.mock('../data/events.json', async (original) => {
  const real = await original<{ default: { eventos: unknown[]; campos: unknown } }>();
  const eventos = [...real.default.eventos, {
    id: 'teste-catalogo', importancia: 5, cena: 'estadio', peso: 10, sorteio: true, condicoes: [['idade', '>=', 18]],
    opcoes: [
      { id: 'a', jeito: 'lider', efeitos: [['moral', 'add', 0.05]] },
      { id: 'b', jeito: 'frio', efeitos: [['moral', 'add', -0.05]] },
      { id: 'c', jeito: 'resenha', efeitos: [['disciplina', 'add', -0.05]] },
    ],
    politica: { padrao: 'a' },
  }, {
    id: 'teste-recorrente', importancia: 5, cena: 'estadio', peso: 10, sorteio: true, recorrente: true, condicoes: [['idade', '>=', 18]],
    opcoes: [
      { id: 'a', jeito: 'lider', efeitos: [['moral', 'add', 0.01]] },
      { id: 'b', jeito: 'frio', efeitos: [['moral', 'add', -0.01]] },
      { id: 'c', jeito: 'resenha', efeitos: [['disciplina', 'add', -0.01]] },
    ],
    politica: { padrao: 'a' },
  }];
  return { default: { ...real.default, eventos } };
});

const run = (seed: number, decide?: Decider) => simulateCareer(randomInput(createPrng(seed)), seed, 2026, decide);
const asked = (seed: number, pick?: (id: string) => string | null) => {
  const ids: string[] = [];
  const result = run(seed, (id, t, view) => { ids.push(id); return pick?.(id) ?? autoDecide(id, t, view); });
  return { ids, result };
};

describe('sorteio de catálogo na carreira (T25e)', () => {
  it('o evento de catálogo não recorrente aparece uma vez só por carreira; o recorrente volta', () => {
    for (const seed of [1, 2, 3, 4]) {
      const { ids } = asked(seed);
      expect(ids.filter((x) => x === 'teste-catalogo').length, `seed ${seed}`).toBeLessThanOrEqual(1);
      expect(ids.filter((x) => x === 'teste-recorrente').length, `seed ${seed}`).toBeGreaterThan(3);
    }
  });

  it('a escolha da tela vale: outra opção do evento muda a carreira dali para frente', () => {
    const a = asked(2, (id) => (id === 'teste-recorrente' ? 'a' : null)).result;
    const b = asked(2, (id) => (id === 'teste-recorrente' ? 'c' : null)).result;
    expect(JSON.stringify(a)).not.toBe(JSON.stringify(b));
  });

  it('é determinístico e não desloca o resto da carreira: sem escolher nada diferente, mesma carreira duas vezes', () => {
    expect(JSON.stringify(run(5))).toBe(JSON.stringify(run(5)));
  });

  it('nenhum evento de catálogo aparece na juventude ou na várzea (só no profissional)', () => {
    const views: { age: number; clubId: string | null }[] = [];
    run(3, (id, t, view) => { if (id === 'teste-recorrente') views.push({ age: view().age, clubId: view().clubId }); return autoDecide(id, t, view); });
    expect(views.length).toBeGreaterThan(0);
    for (const v of views) { expect(v.clubId).not.toBeNull(); expect(v.age).toBeGreaterThanOrEqual(18); }
  });
});
