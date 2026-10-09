import { autoDecide, simulateCareer, type CareerResult, type Decider, type DecisionView } from './career';
import { applyOption } from './events';
import { LOAN_EVENT, PROPOSAL_EVENT, STAY, acceptChoice } from './proposals';
import { createPrng } from './prng';
import { randomInput } from './simulation';

// v2.64 (docs/proposta-emprestimo-e-venda.md, aprovado em 2026-10-09): empréstimo vira decisão com o clube à vista; a venda pelo
// empresário mostra o clube comprador; no máximo uma decisão de transferência por temporada.
const SALE = 'empresario-forca-venda';
const TRANSFER = new Set([LOAN_EVENT, SALE, PROPOSAL_EVENT]);
const SEEDS = Array.from({ length: 120 }, (_, i) => i + 1);

/** O clube seguinte ao da decisão (a passagem em que ele estava quando decidiu, e a próxima). */
function nextSpell(result: CareerResult, v: DecisionView) {
  let i = -1;
  result.spells.forEach((x, j) => { if (x.clubId === v.clubId && x.fromAge <= v.age) i = j; });
  expect(i).toBeGreaterThanOrEqual(0);
  return result.spells[i + 1];
}

interface Seen { eventId: string; view: DecisionView; choice: string }
/** Roda a carreira anotando as decisões; `pick` troca a escolha de alguns eventos (o resto é o automático). */
function run(seed: number, pick: (eventId: string, v: DecisionView) => string | null = () => null) {
  const seen: Seen[] = [];
  const decide: Decider = (eventId, temperament, view) => {
    const v = view();
    const choice = pick(eventId, v) ?? autoDecide(eventId, temperament, () => v);
    seen.push({ eventId, view: v, choice });
    return choice;
  };
  return { result: simulateCareer(randomInput(createPrng(seed)), seed, 2026, decide), seen };
}

describe('empréstimo e venda com destino (v2.64)', () => {
  const careers = SEEDS.map((s) => run(s));

  it('no máximo uma decisão de transferência por temporada', () => {
    for (const { seen } of careers) {
      const perYear = new Map<number, number>();
      for (const s of seen) if (TRANSFER.has(s.eventId)) perYear.set(s.view.year, (perYear.get(s.view.year) ?? 0) + 1);
      for (const [year, n] of perYear) expect(n, `ano ${year}`).toBeLessThanOrEqual(1);
    }
  });

  it('ninguém é emprestado sem a decisão de empréstimo; a decisão traz o clube de destino', () => {
    let loans = 0;
    for (const { result, seen } of careers) {
      const asked = seen.filter((s) => s.eventId === LOAN_EVENT);
      for (const s of asked) {
        expect(s.view.propostas).toHaveLength(1);
        expect(s.view.state.podeFicar).toBe(true);
      }
      const accepted = asked.filter((s) => s.choice !== STAY).map((s) => s.view.propostas![0]!.clubId);
      const loanSpells = result.spells.filter((x) => x.loan).map((x) => x.clubId);
      expect(loanSpells).toEqual(accepted);
      loans += loanSpells.length;
    }
    expect(loans).toBeGreaterThan(0);
  });

  it('o empréstimo é oferecido no máximo uma vez por temporada; recusar mantém o clube', () => {
    let refused = 0;
    for (const seed of SEEDS) {
      const { result, seen } = run(seed, (id) => (id === LOAN_EVENT ? STAY : null));
      expect(result.spells.some((x) => x.loan)).toBe(false);
      const years = seen.filter((s) => s.eventId === LOAN_EVENT).map((s) => s.view.year);
      expect(new Set(years).size).toBe(years.length);
      refused += years.length;
    }
    expect(refused).toBeGreaterThan(0);
  });

  it('aceitar o empréstimo leva ao clube mostrado', () => {
    for (const seed of SEEDS) {
      const { result, seen } = run(seed, (id, v) => (id === LOAN_EVENT ? acceptChoice(v.propostas![0]!.clubId) : null));
      const asked = seen.filter((s) => s.eventId === LOAN_EVENT).map((s) => s.view.propostas![0]!.clubId);
      expect(result.spells.filter((x) => x.loan).map((x) => x.clubId)).toEqual(asked);
    }
  });

  it('a venda pelo empresário traz o clube comprador; aceitar leva exatamente a ele no fim da temporada', () => {
    let sales = 0;
    for (const seed of SEEDS) {
      const { result, seen } = run(seed, (id) => (id === SALE ? 'aceitar-venda' : null));
      for (const s of seen.filter((x) => x.eventId === SALE)) {
        expect(s.view.propostas).toHaveLength(1);
        const buyer = s.view.propostas![0]!.clubId;
        const next = nextSpell(result, s.view);
        expect(next?.clubId, `seed ${seed}`).toBe(buyer);
        expect(next?.loan).toBe(false);
        sales++;
      }
    }
    expect(sales).toBeGreaterThan(0);
  });

  it('bater o pé: a venda cai, ele fica e a relação com o técnico piora', () => {
    let stood = 0;
    for (const seed of SEEDS) {
      const { result, seen } = run(seed, (id) => (id === SALE ? 'bater-o-pe' : null));
      for (const s of seen.filter((x) => x.eventId === SALE)) {
        // ele não vai para o comprador: segue no clube (só a despedida no formador ou no coração, fora da conta, o tira dali)
        // uma troca no fim da mesma temporada (idade arredondada para cima) só pode ser a despedida, nunca o comprador
        const next = nextSpell(result, s.view);
        if (next && next.fromAge <= Math.ceil(s.view.age)) {
          expect(next.clubId, `seed ${seed}`).not.toBe(s.view.propostas![0]!.clubId);
          expect(result.farewell, `seed ${seed}`).not.toBeNull();
        }
        stood++;
      }
    }
    expect(stood).toBeGreaterThan(0);
    const before = { relacaoTecnico: 0.5, idolatria: 10, moral: 0.5 };
    const after = applyOption(before, SALE, 'bater-o-pe');
    expect(after.relacaoTecnico as number).toBeLessThan(before.relacaoTecnico);
    expect(after.idolatria as number).toBeGreaterThan(before.idolatria);
  });

  it('a carreira continua determinística', () => {
    expect(run(7).result).toEqual(run(7).result);
  });
});
