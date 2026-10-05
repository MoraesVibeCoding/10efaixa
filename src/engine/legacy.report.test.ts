import { mkdirSync, writeFileSync } from 'node:fs';
import { simulateCareer, type CareerResult } from './career';
import { LABELS, RESERVE_LABELS, VERDICTS, legacyFacts } from './legacy';
import { POSITIONS } from './overall';
import { createPrng } from './prng';
import { randomInput } from './simulation';

// Sanidade 9.3 (T40): N carreiras por origem × posição. Roda só com `npm run sim:legado` (SIM_LEGADO=N; a SPEC pede 10 mil).
const N = Number(process.env.SIM_LEGADO) || 0;
const ORIGINS = ['baseGrande', 'peneira', 'varzea'];
type R = CareerResult & { origin: string; position: string };

it.skipIf(!N)(`sanidade 9.3: ${N} carreiras por origem × posição em docs/simulacao-legado.md`, () => {
  const cells = new Map<string, number>();
  const rs: R[] = [];
  let ms = 0;
  for (let seed = 100_000; rs.length < N * ORIGINS.length * POSITIONS.length; seed++) {
    const input = randomInput(createPrng(seed));
    const key = `${input.origin}|${input.position}`;
    if ((cells.get(key) ?? 0) >= N) continue;
    cells.set(key, (cells.get(key) ?? 0) + 1);
    const t0 = performance.now();
    rs.push({ ...simulateCareer(input, seed), origin: input.origin, position: input.position });
    ms += performance.now() - t0;
  }
  const pctN = (xs: boolean[]) => (100 * xs.filter(Boolean).length) / (xs.length || 1);
  const pct = (xs: boolean[]) => `${pctN(xs).toFixed(1)}%`;
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
  const row = (c: (string | number)[]) => `| ${c.join(' | ')} |`;
  const head = (c: string[]) => [row(c), row(['---', ...c.slice(1).map(() => '--:')])];
  const ok = (b: boolean) => (b ? '✅' : '❌');
  const by = (k: 'origin' | 'position', v: string) => rs.filter((r) => r[k] === v);
  const TIERS: [number, number, number][] = [[95, 99, 5], [90, 94, 10], [85, 89, 60], [80, 84, 25]];
  const tiers = (g: R[]) => TIERS.map(([lo, hi]) => pctN(g.map((r) => r.peakOverall >= lo && r.peakOverall <= hi)));
  const tiersOk = (g: R[]) => tiers(g).every((v, i) => Math.abs(v - TIERS[i]![2]) <= 2);
  const legend = (g: R[]) => pctN(g.map((r) => ['lendaDoFutebolBrasileiro', 'lendaMundial'].includes(r.legacy.verdict)));
  const world = pctN(rs.map((r) => r.legacy.verdict === 'lendaMundial'));
  const seen = VERDICTS.filter((v) => rs.some((r) => r.legacy.verdict === v));
  const varzea = by('origin', 'varzea');
  const diamond = pctN(varzea.map((r) => r.player.isDiamond));
  const ages = ORIGINS.map((o) => mean(by('origin', o).map((r) => r.endAge)));
  const legends = POSITIONS.map((p) => legend(by('position', p)));
  const perCareer = ms / rs.length;
  const biggest = Math.max(...VERDICTS.map((v) => pctN(rs.map((r) => r.legacy.verdict === v))));

  const lines = [
    '# Sanidade da simulação — SPEC 9.3 (T40)', '',
    `${rs.length} carreiras: ${N} por origem × posição (a SPEC pede 10 mil por célula; rode \`SIM_LEGADO=10000 npm run sim:legado\` para a amostra cheia). Ritmo Rápido, decisões automáticas.`, '',
    '## Critérios',
    ...head(['Critério', 'Medido', 'Meta', 'Ok']),
    row(['"Lenda mundial"', `${world.toFixed(2)}%`, '≤ 1%', ok(world <= 1)]),
    row(['Faixas de veredito que aparecem', `${seen.length} de 8`, '8', ok(seen.length === 8)]),
    row(['Maior faixa de veredito', `${biggest.toFixed(1)}%`, '≤ 35%', ok(biggest <= 35)]),
    row(['Auge, todas as origens', tiers(rs).map((v) => v.toFixed(1)).join(' · '), '5 · 10 · 60 · 25 (±2)', ok(tiersOk(rs))]),
    ...ORIGINS.map((o) => row([`Auge, ${o}`, tiers(by('origin', o)).map((v) => v.toFixed(1)).join(' · '), '5 · 10 · 60 · 25 (±2)', ok(tiersOk(by('origin', o)))])),
    row(['Diamante bruto (várzea)', `${diamond.toFixed(1)}%`, '2% a 4%', ok(diamond >= 2 && diamond <= 4)]),
    row(['Idade média de aposentadoria por origem', ages.map((a) => a.toFixed(1)).join(' · '), '30 a 39', ok(ages.every((a) => a >= 30 && a <= 39))]),
    row(['"Lenda do futebol brasileiro" ou mais, por posição', legends.map((v) => v.toFixed(1)).join(' · '), 'comparável (menor ≥ metade da maior)', ok(Math.min(...legends) >= Math.max(...legends) / 2)]),
    row(['Tempo por carreira', `${perCareer.toFixed(1)} ms`, '< 50 ms', ok(perCareer < 50)]),
    '', 'Altura (efeito mensurável e equilibrado): medida no relatório da T13, `docs/simulacao-T13.md`.', '',
    '## Veredito (% das carreiras)',
    ...head(['Grupo', ...VERDICTS, 'Nota média']),
    ...[['todas', rs] as [string, R[]], ...ORIGINS.map((o) => [o, by('origin', o)] as [string, R[]]), ...POSITIONS.map((p) => [p, by('position', p)] as [string, R[]])]
      .map(([g, x]) => row([g, ...VERDICTS.map((v) => pct(x.map((r) => r.legacy.verdict === v))), mean(x.map((r) => r.legacy.score)).toFixed(1)])), '',
    '## Componentes da nota (média, 0–1) por posição',
    ...head(['Posição', 'selecao', 'titulos', 'premios', 'numeros', 'idolatria', 'longevidade']),
    ...POSITIONS.map((p) => row([p, ...(['selecao', 'titulos', 'premios', 'numeros', 'idolatria', 'longevidade'] as const).map((c) => mean(by('position', p).map((r) => r.legacy.components[c])).toFixed(2))])), '',
    '## Rótulos (% das carreiras; "principal" = o que vai no cartão)',
    ...head(['Rótulo', 'Tem', 'Principal']),
    ...[...LABELS, ...RESERVE_LABELS].map((l) => row([l, pct(rs.map((r) => r.legacy.labels.some((x) => x.id === l))), pct(rs.map((r) => r.legacy.labels[0]?.id === l))])),
    '',
    '## Diagnóstico: do teto ao auge',
    ...head(['Grupo', 'Teto (potencial)', 'Auge', 'Teto − auge', 'Idade do auge', 'Minutos 16–24', 'Minutos na carreira', 'Convocado para a principal', 'Prêmios (média)', 'Títulos (média)']),
    ...[...ORIGINS.map((o) => [o, by('origin', o)] as [string, R[]]), ...POSITIONS.map((p) => [p, by('position', p)] as [string, R[]])].map(([g, x]) => row([g,
      mean(x.map((r) => r.player.potential)).toFixed(1), mean(x.map((r) => r.peakOverall)).toFixed(1), mean(x.map((r) => r.player.potential - r.peakOverall)).toFixed(1),
      mean(x.map((r) => r.peakAge)).toFixed(1), mean(x.map((r) => mean(r.seasons.slice(0, 9).map((s) => s.minutes)))).toFixed(2), mean(x.map((r) => mean(r.seasons.map((s) => s.minutes)))).toFixed(2),
      pct(x.map((r) => r.selection.caps > 0)), mean(x.map((r) => r.awards.length)).toFixed(1), mean(x.map((r) => r.titles.length)).toFixed(1)])), '',
    '## Distribuição (percentis) — base para calibrar tetos e cortes',
    ...head(['Medida', 'p10', 'p25', 'p50', 'p75', 'p90', 'p99']),
    ...([['Nota de legado', (r: R) => r.legacy.score], ['Idolatria máxima', (r: R) => Number(legacyFacts(r).idolatriaMax)], ['Jogos', (r: R) => r.stats.games],
      ['Temporadas na elite', (r: R) => Number(legacyFacts(r).temporadasElite)], ['Títulos', (r: R) => r.titles.length], ['Prêmios', (r: R) => r.awards.length],
      ['Convocações (principal)', (r: R) => r.selection.caps], ['Clubes', (r: R) => Number(legacyFacts(r).clubes)]] as [string, (r: R) => number][])
      .map(([name, fn]) => { const xs = rs.map(fn).sort((a, b) => a - b); return row([name, ...[0.1, 0.25, 0.5, 0.75, 0.9, 0.99].map((q) => xs[Math.floor(q * (xs.length - 1))]!.toFixed(0))]); }), '',
    '## Outros números',
    ...head(['Origem', 'Auge <80', 'Camisa 10 no clube', 'Capitão no clube', 'Patrimônio mediano (R$ mi)', 'Títulos (média)', 'Convocado para a principal']),
    ...ORIGINS.map((o) => { const x = by('origin', o); return row([o, pct(x.map((r) => r.peakOverall < 80)), pct(x.map((r) => r.wearsTen)), pct(x.map((r) => r.captain)),
      (x.map((r) => r.wealthBRL).sort((a, b) => a - b)[Math.floor(x.length / 2)]! / 1e6).toFixed(1), mean(x.map((r) => r.titles.length)).toFixed(1), pct(x.map((r) => r.selection.caps > 0))]); }), '',
  ];
  mkdirSync('docs', { recursive: true });
  writeFileSync('docs/simulacao-legado.md', lines.join('\n'));
  expect(rs.length).toBe(N * ORIGINS.length * POSITIONS.length);
}, 3_600_000);
