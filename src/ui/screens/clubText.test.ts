import { CLUBS } from '../../engine/clubs';
import { MARKET_CLUB_IDS } from '../../engine/market';
import { clubName } from './clubText';

// T51b: a carreira passa por clubes de fora; sem nome, a figurinha dizia "Meia do" e o resumo listava linhas vazias.
describe('clubName', () => {
  it('todo clube que o mercado pode oferecer tem nome e sigla', () => {
    expect(MARKET_CLUB_IDS.length).toBeGreaterThan(CLUBS.length);
    for (const id of MARKET_CLUB_IDS) {
      const { nome, sigla } = clubName(id);
      expect(nome, id).not.toBe('');
      expect(sigla, id).not.toBe('');
    }
  });

  it('brasileiro mantém a preposição do artigo; os de fora usam "do"', () => {
    const portuguesa = CLUBS.find((c) => c.artigo === 'a')!;
    expect(clubName(portuguesa.id).prep).toBe('da');
    expect(clubName('boca-juniors')).toMatchObject({ nome: 'Boca Juniors', prep: 'do' });
  });
});
