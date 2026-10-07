import type { CreationInput } from '../engine/player';
import { createPlayer } from '../engine/player';
import { dailySeed } from '../engine/daily';
import { createPrng } from '../engine/prng';
import { VISUAIS } from '../ui/screens/look';

// T57b (SPEC 6.15, v2.49): link da carreira. Vai no fragmento da URL (#c=...), que o navegador não envia ao servidor.
// Leva só o que refaz a carreira (semente, ritmo, criação, visual, escolhas); nome e apelido NUNCA entram (privacidade).
// A leitura é estrita (Lei de Hyrum): versão, tamanho, tipos e ids conferidos, e nenhum campo a mais é aceito.
export const LINK_VERSION = 1;
const PREFIX = '#c=';
const MAX_HASH_CHARS = 4000;
const MAX_CHOICES = 300;
const RITMOS = ['rapido', 'normal', 'completo'] as const;
type Ritmo = (typeof RITMOS)[number];

export interface CareerLinkData {
  seed: number;
  ritmo: Ritmo;
  input: Omit<CreationInput, 'name'>;
  visual: string;
  choices: string[];
  /** Código do cartão original (`careerCode`): o nome não vai no link, então ele não dá para refazer ao abrir. */
  codigo: string;
  /** Dia "AAAA-MM-DD" do desafio do dia, quando a carreira era um desafio. */
  desafio?: string;
}
export type LinkResult = { ok: true; data: CareerLinkData } | { ok: false; reason: 'formato' | 'versao' | 'tamanho' | 'invalido' };

const INPUT_KEYS = ['shirtNumber', 'state', 'position', 'archetypeId', 'biotype', 'temperament', 'celebration', 'origin', 'foot', 'heartClub', 'side', 'mentality'] as const;
const ROOT_KEYS = ['v', 's', 'r', 'i', 'x', 'c', 'k', 'd'];
const CODE = /^10F-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/;
// Só para a conferência semântica do createPlayer (que exige um nome válido); o nome nunca sai nem volta no link.
const CHECK_NAME = 'Jogador';

const isObject = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64: string): string | null {
  try {
    const bin = atob(b64.replace(/-/g, '+').replace(/_/g, '/'));
    return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
  } catch { return null; }
}

/** "#c=..." para colar depois do endereço do site. Copia só os campos conhecidos: nome e apelido não passam. */
export function careerLinkFragment(data: CareerLinkData): string {
  const input: Record<string, unknown> = {};
  for (const k of INPUT_KEYS) if (data.input[k] !== undefined) input[k] = data.input[k];
  return PREFIX + toBase64Url(JSON.stringify({ v: LINK_VERSION, s: data.seed, r: data.ritmo, i: input, x: data.visual, c: data.choices, k: data.codigo, ...(data.desafio === undefined ? {} : { d: data.desafio }) }));
}

function isDay(d: unknown): boolean {
  try { dailySeed(d as string); return true; } catch { return false; }
}

function validInput(i: unknown): i is CareerLinkData['input'] {
  if (!isObject(i) || !Object.keys(i).every((k) => (INPUT_KEYS as readonly string[]).includes(k))) return false;
  if (i.side !== undefined && i.side !== 'esquerdo' && i.side !== 'direito') return false;
  // Tipos e ids passam pelas mesmas regras da criação (posição × estilo, altura, clube, origem, ...).
  const r = createPlayer({ ...(i as Omit<CreationInput, 'name'>), name: CHECK_NAME }, createPrng(0));
  return r.ok;
}

/** Lê o fragmento (location.hash). Não refaz a carreira: quem abre ainda confere as escolhas com o motor (T57d). */
export function parseCareerLink(hash: string): LinkResult {
  if (hash.length > MAX_HASH_CHARS) return { ok: false, reason: 'tamanho' };
  if (!hash.startsWith(PREFIX)) return { ok: false, reason: 'formato' };
  const text = fromBase64Url(hash.slice(PREFIX.length));
  let raw: unknown;
  try { raw = text === null ? null : JSON.parse(text); } catch { return { ok: false, reason: 'formato' }; }
  if (text === null) return { ok: false, reason: 'formato' };
  if (!isObject(raw)) return { ok: false, reason: 'invalido' };
  if (raw.v !== LINK_VERSION) return { ok: false, reason: 'versao' };
  const { s, r, i, x, c, k, d } = raw;
  const ok = Object.keys(raw).every((k) => ROOT_KEYS.includes(k))
    && typeof s === 'number' && Number.isSafeInteger(s) && s >= 0
    && RITMOS.includes(r as Ritmo)
    && typeof x === 'string' && VISUAIS.some((v) => v.id === x)
    && Array.isArray(c) && c.length <= MAX_CHOICES && c.every((e) => typeof e === 'string' && /^[\x21-\x7e]{1,64}$/.test(e))
    && typeof k === 'string' && CODE.test(k)
    && (d === undefined || isDay(d))
    && validInput(i);
  return ok ? { ok: true, data: { seed: s, ritmo: r as Ritmo, input: i as CareerLinkData['input'], visual: x, choices: c as string[], codigo: k as string, ...(d === undefined ? {} : { desafio: d as string }) } } : { ok: false, reason: 'invalido' };
}
