import { autoDecide, simulateCareer, type CareerResult, type Decider, type DecisionView } from './career';
import { createPrng } from './prng';
import { PROPOSAL_EVENT, RENEW, RETIRE, STAY, homeChoice } from './proposals';
import { randomInput } from './simulation';
import retire from '../data/retirement.json';

// v2.85 (pedido do usuário em 2026-10-11): a partir dos 34, a tela de propostas abre toda temporada com o clube atual, no
// máximo 2 propostas, "Voltar para casa" (clube de coração; sem ele, o formador) e "Pendurar as chuteiras". O sorteio
// de "decidiu parar" e o sorteio da despedida saem: parar é sempre escolha (ou sugestão do temperamento no automático).
const FIM = retire.fimDeCarreira;
type Visto = { age: number; view: DecisionView };
const run = (seed: number, escolha: (v: DecisionView) => string | null, heartClub: string | null = null) => {
  const vistos: Visto[] = [];
  const decide: Decider = (id, t, view) => {
    if (id !== PROPOSAL_EVENT) return autoDecide(id, t, view);
    const v = view();
    vistos.push({ age: v.age, view: v });
    return escolha(v) ?? autoDecide(id, t, () => v);
  };
  const input = { ...randomInput(createPrng(seed)), heartClub };
  const r = simulateCareer(input, seed, 2026, decide);
  return { r, vistos, input };
};
// nunca para por escolha: fica (ou renova) sempre
const nuncaPara = (v: DecisionView) => (v.state.podeRenovar ? RENEW : STAY);

describe('fim de carreira na tela de propostas (v2.85)', () => {
  it('dos 34 em diante a janela abre toda temporada, com até 2 propostas e o card de parar; antes, não', () => {
    let tardias = 0;
    for (let seed = 1; seed <= 12; seed++) {
      const { r, vistos } = run(seed, nuncaPara);
      for (const { age, view } of vistos) {
        if (age >= FIM.idadeMin) {
          tardias++;
          expect(view.propostas!.length).toBeLessThanOrEqual(FIM.maxPropostas);
          expect(view.state.podeParar).toBe(true);
        } else expect(view.state.podeParar).toBeFalsy();
      }
      // uma janela por temporada jogada a partir dos 34 (fora os anos com empréstimo, venda ou volta de empréstimo)
      const anosTardios = r.seasons.filter((s) => s.age >= FIM.idadeMin && s.age < r.endAge).length;
      expect(vistos.filter((x) => x.age >= FIM.idadeMin).length).toBeGreaterThanOrEqual(anosTardios - 1);
    }
    expect(tardias).toBeGreaterThan(20);
  });

  it('quem nunca escolhe parar não se aposenta por "decisão": só por corpo, nível ou 40 anos', () => {
    for (let seed = 1; seed <= 20; seed++) expect(run(seed, nuncaPara).r.retirement).not.toBe('decisao');
  });

  it('"Pendurar as chuteiras" encerra a carreira naquela temporada, com o motivo "decisao"', () => {
    const { r, vistos } = run(3, (v) => (v.state.podeParar ? RETIRE : null));
    const primeira = vistos.find((x) => x.view.state.podeParar)!;
    expect(r.retirement).toBe('decisao');
    expect(Math.floor(r.endAge)).toBe(Math.floor(primeira.age));
  });

  it('"Voltar para casa" leva ao clube de coração com o salário do "por amor"; sem coração, ao clube formador', () => {
    const casaDe = (heart: string | null) => run(5, (v) => (v.casa ? homeChoice(v.casa.clubId) : null), heart);
    const comCoracao = casaDe('bahia');
    const card = comCoracao.vistos.find((x) => x.view.casa)!.view.casa!;
    expect(card).toMatchObject({ clubId: 'bahia', kind: 'coracao' });
    expect(comCoracao.r.farewell).toBe('coracao');
    expect(comCoracao.r.spells.at(-1)!.clubId).toBe('bahia');

    const semCoracao = casaDe(null);
    const formador = semCoracao.r.spells[0]!.clubId;
    const v = semCoracao.vistos.find((x) => x.view.casa);
    if (semCoracao.r.spells.some((s) => s.clubId !== formador)) {
      expect(v!.view.casa).toMatchObject({ clubId: formador, kind: 'formador' });
      expect(semCoracao.r.farewell).toBe('formador');
    }
  });

  it('em casa, o card de volta some (continua podendo ficar, sair ou parar)', () => {
    const { vistos } = run(5, (v) => (v.casa ? homeChoice(v.casa.clubId) : null), 'bahia');
    const depois = vistos.filter((x) => x.view.clubId === 'bahia' && x.view.state.podeParar);
    for (const x of depois) expect(x.view.casa).toBeUndefined();
  });

  it('no automático, parar só a partir dos 34', () => {
    const rs: CareerResult[] = [];
    for (let seed = 1; seed <= 40; seed++) rs.push(simulateCareer(randomInput(createPrng(seed)), seed));
    for (const r of rs.filter((x) => x.retirement === 'decisao')) expect(r.endAge).toBeGreaterThanOrEqual(FIM.idadeMin);
    expect(rs.some((x) => x.retirement === 'decisao')).toBe(true);
  });
});
