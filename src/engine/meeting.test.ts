import { POSITIONS } from './overall';
import { ATTRIBUTES, type Attributes } from './attributes';
import { evolveSemester } from './evolution';
import { autoProposal, staffMeeting, validateMeetingConfig, type MeetingInput } from './meeting';
import { createPrng } from './prng';
import cfg from '../data/meeting.json';

const input = (over: Partial<MeetingInput> = {}): MeetingInput => ({
  proposal: { main: 'drible', secondary: 'bolaParada' },
  morale: 0.8, coachRelation: 0.8, nationalTeamStatus: 0.5, clubNeed: 'passe', ...over,
});

describe('reunião com a comissão', () => {
  it('moral, relação e Seleção bons → aceita a proposta (cópia, sem alias)', () => {
    const i = input();
    const r = staffMeeting(i);
    expect(r.response).toBe('aceita');
    expect(r.focus).toEqual(i.proposal);
    expect(r.focus).not.toBe(i.proposal);
  });

  it('moral abaixo do piso → recusa por moral, mesmo com o resto ótimo', () => {
    const r = staffMeeting(input({ morale: 0.19, coachRelation: 1, nationalTeamStatus: 1 }));
    expect(r).toMatchObject({ response: 'recusa', reason: 'moral', focus: {} });
  });

  it('relação ruim com o técnico → recusa por relação', () => {
    expect(staffMeeting(input({ coachRelation: 0.1, morale: 1 }))).toMatchObject({ response: 'recusa', reason: 'relacao' });
  });

  it('pontuação baixa → recusa por pontuação', () => {
    expect(staffMeeting(input({ morale: 0.3, coachRelation: 0.3, nationalTeamStatus: 0 })))
      .toMatchObject({ response: 'recusa', reason: 'score' });
  });

  it('pontuação média → contrapropõe: necessidade do clube vira principal, desejo do jogador vira secundário', () => {
    const r = staffMeeting(input({ morale: 0.5, coachRelation: 0.5, nationalTeamStatus: 0.5 }));
    expect(r).toMatchObject({ response: 'contrapropoe', focus: { main: 'passe', secondary: 'drible' } });
  });

  it('contraproposta com clubNeed = secundário do jogador troca os dois', () => {
    const r = staffMeeting(input({ morale: 0.5, coachRelation: 0.5, clubNeed: 'bolaParada' }));
    expect(r.focus).toEqual({ main: 'bolaParada', secondary: 'drible' });
  });

  it('pontuação média mas proposta já atende o clube → aceita', () => {
    expect(staffMeeting(input({ morale: 0.5, coachRelation: 0.5, clubNeed: 'drible' })).response).toBe('aceita');
  });

  it('status de Seleção pesa: mesmo moral/relação, convocado é aceito e não convocado recebe contraproposta', () => {
    const base = { morale: 0.55, coachRelation: 0.55 };
    expect(staffMeeting(input({ ...base, nationalTeamStatus: 1 })).response).toBe('aceita');
    expect(staffMeeting(input({ ...base, nationalTeamStatus: 0 })).response).toBe('contrapropoe');
  });

  it('fronteiras exatas: piso não recusa; limiar de aceite é inclusivo', () => {
    expect(staffMeeting(input({ morale: cfg.hardFloor, coachRelation: 1, nationalTeamStatus: 1 })).response).not.toBe('recusa');
    expect(staffMeeting(input({ morale: 0.6, coachRelation: 0.6, nationalTeamStatus: 0.6 })).response).toBe('aceita');
  });

  it('foco físico aumenta risco de lesão (principal mais que secundário), sobre o foco resultante', () => {
    expect(staffMeeting(input()).injuryRiskMultiplier).toBe(1);
    expect(staffMeeting(input({ proposal: { main: 'forca', secondary: 'passe' } })).injuryRiskMultiplier).toBeCloseTo(1.3);
    expect(staffMeeting(input({ proposal: { main: 'passe', secondary: 'fisico' } })).injuryRiskMultiplier).toBeCloseTo(1.15);
    expect(staffMeeting(input({ proposal: { main: 'velocidade', secondary: 'forca' } })).injuryRiskMultiplier).toBeCloseTo(1.45);
    const counter = staffMeeting(input({ morale: 0.5, coachRelation: 0.5, clubNeed: 'fisico' }));
    expect(counter.injuryRiskMultiplier).toBeCloseTo(1.3);
    expect(staffMeeting(input({ morale: 0, proposal: { main: 'forca', secondary: 'fisico' } })).injuryRiskMultiplier).toBe(1);
  });

  it.each([
    ['moral NaN', { morale: NaN }],
    ['relação > 1', { coachRelation: 1.1 }],
    ['Seleção < 0', { nationalTeamStatus: -0.1 }],
    ['foco desconhecido', { proposal: { main: 'chute' as never, secondary: 'passe' as const } }],
    ['principal = secundário', { proposal: { main: 'passe' as const, secondary: 'passe' as const } }],
    ['clubNeed ausente', { clubNeed: undefined as never }],
  ])('recusa entrada inválida: %s', (_, over) => {
    expect(() => staffMeeting(input(over))).toThrow(RangeError);
  });

  it('config: válida; recusa pesos que não somam 1, limiares fora de ordem e físico desconhecido', () => {
    expect(validateMeetingConfig(cfg)).toEqual([]);
    expect(validateMeetingConfig({ ...cfg, weights: { morale: 0.5, coachRelation: 0.5, nationalTeamStatus: 0.5 } })).not.toEqual([]);
    expect(validateMeetingConfig({ ...cfg, refuseBelow: 0.7 })).not.toEqual([]);
    expect(validateMeetingConfig({ ...cfg, physical: ['resistencia'] })).not.toEqual([]);
    expect(validateMeetingConfig({ ...cfg, injuryRisk: { main: -0.1, secondary: 0.15 } })).not.toEqual([]);
    expect(validateMeetingConfig({ ...cfg, injuryRisk: { main: NaN, secondary: 0.15 } })).not.toEqual([]);
    expect(validateMeetingConfig({ ...cfg, hardFloor: -0.1 })).not.toEqual([]);
    expect(validateMeetingConfig({ ...cfg, acceptFrom: 1.5 })).not.toEqual([]);
  });

  it('integração: o foco de qualquer resposta roda na evolução', () => {
    const flat = Object.fromEntries(ATTRIBUTES.map((a) => [a, 50])) as Attributes;
    const s = { age: 20, attributes: flat, baseCaps: flat, caps: flat, predictedHeightCm: 180,
      growth: { deltaCm: 0, big: false }, build: 'atletico' as const, buildPush: 0, originalBuild: 'atletico' as const };
    for (const morale of [0, 0.5, 1]) {
      const { focus } = staffMeeting(input({ morale, coachRelation: morale }));
      expect(() => evolveSemester(s, { focus, staffQuality: 1, minutes: 1, morale }, createPrng(1))).not.toThrow();
    }
  });
});

