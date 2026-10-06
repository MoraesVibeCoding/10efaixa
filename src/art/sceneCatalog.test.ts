import { allFiles, filesFor, sceneDef, sceneForEvent } from './sceneCatalog';
import { validateArt } from './validateArt';
import events from '../data/events.json';
import scenes from '../data/scenes.json';
import fmt from './format.json';
import type { ArtFormat } from './validateArt';

const nameOk = (f: string) => validateArt(f, '<svg/>', fmt as ArtFormat).every((i) => i.kind !== 'nome');

describe('catálogo de cenas (T46, SPEC 6.17)', () => {
  it('os 25 cenários têm definição completa, com pose, expressão e detalhes do catálogo', () => {
    expect(scenes.cenas).toHaveLength(25);
    for (const id of scenes.cenas) {
      const d = sceneDef(id);
      expect(scenes.poses).toContain(d.pose);
      if (d.poseGoleiro) expect(scenes.poses).toContain(d.poseGoleiro);
      expect(scenes.expressoes).toContain(d.expressao);
      for (const x of d.detalhes) expect(scenes.detalhes).toContain(x);
      expect(d.companheiros).toBeGreaterThanOrEqual(0);
      expect(d.companheiros).toBeLessThanOrEqual(4);
    }
  });

  it('toda decisão da T25 tem cena, e eventos do mesmo cenário reaproveitam a mesma definição', () => {
    const byCena = new Map<string, object>();
    for (const e of events.eventos) {
      const d = sceneForEvent(e.id);
      expect(d.id).toBe(e.cena);
      expect(byCena.get(e.cena) ?? d).toBe(d);
      byCena.set(e.cena, d);
    }
    expect(events.eventos.length).toBeGreaterThan(byCena.size);
  });

  it('arquivos pedidos seguem o padrão do validador; goleiro usa a pose própria quando existe', () => {
    const f = filesFor(sceneDef('penalti'), false);
    expect(f).toEqual({ cenario: 'cenario__penalti.svg', pose: 'pose__chutando.svg', detalhes: ['detalhe__bola.svg'] });
    expect(filesFor(sceneDef('penalti'), true).pose).toBe('pose__goleiro-mergulhando.svg');
    expect(filesFor(sceneDef('vestiario'), true).pose).toBe(filesFor(sceneDef('vestiario'), false).pose);
    const all = allFiles();
    expect(new Set(all).size).toBe(all.length);
    for (const file of all) expect(nameOk(file)).toBe(true);
    expect(all).toContain('cenario__varzea.svg');
    expect(all.filter((x) => x.startsWith('cenario__'))).toHaveLength(25);
  });

  it('cena desconhecida é erro claro', () => {
    expect(() => sceneDef('nao-existe')).toThrow(/nao-existe/);
  });
});
