import { simulateCareer } from '../engine/career';
import { createPrng } from '../engine/prng';
import { randomInput } from '../engine/simulation';
import { ATTRIBUTES } from '../engine/attributes';
import { t } from '../i18n';
import { cardModel } from './cardModel';

// T55c (SPEC 6.15): o que as duas versões do cartão desenham, já em texto, e o texto alternativo de cada uma.
const r = simulateCareer(randomInput(createPrng(3)), 3);
const m = cardModel(r, '10F-7K3Q-9M2X');

describe('modelo do cartão final (T55c)', () => {
  it('auge: clube e os 10 atributos do pico em número', () => {
    expect(m.clubeAuge).toBe(r.peakClubId);
    expect(m.radar.map((a) => a.id)).toEqual([...ATTRIBUTES]);
    for (const a of m.radar) expect(a.valor).toBe(Math.round(r.peakAttributes[a.id]));
    expect(m.overall).toBe(r.peakOverall);
  });

  it('a figurinha veste o último clube profissional: clube e número da camisa nele (v2.62)', () => {
    const last = r.seasons.filter((x) => x.division !== null).at(-1)!.clubId;
    expect(m.clubeFigurinha).toBe(last);
    expect(m.numero).toBe(r.spells.filter((x) => x.clubId === last).at(-1)!.number);
  });

  it('ídolos: os clubes com idolatria de ídolo, o clube de coração primeiro e marcado (v2.62)', () => {
    const base = { ...r, idolatry: { santos: 90, flamengo: 20, bahia: 80, vasco: 76 }, player: { ...r.player, heartClub: 'bahia' } };
    const x = cardModel(base, 'X');
    expect(x.idolos.map((i) => i.clubId)).toEqual(['bahia', 'santos', 'vasco']);
    expect(x.idolos.map((i) => i.coracao)).toEqual([true, false, false]);
    expect(x.alt.narrativa).toContain(t('ui.cartao.idoloCoracao', { clube: 'Bahia' }));
    const sem = cardModel({ ...r, idolatry: { santos: 74 } }, 'X');
    expect(sem.idolos).toEqual([]);
  });

  it('veredito, rótulo principal, até 3 honrarias, até 4 frases e o código', () => {
    expect(m.veredito).toBe(t(`legacy.veredito.${r.legacy.verdict}`));
    expect(m.rotulo).toBe(t(`legacy.rotulo.${r.legacy.labels[0]!.id}`));
    expect(m.honrarias.length).toBeLessThanOrEqual(3);
    expect(m.frases.length).toBeGreaterThan(0);
    expect(m.frases.length).toBeLessThanOrEqual(4);
    expect(m.codigo).toBe('10F-7K3Q-9M2X');
  });

  it('números da carreira: jogos, gols, assistências, títulos e patrimônio', () => {
    const semSelecao = cardModel({ ...r, selection: { ...r.selection, games: 0, goals: 0 } }, 'X');
    expect(semSelecao.numeros.map((n) => n.id)).toEqual(['jogos', 'gols', 'assistencias', 'titulos', 'patrimonio']);
    expect(semSelecao.numeros[0]!.valor).toBe(r.stats.games.toLocaleString('pt-BR'));
  });

  it('v2.65: com jogos pela Seleção (base inclusive), entram jogos e gols por ela', () => {
    const x = cardModel({ ...r, selection: { ...r.selection, games: 52, goals: 18 } }, 'X');
    expect(x.numeros.map((n) => n.id)).toEqual(['jogos', 'gols', 'assistencias', 'titulos', 'selecao', 'patrimonio']);
    expect(x.numeros.find((n) => n.id === 'selecao')!.valor).toBe(t('ui.cartao.selecaoValor', { jogos: 52, gols: 18 }));
  });

  it('texto alternativo: o narrativo conta a história; o estatístico lê os números e o radar', () => {
    expect(m.alt.narrativa).toContain(r.player.name);
    expect(m.alt.narrativa).toContain(m.veredito);
    for (const f of m.frases) expect(m.alt.narrativa).toContain(f);
    expect(m.alt.estatistica).toContain(r.player.name);
    for (const a of m.radar) expect(m.alt.estatistica).toContain(`${a.nome} ${a.valor}`);
  });
});

// Revisão das telas: no cartão do goleiro, jogos sem sofrer gol no lugar de gols e assistências.
describe('cartão do goleiro', () => {
  it('números com jogos sem sofrer gol, sem gols e assistências', () => {
    const r = simulateCareer(randomInput(createPrng(7)), 7);
    const ids = cardModel(r, 'X').numeros.map((n) => n.id);
    expect(ids).toContain('semSofrerGol');
    expect(ids).not.toContain('gols');
    expect(ids).not.toContain('assistencias');
    expect(cardModel(r, 'X').numeros.find((n) => n.id === 'semSofrerGol')!.valor).toBe(r.stats.cleanSheets.toLocaleString('pt-BR'));
  });
});
