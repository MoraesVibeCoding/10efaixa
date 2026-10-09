import events from '../data/events.json';
import ptEvents from '../i18n/pt-BR/events.json';
import { CONTEXT_TAGS } from './contextTags';
import { LIMITS, composeText, layerErrors, worstCase, type Layers } from './contextText';
import { format } from '../i18n';

/** v2.64: parâmetros que o motor sempre passa ao texto do evento (o clube comprador na venda), com um nome longo de clube. */
const PARAMS = { comprador: 'Borussia Mönchengladbach' };

// T25e: as camadas de texto do catálogo (abertura e contexto por etiqueta) seguem as regras da narrativa e cabem na tela.
type Texts = Record<string, { texto?: string; abertura?: Record<string, string>; contexto?: Record<string, string> }>;
const TEXTS = ptEvents as unknown as Texts;
const WITH_LAYERS = Object.entries(TEXTS).filter(([, v]) => v.abertura || v.contexto);
const layers = (v: Texts[string]): Layers => ({ texto: v.texto ?? '', abertura: v.abertura, contexto: v.contexto });

describe('camadas de texto do catálogo (T25e)', () => {
  it('pelo menos 8 eventos já têm abertura e contexto escritos', () => {
    expect(WITH_LAYERS.length).toBeGreaterThanOrEqual(8);
    for (const [id, v] of WITH_LAYERS) {
      expect(Object.keys(v.abertura ?? {}).length, `${id} abertura`).toBeGreaterThanOrEqual(2);
      expect(Object.keys(v.contexto ?? {}).length, `${id} contexto`).toBeGreaterThanOrEqual(2);
    }
  });

  it('só evento que existe tem camadas, e as camadas passam na validação (etiqueta, tamanho, aspas)', () => {
    const ids = new Set((events.eventos as { id: string }[]).map((e) => e.id));
    for (const [id, v] of WITH_LAYERS) {
      expect(ids.has(id), id).toBe(true);
      expect(layerErrors(id, layers(v)), id).toEqual([]);
    }
  });

  it('abertura e contexto começam com maiúscula, terminam em ponto e não têm número nem reticências', () => {
    for (const [id, v] of WITH_LAYERS) {
      for (const text of [...Object.values(v.abertura ?? {}), ...Object.values(v.contexto ?? {})]) {
        expect(text, id).toMatch(/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/);
        expect(text, id).toMatch(/[.!?]$/);
        expect(text, id).not.toMatch(/\d/);
      }
    }
  });

  it('10 mil contextos sorteados: o texto sai completo, dentro do limite e sem frase repetida', () => {
    const ids = CONTEXT_TAGS.map((x) => x.id);
    let seed = 12345;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = 0; i < 10_000; i++) {
      const [id, v] = WITH_LAYERS[Math.floor(rnd() * WITH_LAYERS.length)]!;
      const tags = ids.filter(() => rnd() < 0.35);
      const raw = composeText(layers(v), tags);
      expect(raw.startsWith(v.texto!) || raw.includes(v.texto!), id).toBe(true);
      expect(raw.length, id).toBeLessThanOrEqual(worstCase(layers(v)));
      const text = format(raw, PARAMS);
      expect(text.length, id).toBeLessThanOrEqual(LIMITS.textoMax);
      expect(text, id).not.toMatch(/\{|\}|undefined/);
      const sentences = text.split(/(?<=[.!?])\s+/);
      expect(new Set(sentences).size, `${id}: ${text}`).toBe(sentences.length);
    }
  });
});
