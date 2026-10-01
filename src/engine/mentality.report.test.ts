import { mkdirSync, writeFileSync } from 'node:fs';
import { archetypesFor } from './archetypes';
import { simulateCareer } from './career';
import { MENTALITIES } from './mentality';
import type { Position } from './overall';
import { createPrng } from './prng';
import { randomInput } from './simulation';
import biotype from '../data/biotype.json';

// Mentalidade (proposta SPEC 6.17): 50 carreiras (10 por posição), cada uma em par com a mesma semente sem mentalidade.
// Roda só com `SIM_MENTALIDADE=1 npx vitest run src/engine/mentality.report.test.ts`.
const ON = !!process.env.SIM_MENTALIDADE;
const POS: Position[] = ['atacante', 'meia', 'zagueiro', 'lateral', 'goleiro'];
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
const f = (x: number, d = 1) => x.toFixed(d).replace('.', ',');

it.skipIf(!ON)('50 carreiras com mentalidade × pares neutros em docs/simulacao-mentalidade.md', { timeout: 120_000 }, () => {
  const rows: { pos: string; m: string; seed: number; a: ReturnType<typeof simulateCareer>; b: ReturnType<typeof simulateCareer> }[] = [];
  POS.forEach((pos, pi) => {
    const range = biotype.heightRangesCm[pos];
    for (let i = 0; i < 10; i++) {
      const seed = 5000 + pi * 100 + i;
      const archs = archetypesFor(pos);
      const base = {
        ...randomInput(createPrng(seed)), position: pos, archetypeId: archs[i % archs.length]!.id,
        biotype: { heightCm: Math.round((range.min + range.max) / 2), build: 'atletico' as const }, temperament: 'frio',
      };
      const m = MENTALITIES[(i + pi) % 4]!;
      rows.push({ pos, m, seed, a: simulateCareer({ ...base, mentality: m }, seed), b: simulateCareer(base, seed) });
    }
  });

  const line = (r: (typeof rows)[number]) =>
    `| ${r.pos} | ${r.m} | ${r.b.peakOverall} → ${r.a.peakOverall} | ${r.b.peakAge} → ${r.a.peakAge} | ${r.b.endAge} → ${r.a.endAge} | ${r.b.legacy.score} → ${r.a.legacy.score} | ${r.a.legacy.verdict} |`;
  const agg = (rs: typeof rows) => ({
    n: rs.length, dPico: mean(rs.map((r) => r.a.peakOverall - r.b.peakOverall)), dIdadePico: mean(rs.map((r) => r.a.peakAge - r.b.peakAge)),
    dFim: mean(rs.map((r) => r.a.endAge - r.b.endAge)), dNota: mean(rs.map((r) => r.a.legacy.score - r.b.legacy.score)),
    pico: mean(rs.map((r) => r.a.peakOverall)),
  });
  const table = (title: string, keys: string[], pick: (r: (typeof rows)[number]) => string) =>
    `### ${title}\n| Grupo | Carreiras | Δ pico | Δ idade do pico | Δ idade final | Δ nota de legado |\n| --- | --: | --: | --: | --: | --: |\n`
    + keys.map((k) => { const g = agg(rows.filter((r) => pick(r) === k)); return `| ${k} | ${g.n} | ${f(g.dPico)} | ${f(g.dIdadePico)} | ${f(g.dFim)} | ${f(g.dNota)} |`; }).join('\n');

  const all = agg(rows);
  const md = [
    '# Simulação — mentalidade (proposta SPEC 6.17)',
    '',
    '50 carreiras: 10 por posição (atacante, meia, zagueiro, lateral, goleiro), mentalidades alternadas (cada posição usa as 4, duas delas 3 vezes). Temperamento Frio em todas, altura média da posição, compleição atlética. Cada carreira roda **duas vezes com a mesma semente**: neutra → com mentalidade. Δ = com − sem.',
    '',
    `**Todas:** Δ pico ${f(all.dPico)} · Δ idade do pico ${f(all.dIdadePico)} · Δ idade final ${f(all.dFim)} · Δ nota de legado ${f(all.dNota)}. Amostra pequena: as diferenças por grupo são indicativas, não calibração (a mesma semente diverge nos sorteios depois da primeira decisão).`,
    '',
    table('Por mentalidade', [...MENTALITIES], (r) => r.m),
    '',
    table('Por posição', POS, (r) => r.pos),
    '',
    '### As 50 carreiras (neutra → com mentalidade)',
    '| Posição | Mentalidade | Pico | Idade do pico | Idade final | Nota de legado | Veredito |',
    '| --- | --- | --: | --: | --: | --: | --- |',
    ...rows.map(line),
    '',
  ].join('\n');
  mkdirSync('docs', { recursive: true });
  writeFileSync('docs/simulacao-mentalidade.md', md);
  expect(rows).toHaveLength(50);
});
