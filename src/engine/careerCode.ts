// T55a (SPEC 6.15): código curto da carreira para o cartão. É uma assinatura (40 bits) de tudo o que define a carreira;
// ela identifica e compara, não refaz. Os dados para refazer (semente, criação, escolhas) vão no link da T56.
const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export interface CareerCodeInput { seed: number; ritmo: string; input: object; choices: readonly string[] }

/** JSON com as chaves em ordem: a mesma criação dá o mesmo texto, venha o objeto em que ordem vier. */
function stable(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;
  if (v && typeof v === 'object') {
    return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${stable((v as Record<string, unknown>)[k])}`).join(',')}}`;
  }
  return JSON.stringify(v) ?? 'null';
}

/** FNV-1a de 32 bits, com base de partida escolhível para tirar duas metades independentes. */
export function fnv1a(text: string, basis: number): number {
  let h = basis >>> 0;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193) >>> 0;
  return h;
}

/** "10F-XXXX-XXXX": 8 caracteres base32 Crockford (sem I, L, O, U, para ler e digitar sem confusão). */
export function careerCode({ seed, ritmo, input, choices }: CareerCodeInput): string {
  const text = stable({ seed, ritmo, input, choices });
  const hi = fnv1a(text, 0x811c9dc5) & 0xff; // 8 bits
  const lo = fnv1a(text, 0x050c5d1f); // 32 bits
  let n = hi * 2 ** 32 + lo;
  let out = '';
  for (let i = 0; i < 8; i++) { out = CROCKFORD[n % 32]! + out; n = Math.floor(n / 32); }
  return `10F-${out.slice(0, 4)}-${out.slice(4)}`;
}
