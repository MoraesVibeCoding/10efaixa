import type { Offer } from './market';
import { PROPOSAL_EVENT, STAY, acceptChoice, loveChoice, forceChoice, negotiateChoice, parseProposalChoice, proposalViewOf } from './proposals';

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
    expect(loveChoice('bahia')).toBe('amor:bahia');
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
    expect(v).toEqual({ clubId: 'vitoria', league: 'POR', currency: 'EUR', annualSalary: 2_500_000, years: 3, role: 'aposta', staffQuality: 1, offAxis: true, marca: 'coracao', minutosFaixa: expect.stringMatching(/^(muitos|rodizio|poucos)$/), nivelClube: expect.stringMatching(/^(modesto|medio|grande|elite)$/) });
  });

  it('a visão traz as faixas de minutos e de nível do clube, e o mesmo jogador vê faixas diferentes em clubes diferentes', () => {
    const forte = proposalViewOf(offer('flamengo', { role: 'rodizio' }), 75);
    const fraco = proposalViewOf(offer('santa-cruz', { role: 'titular' }), 75);
    expect(forte.nivelClube).not.toBe(fraco.nivelClube);
    expect(fraco.minutosFaixa).toBe('muitos');
  });
});

// T28e (v2.50): proposta do clube de coração tem a opção "aceitar por amor"; só ela.
describe('proposta com marca (T28e)', () => {
  const heart = offer('bahia', { heartClub: true });
  const withHeart = [offer('vitoria'), heart];
  const isHeart = (o: Offer) => o.heartClub;

  it('"amor:<clube>" vale só para a proposta do clube de coração', () => {
    expect(parseProposalChoice('amor:bahia', withHeart, true, isHeart)).toEqual({ kind: 'amor', offer: heart });
    expect(parseProposalChoice('amor:vitoria', withHeart, true, isHeart)).toBeNull();
    expect(parseProposalChoice('amor:bahia', withHeart, true)).toBeNull();
  });

  it('a marca da visão: coração, rival, rival do coração ou nenhuma (coração vence rival)', () => {
    expect(proposalViewOf(offer('a'), 70).marca).toBeNull();
    expect(proposalViewOf(offer('a', { rivalOfCurrent: true }), 70).marca).toBe('rival');
    expect(proposalViewOf(offer('a', { rivalOfHeart: true }), 70).marca).toBe('rivalCoracao');
    expect(proposalViewOf(offer('a', { heartClub: true, rivalOfCurrent: true }), 70).marca).toBe('coracao');
  });
});

// T28e (v2.50): "mandar o empresário negociar" uma das propostas mostradas.
describe('empresário negocia (T28e)', () => {
  it('"negociar:<clube>" vale para qualquer proposta mostrada, e só para elas', () => {
    expect(negotiateChoice('sport')).toBe('negociar:sport');
    expect(parseProposalChoice('negociar:sport', shown, true)).toEqual({ kind: 'negociar', offer: shown[1] });
    expect(parseProposalChoice('negociar:flamengo', shown, true)).toBeNull();
    expect(parseProposalChoice('negociar:', shown, true)).toBeNull();
  });
});

// T28e (v2.50): forçar a saída antes do fim do contrato.
describe('forçar saída (T28e)', () => {
  it('"forcar:<clube>" só vale quando o contrato permite forçar, e para propostas mostradas', () => {
    expect(forceChoice('sport')).toBe('forcar:sport');
    expect(parseProposalChoice('forcar:sport', shown, true, () => false, true)).toEqual({ kind: 'forcar', offer: shown[1] });
    expect(parseProposalChoice('forcar:sport', shown, true, () => false, false)).toBeNull();
    expect(parseProposalChoice('forcar:sport', shown, true)).toBeNull();
    expect(parseProposalChoice('forcar:flamengo', shown, true, () => false, true)).toBeNull();
  });
});
