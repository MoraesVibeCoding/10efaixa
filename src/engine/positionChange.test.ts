import { ATTRIBUTES, type Attributes } from './attributes';
import { autoChoice, eligibleEvents } from './events';
import { overall } from './overall';
import { changePosition, coachProposal, playerRequest, type PositionState } from './positionChange';
import cfg from '../data/positionChange.json';

const flat = (v: number): Attributes => Object.fromEntries(ATTRIBUTES.map((a) => [a, v])) as Attributes;
const marcador = { ...flat(70), marcacao: 86, forca: 82, mental: 84, jogoAereo: 80, passe: 80, drible: 60, finalizacao: 55 };
const state: PositionState = { position: 'meia', archetypeId: 'regente', originStyle: null, traits: ['donoDoMeio'], heightCm: 181 };

describe('mudança de posição (T32)', () => {
  it('técnico propõe: meia recua para volante depois dos 30, se o overall compensar', () => {
    expect(coachProposal({ position: 'meia', age: 31, attributes: marcador })).toBe('volante');
    expect(coachProposal({ position: 'meia', age: 27, attributes: marcador })).toBeNull();
    const criativo = { ...flat(60), passe: 90, habilidade: 90, drible: 88, finalizacao: 85, marcacao: 30, forca: 35 };
    expect(coachProposal({ position: 'meia', age: 32, attributes: criativo })).toBeNull();
  });

  it('lateral vira zagueiro; goleiro nunca recebe proposta', () => {
    expect(coachProposal({ position: 'lateral', age: 30, attributes: marcador })).toBe('zagueiro');
    expect(coachProposal({ position: 'goleiro', age: 34, attributes: marcador })).toBeNull();
  });

  it('pedido do jogador: aceito se o overall na nova posição não cai demais; senão caem moral e relação', () => {
    expect(playerRequest({ position: 'meia', target: 'volante', attributes: marcador, coachRelation: 0.5 })).toEqual({ accepted: true, moraleDelta: 0, relationDelta: 0 });
    const r = playerRequest({ position: 'zagueiro', target: 'atacante', attributes: marcador, coachRelation: 0.5 });
    expect(r.accepted).toBe(false);
    expect(r.moraleDelta).toBe(cfg.pedido.recusa.moral);
    expect(r.relationDelta).toBe(cfg.pedido.recusa.relacaoTecnico);
  });

  it('técnico com quem o jogador se dá muito bem aceita mesmo com queda de overall', () => {
    expect(playerRequest({ position: 'zagueiro', target: 'atacante', attributes: marcador, coachRelation: 0.9 }).accepted).toBe(true);
  });

  it('pedido envolvendo goleiro ou a própria posição é recusado sem custo', () => {
    expect(playerRequest({ position: 'meia', target: 'goleiro', attributes: marcador, coachRelation: 1 })).toEqual({ accepted: false, moraleDelta: 0, relationDelta: 0 });
    expect(playerRequest({ position: 'meia', target: 'meia', attributes: marcador, coachRelation: 1 }).accepted).toBe(false);
  });

  it('troca: overall recalculado pelos pesos da nova posição; arquétipo vira estilo de origem; traço e altura mantidos', () => {
    const next = changePosition(state, 'volante');
    expect(next).toEqual({ position: 'volante', archetypeId: 'regente', originStyle: 'regente', traits: ['donoDoMeio'], heightCm: 181 });
    expect(overall(marcador, next.position)).not.toBe(overall(marcador, state.position));
    expect(state.position).toBe('meia');
    expect(() => changePosition(state, 'goleiro')).toThrow(RangeError);
    expect(() => changePosition(state, 'meia')).toThrow(RangeError);
  });

  it('dilema no catálogo: proposta de mudança com cena e política', () => {
    expect(eligibleEvents({ propostaMudancaPosicao: 'volante' })).toContain('mudanca-posicao');
    expect(eligibleEvents({ propostaMudancaPosicao: '' })).not.toContain('mudanca-posicao');
    expect(autoChoice('mudanca-posicao', 'frio')).toBe('aceitar');
  });
});
