import events from '../data/events.json';
import contextTags from '../data/contextTags.json';
import text from '../i18n/pt-BR/events.json';
import { CATALOG, drawCatalog } from './contextDraw';
import { createPrng } from './prng';

// T25b, lote 2 (SPEC 6.13c): 15 eventos de campo, de clube e de vida do jogador no catálogo de sorteio.
const LOTE = [
  'companheiro-falha-no-gol', 'tecnico-pede-sacrificio', 'camisa-no-tunel', 'reforco-para-sua-posicao', 'jogo-no-gramado-ruim',
  'companheiro-expulso', 'cartao-pendurado', 'projeto-social-convida', 'professor-da-base', 'portao-aberto-cobranca',
  'pergunta-da-selecao', 'jogo-beneficente', 'palpite-do-pai', 'lista-sem-seu-nome', 'homenagem-no-estadio',
];
const FACTS = ['idade', 'moral', 'idolatria', 'minutosFracao', 'salarioAtrasos', 'convocado', 'posicaoDisputada'];
const TAGS = contextTags.etiquetas.map((t) => t.id);
const byId = new Map(CATALOG.map((e) => [e.id, e]));
const t = text as unknown as Record<string, { abertura?: Record<string, string>; contexto?: Record<string, string> }>;

describe('catálogo, lote 2: campo, clube e vida (T25b)', () => {
  it('os 15 estão no catálogo de sorteio, com cena, importância de tela e condições que o contexto entende', () => {
    for (const id of LOTE) {
      const e = byId.get(id)!;
      expect(e, id).toBeDefined();
      expect(e.sorteio, id).toBe(true);
      expect(e.marco, id).toBeFalsy();
      for (const [campo] of e.condicoes) expect(FACTS, `${id}: ${campo}`).toContain(campo);
      expect(events.eventos.find((x) => x.id === id)!.importancia, id).toBeGreaterThanOrEqual(4);
    }
  });

  it('abertura, contexto e reforço só usam etiquetas que existem, com pelo menos duas aberturas e dois contextos cada', () => {
    for (const id of LOTE) {
      expect(Object.keys(t[id]!.abertura ?? {}).length, `${id} abertura`).toBeGreaterThanOrEqual(2);
      expect(Object.keys(t[id]!.contexto ?? {}).length, `${id} contexto`).toBeGreaterThanOrEqual(2);
      for (const tag of [...Object.keys(t[id]!.abertura ?? {}), ...Object.keys(t[id]!.contexto ?? {}), ...(byId.get(id)!.reforco ?? [])]) expect(TAGS, `${id}: ${tag}`).toContain(tag);
    }
  });

  it('em contextos plausíveis, o sorteio chega a cada evento do lote', () => {
    const seen = new Set<string>();
    const rng = createPrng(11);
    for (let k = 0; k < 6000; k++) {
      const ctx = { idade: 17 + (k % 20), moral: (k % 10) / 10, idolatria: (k * 7) % 80, minutosFracao: ((k >> 2) % 10) / 10, salarioAtrasos: 0, convocado: k % 3 === 0, posicaoDisputada: k % 2 === 0 };
      for (const id of drawCatalog({ ctx, tags: [], temperament: 'lider', used: new Set(), count: 3 }, rng)) seen.add(id);
    }
    for (const id of LOTE) expect(seen, id).toContain(id);
  });

  it('as condições barram o contexto errado: sem convocação não há pergunta da Seleção; convocado não perde a lista; ídolo novo não é homenageado', () => {
    const draw = (ctx: Record<string, number | boolean>) => drawCatalog({ ctx, tags: [], temperament: 'frio', used: new Set(), count: 99 }, createPrng(3));
    const base = { idade: 26, moral: 0.9, idolatria: 0, minutosFracao: 0.9, salarioAtrasos: 0, posicaoDisputada: false };
    expect(draw({ ...base, convocado: false })).not.toContain('pergunta-da-selecao');
    expect(draw({ ...base, convocado: true })).not.toContain('lista-sem-seu-nome');
    expect(draw({ ...base, convocado: false })).not.toContain('homenagem-no-estadio');
    expect(draw({ ...base, convocado: false, posicaoDisputada: false })).not.toContain('reforco-para-sua-posicao');
  });
});
