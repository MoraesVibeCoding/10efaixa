import { checkName } from './nameFilter';
import { pickWeighted, type Prng } from './prng';
import cfg from '../data/nicknames.json';
import txt from '../i18n/pt-BR/nicknames.json';

// 6.17: apelido dado na base, por origem, estado natal (gentílico) e estilo; sempre passa pelo filtro.
// Os textos vêm do i18n porque o apelido é texto visível e depende do idioma.
export interface NicknameInput {
  name: string;
  state: string;
  origin: string;
  archetypeId: string;
}

type Pattern = keyof typeof cfg.patternWeights.varzea;
const pick = <T>(rng: Prng, xs: readonly T[]) => xs[rng.int(0, xs.length - 1)]!;

const firstName = (name: string) => {
  const w = name.trim().split(/\s+/)[0] ?? '';
  return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
};

/** Pedro → Pedrinho; João → Joãozinho; Zé → Zezinho. */
function diminutive(first: string): string {
  const { dropFinal, vowelSuffix, otherSuffix } = txt.diminutive;
  const plain = first.replace(/[áéíóú]$/, (c) => c.normalize('NFD')[0]!);
  // Só tira a vogal final depois de consoante (Pedro → Pedr+inho); ditongo mantém a palavra (João → João+zinho).
  const dropsVowel = dropFinal.includes(plain.slice(-1)) && !/[aeiouáéíóúâêôãõ]/i.test(plain.slice(-2, -1));
  return dropsVowel ? plain.slice(0, -1) + vowelSuffix : plain + otherSuffix;
}

export function generateNickname(p: NicknameInput, rng: Prng): string {
  const first = firstName(p.name);
  const gentilico = (txt.demonym as Record<string, string>)[p.state] ?? '';
  const styles = (txt.style as Record<string, string[]>)[p.archetypeId] ?? [];
  const origins = (txt.templates.origin as Record<string, string[]>)[p.origin] ?? [];
  const weights = (cfg.patternWeights as Record<string, Record<Pattern, number>>)[p.origin] ?? cfg.patternWeights.peneira;
  const vars: Record<string, string> = { first, dim: diminutive(first), gentilico, estilo: '' };

  for (let i = 0; i < cfg.maxAttempts; i++) {
    const pattern = pickWeighted(rng, weights);
    const templates = pattern === 'origin' ? origins : txt.templates[pattern];
    if (!templates.length || (pattern === 'style' && !styles.length)) continue;
    vars.estilo = styles.length ? pick(rng, styles) : '';
    const nick = pick(rng, templates).replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '').trim();
    if (nick && checkName(nick) === 'ok') return nick;
  }
  return gentilico; // sempre seguro: vem do i18n, sem nome digitado pelo jogador
}
