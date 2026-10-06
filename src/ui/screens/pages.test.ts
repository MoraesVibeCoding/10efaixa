import { CREATION_STEPS } from '../../state/flow';
import { firstStepOf, pageOf, pagesFor } from './pages';

describe('páginas da criação (T50e, v2.30)', () => {
  it('celular: uma página por passo, na ordem da máquina', () => {
    expect(pagesFor(false)).toEqual(CREATION_STEPS.map((s) => [s]));
    CREATION_STEPS.forEach((_, i) => expect(pageOf(i, false)).toBe(i));
  });

  it('computador: "quem é ele" e "em campo" na mesma página; todo passo aparece uma vez', () => {
    const pages = pagesFor(true);
    expect(pages[0]).toEqual(['quemE', 'visual']);
    expect(pages).toHaveLength(3);
    expect(pages.flat()).toEqual(CREATION_STEPS);
    expect(pageOf(1, true)).toBe(0);
    expect(pageOf(2, true)).toBe(1);
    expect(pageOf(3, true)).toBe(2);
    expect(firstStepOf(pages[1]!)).toBe(2);
  });
});
