import { writeFileSync, mkdirSync } from 'node:fs';
import { simulateCareer, type CareerResult } from './career';
import { AWARDS } from './awards';
import { createPrng } from './prng';
import { randomInput } from './simulation';

// Relatório da carreira integrada (T24b). Roda só com `npm run sim:carreira` (SIM_CARREIRA=1).
const N = 300;
const EURO = ['ENG', 'ESP', 'ITA', 'GER', 'FRA', 'POR', 'OUTROS'];
const OFF = ['SAU', 'USA', 'JPN', 'QAT', 'CHN'];

it.skipIf(!process.env.SIM_CARREIRA)(`gera o relatório de ${N} carreiras integradas em docs/simulacao-carreira.md`, () => {
  const t0 = performance.now();
  const rs: (CareerResult & { origin: string })[] = [];
  for (let i = 0; i < N; i++) {
    const input = randomInput(createPrng(50_000 + i));
    rs.push({ ...simulateCareer(input, 50_000 + i), origin: input.origin });
  }
  const ms = (performance.now() - t0) / N;
  const mean = (xs: number[]) => (xs.reduce((a, b) => a + b, 0) / (xs.length || 1));
  const pct = (xs: boolean[]) => `${((100 * xs.filter(Boolean).length) / (xs.length || 1)).toFixed(1)}%`;
  const tiers = (g: CareerResult[]) => [[95, 99], [90, 94], [85, 89], [80, 84], [0, 79]].map(([lo, hi]) => pct(g.map((r) => r.peakOverall >= lo! && r.peakOverall <= hi!)));
  const row = (c: (string | number)[]) => `| ${c.join(' | ')} |`;
  const groups: [string, typeof rs][] = [['todas', rs], ...['baseGrande', 'peneira', 'varzea'].map((o) => [o, rs.filter((r) => r.origin === o)] as [string, typeof rs])];
  const comps = ['serieA', 'serieB', 'estadual', 'copaDoBrasil', 'libertadores', 'sulAmericana', 'ligaNacional', 'copaNacional', 'champions', 'europaLeague'];
  const lines = [
    '# Relatório da carreira integrada — Marcos 3 e 4', '',
    `${N} carreiras completas (dos 16 anos à aposentadoria, Marcos 3 e 4). Tempo médio: **${ms.toFixed(1)} ms/carreira** (meta < 50 ms).`, '',
    '## Auge por faixa (meta 9.3: 5% · 10% · 60% · 25% · 0%)',
    row(['Grupo', 'n', '95+', '90–94', '85–89', '80–84', '<80']), row(['---', '--:', '--:', '--:', '--:', '--:', '--:']),
    ...groups.map(([g, x]) => row([g, x.length, ...tiers(x)])), '',
    '## Trajetória',
    row(['Grupo', 'Clubes (média)', 'Empréstimos', 'Temporadas na Série A', 'Temporadas na Europa', 'Fora do eixo', 'Camisa 10', 'Capitão', 'Patrimônio (R$ mi, mediana)']), row(['---', '--:', '--:', '--:', '--:', '--:', '--:', '--:', '--:']),
    ...groups.map(([g, x]) => row([g, mean(x.map((r) => new Set(r.spells.map((s) => s.clubId)).size)).toFixed(1),
      mean(x.map((r) => r.spells.filter((s) => s.loan).length)).toFixed(1),
      `${((100 * mean(x.map((r) => r.seasons.filter((s) => s.division === 'BRA-A').length / r.seasons.length)))).toFixed(0)}%`,
      `${((100 * mean(x.map((r) => r.seasons.filter((s) => EURO.includes(s.division ?? '')).length / r.seasons.length)))).toFixed(0)}%`,
      pct(x.map((r) => r.seasons.some((s) => OFF.includes(s.division ?? '')))),
      pct(x.map((r) => r.wearsTen)), pct(x.map((r) => r.captain)),
      (x.map((r) => r.wealthBRL).sort((a, b) => a - b)[Math.floor(x.length / 2)]! / 1e6).toFixed(1)])), '',
    '## Aposentadoria e disciplina',
    row(['Grupo', 'Idade final (média)', 'Decisão', 'Físico', 'Overall inicial', '40 anos', 'Despedida no formador', 'Despedida no coração', 'Amarelos', 'Vermelhos', 'Lesões graves', 'Mudou de posição', 'Casa da família']), row(['---', ...Array(12).fill('--:')]),
    ...groups.map(([g, x]) => row([g, mean(x.map((r) => r.endAge)).toFixed(1),
      ...['decisao', 'fisico', 'overallInicial', 'idadeLimite'].map((m) => pct(x.map((r) => r.retirement === m))),
      pct(x.map((r) => r.farewell === 'formador')), pct(x.map((r) => r.farewell === 'coracao')),
      mean(x.map((r) => r.cards.yellows)).toFixed(0), mean(x.map((r) => r.cards.reds)).toFixed(1),
      mean(x.map((r) => r.injuries.grave)).toFixed(1), pct(x.map((r) => r.positionChanges > 0)), pct(x.map((r) => r.houseBought))])), '',
    '## Seleção (% das carreiras com ao menos uma convocação no degrau)',
    row(['Grupo', 'Sub-17', 'Sub-20', 'Olímpica', 'Principal', 'Titular', 'Camisa 10', 'Capitão', '10 e faixa', 'Convocações (média de quem foi)']), row(['---', ...Array(9).fill('--:')]),
    ...groups.map(([g, x]) => row([g, pct(x.map((r) => r.selection.callUps.sub17 > 0)), pct(x.map((r) => r.selection.callUps.sub20 > 0)), pct(x.map((r) => r.selection.callUps.olimpica > 0)),
      pct(x.map((r) => r.selection.caps > 0)), pct(x.map((r) => r.selection.callUps.titular > 0)), pct(x.map((r) => r.selection.ten > 0)), pct(x.map((r) => r.selection.captain > 0)),
      pct(x.map((r) => r.selection.ten > 0 && r.selection.captain > 0)), mean(x.filter((r) => r.selection.caps > 0).map((r) => r.selection.caps)).toFixed(1)])), '',
    '## Torneios de seleções',
    row(['Grupo', 'Jogou Copa', 'Campeão do mundo', 'Copa América', 'Ouro olímpico', 'Herói da Copa', 'Vilão da Copa', 'Convite de outra seleção', 'Aceitou', 'Oriundo campeão', 'Esperou o Brasil']), row(['---', ...Array(10).fill('--:')]),
    ...groups.map(([g, x]) => row([g, pct(x.map((r) => r.selection.tournaments.some((t) => t.tournament === 'copaDoMundo'))),
      ...['copaDoMundo', 'copaAmerica', 'olimpiadas'].map((c) => pct(x.map((r) => r.titles.some((t) => t.competition === c)))),
      pct(x.map((r) => r.selection.tournaments.some((t) => t.tournament === 'copaDoMundo' && t.hero))),
      pct(x.map((r) => r.selection.tournaments.some((t) => t.tournament === 'copaDoMundo' && t.villain))),
      pct(x.map((r) => r.selection.dual !== null)), pct(x.map((r) => r.selection.dual === 'aceitou')), pct(x.map((r) => r.selection.oriundoCampeao)), pct(x.map((r) => r.selection.esperouOBrasil))])), '',
    '## Prêmios (% das carreiras com o prêmio ao menos uma vez) e números',
    row(['Grupo', ...AWARDS, 'Prêmios (média)', 'Jogos', 'Gols', 'Assistências']), row(['---', ...Array(AWARDS.length + 4).fill('--:')]),
    ...groups.map(([g, x]) => row([g, ...AWARDS.map((a) => pct(x.map((r) => r.awards.some((w) => w.award === a)))), mean(x.map((r) => r.awards.length)).toFixed(1),
      mean(x.map((r) => r.stats.games)).toFixed(0), mean(x.map((r) => r.stats.goals)).toFixed(0), mean(x.map((r) => r.stats.assists)).toFixed(0)])), '',
    '## Títulos por carreira (média)',
    row(['Grupo', ...comps, 'total']), row(['---', ...comps.map(() => '--:'), '--:']),
    ...groups.map(([g, x]) => row([g, ...comps.map((c) => mean(x.map((r) => r.titles.filter((t) => t.competition === c).length)).toFixed(2)), mean(x.map((r) => r.titles.length)).toFixed(1)])), '',
  ];
  mkdirSync('docs', { recursive: true });
  writeFileSync('docs/simulacao-carreira.md', lines.join('\n'));
  expect(rs).toHaveLength(N);
}, 600_000);
