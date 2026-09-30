import list from '../data/blockedWords.json';

export type NameCheck = 'ok' | 'empty' | 'tooShort' | 'tooLong' | 'blocked';

const LEET: Record<string, string> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '@': 'a', $: 's' };

/** Minúsculas, sem acento, leetspeak desfeito, letras repetidas colapsadas; devolve as palavras. */
const tokens = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[013457@$]/g, (c) => LEET[c]!)
    .replace(/(.)\1+/g, '$1')
    .split(/[^a-z]+/)
    .filter(Boolean);

const WORDS = new Set(list.words.flatMap(tokens));
const NAMES = list.names.map((n) => ` ${tokens(n).join(' ')} `);

// ponytail: casa por palavra inteira; palavrão colado a outra palavra ("joaoporra") passa. Ampliar se aparecer no uso.
export function checkName(name: string): NameCheck {
  const trimmed = name.trim();
  if (!trimmed) return 'empty';
  if (trimmed.length < list.minLength) return 'tooShort';
  if (trimmed.length > list.maxLength) return 'tooLong';
  const t = tokens(trimmed);
  const joined = ` ${t.join(' ')} `;
  if (t.some((w) => WORDS.has(w)) || NAMES.some((n) => joined.includes(n))) return 'blocked';
  return 'ok';
}
