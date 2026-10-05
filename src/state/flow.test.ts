import { CREATION_STEPS, SCREENS, eventsOf, initialFlow, transition, validateFlow, type FlowState, type Screen } from './flow';
import data from '../data/flow.json';

const at = (screen: Screen, step = 0): FlowState => ({ screen, step });
const TABLE = data.telas as Record<string, Record<string, string>>;

describe('fluxo de telas (T48)', () => {
  it('começa na abertura', () => {
    expect(initialFlow()).toEqual({ screen: 'abertura', step: 0 });
  });

  it('toda transição da tabela leva à tela de destino', () => {
    let count = 0;
    for (const screen of SCREENS) {
      for (const [event, target] of Object.entries(TABLE[screen]!)) {
        const from = screen === 'criacao' ? at(screen, CREATION_STEPS.length - 1) : at(screen);
        expect(transition(from, event).screen, `${screen} --${event}-->`).toBe(target);
        count++;
      }
    }
    expect(count).toBeGreaterThan(20);
  });

  it('nenhuma tela sem saída; todo destino existe; toda tela é alcançável a partir da abertura', () => {
    for (const screen of SCREENS) {
      expect(eventsOf(screen).length, screen).toBeGreaterThan(0);
      for (const target of Object.values(TABLE[screen]!)) expect(SCREENS).toContain(target);
    }
    const seen = new Set<string>(['abertura']);
    const queue = ['abertura'];
    while (queue.length) for (const t of Object.values(TABLE[queue.pop()!]!)) if (!seen.has(t)) { seen.add(t); queue.push(t); }
    expect([...seen].sort()).toEqual([...SCREENS].sort());
  });

  it('de qualquer tela dá para chegar ao cartão e voltar à abertura (o jogo nunca trava)', () => {
    const reaches = (from: string, goal: string) => {
      const seen = new Set([from]);
      const queue = [from];
      while (queue.length) for (const t of Object.values(TABLE[queue.pop()!]!)) { if (t === goal) return true; if (!seen.has(t)) { seen.add(t); queue.push(t); } }
      return false;
    };
    for (const screen of SCREENS) {
      if (screen !== 'cartao') expect(reaches(screen, 'cartao'), `${screen} → cartao`).toBe(true);
      if (screen !== 'abertura') expect(reaches(screen, 'abertura'), `${screen} → abertura`).toBe(true);
    }
  });

  it('evento que a tela não aceita não muda o estado', () => {
    for (const screen of SCREENS) expect(transition(at(screen), 'EVENTO_INEXISTENTE')).toEqual(at(screen));
    expect(transition(at('decisao'), 'APOSENTAR')).toEqual(at('decisao'));
  });

  it('criação: passos na ordem da SPEC 6.1, avançar e voltar; voltar no primeiro passo sai para a abertura', () => {
    expect(CREATION_STEPS).toEqual(['quemE', 'emCampo', 'origem']); // v2.30: duas telas + tipo de início
    let s = transition(initialFlow(), 'NOVA_CARREIRA');
    expect(s).toEqual(at('criacao', 0));
    for (let i = 1; i < CREATION_STEPS.length; i++) { s = transition(s, 'AVANCAR'); expect(s).toEqual(at('criacao', i)); }
    expect(transition(s, 'AVANCAR')).toEqual(s);
    expect(transition(s, 'VOLTAR')).toEqual(at('criacao', CREATION_STEPS.length - 2));
    expect(transition(at('criacao', 0), 'VOLTAR')).toEqual(at('abertura'));
  });

  it('criação só conclui no último passo; nova carreira sempre recomeça do passo 0', () => {
    expect(transition(at('criacao', 1), 'CONCLUIR')).toEqual(at('criacao', 1)); // passo do meio não conclui
    expect(transition(at('criacao', CREATION_STEPS.length - 1), 'CONCLUIR')).toEqual(at('sorteio'));
    expect(transition(at('cartao'), 'NOVA_CARREIRA')).toEqual(at('criacao', 0));
    expect(transition(at('saveInvalido'), 'RECOMECAR')).toEqual(at('criacao', 0));
  });

  it('save inválido nunca trava: mensagem com opção de recomeçar (6.16)', () => {
    const s = transition(initialFlow(), 'SAVE_INVALIDO');
    expect(s.screen).toBe('saveInvalido');
    expect(eventsOf('saveInvalido')).toEqual(expect.arrayContaining(['RECOMECAR', 'VOLTAR']));
  });

  it('caminho completo de uma carreira', () => {
    const path = ['NOVA_CARREIRA', ...CREATION_STEPS.slice(1).map(() => 'AVANCAR'), 'CONCLUIR', 'AVANCAR', 'ESCOLHER', 'AVANCAR',
      'DECISAO', 'ESCOLHER', 'AVANCAR', 'REUNIAO', 'PROPOR', 'AVANCAR', 'TORNEIO', 'DECISAO', 'ESCOLHER', 'AVANCAR', 'PROXIMA', 'APOSENTAR', 'AVANCAR', 'AVANCAR'];
    expect(path.reduce(transition, initialFlow())).toEqual(at('cartao'));
  });

  it('tabela inválida é recusada: destino inexistente, tela sem saída ou tela inicial desconhecida', () => {
    expect(validateFlow(data)).toEqual([]);
    expect(validateFlow({ ...data, inicial: 'nada' })).not.toEqual([]);
    expect(validateFlow({ ...data, telas: { ...data.telas, veredito: {} } } as never)).not.toEqual([]);
    expect(validateFlow({ ...data, telas: { ...data.telas, veredito: { AVANCAR: 'fantasma' } } } as never)).not.toEqual([]);
  });
});
