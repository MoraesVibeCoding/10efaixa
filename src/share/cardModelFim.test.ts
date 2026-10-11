import { simulateCareer } from '../engine/career';
import { createPrng } from '../engine/prng';
import { randomInput } from '../engine/simulation';
import { t } from '../i18n';
import { clubName } from '../ui/screens/clubText';
import { cardModel } from './cardModel';

// v2.81 (direção "Álbum", PR 4): o card de fim de carreira (frente e verso) lê do modelo do cartão o auge com a idade, as
// metas do jogo respondidas (a 10 e a faixa da Seleção), o arco da origem à despedida, o sonho do clube de coração, a
// estante de troféus e a linha da Seleção.
const r = simulateCareer(randomInput(createPrng(3)), 3);
const m = cardModel(r, 'X');

describe('modelo do card de fim de carreira (v2.81)', () => {
  it('auge com a idade e as metas do jogo', () => {
    expect(m.auge).toEqual({ overall: r.peakOverall, idade: Math.floor(r.peakAge) });
    expect(m.metas).toEqual({ dez: r.selection.ten > 0, faixa: r.selection.captain > 0 });
  });

  it('o arco vai da origem à despedida no último clube', () => {
    const ultimo = clubName(r.spells.at(-1)!.clubId);
    expect(m.arco).toBe(t(`ui.fim.arco.${r.player.origin}`, { prep: ultimo.prep, clube: ultimo.nome }));
  });

  it('o sonho: realizado se jogou no clube de coração; sem clube de coração, nada', () => {
    const heart = 'bahia';
    const com = cardModel({ ...r, player: { ...r.player, heartClub: heart }, spells: [...r.spells, { ...r.spells.at(-1)!, clubId: heart }] }, 'X');
    expect(com.sonho).toEqual({ clubId: heart, realizado: true });
    const sem = cardModel({ ...r, player: { ...r.player, heartClub: heart }, spells: r.spells.filter((s) => s.clubId !== heart) }, 'X');
    expect(sem.sonho).toEqual({ clubId: heart, realizado: false });
    expect(cardModel({ ...r, player: { ...r.player, heartClub: null } }, 'X').sonho).toBeNull();
  });

  it('a estante: um troféu por competição, com quantas vezes', () => {
    const total = m.tacas.reduce((a, x) => a + x.n, 0);
    expect(total).toBe(r.titles.length);
    expect(new Set(m.tacas.map((x) => x.id)).size).toBe(m.tacas.length);
  });

  it('a Seleção numa linha (jogos, gols e Copas), só para quem jogou por ela', () => {
    const copas = new Set(r.selection.tournaments.filter((x) => x.tournament === 'copaDoMundo').map((x) => x.year)).size;
    const esperado = r.selection.games > 0 ? t('ui.fim.selecaoLinha', { jogos: r.selection.games, gols: r.selection.goals, copas }) : null;
    expect(m.selecaoLinha).toBe(esperado);
  });
});
