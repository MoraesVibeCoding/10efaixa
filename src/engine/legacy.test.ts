import { simulateCareer } from './career';
import type { Ctx } from './events';
import { LABELS, VERDICTS, labelsOf, legacyFacts, legacyOf, legacyScore, validateLegacyConfig, verdictOf } from './legacy';
import cfg from '../data/legacy.json';
import ptBR from '../i18n/pt-BR/legacy.json';

const f = (over: Ctx = {}): Ctx => ({
  posicao: 'atacante', origem: 'peneira', convocacoes: 0, semestresTitular: 0, semestresCamisa10Selecao: 0, semestresCapitaoSelecao: 0,
  jogos: 0, gols: 0, assistencias: 0, desarmes: 0, semSofrerGol: 0, idolatriaMax: 0, anos: 0, patrimonioBRL: 0, ganhoBRL: 0, fracaoGuardada: 1,
  clubes: 3, convocacoesBase: 0, pico: 80, temporadasElite: 0, classicosDecisivos: 0, grandeNoMundo: false, heroiDaCopa: false, vilaoDaCopa: false,
  oriundoCampeao: false, idoloNoCoracao: false, diamante: false, casaComprada: false, aposentadoria: 'fisico', ...over,
});
const P = cfg.pesos;

describe('nota de legado (T40, SPEC 6.15)', () => {
  it('pesos da SPEC: 35 · 30 · 15 · 12 · 5 · 3, somando 100', () => {
    expect(P).toEqual({ selecao: 35, titulos: 30, premios: 15, numeros: 12, idolatria: 5, longevidade: 3 });
  });

  it('carreira vazia vale 0; carreira que estoura todos os tetos vale 100', () => {
    expect(legacyScore(f()).score).toBe(0);
    const max = f({
      convocacoes: 999, titulo_copaDoMundo: 9, premio_melhorDoMundo: 9, jogos: 9999, gols: 9999, assistencias: 9999,
      idolatriaMax: 100, anos: 99, patrimonioBRL: 1e12,
    });
    expect(legacyScore(max).score).toBe(100);
  });

  it('cada componente satura no seu peso', () => {
    expect(legacyScore(f({ convocacoes: 999 })).score).toBe(P.selecao);
    expect(legacyScore(f({ titulo_champions: 99 })).score).toBe(P.titulos);
    expect(legacyScore(f({ premio_melhorDoMundo: 99 })).score).toBe(P.premios);
    expect(legacyScore(f({ idolatriaMax: 100 })).score).toBe(P.idolatria);
    expect(legacyScore(f({ idolatriaMax: -80 })).score).toBe(0);
    expect(legacyScore(f({ anos: 99, patrimonioBRL: 1e12 })).score).toBe(P.longevidade);
  });

  it('hierarquia dos títulos: Copa do Mundo > Libertadores/Champions > liga nacional > copa > estadual', () => {
    const t = (k: string) => legacyScore(f({ [`titulo_${k}`]: 1 })).components.titulos;
    expect(t('copaDoMundo')).toBeGreaterThan(t('champions'));
    expect(t('champions')).toBe(t('libertadores'));
    expect(t('libertadores')).toBeGreaterThan(t('serieA'));
    expect(t('serieA')).toBe(t('ligaNacional'));
    expect(t('ligaNacional')).toBeGreaterThan(t('copaDoBrasil'));
    expect(t('copaDoBrasil')).toBeGreaterThan(t('estadual'));
  });

  it('Seleção: titular, camisa 10, faixa e títulos somam por cima das convocações', () => {
    const s = (o: Ctx) => legacyScore(f({ convocacoes: 10, ...o })).components.selecao;
    expect(s({ semestresTitular: 10 })).toBeGreaterThan(s({}));
    expect(s({ semestresCamisa10Selecao: 5 })).toBeGreaterThan(s({}));
    expect(s({ semestresCapitaoSelecao: 5 })).toBeGreaterThan(s({}));
    expect(s({ titulo_copaDoMundo: 1 })).toBeGreaterThan(s({ titulo_copaAmerica: 1 }));
  });

  it('números ajustados por posição: zagueiro e goleiro pontuam sem gols', () => {
    const n = (o: Ctx) => legacyScore(f(o)).components.numeros;
    const ref = cfg.numeros.porPosicao;
    expect(n({ posicao: 'goleiro', jogos: cfg.numeros.jogos, semSofrerGol: ref.goleiro.semSofrerGol })).toBe(1);
    expect(n({ posicao: 'zagueiro', jogos: cfg.numeros.jogos, semSofrerGol: ref.zagueiro.semSofrerGol, desarmes: ref.zagueiro.desarmes })).toBe(1);
    expect(n({ posicao: 'atacante', jogos: cfg.numeros.jogos, gols: ref.atacante.gols, assistencias: ref.atacante.assistencias })).toBe(1);
    expect(n({ posicao: 'atacante', jogos: cfg.numeros.jogos, semSofrerGol: 999, desarmes: 9999 })).toBeLessThan(0.5);
  });
});

