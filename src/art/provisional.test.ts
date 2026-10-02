import { generateProvisional } from './provisional';
import { headFiles } from './avatar';
import { allFiles } from './sceneCatalog';
import { validateArt, type ArtFormat } from './validateArt';
import avatar from '../data/avatar.json';
import creation from '../data/creation.json';
import fmt from './format.json';
import scenes from '../data/scenes.json';
import emblems from '../data/emblems.json';

const out = generateProvisional({ scenes, styles: avatar.styles, celebrations: creation.celebrations, emblems: Object.keys(emblems.clubes) });
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
    expect(generateProvisional({ scenes, styles: avatar.styles, celebrations: creation.celebrations, emblems: Object.keys(emblems.clubes) })).toEqual(out);
  });

  it('emblemas (T49d): completo e simplificado de cada clube com emblema próprio e do escudo genérico, só com cores-chave do uniforme e paleta, sem texto', () => {
    const ids = [...Object.keys(emblems.clubes), 'generico'];
    expect(ids).toEqual(expect.arrayContaining(['flamengo', 'santos', 'palmeiras', 'coritiba', 'generico']));
    for (const id of ids) {
      for (const v of ['completo', 'simples']) {
        const svg = out[names.get(`emblema__${id}-${v}.svg`) ?? '']!;
        expect(svg, `${id}-${v}`).toBeTruthy();
        expect(svg).toContain('id="emblema"');
        expect(svg).toMatch(/#00FF00/i);
        expect(svg).not.toMatch(/<text/);
      }
    }
  });
});


describe('prompts dos emblemas (T49d)', () => {
  it('todo clube da Série A tem prompt em docs/arte/emblemas, com o que evitar e o aviso de conferir; sem pedir texto ou estrela', async () => {
    const { readFileSync, existsSync } = await import('node:fs');
    const clubs = (await import('../data/clubs.json')).default.clubs.filter((c: { divisao: string | null }) => c.divisao === 'A');
    expect(clubs).toHaveLength(20);
    for (const c of clubs as { id: string }[]) {
      const path = `docs/arte/emblemas/${c.id}/prompt.md`;
      expect(existsSync(path), path).toBe(true);
      const md = readFileSync(path, 'utf8');
      expect(md, c.id).toContain('**Evitar');
      expect(md, c.id).toContain('**Conferir antes de gerar:**');
      expect(md, c.id).toContain('No letters, no numbers, no text, no stars');
    }
  });
});
