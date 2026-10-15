import events from '../data/events.json';
import ptEvents from '../i18n/pt-BR/events.json';
import { autoDecide, simulateCareer, type DecisionView } from './career';
import { overall } from './overall';
import { createPrng } from './prng';
import { randomInput } from './simulation';

// v3.10 (pedido do usuário em 2026-10-15): a proposta de mudança de posição diz qual posição o técnico oferece, com o
// over do jogador em cada uma (o overall pode aparecer em número na tela de decisão, v2.16).
describe('proposta de mudança de posição com a posição oferecida (v3.10)', () => {
  it('a decisão traz de qual posição para qual, e o over em cada uma', { timeout: 120_000 }, () => {
    const seen: DecisionView[] = [];
    for (let seed = 1; seed <= 80 && seen.length < 3; seed++) {
      simulateCareer(randomInput(createPrng(seed)), seed, 2026, (e, t, v) => {
        if (e === 'mudanca-posicao') seen.push(v());
        return autoDecide(e, t, v);
      });
    }
    expect(seen.length).toBeGreaterThan(0);
    for (const v of seen) {
      const o = v.posicaoOferecida!;
      expect(o.de).toBe(v.position);
      expect(o.para).not.toBe(o.de);
      expect(o.overDe).toBe(v.overall);
      expect(o.overPara).toBeGreaterThanOrEqual(1);
      expect(Math.abs(o.overPara - overall(v.attributes, o.para))).toBeLessThanOrEqual(3);
    }
  });
});

// v3.10: depois de uma transferência, quem está fora da posição de origem escolhe: seguir na nova, pedir para voltar
// (o técnico aceita pela regra 6.6) ou deixar o técnico escolher (a de over maior).
const EVENT = 'posicao-novo-clube';
type Seen = { at: DecisionView; next?: DecisionView; origin: string };
function run(choice: string, seeds = 160): Seen[] {
  const seen: Seen[] = [];
  for (let seed = 1; seed <= seeds && seen.length < 4; seed++) {
    const input = randomInput(createPrng(seed));
    let pending: Seen | null = null;
    simulateCareer(input, seed, 2026, (e, t, v) => {
      if (pending && !pending.next) pending.next = v();
      if (e === 'mudanca-posicao') return 'aceitar';
      if (e === EVENT) { pending = { at: v(), origin: input.position }; seen.push(pending); return choice; }
      return autoDecide(e, t, v);
    });
  }
  return seen;
}

describe('posição no clube novo (v3.10)', () => {
  it('aparece só fora da posição de origem, com a de origem como a oferecida', { timeout: 300_000 }, () => {
    const seen = run('seguir');
    expect(seen.length).toBeGreaterThan(0);
    for (const s of seen) {
      expect(s.at.position).not.toBe(s.origin);
      expect(s.at.posicaoOferecida).toMatchObject({ de: s.at.position, para: s.origin });
      if (s.next) expect(s.next.position).toBe(s.at.position);
    }
  });

  it('"tecnico-decide" leva à posição de over maior', { timeout: 300_000 }, () => {
    const seen = run('tecnico-decide').filter((s) => s.next);
    expect(seen.length).toBeGreaterThan(0);
    for (const s of seen) {
      const o = s.at.posicaoOferecida!;
      expect(s.next!.position).toBe(o.overPara > o.overDe ? o.para : o.de);
    }
  });

  it('"voltar" segue a regra 6.6: aceito, volta à de origem; recusado, fica', { timeout: 300_000 }, () => {
    const seen = run('voltar').filter((s) => s.next);
    expect(seen.length).toBeGreaterThan(0);
    for (const s of seen) {
      const o = s.at.posicaoOferecida!;
      const rel = (s.at.state.relacaoTecnico as number);
      const accepted = overall(s.at.attributes, o.de) - overall(s.at.attributes, o.para) <= 3 || rel >= 0.7;
      expect(s.next!.position, JSON.stringify({ o, rel })).toBe(accepted ? o.para : o.de);
    }
  });
});

// v3.10: "Um favor para o time" não troca a posição; o texto deixa isso claro (pedido do usuário, aprovado em 2026-10-15).
describe('"Um favor para o time" não é troca de posição (v3.10)', () => {
  it('o texto diz que a posição é a mesma, e nenhuma opção muda a posição', () => {
    expect(ptEvents['tecnico-pede-sacrificio'].texto).toMatch(/Não é posição nova/);
    const ev = events.eventos.find((e) => e.id === 'tecnico-pede-sacrificio')!;
    for (const o of ev.opcoes) expect(JSON.stringify(o.efeitos)).not.toMatch(/mudarPosicao/);
  });
});