describe('veredito e rótulos (T40, SPEC 6.15)', () => {
  it('configuração inválida é recusada: pesos que não somam 100 ou última faixa com requisito', () => {
    expect(validateLegacyConfig(cfg)).toEqual([]);
    expect(validateLegacyConfig({ ...cfg, pesos: { ...cfg.pesos, selecao: 30 } })).not.toEqual([]);
    expect(validateLegacyConfig({ ...cfg, veredito: cfg.veredito.slice(0, -1) })).not.toEqual([]);
  });

  it('as 8 faixas e os 14 rótulos da SPEC, todos com texto pt-BR', () => {
    expect(VERDICTS).toHaveLength(8);
    expect(LABELS).toHaveLength(14);
    for (const v of VERDICTS) expect((ptBR.veredito as Record<string, string>)[v]).toBeTruthy();
    for (const l of LABELS) expect((ptBR.rotulo as Record<string, string>)[l]).toBeTruthy();
    for (const l of cfg.rotulos) expect((ptBR.raridade as Record<string, string>)[l.raridade]).toBeTruthy();
    expect(ptBR.rotulo.dezEFaixa).toBe('10eFaixa');
    expect(cfg.rotulos[0]).toMatchObject({ id: 'dezEFaixa', raridade: 'lendaria' });
  });

  it('toda combinação termina num veredito válido (a última faixa não tem requisito)', () => {
    expect(cfg.veredito.at(-1)!.condicoes).toEqual([]);
    expect(VERDICTS).toContain(verdictOf(f(), 0));
    expect(VERDICTS).toContain(verdictOf(f(), 100));
  });

  it('veredito pede nota e requisito: sem Copa nem Melhor do Mundo não há Lenda mundial', () => {
    const min = (id: string) => cfg.veredito.find((v) => v.id === id)!.notaMin;
    const star = { convocacoes: 50, semestresTitular: 30 };
    expect(verdictOf(f({ ...star, grandeNoMundo: true }), min('lendaMundial'))).toBe('lendaMundial');
    expect(verdictOf(f({ ...star, grandeNoMundo: true }), min('lendaMundial') - 1)).toBe('lendaDoFutebolBrasileiro');
    expect(verdictOf(f({ ...star, grandeNoMundo: false }), 100)).toBe('lendaDoFutebolBrasileiro');
    expect(verdictOf(f({ convocacoes: 20, semestresTitular: 8 }), min('craqueDaSelecao'))).toBe('craqueDaSelecao');
    expect(verdictOf(f({ idolatriaMax: 80, temporadasElite: 10 }), min('idoloDeClube'))).toBe('idoloDeClube');
    expect(verdictOf(f({ temporadasElite: 9 }), 10)).toBe('titularDeSerieA');
    expect(verdictOf(f({ convocacoesBase: 3 }), 5)).toBe('promessaQueNaoVingou');
    expect(verdictOf(f({ convocacoesBase: 3, convocacoes: 2 }), 5)).not.toBe('promessaQueNaoVingou');
    expect(verdictOf(f({ clubes: 7 }), 2)).toBe('rodadoDoInterior');
    expect(verdictOf(f(), 2)).toBe('jogadorDeSerieB');
  });

  it('rótulos: do mais raro ao mais comum; o primeiro é o principal do cartão', () => {
    const ls = labelsOf(f({ semestresCamisa10Selecao: 4, semestresCapitaoSelecao: 2, clubes: 7, heroiDaCopa: true }));
    expect(ls.map((l) => l.id)).toEqual(['dezEFaixa', 'heroiDaCopa', 'rodado']);
    expect(ls[0]!.rarity).toBe('lendaria');
    expect(labelsOf(f())).toEqual([]);
  });

  it('cada rótulo tem uma carreira que o ganha', () => {
    const cases: Record<string, Ctx> = {
      dezEFaixa: { semestresCamisa10Selecao: 1, semestresCapitaoSelecao: 1 }, heroiDaCopa: { heroiDaCopa: true }, oriundoCampeao: { oriundoCampeao: true },
      goleiroArtilheiro: { posicao: 'goleiro', gols: 12 }, torcedorQueVirouIdolo: { idoloNoCoracao: true }, diamanteDaVarzea: { diamante: true, pico: 90 },
      vilaoDaCopa: { vilaoDaCopa: true }, idoloDeUmClubeSo: { clubes: 1, idolatriaMax: 90 }, craqueEsquecido: { pico: 92 },
      ganhouMuitoEGastouTudo: { ganhoBRL: 1e10, fracaoGuardada: 0 }, carrascoDeClassico: { classicosDecisivos: 12 }, reiDoEstadual: { titulo_estadual: 5 },
      aposentadoriaTranquila: { casaComprada: true, patrimonioBRL: 1e10, aposentadoria: 'decisao' }, rodado: { clubes: 8 },
    };
    expect(Object.keys(cases).sort()).toEqual([...LABELS].sort());
    for (const [id, facts] of Object.entries(cases)) expect(labelsOf(f(facts)).map((l) => l.id)).toContain(id);
  });
});

describe('legado na carreira (T40, invariante 9.2)', () => {
  it('toda carreira termina com nota entre 0 e 100, veredito válido e fatos coerentes', { timeout: 30_000 }, () => {
    for (let seed = 0; seed < 40; seed++) {
      const r = simulateCareer({
        name: 'Jogador Teste', shirtNumber: 9, state: 'SP', position: seed % 2 ? 'goleiro' : 'atacante', archetypeId: seed % 2 ? 'paredao' : 'matador',
        biotype: { heightCm: seed % 2 ? 190 : 180, build: 'atletico' }, temperament: 'lider', celebration: 'aviaozinho',
        origin: (['baseGrande', 'peneira', 'varzea'] as const)[seed % 3]!, foot: 'direita', heartClub: null,
      }, seed);
      expect(r.legacy.score).toBeGreaterThanOrEqual(0);
      expect(r.legacy.score).toBeLessThanOrEqual(100);
      expect(VERDICTS).toContain(r.legacy.verdict);
      expect(r.legacy).toEqual(legacyOf(r));
      const facts = legacyFacts(r);
      expect(facts.convocacoes).toBe(r.selection.caps);
      expect(facts.jogos).toBe(r.stats.games);
      expect(facts.anos).toBe(r.endAge - 16);
      expect(r.earnedBRL).toBeGreaterThanOrEqual(r.wealthBRL * 0.5);
    }
  });
});
