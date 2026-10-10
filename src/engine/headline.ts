import type { CareerResult } from './career';
import type { Prng } from './prng';
import creation from '../i18n/pt-BR/creation.json';
import txt from '../i18n/pt-BR/headlines.json';

// T41 (SPEC 6.15): manchete séria + comentário com zoeira, sempre sobre o próprio jogador (nunca clubes, torcidas ou pessoas reais).
export interface Headline { headline: string; comment: string }

export function headlineOf(r: Pick<CareerResult, 'player' | 'nickname' | 'legacy' | 'celebration'>, rng: Prng): Headline {
  const vars: Record<string, string> = {
    apelido: r.nickname, nome: r.player.name.trim(),
    comemoracao: ((creation.celebration as Record<string, string>)[r.celebration] ?? '').toLowerCase(),
  };
  const fill = (list: string[]) =>
    list[rng.int(0, list.length - 1)]!.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '');
  const main = r.legacy.labels[0]?.id;
  const byLabel = main !== undefined && rng.int(0, 1) === 0;
  const comments = byLabel ? (txt.comentarioRotulo as Record<string, string[]>)[main]! : (txt.comentario as Record<string, string[]>)[r.legacy.verdict]!;
  return { headline: fill((txt.manchete as Record<string, string[]>)[r.legacy.verdict]!), comment: fill(comments) };
}
