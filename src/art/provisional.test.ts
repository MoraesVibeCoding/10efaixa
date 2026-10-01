import { generateProvisional } from './provisional';
import { headFiles } from './avatar';
import { allFiles } from './sceneCatalog';
import { validateArt, type ArtFormat } from './validateArt';
import avatar from '../data/avatar.json';
import creation from '../data/creation.json';
import fmt from './format.json';
import scenes from '../data/scenes.json';

const out = generateProvisional({ scenes, styles: avatar.styles, celebrations: creation.celebrations });
const names = new Map(Object.keys(out).map((p) => [p.split('/').pop()!, p]));

describe('arte provisória (T47)', () => {
  it('toda peça passa no validador da T43', () => {
    const bad = Object.entries(out).flatMap(([path, svg]) => validateArt(path.split('/').pop()!, svg, fmt as ArtFormat).map((i) => `${path}: [${i.kind}] ${i.message}`));
    expect(bad).toEqual([]);
  });

  it('cobre o catálogo de cenas: cenários, poses, detalhes e troféus', () => {
    for (const f of allFiles()) expect(names.has(f), f).toBe(true);
  });

  it('cobre toda combinação de cabeça que o motor do avatar pode pedir', () => {
    const missing = new Set<string>();
    for (const angle of fmt.angles) for (const hairStyle of avatar.styles.hair) for (const age of [20, 40])
      for (const beard of [null, ...avatar.styles.beards]) for (const expression of avatar.styles.expressions)
        for (const f of headFiles({ skin: 't1', hairColor: 'preto', hairStyle, beard, expression, heightCm: 180, build: 'atletico', age, uniform1: '#000000', uniform2: '#000000', boots: '#000000', headband: '#FFFFFF' }, angle))
          if (!names.has(f)) missing.add(f);
    expect([...missing]).toEqual([]);
  });

  it('traz uniformes, comemorações e os extras de goleiro', () => {
    for (const p of ['lisa', 'listras-verticais', 'faixa-diagonal', 'metade', 'gola-contraste']) expect(names.has(`uniforme__${p}.svg`), p).toBe(true);
    for (const c of ['aviaozinho', 'dancinha', 'punho-cerrado', 'coracao-maos', 'cambalhota', 'aponta-ceu', 'beija-alianca', 'chuteira-telefone']) expect(names.has(`comemoracao__${c}.svg`), c).toBe(true);
    for (const p of ['em-pe', 'correndo', 'goleiro-mergulhando', 'sentado', 'erguendo-taca', 'cabisbaixo']) {
      expect(out[names.get(`pose__${p}.svg`)!]).toMatch(/id="luvas"[\s\S]*id="mangas-longas"|id="mangas-longas"[\s\S]*id="luvas"/);
    }
  });

  it('cada cenário tem slots coerentes com o catálogo e é determinístico', () => {
    for (const [id, d] of Object.entries(scenes.definicoes)) {
      const svg = out[names.get(`cenario__${id}.svg`)!]!;
      expect(svg).toContain(`data-pose-sugerida="${d.pose}"`);
      expect(svg.match(/id="slot-companheiro-\d"/g)?.length ?? 0).toBe(d.companheiros);
    }
    expect(generateProvisional({ scenes, styles: avatar.styles, celebrations: creation.celebrations })).toEqual(out);
  });
});
