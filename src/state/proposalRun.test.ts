import { autoDecide, simulateCareer } from '../engine/career';
import { PROPOSAL_EVENT, acceptChoice, STAY } from '../engine/proposals';
import { createPrng } from '../engine/prng';
import { randomInput } from '../engine/simulation';
import { runUntilDecision, type Ritmo } from './careerRun';

// T28b (SPEC 6.12, v2.50): a proposta de clube vira decisão do jogador; quem escolhe o mesmo que o automático não muda a carreira.
// Aqui a tela está ligada nos três ritmos; em flow.json ela segue desligada até a tela da T28d existir.
vi.mock('../data/flow.json', async (original) => {
  const real = await original<{ default: Record<string, unknown> }>();
  return { default: { ...real.default, propostasNaTela: { rapido: true, normal: true, completo: true } } };
});
const inputOf = (seed: number) => randomInput(createPrng(seed));

/** Joga a carreira escolhendo sempre o automático; devolve o resultado e as telas de proposta que apareceram. */
function playAuto(seed: number, ritmo: Ritmo) {
  const input = inputOf(seed);
  const choices: string[] = [];
  const proposals: { sugestao: string; propostas: { clubId: string }[] }[] = [];
  for (let guard = 0; guard < 800; guard++) {
    const step = runUntilDecision(input, seed, choices, ritmo);
    if (step.kind === 'done') return { input, result: step.result, proposals, choices };
    if (step.eventId === PROPOSAL_EVENT) proposals.push({ sugestao: String(step.view.state.sugestao), propostas: step.view.propostas ?? [] });
    choices.push(autoDecide(step.eventId, step.view.temperament, () => step.view));
  }
  throw new Error('carreira não terminou');
}

describe('proposta de clube como decisão (T28b)', () => {
  it('escolher sempre o automático dá exatamente a mesma carreira da simulação (todos os ritmos)', { timeout: 120_000 }, () => {
    for (const [seed, ritmo] of [[1, 'completo'], [2, 'normal'], [3, 'rapido'], [4, 'normal']] as [number, Ritmo][]) {
      const { input, result } = playAuto(seed, ritmo);
      expect(JSON.stringify(result)).toBe(JSON.stringify(simulateCareer(input, seed)));
    }
  });

  it('a tela de proposta aparece em todos os ritmos, com 1 a 3 propostas e a sugestão do automático', { timeout: 120_000 }, () => {
    for (const ritmo of ['rapido', 'normal', 'completo'] as Ritmo[]) {
      const shown = [1, 2, 3, 4].flatMap((seed) => playAuto(seed, ritmo).proposals);
      expect(shown.length).toBeGreaterThan(0);
      for (const p of shown) {
        expect(p.propostas.length).toBeGreaterThanOrEqual(1);
        expect(p.propostas.length).toBeLessThanOrEqual(3);
        expect(p.sugestao === STAY || p.propostas.some((o) => acceptChoice(o.clubId) === p.sugestao)).toBe(true);
      }
    }
  });

  it('escolha que não foi mostrada é recusada pelo motor', () => {
    const { input, choices, proposals } = playAuto(1, 'normal');
    expect(proposals.length).toBeGreaterThan(0);
    // acha o índice da primeira tela de proposta e troca a escolha por um clube que não foi mostrado
    let idx = -1;
    const trial: string[] = [];
    for (let i = 0; i < choices.length; i++) {
      const step = runUntilDecision(input, 1, trial, 'normal');
      if (step.kind === 'decision' && step.eventId === PROPOSAL_EVENT) { idx = i; break; }
      trial.push(choices[i]!);
    }
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(() => runUntilDecision(input, 1, [...choices.slice(0, idx), 'aceitar:clube-que-nao-existe', ...choices.slice(idx + 1)], 'normal')).toThrow(/escolha inválida/);
  });

  it('o jogador pode contrariar o automático: aceitar outra proposta muda o clube da carreira', { timeout: 60_000 }, () => {
    for (const seed of [1, 2, 3, 4, 5, 6]) {
      const { input, choices } = playAuto(seed, 'completo');
      const trial: string[] = [];
      for (let i = 0; i < choices.length; i++) {
        const step = runUntilDecision(input, seed, trial, 'completo');
        if (step.kind === 'decision' && step.eventId === PROPOSAL_EVENT) {
          const other = (step.view.propostas ?? []).find((o) => acceptChoice(o.clubId) !== choices[i]);
          if (other) {
            const changed = runUntilDecision(input, seed, [...choices.slice(0, i), acceptChoice(other.clubId)], 'completo');
            const before = runUntilDecision(input, seed, [...choices.slice(0, i + 1)], 'completo');
            expect(JSON.stringify(changed)).not.toBe(JSON.stringify(before));
            return;
          }
        }
        trial.push(choices[i]!);
      }
    }
    throw new Error('nenhuma carreira de teste teve duas propostas distintas');
  });
});

// T28e (v2.50): proposta do clube de coração na tela: "aceitar" (salário ×0,85) ou "aceitar por amor" (×0,70 e mais idolatria).
describe('proposta do clube de coração (T28e)', () => {
  /** Procura uma carreira em que uma tela de proposta traga a proposta do clube de coração. */
  function findHeartScreen() {
    for (let seed = 1; seed <= 80; seed++) {
      const input = { ...inputOf(seed), heartClub: 'bahia' };
      const choices: string[] = [];
      for (let guard = 0; guard < 800; guard++) {
        const step = runUntilDecision(input, seed, choices, 'completo');
        if (step.kind === 'done') break;
        if (step.eventId === PROPOSAL_EVENT && step.view.propostas?.some((p) => p.marca === 'coracao')) return { input, seed, choices: [...choices], view: step.view };
        choices.push(autoDecide(step.eventId, step.view.temperament, () => step.view));
      }
    }
    return null;
  }

  it('a proposta do clube de coração aparece na tela com a marca, mesmo para quem a recusaria', { timeout: 300_000 }, () => {
    const found = findHeartScreen();
    expect(found).not.toBeNull();
    expect(found!.view.propostas!.find((p) => p.marca === 'coracao')!.clubId).toBe('bahia');
  });

  it('"amor:" é aceito só nela e rende mais idolatria no clube de coração, com menos dinheiro, que "aceitar:"', { timeout: 300_000 }, () => {
    const f = findHeartScreen()!;
    const finish = (choice: string) => {
      const choices = [...f.choices, choice];
      for (let guard = 0; guard < 800; guard++) {
        const step = runUntilDecision(f.input, f.seed, choices, 'completo');
        if (step.kind === 'done') return step.result;
        choices.push(autoDecide(step.eventId, step.view.temperament, () => step.view));
      }
      throw new Error('carreira não terminou');
    };
    const normal = finish(acceptChoice('bahia'));
    const amor = finish(`amor:bahia`);
    expect(amor.idolatry.bahia ?? 0).toBeGreaterThan(normal.idolatry.bahia ?? 0);
    expect(amor.earnedBRL).toBeLessThan(normal.earnedBRL);
    // "amor:" para um clube que não é o do coração é recusado pelo motor
    const other = f.view.propostas!.find((p) => p.marca !== 'coracao');
    if (other) expect(() => runUntilDecision(f.input, f.seed, [...f.choices, `amor:${other.clubId}`], 'completo')).toThrow(/escolha inválida/);
  });
});
