import { CREATION_STEPS } from '../../state/flow';

// T50e (v2.30; v2.35): páginas da criação. No celular, uma tela por passo; no computador, "quem é ele" e "seu visual" juntos.
export type Page = readonly string[];
export const pagesFor = (wide: boolean): Page[] =>
  wide ? [['quemE', 'visual'], ['emCampo'], ['origem']] : CREATION_STEPS.map((s) => [s]);

/** Página que contém o passo atual da máquina de estados. */
export function pageOf(step: number, wide: boolean): number {
  const name = CREATION_STEPS[step];
  return pagesFor(wide).findIndex((p) => p.includes(name!));
}

/** Passo da máquina onde começa a página. */
export const firstStepOf = (page: Page) => CREATION_STEPS.indexOf(page[0]!);
