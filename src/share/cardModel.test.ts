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
  it('auge: clube, número da camisa nesse clube e os 10 atributos do pico em número', () => {
    expect(m.clubeAuge).toBe(r.peakClubId);
    expect(m.numero).toBe(r.spells.find((s) => s.clubId === r.peakClubId)!.number);
    expect(m.radar.map((a) => a.id)).toEqual([...ATTRIBUTES]);
    for (const a of m.radar) expect(a.valor).toBe(Math.round(r.peakAttributes[a.id]));
    expect(m.overall).toBe(r.peakOverall);
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
    expect(m.numeros.map((n) => n.id)).toEqual(['jogos', 'gols', 'assistencias', 'titulos', 'patrimonio']);
    expect(m.numeros[0]!.valor).toBe(r.stats.games.toLocaleString('pt-BR'));
  });

  it('texto alternativo: o narrativo conta a história; o estatístico lê os números e o radar', () => {
    expect(m.alt.narrativa).toContain(r.player.name);
    expect(m.alt.narrativa).toContain(m.veredito);
    for (const f of m.frases) expect(m.alt.narrativa).toContain(f);
    expect(m.alt.estatistica).toContain(r.player.name);
    for (const a of m.radar) expect(m.alt.estatistica).toContain(`${a.nome} ${a.valor}`);
  });
});
