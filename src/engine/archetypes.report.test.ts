import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { ARCHETYPES, archetypesFor } from './archetypes';
import { simulateCareer } from './career';
import { POSITIONS, type Position } from './overall';
import { createPrng } from './prng';
import { randomInput } from './simulation';

// v2.48: equilíbrio dos estilos. Os 3 estilos de cada posição jogam as MESMAS carreiras (mesmas sementes e criação,
// só o estilo muda), então a diferença é do estilo. Roda só com `npm run sim:estilos` (SIM_ESTILOS=N por estilo).
// SIM_POS limita a uma posição; SIM_DIST (arquivo JSON {id: distribuição}) testa números novos sem editar os dados;
// SIM_OUT grava o resultado em JSON (calibração em paralelo).
const N = Number(process.env.SIM_ESTILOS) || 0;
const ONLY = process.env.SIM_POS as Position | undefined;
const LEGEND = ['lendaDoFutebolBrasileiro', 'lendaMundial'];

export interface StyleRow { position: Position; id: string; n: number; legend: number; score: number; peak: number; goals: number; assists: number }

it.skipIf(!N)(`equilíbrio dos estilos: ${N} carreiras por estilo em docs/simulacao-estilos.md`, () => {
  if (process.env.SIM_DIST) {
    const dist = JSON.parse(readFileSync(process.env.SIM_DIST, 'utf8')) as Record<string, Record<string, number>>;
    for (const a of ARCHETYPES) if (dist[a.id]) Object.assign(a.distribution, dist[a.id]);
  }
  const rows: StyleRow[] = [];
  for (const position of ONLY ? [ONLY] : POSITIONS) {
    const seeds: number[] = [];
    for (let seed = 700_000; seeds.length < N; seed++) if (randomInput(createPrng(seed)).position === position) seeds.push(seed);
    for (const arch of archetypesFor(position)) {
      const row: StyleRow = { position, id: arch.id, n: 0, legend: 0, score: 0, peak: 0, goals: 0, assists: 0 };
      for (const seed of seeds) {
        const r = simulateCareer({ ...randomInput(createPrng(seed)), archetypeId: arch.id }, seed);
        row.n++; row.score += r.legacy.score; row.peak += r.peakOverall; row.goals += r.stats.goals; row.assists += r.stats.assists;
        if (LEGEND.includes(r.legacy.verdict)) row.legend++;
      }
      rows.push(row);
    }
  }
  if (process.env.SIM_OUT) writeFileSync(process.env.SIM_OUT, JSON.stringify(rows));
  if (ONLY) return;
  const pct = (r: StyleRow) => (100 * r.legend) / r.n;
  const lines = [
    '# Equilíbrio dos estilos — SPEC 6.2 (v2.48)', '',
    `${N} carreiras por estilo; os 3 estilos de cada posição jogam as mesmas carreiras (mesma semente e criação). Ritmo Rápido, decisões automáticas. Critério: em cada posição, a chance de "Lenda" do menor ≥ metade da do maior.`, '',
    '| Posição | Estilo | "Lenda" ou mais | Nota média | Auge médio | Gols | Assistências |', '|---|---|--:|--:|--:|--:|--:|',
    ...rows.map((r) => `| ${r.position} | ${r.id} | ${pct(r).toFixed(1)}% | ${(r.score / r.n).toFixed(1)} | ${(r.peak / r.n).toFixed(1)} | ${Math.round(r.goals / r.n)} | ${Math.round(r.assists / r.n)} |`), '',
    '## Critério por posição', '', '| Posição | Menor | Maior | Ok |', '|---|--:|--:|---|',
    ...POSITIONS.map((p) => {
      const xs = rows.filter((r) => r.position === p).map(pct);
      const lo = Math.min(...xs), hi = Math.max(...xs);
      return `| ${p} | ${lo.toFixed(1)}% | ${hi.toFixed(1)}% | ${lo >= hi / 2 ? '✅' : '❌'} |`;
    }), '',
  ];
  mkdirSync('docs', { recursive: true });
  writeFileSync('docs/simulacao-estilos.md', lines.join('\n'));
}, 3_600_000);
