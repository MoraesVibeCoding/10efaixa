import data from '../data/flow.json';

// T48 (SPEC 6.1, 6.14–6.16): máquina de estados pura do fluxo de telas. Transições em dados.
export type Screen = keyof typeof data.telas;
export interface FlowState { screen: Screen; /** Passo da criação (índice em CREATION_STEPS); só vale na tela `criacao`. */ step: number }
export const SCREENS = Object.keys(data.telas) as Screen[];
export const CREATION_STEPS = data.passosCriacao;
export const initialFlow = (): FlowState => ({ screen: data.inicial as Screen, step: 0 });
const TABLE = data.telas as Record<string, Record<string, string>>;
const LAST_STEP = CREATION_STEPS.length - 1;

/** Tabela coerente: tela inicial existe, todo destino existe e nenhuma tela fica sem saída. */
export function validateFlow(d: { inicial: string; telas: Record<string, Record<string, string>> }): string[] {
  const errors: string[] = [];
  if (!(d.inicial in d.telas)) errors.push(`tela inicial desconhecida: ${d.inicial}`);
  for (const [screen, events] of Object.entries(d.telas)) {
    if (!Object.keys(events).length) errors.push(`tela sem saída: ${screen}`);
    for (const [event, target] of Object.entries(events)) if (!(target in d.telas)) errors.push(`${screen}/${event}: destino inexistente ${target}`);
  }
  return errors;
}
const errors = validateFlow(data);
if (errors.length) throw new Error(`flow.json inválido: ${errors.join('; ')}`);

/** Eventos que a tela aceita; a criação soma avançar e voltar entre os passos. */
export const eventsOf = (screen: Screen): string[] =>
  [...Object.keys(TABLE[screen]!), ...(screen === 'criacao' ? ['AVANCAR', 'VOLTAR'] : [])];

/** Próximo estado. Evento que a tela não aceita devolve o mesmo estado. Entrar na criação sempre começa do passo 0. */
export function transition(state: FlowState, event: string): FlowState {
  if (state.screen === 'criacao') {
    if (event === 'AVANCAR') return state.step < LAST_STEP ? { ...state, step: state.step + 1 } : state;
    if (event === 'VOLTAR') return state.step > 0 ? { ...state, step: state.step - 1 } : { screen: 'abertura', step: 0 };
    if (event === 'CONCLUIR' && state.step < LAST_STEP) return state;
  }
  const target = TABLE[state.screen]![event];
  return target ? { screen: target as Screen, step: 0 } : state;
}
