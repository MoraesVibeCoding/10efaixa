import type { CreationInput } from '../engine/player';
import { autoDecide } from '../engine/career';
import { runUntilDecision } from './careerRun';
import { SAVE_KEY, SAVE_VERSION, clearSave, parseSave, peekSave, readSave, validateSave, writeSave, type SaveData } from './save';

// T54 (SPEC 6.16, v2.39): a carreira salva no aparelho a cada decisão. O save é criação + semente + ritmo + escolhas;
// a carreira é refeita a partir dele (motor determinístico). Nada sai do aparelho.
const INPUT: CreationInput = {
  name: 'Dudu Maestro', shirtNumber: 11, state: 'BA', position: 'meia', archetypeId: 'classico10',
  biotype: { heightCm: 184, build: 'forte' }, temperament: 'resenha', celebration: 'aviaozinho',
  origin: 'baseGrande', foot: 'direita', heartClub: 'bahia',
};
const LOOK = { skin: 't6', hairStyle: 'curto', hairColor: 'preto', beard: null, headband: null, boots: 'preta' };
const SAVE: SaveData = { created: { input: INPUT, look: LOOK, visual: 'visual-03' }, seed: 11, ritmo: 'normal', choices: [] };

/** Armazenamento de mentira, do formato do localStorage. */
function memory(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => { data.set(k, v); }, removeItem: (k: string) => { data.delete(k); }, data };
}
/** Armazenamento que falha (modo privado, cota cheia, bloqueado pelo navegador). */
const broken = { getItem: () => { throw new Error('bloqueado'); }, setItem: () => { throw new Error('cheio'); }, removeItem: () => { throw new Error('bloqueado'); } };

describe('save da carreira (T54)', () => {
  it('grava e lê de volta o mesmo save, com a versão do formato', () => {
    const store = memory();
    expect(writeSave(store, { ...SAVE, choices: ['a', 'b'] })).toBe(true);
    expect(JSON.parse(store.data.get(SAVE_KEY)!).versao).toBe(SAVE_VERSION);
    expect(readSave(store)).toEqual({ ok: true, save: { ...SAVE, choices: ['a', 'b'] } });
  });

  it('sem save: "nenhum"; apagar some com ele', () => {
    const store = memory();
    expect(readSave(store)).toEqual({ ok: false, reason: 'nenhum' });
    writeSave(store, SAVE);
    clearSave(store);
    expect(readSave(store)).toEqual({ ok: false, reason: 'nenhum' });
  });

  it('JSON quebrado, campos faltando ou versão desconhecida: inválido, com o motivo', () => {
    expect(parseSave('{nada')).toEqual({ ok: false, reason: 'danificado' });
    expect(parseSave(JSON.stringify({ versao: SAVE_VERSION, seed: 1 }))).toEqual({ ok: false, reason: 'danificado' });
    expect(parseSave(JSON.stringify({ ...SAVE, versao: SAVE_VERSION + 1 }))).toEqual({ ok: false, reason: 'versao' });
    expect(parseSave(JSON.stringify({ ...SAVE, versao: SAVE_VERSION, choices: [1, 2] }))).toEqual({ ok: false, reason: 'danificado' });
    expect(parseSave(JSON.stringify({ ...SAVE, versao: SAVE_VERSION, ritmo: 'turbo' }))).toEqual({ ok: false, reason: 'danificado' });
  });

  it('armazenamento indisponível nunca trava: gravar devolve false, ler devolve "nenhum"', () => {
    expect(writeSave(broken, SAVE)).toBe(false);
    expect(readSave(broken)).toEqual({ ok: false, reason: 'nenhum' });
    expect(() => clearSave(broken)).not.toThrow();
    expect(peekSave(broken)).toEqual({ status: 'nenhum' });
  });

  it('a espiada da abertura: nada salvo, carreira salva (com o nome) ou save inválido (para mostrar o aviso)', () => {
    const store = memory();
    expect(peekSave(store)).toEqual({ status: 'nenhum' });
    writeSave(store, SAVE);
    expect(peekSave(store)).toEqual({ status: 'salvo', name: 'Dudu Maestro' });
    store.data.set(SAVE_KEY, '{nada');
    expect(peekSave(store)).toEqual({ status: 'invalido' });
  });

  it('validar refaz a carreira: escolhas que o motor aceita passam; escolha impossível vira "danificado"', () => {
    const first = runUntilDecision(INPUT, 11, []);
    if (first.kind !== 'decision') throw new Error('esperava decisão');
    expect(validateSave(SAVE)).toEqual({ ok: true, save: SAVE });
    expect(validateSave({ ...SAVE, choices: ['opcao-que-nao-existe'] })).toEqual({ ok: false, reason: 'danificado' });
  });

  it('v2.63/v2.64: saves das versões 1 a 4 viram carreira de outra versão (camisa 10, empréstimo e venda mudaram a sequência de decisões)', () => {
    expect(SAVE_VERSION).toBe(5);
    for (const versao of [1, 2, 3, 4]) expect(parseSave(JSON.stringify({ ...SAVE, versao }))).toEqual({ ok: false, reason: 'versao' });
  });
});

describe('validação refaz a carreira no ritmo salvo (bug achado no teste de deploy, 2026-10-06)', () => {
  // escolhas reais de uma carreira jogada no ritmo, como o automático decide (reunião: a sugestão do preparador)
  function played(ritmo: SaveData['ritmo'], n: number): string[] {
    const choices: string[] = [];
    for (let i = 0; i < n; i++) {
      const step = runUntilDecision(INPUT, SAVE.seed, choices, ritmo);
      if (step.kind !== 'decision') break;
      choices.push(autoDecide(step.eventId, step.view.temperament, () => step.view));
    }
    return choices;
  }

  it.each(['rapido', 'normal', 'completo'] as const)('save do ritmo %s com escolhas continua válido', (ritmo) => {
    const choices = played(ritmo, 8);
    expect(choices.length).toBe(8);
    expect(validateSave({ ...SAVE, ritmo, choices })).toEqual({ ok: true, save: { ...SAVE, ritmo, choices } });
  });
});

describe('save do desafio do dia (T57c)', () => {
  it('guarda e devolve o dia do desafio; sem ele a carreira é livre (saves antigos seguem valendo)', () => {
    const store = memory();
    writeSave(store, { ...SAVE, desafio: '2026-10-07' });
    expect(readSave(store)).toEqual({ ok: true, save: { ...SAVE, desafio: '2026-10-07' } });
    const livre = parseSave(JSON.stringify({ versao: SAVE_VERSION, ...SAVE }));
    expect(livre.ok && 'desafio' in livre.save).toBe(false);
  });

  it.each(['07/10/2026', '2026-02-30', 7, ''])('save com desafio inválido (%s) é danificado', (bad) => {
    expect(parseSave(JSON.stringify({ versao: SAVE_VERSION, ...SAVE, desafio: bad }))).toEqual({ ok: false, reason: 'danificado' });
  });
});
