import { composeScene, mateSpecs } from './scene';
import { createPrng } from '../engine/prng';
import type { AvatarSpec } from './avatar';
import cfg from '../data/avatar.json';
import fmt from './format.json';
import scenes from '../data/scenes.json';
import txt from '../i18n/pt-BR/scenes.json';

const K = fmt.keyColors;
const player: AvatarSpec = {
  skin: 't3', hairColor: 'preto', hairStyle: 'curto', beard: null, expression: 'neutra', heightCm: 180, build: 'atletico', age: 20,
  uniform1: '#000001', uniform2: '#000002', boots: '#14213D', headband: null,
};
const slot = (id: string, x: number, y: number, extra = '') => `<g id="${id}" data-escala="1" ${extra}><rect x="${x}" y="${y}" width="100" height="400" fill="none"/></g>`;
const scenario = `<svg viewBox="0 0 1000 600"><g id="fundo"><rect fill="${K.uniforme1}" width="1000" height="600"/></g><g id="meio"/>`
  + `${slot('slot-jogador', 400, 100, 'data-pose-sugerida="correndo"')}${slot('slot-companheiro-1', 100, 120)}${slot('slot-companheiro-2', 700, 120)}<g id="frente"><path id="marca"/></g></svg>`;
const pose = `<svg viewBox="0 0 400 800"><g id="tronco"><path fill="${K.uniforme1}"/></g><g id="cabeca-ancora" data-angulo="frente"><rect x="150" y="40" width="100" height="120" fill="none"/></g></svg>`;
const base = { sceneId: 'gol', scenario, player, poses: { correndo: pose, 'em-pe': pose }, parts: {}, club: { nome: 'Esporte Clube Modelo', cores: ['#AA0000', '#00AA00'] as [string, string] } };

describe('compositor de cenas (T45, SPEC 6.17)', () => {
  it('encaixa o avatar no slot (pés na base, centrado) e os companheiros nos outros slots, antes da camada frente', () => {
    const { svg } = composeScene({ ...base, mates: 2, rng: createPrng(1) });
    expect(svg).toMatch(/<svg x="350" y="100" width="200" height="400" viewBox="0 0 400 800"/);
    expect(svg.match(/viewBox="0 0 400 800"/g)).toHaveLength(3);
    expect(svg.lastIndexOf('viewBox="0 0 400 800"')).toBeLessThan(svg.indexOf('id="frente"'));
  });

  it('companheiros nunca passam do número de slots, e o uniforme de todos usa as cores do clube', () => {
    const { svg } = composeScene({ ...base, mates: 4, rng: createPrng(1) });
    expect(svg.match(/viewBox="0 0 400 800"/g)).toHaveLength(3);
    expect(svg).toContain('#AA0000');
    expect(svg).not.toContain('#000001');
    expect(svg).not.toContain(K.uniforme1);
  });

  it('companheiros: mesma semente, mesmo resultado; aparência sorteada dentro dos catálogos', () => {
    expect(mateSpecs(4, base.club, createPrng(5))).toEqual(mateSpecs(4, base.club, createPrng(5)));
    expect(mateSpecs(4, base.club, createPrng(5))).not.toEqual(mateSpecs(4, base.club, createPrng(6)));
    for (const m of mateSpecs(20, base.club, createPrng(2))) {
      expect(cfg.skinTones.map((t) => t.id)).toContain(m.skin);
      expect(cfg.styles.hair).toContain(m.hairStyle);
      expect(m.uniform1).toBe('#AA0000');
      expect(m.heightCm).toBeGreaterThanOrEqual(cfg.mates.heightCm[0]!);
    }
  });

  it('detalhes entram na posição pedida', () => {
    const { svg } = composeScene({ ...base, mates: 0, rng: createPrng(1), details: [{ svg: '<svg viewBox="0 0 50 50"><g id="detalhe"/></svg>', x: 10, y: 20, width: 80 }] });
    expect(svg).toMatch(/<svg x="10" y="20" width="80"[^>]*viewBox="0 0 50 50"/);
  });

  it('texto alternativo: toda cena do catálogo tem texto e o resultado cita jogador e clube sem placeholder', () => {
    for (const id of scenes.cenas) expect((txt.alt as Record<string, string>)[id]).toBeTruthy();
    for (const id of scenes.cenas) {
      const { alt } = composeScene({ ...base, sceneId: id, mates: 2, rng: createPrng(1), playerName: 'Pedrinho' });
      expect(alt).toContain('Pedrinho');
      expect(alt).not.toMatch(/[{}]/);
    }
    expect(composeScene({ ...base, mates: 2, rng: createPrng(1), playerName: 'Pedrinho' }).alt).toContain(base.club.nome);
  });
});