describe('proposta automática de foco (T40: decisões automáticas da simulação e do ritmo Rápido)', () => {
  const flat = (v: number) => Object.fromEntries(ATTRIBUTES.map((a) => [a, v])) as Attributes;

  it('foca onde há mais overall a ganhar: peso da posição × espaço até o teto × curva da idade', () => {
    expect(autoProposal(flat(50), flat(90), 'atacante', 18).main).toBe('finalizacao');
    const gk = autoProposal(flat(50), flat(90), 'goleiro', 18);
    expect([gk.main, gk.secondary].sort()).toEqual(['habilidade', 'velocidade']);
  });

  it('atributo no teto ou que já parou de crescer na idade não é escolhido', () => {
    expect(autoProposal({ ...flat(50), finalizacao: 90 }, flat(90), 'atacante', 18).main).not.toBe('finalizacao');
    const gk = autoProposal(flat(50), flat(90), 'goleiro', 26);
    expect([gk.main, gk.secondary]).not.toContain('velocidade');
  });

  it('no declínio, protege o que mais pesa e mais cai; principal e secundário sempre diferentes', () => {
    expect(autoProposal(flat(80), flat(80), 'goleiro', 37).main).toBe('velocidade');
    for (const position of POSITIONS) {
      for (const age of [16, 24, 31, 38]) {
        const p = autoProposal(flat(70), flat(85), position, age);
        expect(p.main).not.toBe(p.secondary);
      }
    }
  });
});
