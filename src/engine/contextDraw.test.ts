import { createPrng } from './prng';
import { drawCatalog, type CatalogEvent } from './contextDraw';

// T25e (SPEC 6.13c): sorteio de catálogo por contexto. Evento com `sorteio: true`; entra por condição; peso × temperamento × reforço por
// etiqueta; não repete na carreira salvo `recorrente`; quantidade por semestre em dados; gerador próprio (não desloca os outros sorteios).
const ev = (over: Partial<CatalogEvent> & { id: string }): CatalogEvent => ({ peso: 10, condicoes: [], sorteio: true, ...over });
const CAT: CatalogEvent[] = [
  ev({ id: 'a' }), ev({ id: 'b' }), ev({ id: 'c', condicoes: [['idade', '>=', 30]] }),
  ev({ id: 'rec', recorrente: true }), ev({ id: 'comum', sorteio: false }), ev({ id: 'marco', marco: true }),
];
const draw = (over: Partial<Parameters<typeof drawCatalog>[0]> = {}, seed = 1) =>
  drawCatalog({ catalog: CAT, ctx: { idade: 25 }, tags: [], temperament: 'frio', used: new Set<string>(), count: 2, ...over }, createPrng(seed));

describe('sorteio de catálogo por contexto (T25e)', () => {
  it('só entra evento de sorteio, de fora os comuns e os marcos', () => {
    for (let s = 0; s < 200; s++) for (const id of draw({ count: 5 }, s)) expect(['a', 'b', 'rec']).toContain(id);
  });

  it('a condição manda: o evento de 30 anos só sai com idade 30+', () => {
    const young = new Set<string>();
    const old = new Set<string>();
    for (let s = 0; s < 300; s++) {
      draw({ ctx: { idade: 22 }, count: 5 }, s).forEach((x) => young.add(x));
      draw({ ctx: { idade: 34 }, count: 5 }, s).forEach((x) => old.add(x));
    }
    expect(young.has('c')).toBe(false);
    expect(old.has('c')).toBe(true);
  });

  it('não repete: o que já foi usado não volta, salvo o recorrente', () => {
    const used = new Set(['a', 'b', 'rec']);
    for (let s = 0; s < 100; s++) { const out = draw({ used, count: 5 }, s); expect(out).not.toContain('a'); expect(out).not.toContain('b'); }
    expect(Array.from({ length: 100 }, (_, s) => draw({ used, count: 5 }, s)).some((o) => o.includes('rec'))).toBe(true);
  });

  it('nunca devolve o mesmo evento duas vezes na mesma rodada', () => {
    for (let s = 0; s < 200; s++) { const out = draw({ count: 3 }, s); expect(new Set(out).size).toBe(out.length); }
  });

  it('devolve no máximo `count` e menos se não há elegível; count 0 = nada', () => {
    expect(draw({ count: 0 })).toEqual([]);
    expect(draw({ catalog: [ev({ id: 'x', condicoes: [['idade', '>=', 99]] })] })).toEqual([]);
    expect(draw({ count: 1 })).toHaveLength(1);
  });

  it('o peso por temperamento muda a frequência na direção certa (esquentado puxa o evento dele)', () => {
    const cat = [ev({ id: 'briga', pesoPorTemperamento: { esquentado: 5 } }), ev({ id: 'calma' })];
    const share = (temperament: string) => {
      let n = 0;
      for (let s = 0; s < 2000; s++) if (drawCatalog({ catalog: cat, ctx: {}, tags: [], temperament, used: new Set(), count: 1 }, createPrng(s))[0] === 'briga') n++;
      return n / 2000;
    };
    expect(share('esquentado')).toBeGreaterThan(share('frio') + 0.25);
  });

  it('a etiqueta reforça: evento que lista a etiqueta do contexto sai mais', () => {
    const cat = [ev({ id: 'banco', reforco: ['noBanco'] }), ev({ id: 'outro' })];
    const share = (tags: string[]) => {
      let n = 0;
      for (let s = 0; s < 2000; s++) if (drawCatalog({ catalog: cat, ctx: {}, tags, temperament: 'frio', used: new Set(), count: 1 }, createPrng(s))[0] === 'banco') n++;
      return n / 2000;
    };
    expect(share(['noBanco'])).toBeGreaterThan(share([]) + 0.1);
  });

  it('é determinístico pela semente do gerador', () => {
    expect(draw({}, 7)).toEqual(draw({}, 7));
  });
});
