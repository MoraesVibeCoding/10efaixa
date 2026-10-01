import { writeFileSync, mkdirSync } from 'node:fs';
import { POSITIONS } from './overall';
import { runMass } from './simulation';

// Relatório ⛳ da T13. Roda só com `npm run sim` (SIM=1); pulado na suíte normal.
const N = 10_000;

it.skipIf(!process.env.SIM)(`gera o relatório de ${N} carreiras em docs/simulacao-T13.md`, () => {
  const r = runMass(N, 2026);
  const row = (cells: (string | number)[]) => `| ${cells.join(' | ')} |`;
  const lines = [
    `# Relatório de simulação — T13`,
    ``,
    `${r.careers} carreiras (16→35 anos, reunião automática pelo arquétipo, contexto sorteado; sem clubes ainda). Semente 2026.`,
    `Tempo médio por carreira: **${r.msPerCareer} ms** (meta < 50 ms).`,
    ``,
    `## Por origem`,
    row(['Origem', 'n', 'Overall inicial', 'Teto médio', 'Auge médio', 'p10', 'p50', 'p90', 'Máx', 'Idade do auge', '% ≥75', '% ≥85']),
    row(['---', '--:', '--:', '--:', '--:', '--:', '--:', '--:', '--:', '--:', '--:', '--:']),
    ...Object.entries(r.byOrigin).map(([o, v]) => row([o, v.n, v.startOverall, v.potential, v.peakOverall, v.p10, v.p50, v.p90, v.max, v.peakAge, v.excelente, v.lendario])),
    ``,
    `Diamante bruto na várzea: **${(r.diamondRateVarzea * 100).toFixed(2)}%** (meta 2–4%).`,
    ``,
    `## Auge por faixa (meta 9.3: 5% · 10% · 60% · 25%)`,
    row(['Grupo', '95+', '90–94', '85–89', '80–84', 'Ganho em fundamentos e físico']),
    row(['---', '--:', '--:', '--:', '--:', '--:']),
    row(['todas', ...r.peakTiers.all.map((x) => `${x}%`), '—']),
    ...Object.entries(r.peakTiers.byOrigin).map(([o, t]) => row([o, ...t.map((x) => `${x}%`), `+${r.growth[o]!.fundamentosFisico}`])),
    ``,
    `## Por posição`,
    row(['Posição', 'n', 'Auge médio']),
    row(['---', '--:', '--:']),
    ...POSITIONS.map((p) => row([p, r.byPosition[p].n, r.byPosition[p].peakOverall])),
    ``,
    `## Efeito da altura (terços da faixa da posição; valores no auge)`,
    row(['Posição', 'Altura', 'n', 'Overall', 'Jogo aéreo', 'Drible', 'Velocidade']),
    row(['---', '---', '--:', '--:', '--:', '--:', '--:']),
    ...POSITIONS.flatMap((p) => (['baixo', 'medio', 'alto'] as const).map((b) => {
      const h = r.height[p][b];
      return row([p, b, h.n, h.overall, h.jogoAereo, h.drible, h.velocidade]);
    })),
    ``,
  ];
  mkdirSync('docs', { recursive: true });
  writeFileSync('docs/simulacao-T13.md', lines.join('\n'));
  expect(r.careers).toBe(N);
}, 300_000);
