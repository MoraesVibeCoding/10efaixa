import { AGENT_PROFILES, agentSemester, changeAgent, commissionOn, createAgent, salaryBoost } from './agent';
import { eligibleEvents } from './events';
import { createPrng } from './prng';
import cfg from '../data/agents.json';
import ptBR from '../i18n/pt-BR/creation.json';

const rate = (profile: string, event: string, n = 4000) => {
  let k = 0;
  for (let s = 0; s < n; s++) if (agentSemester(createAgent(profile, createPrng(s)), createPrng(s + 99_999)).event === event) k++;
  return k / n;
};

describe('empresário (T26)', () => {
  it('3 perfis da tabela 6.12, com rótulo pt-BR', () => {
    expect(AGENT_PROFILES.sort()).toEqual(['agenteLocal', 'grandeAgencia', 'paiTio']);
    for (const p of AGENT_PROFILES) expect(ptBR.agent[p as keyof typeof ptBR.agent]).toBeTruthy();
  });

  it('perfis: pai/tio leal e com comissão baixa; grande agência influente e cara; lealdade dentro da faixa', () => {
    const pai = createAgent('paiTio', createPrng(1));
    const big = createAgent('grandeAgencia', createPrng(1));
    expect(pai.loyalty).toBeGreaterThan(0.8);
    expect(big.influence).toBeGreaterThan(pai.influence);
    expect(big.commission).toBeGreaterThan(pai.commission);
    for (let s = 0; s < 100; s++) {
      const a = createAgent('grandeAgencia', createPrng(s));
      expect(a.loyalty).toBeGreaterThanOrEqual(cfg.perfis.grandeAgencia.lealdade[0]!);
      expect(a.loyalty).toBeLessThanOrEqual(cfg.perfis.grandeAgencia.lealdade[1]!);
    }
  });

  it('eventos ruins (forçar venda, sumir com dinheiro) são mais comuns com empresário pouco leal', () => {
    expect(rate('grandeAgencia', 'forcaVenda')).toBeGreaterThan(rate('paiTio', 'forcaVenda'));
    expect(rate('agenteLocal', 'someDinheiro')).toBeGreaterThan(rate('paiTio', 'someDinheiro'));
  });

  it('briga com o clube é mais comum com empresário influente', () => {
    expect(rate('grandeAgencia', 'brigaClube')).toBeGreaterThan(rate('paiTio', 'brigaClube'));
  });

  it('sumiço de dinheiro informa a fração perdida dentro da faixa', () => {
    for (let s = 0; s < 3000; s++) {
      const r = agentSemester(createAgent('agenteLocal', createPrng(s)), createPrng(s + 7));
      if (r.event === 'someDinheiro') {
        expect(r.moneyLossFraction).toBeGreaterThanOrEqual(cfg.eventos.someDinheiro.perdaPatrimonio[0]!);
        expect(r.moneyLossFraction).toBeLessThanOrEqual(cfg.eventos.someDinheiro.perdaPatrimonio[1]!);
      } else expect(r.moneyLossFraction).toBe(0);
    }
  });

  it('influência melhora a negociação; comissão sobre o valor', () => {
    expect(salaryBoost(createAgent('grandeAgencia', createPrng(1)))).toBeGreaterThan(salaryBoost(createAgent('paiTio', createPrng(1))));
    expect(commissionOn(1_000_000, createAgent('agenteLocal', createPrng(1)))).toBe(80_000);
  });

  it('trocar de empresário tem custo e atrito', () => {
    const r = changeAgent(2_000_000, 'agenteLocal', createPrng(3));
    expect(r.cost).toBe(100_000);
    expect(r.moraleDelta).toBeLessThan(0);
    expect(r.agent.profile).toBe('agenteLocal');
  });

  it('eventos do empresário entram no catálogo da T25 (com cena)', () => {
    for (const e of ['forcaVenda', 'someDinheiro', 'brigaClube']) {
      expect(eligibleEvents({ eventoEmpresario: e }).length).toBe(1);
    }
  });
});
