import type { Offer } from './market';
import { PROPOSAL_EVENT, STAY, acceptChoice, parseProposalChoice, proposalViewOf } from './proposals';

// T28b (SPEC 6.12, v2.50): a decisão "proposta-clube": a escolha é "aceitar:<clube>" ou "ficar", conferida com as propostas mostradas.
const offer = (clubId: string, over: Partial<Offer> = {}): Offer => ({
  clubId, league: 'BRA-A', currency: 'BRL', annualSalary: 1_000_000, years: 3, role: 'titular', staffQuality: 1,
  heartClub: false, rivalOfCurrent: false, rivalOfHeart: false, offAxis: false, ...over,
});
const shown = [offer('vitoria'), offer('sport')];

describe('escolha da proposta (T28b)', () => {
  it('o id da decisão e a escolha de ficar são fixos (entram no save e no link)', () => {
    expect(PROPOSAL_EVENT).toBe('proposta-clube');
    expect(STAY).toBe('ficar');
    expect(acceptChoice('vitoria')).toBe('aceitar:vitoria');
  });

  it('aceita "aceitar:<clube mostrado>" e devolve a proposta', () => {
    expect(parseProposalChoice('aceitar:sport', shown, true)).toEqual({ kind: 'aceitar', offer: shown[1] });
  });

  it('"ficar" só vale quando há clube para ficar', () => {
    expect(parseProposalChoice('ficar', shown, true)).toEqual({ kind: 'ficar' });
    expect(parseProposalChoice('ficar', shown, false)).toBeNull();
  });

  it.each(['', 'aceitar', 'aceitar:', 'aceitar:flamengo', 'aceitar:vitoria:sport', 'recusar', 'FICAR', ' ficar', 'ficar:vitoria'])(
    'rejeita escolha fora do formato ou de clube que não foi mostrado: %j', (bad) => {
      expect(parseProposalChoice(bad, shown, true)).toBeNull();
    });

  it('a visão da proposta para a tela leva só o que a tela mostra, sem os campos internos do mercado', () => {
    const v = proposalViewOf(offer('vitoria', { heartClub: true, rivalOfCurrent: true, offAxis: true, annualSalary: 2_500_000, currency: 'EUR', league: 'POR', role: 'aposta' }), 70);
    expect(v).toEqual({ clubId: 'vitoria', league: 'POR', currency: 'EUR', annualSalary: 2_500_000, years: 3, role: 'aposta', staffQuality: 1, offAxis: true, minutosFaixa: expect.stringMatching(/^(muitos|rodizio|poucos)$/), nivelClube: expect.stringMatching(/^(modesto|medio|grande|elite)$/) });
  });

  it('a visão traz as faixas de minutos e de nível do clube, e o mesmo jogador vê faixas diferentes em clubes diferentes', () => {
    const forte = proposalViewOf(offer('flamengo', { role: 'rodizio' }), 75);
    const fraco = proposalViewOf(offer('santa-cruz', { role: 'titular' }), 75);
    expect(forte.nivelClube).not.toBe(fraco.nivelClube);
    expect(fraco.minutosFaixa).toBe('muitos');
  });
});
