import type { CreationInput } from '../engine/player';
import { runUntilDecision } from './careerRun';

// T54 (SPEC 6.16, v2.39): a carreira salva no aparelho a cada decisão. O motor é determinístico, então o save é só
// criação + semente + ritmo + escolhas; continuar = refazer a carreira até a próxima decisão (careerRun).
// Fica só no aparelho (localStorage): nada vai para servidor, analytics ou URL. Uma carreira ativa por vez.
export const SAVE_KEY = '10efaixa:carreira';
export const SAVE_VERSION = 2;
const RITMOS = ['rapido', 'normal', 'completo'] as const;

export interface SaveData {
  created: { input: CreationInput; look: object; visual: string };
  seed: number;
  ritmo: (typeof RITMOS)[number];
  choices: string[];
}
export type SaveResult = { ok: true; save: SaveData } | { ok: false; reason: 'nenhum' | 'danificado' | 'versao' };
/** O pedaço do localStorage que o save usa (dá para testar com um armazenamento de mentira). */
export interface SaveStorage { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void }

/** Migrações por versão: cada uma leva um save da versão `n` para `n + 1`. */
const MIGRATIONS: Record<number, (old: Record<string, unknown>) => Record<string, unknown>> = {
  // v1 → v2 (T53): no v1 toda decisão ia para a tela em qualquer ritmo; as escolhas salvas só fazem sentido com essa
  // regra, que hoje é a do Completo.
  1: (old) => ({ ...old, versao: 2, ritmo: 'completo' }),
};

const isObject = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);

function wellFormed(x: Record<string, unknown>): boolean {
  const created = x.created;
  return isObject(created) && isObject(created.input) && typeof (created.input as { name?: unknown }).name === 'string'
    && isObject(created.look) && typeof created.visual === 'string'
    && Number.isInteger(x.seed) && RITMOS.includes(x.ritmo as SaveData['ritmo'])
    && Array.isArray(x.choices) && x.choices.every((c) => typeof c === 'string');
}

/** Lê o texto salvo: versão conhecida (migrando as antigas) e formato certo. Não refaz a carreira (validateSave faz). */
export function parseSave(raw: string): SaveResult {
  let data: unknown;
  try { data = JSON.parse(raw); } catch { return { ok: false, reason: 'danificado' }; }
  if (!isObject(data) || !Number.isInteger(data.versao)) return { ok: false, reason: 'danificado' };
  let version = data.versao as number;
  if (version > SAVE_VERSION || version < 1) return { ok: false, reason: 'versao' };
  let cur: Record<string, unknown> = data;
  while (version < SAVE_VERSION) {
    const step = MIGRATIONS[version];
    if (!step) return { ok: false, reason: 'versao' };
    cur = step(cur);
    version += 1;
  }
  if (!wellFormed(cur)) return { ok: false, reason: 'danificado' };
  const { created, seed, ritmo, choices } = cur as unknown as SaveData;
  return { ok: true, save: { created, seed, ritmo, choices } };
}

export function readSave(storage: SaveStorage): SaveResult {
  let raw: string | null;
  try { raw = storage.getItem(SAVE_KEY); } catch { return { ok: false, reason: 'nenhum' }; }
  return raw === null ? { ok: false, reason: 'nenhum' } : parseSave(raw);
}

/** Grava; com o armazenamento indisponível (modo privado, cota cheia) devolve false e o jogo segue sem save. */
export function writeSave(storage: SaveStorage, save: SaveData): boolean {
  try {
    storage.setItem(SAVE_KEY, JSON.stringify({ versao: SAVE_VERSION, ...save }));
    return true;
  } catch {
    return false;
  }
}

export function clearSave(storage: SaveStorage): void {
  try { storage.removeItem(SAVE_KEY); } catch { /* nada a apagar se o armazenamento não abre */ }
}

export type SavePeek = { status: 'nenhum' } | { status: 'salvo'; name: string } | { status: 'invalido' };

/** Para a abertura: nada salvo, carreira salva (o nome vai em "Continuar a carreira de ...") ou save inválido, que
 * também mostra "Continuar" para o jogador ver o aviso e decidir (SPEC 6.16: mensagem clara, sem travar). */
export function peekSave(storage: SaveStorage): SavePeek {
  const r = readSave(storage);
  if (r.ok) return { status: 'salvo', name: r.save.created.input.name };
  return r.reason === 'nenhum' ? { status: 'nenhum' } : { status: 'invalido' };
}

/** Refaz a carreira com as escolhas salvas: escolha que o motor não aceita (save adulterado ou de outro jogo) é "danificado". */
export function validateSave(save: SaveData): SaveResult {
  try {
    // no ritmo salvo: cada ritmo escolhe decisões diferentes, e o padrão (Completo) recusaria saves do Rápido e do Normal
    runUntilDecision(save.created.input, save.seed, save.choices, save.ritmo);
    return { ok: true, save };
  } catch {
    return { ok: false, reason: 'danificado' };
  }
}
