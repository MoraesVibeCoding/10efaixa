import type { CreationInput } from '../../engine/player';
import { simulateCareer } from '../../engine/career';
import { runUntilDecision } from '../../state/careerRun';
import events from '../../data/events.json';
import { t } from '../../i18n';
import { careerProgress, semesterLines, toDecisionPlayer, uniformeFor } from './careerView';
import { MEETING_EVENT } from '../../engine/meeting';
import { PROPOSAL_EVENT } from '../../engine/proposals';

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
    choices.push(step.eventId === MEETING_EVENT || step.eventId === PROPOSAL_EVENT ? String(step.view.state.sugestao) : pickFirst(step.eventId));
    const next = runUntilDecision(INPUT, 11, choices);
    if (next.kind !== 'decision') break;
    step = next;
  }
  if (step.kind !== 'decision') throw new Error('esperava decisão');
  return step.view;
}

describe('careerView (T51b): do motor para a tela de decisão', () => {
  it('leva os parâmetros de texto da memória (T25d): só existem para o que aconteceu', () => {
    expect(toDecisionPlayer(viewAt(0), INPUT, LOOK).textoParams).toEqual({});
    const late = viewAt(40);
    const p = toDecisionPlayer(late, INPUT, LOOK).textoParams!;
    expect(Object.keys(p).length).toBeGreaterThan(0);
    for (const k of Object.keys(p)) expect(k).toMatch(/^mem_\w+_(ano|anos|clube)$/);
    const marco = late.marcos[0]!;
    expect(p[`mem_${marco.id.replace(/-/g, '_')}_ano`]).toBe(marco.year);
  });

  it('bandeira da seleção (v2.62): só depois da estreia pela seleção principal, com o país do jogador', () => {
    const base = viewAt(0);
    expect(toDecisionPlayer(base, INPUT, LOOK).selecao).toBeUndefined();
    const estreou = { ...base, nationality: 'italia', marcos: [...base.marcos, { id: 'estreia-selecao', year: 2030, clubId: 'flamengo' }] };
    expect(toDecisionPlayer(estreou, INPUT, LOOK).selecao).toBe('italia');
    const soConvocado = { ...base, marcos: [...base.marcos, { id: 'primeira-convocacao', year: 2030, clubId: 'flamengo' }] };
    expect(toDecisionPlayer(soConvocado, INPUT, LOOK).selecao).toBeUndefined();
  });

  it('leva os marcos já vividos (T25c), do mais antigo ao mais novo', () => {
    const early = toDecisionPlayer(viewAt(0), INPUT, LOOK);
    expect(early.marcos).toEqual([]);
    const late = toDecisionPlayer(viewAt(40), INPUT, LOOK);
    expect(late.marcos!.length).toBeGreaterThan(0);
    for (const m of late.marcos!) expect(m).toEqual({ id: expect.any(String), ano: expect.any(Number), clubId: expect.any(String) });
    const years = late.marcos!.map((m) => m.ano);
    expect(years).toEqual([...years].sort((a, b) => a - b));
  });

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
    expect(p.seasons).toEqual(v.seasons.map((s) => expect.objectContaining({ age: s.year - 2026 + 16, clubId: s.clubId, overall: s.overall })));
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

  it('leva o id do visual até a ficha da decisão (arte pintada); sem ele, só o busto em desenho', () => {
    expect(toDecisionPlayer(viewAt(0), INPUT, LOOK, 'visual-07').visual).toBe('visual-07');
    expect(toDecisionPlayer(viewAt(0), INPUT, LOOK).visual).toBeUndefined();
  });
});

describe('uniforme da figurinha (T50k, SPEC v2.37)', () => {
  it('o motor informa a seleção atual do jogador: Brasil no começo', () => {
    expect(viewAt(0).nationality).toBe('brasil');
  });

  it('os eventos da Copa são do contexto Seleção (nos dados); os demais não', () => {
    const selecao = events.eventos.filter((e) => (e as { contexto?: string }).contexto === 'selecao').map((e) => e.id).sort();
    // a Copa e os marcos da Seleção (T25c): a figurinha veste o país
    expect(selecao).toEqual(['copa-fora-posicao', 'copa-penalti', 'copa-sacrificio', 'estreia-selecao', 'primeira-convocacao', 'primeira-copa', 'primeiro-gol-selecao']);
  });

  it('em evento da Seleção a figurinha veste o país; nos outros, o clube', () => {
    const v = { ...viewAt(0), clubId: 'flamengo' };
    expect(uniformeFor('copa-penalti', v)).toBe('selecao:brasil');
    expect(uniformeFor('copa-penalti', { ...v, nationality: 'italia' })).toBe('selecao:italia');
    expect(uniformeFor('salario-atrasado', v)).toBe('flamengo');
    expect(toDecisionPlayer(v, INPUT, LOOK, undefined, 'copa-sacrificio').uniforme).toBe('selecao:brasil');
    expect(toDecisionPlayer(v, INPUT, LOOK, undefined, 'festa').uniforme).toBe('flamengo');
  });
});

describe('evolução e idolatria para a tela (T51b)', () => {
  it('frases do semestre em palavras, com o possessivo certo e sem número', () => {
    expect(semesterLines([{ atributo: 'passe', sentido: 'sobe', forte: true }, { atributo: 'velocidade', sentido: 'desce', forte: false }])).toEqual([
      t('ui.evolucao.sobeForte', { atributo: t('ui.evolucao.atributo.passe') }),
      t('ui.evolucao.desce', { atributo: t('ui.evolucao.atributo.velocidade') }),
    ]);
    expect(semesterLines([{ atributo: 'velocidade', sentido: 'desce', forte: false }])[0]).toMatch(/^Sua velocidade/);
  });

  it('o jogador leva a faixa da torcida do clube atual, e cada temporada a faixa daquele clube', () => {
    const v = { ...viewAt(3), clubId: 'flamengo', idolatrias: { flamengo: 60, bahia: 80 }, seasons: [{ ...viewAt(3).seasons[0]!, clubId: 'bahia' }] };
    const p = toDecisionPlayer(v, INPUT, LOOK);
    expect(p.torcida).toBe('querido');
    expect(p.seasons![0]!.torcida).toBe('idolo');
    expect(toDecisionPlayer({ ...v, clubId: null }, INPUT, LOOK).torcida).toBeUndefined();
  });
});
