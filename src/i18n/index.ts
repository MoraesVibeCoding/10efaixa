import app from './pt-BR/app.json';
import archetypes from './pt-BR/archetypes.json';
import attributes from './pt-BR/attributes.json';
import competitions from './pt-BR/competitions.json';
import creation from './pt-BR/creation.json';
import events from './pt-BR/events.json';
import legacy from './pt-BR/legacy.json';
import nicknames from './pt-BR/nicknames.json';
import positions from './pt-BR/positions.json';
import preview from './pt-BR/preview.json';
import scenes from './pt-BR/scenes.json';
import ui from './pt-BR/ui.json';

// Único ponto de acesso a texto visível (CLAUDE.md). Importação explícita: funciona fora do Vite (app nativo, Fase 3).
export type Params = Record<string, string | number>;
type Tree = { [k: string]: string | Tree };

const ptBR = { app, archetypes, attributes, competitions, creation, events, legacy, nicknames, positions, preview, scenes, ui } as unknown as Tree;

/** Desce na árvore; aceita chaves que contêm ponto (ex.: "error" → "name.blocked"). */
function lookup(node: string | Tree | undefined, parts: string[]): string | Tree | undefined {
  if (!parts.length || node === undefined || typeof node === 'string') return parts.length ? undefined : node;
  for (let i = parts.length; i > 0; i--) {
    const k = parts.slice(0, i).join('.');
    if (k in node) return lookup(node[k], parts.slice(i));
  }
  return undefined;
}

/** Camadas de texto de um evento (T25e): o texto base e, se existirem, as aberturas e as frases de contexto por etiqueta. */
export function eventLayers(eventId: string): { texto: string; abertura?: Record<string, string>; contexto?: Record<string, string> } | null {
  const e = (events as unknown as Record<string, { texto?: string; abertura?: Record<string, string>; contexto?: Record<string, string> }>)[eventId];
  return e?.texto === undefined ? null : { texto: e.texto, ...(e.abertura && { abertura: e.abertura }), ...(e.contexto && { contexto: e.contexto }) };
}

/** Troca os {parâmetros} de um texto já montado (as camadas do evento). Parâmetro faltando lança erro, como em `t`. */
export function format(text: string, params: Params = {}): string {
  return text.replace(/\{(\w+)\}/g, (_, p: string) => {
    if (!(p in params)) throw new Error(`i18n: parâmetro {${p}} faltando em "${text.slice(0, 40)}"`);
    return String(params[p]);
  });
}

/** Texto pt-BR pela chave "arquivo.caminho", com {parâmetros}. Chave ou parâmetro faltando lança erro. */
export function t(key: string, params: Params = {}): string {
  const text = lookup(ptBR, key.split('.'));
  if (typeof text !== 'string') throw new Error(`i18n: chave inexistente ou não-texto: ${key}`);
  return text.replace(/\{(\w+)\}/g, (_, p: string) => {
    if (!(p in params)) throw new Error(`i18n: parâmetro {${p}} faltando em ${key}`);
    return String(params[p]);
  });
}
