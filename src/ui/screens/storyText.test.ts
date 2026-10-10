import { storyText } from './storyText';

// Revisão das telas: "Viveu o auge aos 23.5" — a idade do motor vem por semestre; o texto mostra só os anos completos.
describe('frase da história (correção da idade)', () => {
  it('idade com meio ano aparece só com os anos completos', () => {
    const s = storyText({ id: 'auge', age: 23.5, clubId: 'flamengo' });
    expect(s).toContain('aos 23,');
    expect(s).not.toMatch(/23\.5|23,5/);
  });

  it('idade inteira segue igual', () => {
    expect(storyText({ id: 'melhorDoMundo', age: 25 })).toContain('aos 25');
  });
});
