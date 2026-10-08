import events from '../data/events.json';
import contextTags from '../data/contextTags.json';
import text from '../i18n/pt-BR/events.json';
import { CATALOG, drawCatalog } from './contextDraw';
import { createPrng } from './prng';

// T25b, lote 1 (SPEC 6.13c): 15 eventos de campo e de postura em campo no catálogo de sorteio.
const LOTE = [
  'vaia-da-torcida', 'cera-no-fim', 'penalti-contra-voce', 'entrevista-pos-derrota', 'marcacao-dura-no-classico', 'vestiario-pos-derrota',
  'banco-sem-olhar', 'gol-feito-perdido', 'comemoracao-fora-do-combinado', 'substituido-no-intervalo', 'jogo-grande-bola-pesada',
  'poupado-no-classico', 'atraso-no-treino', 'garoto-novo-no-vestiario', 'intervalo-perdendo-por-dois',
];
const FACTS = ['idade', 'moral', 'idolatria', 'minutosFracao', 'salarioAtrasos', 'convocado'];
const TAGS = contextTags.etiquetas.map((t) => t.id);
const byId = new Map(CATALOG.map((e) => [e.id, e]));

describe('catálogo, lote 1: campo e postura (T25b)', () => {
  it('os 15 estão no catálogo de sorteio, com cena, importância de tela e condições que o contexto entende', () => {
    for (const id of LOTE) {
      const e = byId.get(id)!;
      expect(e, id).toBeDefined();
      expect(e.sorteio, id).toBe(true);
      expect(e.marco, id).toBeFalsy();
      for (const [campo] of e.condicoes) expect(FACTS, `${id}: ${campo}`).toContain(campo);
      const raw = events.eventos.find((x) => x.id === id)!;
      expect(raw.importancia, id).toBeGreaterThanOrEqual(5);
    }
  });

  it('abertura, contexto e reforço só usam etiquetas que existem, e todo evento tem pelo menos uma camada', () => {
    const t = text as unknown as Record<string, { abertura?: Record<string, string>; contexto?: Record<string, string> }>;
    for (const id of LOTE) {
      const camadas = [...Object.keys(t[id]!.abertura ?? {}), ...Object.keys(t[id]!.contexto ?? {})];
      expect(camadas.length, id).toBeGreaterThan(0);
      for (const tag of [...camadas, ...(byId.get(id)!.reforco ?? [])]) expect(TAGS, `${id}: ${tag}`).toContain(tag);
    }
  });

  it('em contextos plausíveis, o sorteio chega a cada evento do lote, e nenhum aparece no contexto que a condição barra', () => {
    const seen = new Set<string>();
    const rng = createPrng(7);
    for (let k = 0; k < 4000; k++) {
      const ctx = { idade: 17 + (k % 20), moral: (k % 10) / 10, idolatria: 0, minutosFracao: ((k >> 2) % 10) / 10, salarioAtrasos: 0, convocado: false };
      for (const id of drawCatalog({ ctx, tags: [], temperament: 'frio', used: new Set(), count: 2 }, rng)) seen.add(id);
    }
    for (const id of LOTE) expect(seen, id).toContain(id);
    // contexto que barra: moral alta e muitos minutos não liberam as vaias, o banco nem o vestiário depois da derrota
    const barrado = drawCatalog({ ctx: { idade: 25, moral: 0.95, idolatria: 0, minutosFracao: 0.9, salarioAtrasos: 0, convocado: false }, tags: [], temperament: 'frio', used: new Set(), count: 99 }, createPrng(1));
    for (const id of ['vaia-da-torcida', 'banco-sem-olhar', 'vestiario-pos-derrota', 'entrevista-pos-derrota']) expect(barrado, id).not.toContain(id);
  });
});
