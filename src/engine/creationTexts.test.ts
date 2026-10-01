import data from '../data/creation.json';
import ptBR from '../i18n/pt-BR/creation.json';

const has = (group: Record<string, string>, keys: string[]) => keys.filter((k) => !group[k]);

describe('textos pt-BR da criação', () => {
  it('toda opção de criação tem rótulo', () => {
    expect(has(ptBR.state, data.states)).toEqual([]);
    expect(has(ptBR.temperament, data.temperaments)).toEqual([]);
    expect(has(ptBR.celebration, data.celebrations)).toEqual([]);
    expect(has(ptBR.foot, data.feet)).toEqual([]);
    expect(has(ptBR.origin, Object.keys(data.origins))).toEqual([]);
    expect(has(ptBR.country, Object.keys(data.dualNationality.countries))).toEqual([]);
  });

  it('todo erro de criação tem mensagem', () => {
    const errors = [
      'name.empty', 'name.tooShort', 'name.tooLong', 'name.blocked', 'shirtNumber.invalid', 'state.invalid',
      'height.outOfRange', 'build.invalid', 'archetype.invalid', 'temperament.invalid', 'celebration.invalid', 'foot.invalid', 'origin.invalid', 'heartClub.invalid',
    ];
    expect(has(ptBR.error, errors)).toEqual([]);
  });
});
