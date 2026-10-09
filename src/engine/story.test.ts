import { storyOf, storyHighlights, type StoryInput } from './story';
import cfg from '../data/story.json';
import ptBR from '../i18n/pt-BR/legacy.json';

// T55b (SPEC 6.15, v2.31/v2.42): "Sua história" montada do resultado da carreira, em ordem de idade.
const season = (year: number, clubId: string) => ({ year, age: 16 + (year - 2026), clubId, division: 'BRA-A', minutes: 0.8, overall: 70, games: 0, goals: 0, assists: 0 });
const r = (over: Partial<StoryInput> = {}): StoryInput => ({
  origin: 'peneira',
  spells: [{ clubId: 'santos', fromAge: 16, toAge: 30, number: 10, loan: false }],
  titles: [], peakAge: 27, peakClubId: 'santos', endAge: 30, idolatry: { santos: 40 },
  selection: { caps: 0, tournaments: [] }, awards: [], injuries: { leve: 0, media: 0, grave: 0 }, farewell: null,
  seasons: Array.from({ length: 15 }, (_, i) => season(2026 + i, 'santos')),
  ...over,
});
const ids = (x: StoryInput) => storyOf(x).map((b) => b.id);

describe('"Sua história" (T55b)', () => {
  it('carreira simples: início, auge e aposentadoria, nessa ordem', () => {
    expect(ids(r())).toEqual(['inicio_peneira', 'auge', 'aposentadoria']);
    expect(storyOf(r()).map((b) => b.age)).toEqual([16, 27, 30]);
  });

  it('primeiro título, ida para a Europa e ídolo entram na idade certa', () => {
    const x = r({
      spells: [{ clubId: 'santos', fromAge: 16, toAge: 24, number: 10, loan: false }, { clubId: 'benfica', fromAge: 24, toAge: 33, number: 10, loan: false }],
      seasons: [...Array.from({ length: 8 }, (_, i) => season(2026 + i, 'santos')), ...Array.from({ length: 10 }, (_, i) => season(2034 + i, 'benfica'))],
      titles: [{ year: 2031, competition: 'estadual', clubId: 'santos' }, { year: 2036, competition: 'ligaNacional', clubId: 'benfica' }],
      idolatry: { santos: 30, benfica: 80 }, peakClubId: 'benfica', endAge: 33,
    });
    const s = storyOf(x);
    expect(s.map((b) => b.id)).toEqual(['inicio_peneira', 'primeiroTitulo', 'europa', 'auge', 'idolo', 'aposentadoria']);
    expect(s.find((b) => b.id === 'primeiroTitulo')).toMatchObject({ age: 21, competition: 'estadual' });
    expect(s.find((b) => b.id === 'europa')).toMatchObject({ age: 24, clubId: 'benfica' });
    expect(s.find((b) => b.id === 'idolo')).toMatchObject({ age: 33, clubId: 'benfica', n: 10 });
  });

  it('Seleção, Mundial, melhor do mundo, lesões e despedida no clube do coração', () => {
    const x = r({
      selection: { caps: 40, tournaments: [{ year: 2038, tournament: 'copaDoMundo', team: 'brasil', stage: 'campeao', hero: true, villain: false }] },
      awards: [{ year: 2037, award: 'melhorDoMundo' }], injuries: { leve: 3, media: 1, grave: 2 }, farewell: 'coracao',
    });
    expect(ids(x)).toEqual(['inicio_peneira', 'auge', 'melhorDoMundo', 'selecao', 'campeaoMundial', 'lesoes', 'despedida_coracao']);
  });

  it('destaques do cartão: as de maior peso, até o máximo dos dados, em ordem de idade', () => {
    const x = r({ selection: { caps: 40, tournaments: [{ year: 2038, tournament: 'copaDoMundo', team: 'brasil', stage: 'campeao', hero: false, villain: false }] }, awards: [{ year: 2037, award: 'melhorDoMundo' }], farewell: 'coracao' });
    const h = storyHighlights(storyOf(x));
    expect(h).toHaveLength(cfg.maxNoCartao);
    expect(h.map((b) => b.id)).toEqual(['melhorDoMundo', 'selecao', 'campeaoMundial', 'despedida_coracao']);
  });

  it('todo tipo de frase tem peso nos dados e texto pt-BR', () => {
    for (const id of Object.keys(cfg.pesos)) expect((ptBR.historia as Record<string, string>)[id], id).toBeTruthy();
  });
});

describe('"Sua história" numa carreira simulada (T55b)', () => {
  it('a idade de cada frase bate com a temporada real (2026 = 16 anos)', async () => {
    const { simulateCareer } = await import('./career');
    const { createPrng } = await import('./prng');
    const { randomInput } = await import('./simulation');
    const c = simulateCareer(randomInput(createPrng(3)), 3);
    const s = storyOf({ ...c, origin: c.player.origin });
    expect(s[0]!.age).toBe(16);
    const first = [...c.titles].sort((a, b) => a.year - b.year)[0]!;
    expect(s.find((b) => b.id === 'primeiroTitulo')!.age).toBe(16 + first.year - c.seasons[0]!.year);
  });
});
