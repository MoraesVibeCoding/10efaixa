import cups from '../data/cups.json';
import europe from '../data/europe.json';
import leagues from '../data/leagues.json';
import tournaments from '../data/nationalTournaments.json';
import states from '../data/states.json';
import { t } from './index';

// v2.32 (decisão do usuário, docs/competicoes-nomes.md): nenhuma competição aparece com nome oficial ou marca.
// Os dados podem citar a competição real em notas e fontes (referência); o que o jogador vê vem do i18n.
const OFFICIAL = [
  /brasileir[ãa]o/i, /libertadores/i, /sul-?americana/i, /sudamericana/i, /copa do brasil/i, /copa do nordeste/i,
  /copa do mundo/i, /copa am[ée]rica/i, /ol[ií]mpi/i, /copinha/i, /champions/i, /premier league/i, /\blaliga\b/i,
  /bundesliga/i, /ligue \d/i, /liga portugal/i, /europa league/i, /\bliga europa\b/i, /conference league/i,
  /paulist[ãa]o/i, /\bmls\b/i, /\bj1\b/i, /saudi pro/i, /superliga/i, /championship/i, /copa del rey/i,
  /coppa italia/i, /pokal/i, /coupe de france/i, /ta[çc]a de portugal/i, /fa cup/i, /\bfifa\b/i, /\buefa\b/i,
  /\bconmebol\b/i, /\bcbf\b/i,
];

const TEXTS = import.meta.glob<unknown>('./pt-BR/*.json', { eager: true, import: 'default' });
/** Todos os textos de um arquivo de i18n, com o caminho da chave. */
function strings(node: unknown, path: string, out: [string, string][] = []): [string, string][] {
  if (typeof node === 'string') out.push([path, node]);
  else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) strings(v, `${path}.${k}`, out);
  return out;
}

describe('competições com nomes não oficiais (v2.32)', () => {
  it('nenhum texto do jogo usa nome oficial ou marca de competição', () => {
    const found = Object.entries(TEXTS).flatMap(([file, json]) => strings(json, file))
      .filter(([, text]) => OFFICIAL.some((re) => re.test(text)))
      .map(([path, text]) => `${path}: ${text}`);
    expect(found).toEqual([]);
  });

  it('toda liga, copa e torneio dos dados tem nome no jogo', () => {
    const ids = [
      ...Object.keys(leagues.leagues).map((k) => `brasil.serie${k}`),
      ...Object.keys(europe.ligas).map((k) => `europa.liga.${k}`),
      ...Object.keys(europe.ligas).map((k) => `europa.copa.${k}`),
      ...Object.keys(europe.foraDoEixo.ligas).map((k) => `foraDoEixo.${k}`),
      ...Object.keys(cups).filter((k) => !k.startsWith('_') && k !== 'conmebol').map((k) => `brasil.${k}`),
      ...['libertadores', 'sulAmericana'].filter((k) => k in cups.conmebol).map((k) => `continental.${k}`),
      ...Object.keys(tournaments.torneios).map((k) => `selecoes.${k}`),
      'europa.copaEuropeia', 'europa.copaEuropeia2', 'brasil.copaJuniores',
    ];
    for (const id of ids) expect(() => t(`competitions.${id}`), id).not.toThrow();
    for (const uf of Object.keys(states.estaduais)) expect(t('competitions.brasil.estadual', { uf })).toContain(uf);
  });

  it('nomes aprovados pelo usuário', () => {
    expect(t('competitions.brasil.serieA')).toBe('Nacional · Série A');
    expect(t('competitions.continental.libertadores')).toBe('Copa Continental');
    expect(t('competitions.europa.copaEuropeia')).toBe('Copa Europeia');
    expect(t('competitions.europa.copaEuropeia2')).toBe('Copa Europeia 2'); // era "Liga Europeia": perto demais de "Liga Europa"
    expect(t('ui.titulo.europaLeague')).toBe('Copa Europeia 2');
    expect(t('competitions.selecoes.copaDoMundo')).toBe('Mundial de Seleções');
  });
});
