import type { CreationInput } from '../../engine/player';
import { simulateCareer } from '../../engine/career';
import { runUntilDecision } from '../../state/careerRun';
import events from '../../data/events.json';
import { t } from '../../i18n';
import { careerProgress, toDecisionPlayer } from './careerView';

const pickFirst = (id: string) => events.eventos.find((e) => e.id === id)!.opcoes[0]!.id;

const INPUT: CreationInput = {
  name: 'Dudu Maestro', shirtNumber: 10, state: 'BA', position: 'meia', archetypeId: 'classico10',
  biotype: { heightCm: 184, build: 'forte' }, temperament: 'resenha', celebration: 'aviaozinho',
  origin: 'baseGrande', foot: 'direita', heartClub: 'bahia',
};
const LOOK = { skin: 't6', hairStyle: 'curto', hairColor: 'preto', beard: null, headband: null, boots: 'preta' };

/** Visão da decisão n, escolhendo sempre a primeira opção de cada evento. */
function viewAt(n: number) {
  const choices: string[] = [];
  let step = runUntilDecision(INPUT, 11, choices);
  while (step.kind === 'decision' && choices.length < n) {
    choices.push(pickFirst(step.eventId));
    const next = runUntilDecision(INPUT, 11, choices);
    if (next.kind !== 'decision') break;
    step = next;
  }
  if (step.kind !== 'decision') throw new Error('esperava decisão');
  return step.view;
}

describe('careerView (T51b): do motor para a tela de decisão', () => {
  it('leva nome, posição, overall, papel, salário, valor, número e atributos do momento', () => {
    const v = viewAt(0);
    const p = toDecisionPlayer(v, INPUT, LOOK);
    expect(p).toMatchObject({
      name: 'Dudu Maestro', position: v.position, overall: v.overall, role: v.role,
      monthlySalary: v.monthlySalary, marketValueEUR: v.marketValueEUR, number: v.number, attributes: v.attributes,
    });
    expect(p.clubId).toBe(v.clubId ?? '');
  });

  it('o avatar usa o visual escolhido com a altura e a compleição da criação', () => {
    const p = toDecisionPlayer(viewAt(0), INPUT, LOOK);
    expect(p.avatar).toMatchObject({ skin: 't6', hairStyle: 'curto', heightCm: 184, build: 'forte' });
  });

  it('temporadas viram idade (16 anos em 2026) e títulos viram a lista de competições', () => {
    const v = viewAt(12);
    const p = toDecisionPlayer(v, INPUT, LOOK);
    expect(p.seasons).toEqual(v.seasons.map((s) => ({ age: s.year - 2026 + 16, clubId: s.clubId, overall: s.overall })));
    expect(p.titles).toEqual(v.titles.map((x) => x.competition));
  });

  it('todo título que o motor dá tem nome em pt-BR', () => {
    for (let seed = 1; seed <= 40; seed++) {
      for (const title of simulateCareer(INPUT, seed).titles) expect(() => t(`ui.titulo.${title.competition}`)).not.toThrow();
    }
  });

  it('progresso vai de 0 aos 16 anos a 1 aos 40, sem passar dos limites', () => {
    expect(careerProgress(16)).toBe(0);
    expect(careerProgress(28)).toBe(0.5);
    expect(careerProgress(45)).toBe(1);
    expect(careerProgress(15)).toBe(0);
  });
});
