import { CLUBS } from './clubs';
import { FOREIGN } from './cups';
import europe from '../data/europe.json';
import { simulateCareer } from './career';
import { createPrng } from './prng';
import { randomInput } from './simulation';
import { isEditionYear } from './calendar';
import { AWARDS } from './awards';
import type { CreationInput } from './player';
import cfg from '../data/career.json';
import retire from '../data/retirement.json';
import { readFileSync } from 'node:fs';
import { EUROPE } from './europe';

const input = (over: Partial<CreationInput> = {}): CreationInput => ({
  name: 'Jogador Teste', shirtNumber: 9, state: 'SP', position: 'atacante', archetypeId: 'matador',
  biotype: { heightCm: 180, build: 'atletico' }, temperament: 'frio', celebration: 'aviaozinho',
  origin: 'baseGrande', foot: 'direita', heartClub: null, ...over,
});
const ids = new Set([...CLUBS.map((c) => c.id), ...FOREIGN.map((c) => c.id), ...europe.clubs.map((c) => c.id), ...europe.outros.clubs.map((c) => c.id), ...europe.foraDoEixo.clubs.map((c) => c.id)]);

describe('integração da carreira (T24b)', () => {
  it('determinística pela semente', () => {
    expect(simulateCareer(input(), 7)).toEqual(simulateCareer(input(), 7));
  });

  it('vai dos 16 anos à aposentadoria (T34): uma temporada por ano, motivo registrado, nunca além dos 40', { timeout: 30_000 }, () => {
    const rs = Array.from({ length: 30 }, (_, seed) => simulateCareer(input({ temperament: seed % 2 ? 'resenha' : 'frio' }), seed));
    for (const r of rs) {
      expect(r.seasons.length).toBe(r.endAge - 16);
      expect(r.seasons[0]!.year).toBe(2026);
      expect(r.endAge).toBeLessThanOrEqual(retire.idadeLimite);
      expect(['decisao', 'fisico', 'overallInicial', 'idadeLimite']).toContain(r.retirement);
      if (r.retirement === 'decisao') expect(r.endAge).toBeGreaterThanOrEqual(retire.decisao.idadeMin);
      if (r.retirement === 'idadeLimite') expect(r.endAge).toBe(retire.idadeLimite);
    }
    expect(new Set(rs.map((r) => r.endAge)).size).toBeGreaterThan(3);
  });

  it('despedida (T34): quem aceita encerra a carreira no clube de coração ou no formador, sem sair mais', () => {
    const rs = Array.from({ length: 40 }, (_, seed) => simulateCareer(input({ temperament: 'lider', heartClub: 'santos' }), seed));
    const back = rs.filter((r) => r.farewell !== null);
    expect(back.length).toBeGreaterThan(0);
    for (const r of back) {
      const last = r.spells.at(-1)!;
      expect(last.clubId).toBe(r.farewell === 'coracao' ? 'santos' : r.spells[0]!.clubId);
      expect(last.fromAge).toBeGreaterThanOrEqual(retire.despedida.idadeMin);
      expect(last.toAge).toBe(r.endAge);
    }
    expect(back.some((r) => r.farewell === 'coracao')).toBe(true);
  });

  it('histórico de clubes consistente: clubes existem, passagens encadeadas sem sobreposição', () => {
    for (const origin of ['baseGrande', 'peneira', 'varzea']) {
      const r = simulateCareer(input({ origin }), 11);
      expect(r.spells.length).toBeGreaterThan(0);
      for (const s of r.spells) expect(ids.has(s.clubId)).toBe(true);
      for (let i = 1; i < r.spells.length; i++) expect(r.spells[i]!.fromAge).toBe(r.spells[i - 1]!.toAge);
      for (const s of r.spells) expect(s.number).not.toBe(0);
    }
  });

  it('títulos só do clube do jogador naquela temporada', () => {
    for (let seed = 0; seed < 10; seed++) {
      const r = simulateCareer(input({ origin: 'baseGrande' }), seed);
      for (const t of r.titles.filter((x) => x.clubId !== 'selecao')) {
        const season = r.seasons.find((s) => s.year === t.year)!;
        expect(t.clubId).toBe(season.clubId);
        expect(season.minutes).toBeGreaterThanOrEqual(cfg.minutosParaTitulo);
      }
    }
  });

  it('clube de coração entre as ofertas da base: começa nele', () => {
    const r = simulateCareer(input({ state: 'RJ', heartClub: 'vasco' }), 4);
    expect(r.spells[0]!.clubId).toBe('vasco');
  });

  it('auge coerente e dentro de 1–99', () => {
    const r = simulateCareer(input(), 5);
    expect(r.peakOverall).toBeGreaterThanOrEqual(r.player.startingOverall - 2);
    expect(r.peakOverall).toBeLessThanOrEqual(99);
    expect(r.peakAge).toBeGreaterThanOrEqual(16);
  });

  it('uma carreira em menos de 150 ms no teste (meta do SPEC: 50 ms no CI, medida no relatório)', () => {
    simulateCareer(input(), 0); // aquece: a primeira chamada mede a compilação do motor, não a carreira
    const t0 = performance.now();
    simulateCareer(input(), 1);
    expect(performance.now() - t0).toBeLessThan(150);
  });

  it('a transferência provisória saiu do código (mercado da T28 no lugar)', () => {
    expect(readFileSync('src/engine/career.ts', 'utf8')).not.toMatch(/provisionalTransfer/);
  });

  it('patrimônio em R$, nunca negativo; empresário escolhido; contratos assinados', () => {
    for (let seed = 0; seed < 8; seed++) {
      const r = simulateCareer(input({ origin: 'peneira' }), seed);
      expect(Number.isFinite(r.wealthBRL)).toBe(true);
      expect(r.wealthBRL).toBeGreaterThanOrEqual(0);
      expect(['paiTio', 'agenteLocal', 'grandeAgencia']).toContain(r.agentProfile);
      expect(r.contracts).toBeGreaterThan(0);
    }
    expect(simulateCareer(input(), 3).wealthBRL).toBeGreaterThan(1_000_000);
  });

  it('há carreiras com passagem pela Europa, com liga registrada na temporada', () => {
    const euro = new Set(EUROPE.map((c) => c.id));
    const careers = Array.from({ length: 25 }, (_, s) => simulateCareer(input({ temperament: 'frio' }), s));
    const abroad = careers.filter((r) => r.spells.some((x) => euro.has(x.clubId)));
    expect(abroad.length).toBeGreaterThan(0);
    const s = abroad[0]!.seasons.find((x) => euro.has(x.clubId))!;
    expect(['ENG', 'ESP', 'ITA', 'GER', 'FRA', 'POR']).toContain(s.division);
  });

  it('lesões acontecem ao longo da carreira e são contadas por gravidade', () => {
    const rs = Array.from({ length: 20 }, (_, seed) => simulateCareer(input({ biotype: { heightCm: 180, build: 'franzino' } }), seed));
    const total = (k: 'leve' | 'media' | 'grave') => rs.reduce((a, r) => a + r.injuries[k], 0);
    expect(total('leve')).toBeGreaterThan(total('grave'));
    expect(total('leve')).toBeGreaterThan(10);
    expect(total('grave')).toBeGreaterThan(0);
  });

  it('mudança de posição acontece em algumas carreiras e fica registrada; a altura prevista não muda', () => {
    const rs = Array.from({ length: 30 }, (_, seed) => simulateCareer(input({ position: 'lateral', archetypeId: 'lateralConstrutor', biotype: { heightCm: 178, build: 'atletico' } }), seed));
    const changed = rs.filter((r) => r.positionChanges > 0);
    expect(changed.length).toBeGreaterThan(0);
    expect(changed[0]!.finalPosition).toBe('zagueiro');
    expect(rs.filter((r) => r.positionChanges === 0).every((r) => r.finalPosition === 'lateral')).toBe(true);
    expect(changed[0]!.player.biotype.heightCm).toBe(178);
  });

  it('temperamento: Esquentado leva mais cartões que Frio e amadurece para Líder; Frio não muda', () => {
    const run = (temperament: string) => Array.from({ length: 12 }, (_, seed) => simulateCareer(input({ temperament }), seed));
    const sum = (rs: ReturnType<typeof run>) => rs.reduce((a, r) => a + r.cards.yellows + r.cards.reds, 0);
    const [esq, frio] = [run('esquentado'), run('frio')];
    expect(sum(esq)).toBeGreaterThan(sum(frio));
    expect(esq.every((r) => r.finalTemperament === 'lider')).toBe(true);
    expect(frio.every((r) => r.finalTemperament === 'frio')).toBe(true);
  });

  it('vida fora de campo: carreira rica compra a casa da família; disciplina fica em 0–1', () => {
    const rs = Array.from({ length: 10 }, (_, seed) => simulateCareer(input(), seed));
    expect(rs.some((r) => r.houseBought)).toBe(true);
    for (const r of rs) { expect(r.discipline).toBeGreaterThanOrEqual(0); expect(r.discipline).toBeLessThanOrEqual(1); }
  });

  it('Seleção (T36): convocações registradas por degrau; camisa 10 e faixa só para quem foi titular', () => {
    const rs = Array.from({ length: 40 }, (_, seed) => simulateCareer(input({ position: 'meia', archetypeId: 'classico10' }), seed));
    for (const r of rs) {
      const c = r.selection.callUps;
      expect(r.selection.caps).toBe(c.lista + c.reserva + c.titular);
      expect(r.selection.ten).toBeLessThanOrEqual(c.titular);
      expect(r.selection.captain).toBeLessThanOrEqual(c.titular);
    }
    expect(rs.some((r) => r.selection.caps > 0)).toBe(true);
    expect(rs.some((r) => r.selection.caps === 0)).toBe(true);
    const best = [...rs].sort((a, b) => b.peakOverall - a.peakOverall);
    expect(best[0]!.selection.caps).toBeGreaterThan(best.at(-1)!.selection.caps);
  });

  it('torneios de seleções (T37): só em ano de edição do calendário; título com a Seleção fica na carreira', () => {
    const rs = Array.from({ length: 60 }, (_, seed) => simulateCareer(input({ position: 'meia', archetypeId: 'classico10', origin: seed % 2 ? 'varzea' : 'baseGrande' }), seed));
    const all = rs.flatMap((r) => r.selection.tournaments);
    expect(all.length).toBeGreaterThan(0);
    for (const t of all) expect(isEditionYear(t.tournament, t.year)).toBe(true);
    for (const r of rs) {
      const won = r.selection.tournaments.filter((t) => t.stage === 'campeao');
      expect(r.titles.filter((t) => t.clubId === 'selecao').map((t) => `${t.year}-${t.competition}`)).toEqual(won.map((t) => `${t.year}-${t.tournament}`));
    }
    expect(all.some((t) => t.tournament === 'copaDoMundo')).toBe(true);
  });

  it('dupla nacionalidade (T38): aceitar é definitivo; quem recusa segue brasileiro', { timeout: 30_000 }, () => {
    const run = (temperament: string) => Array.from({ length: 80 }, (_, seed) => simulateCareer(input({ temperament, position: 'meia', archetypeId: 'classico10' }), seed));
    const frio = run('frio');
    const took = frio.filter((r) => r.selection.dual === 'aceitou');
    expect(took.length).toBeGreaterThan(0);
    for (const r of took) {
      expect(r.selection.nationality).not.toBe('brasil');
      const teams = new Set(r.selection.tournaments.filter((t) => t.tournament !== 'olimpiadas').map((t) => t.team));
      expect([...teams].every((t) => t === r.selection.nationality)).toBe(true);
    }
    const lider = run('lider');
    expect(lider.some((r) => r.selection.dual === 'recusou')).toBe(true);
    for (const r of lider) {
      expect(r.selection.nationality).toBe('brasil');
      expect(r.selection.oriundoCampeao).toBe(false);
      if (r.selection.esperouOBrasil) expect(r.selection.caps).toBeGreaterThan(0);
    }
  });

  it('números e prêmios (T39): totais da carreira coerentes; prêmios válidos, em anos jogados; Revelação no máximo uma vez', () => {
    const rs = Array.from({ length: 30 }, (_, seed) => simulateCareer(input({ origin: seed % 2 ? 'peneira' : 'baseGrande' }), seed));
    for (const r of rs) {
      expect(r.stats.games).toBeGreaterThan(0);
      expect(r.stats.games).toBeLessThanOrEqual(r.seasons.length * 60);
      expect(r.stats.goals).toBeGreaterThan(0);
      for (const a of r.awards) {
        expect(AWARDS).toContain(a.award);
        expect(r.seasons.some((s) => s.year === a.year)).toBe(true);
      }
      expect(r.awards.filter((a) => a.award === 'revelacao').length).toBeLessThanOrEqual(1);
    }
    expect(rs.some((r) => r.awards.length > 0)).toBe(true);
  });

  it('meta do auge (9.3) na carreira integrada: 5% · 10% · 60% · 25%, com folga de amostra pequena (±6 p.p.)', { timeout: 120_000 }, () => {
    const n = 500;
    const peaks = Array.from({ length: n }, (_, k) => simulateCareer(randomInput(createPrng(300_000 + k)), 300_000 + k).peakOverall);
    const share = (lo: number, hi: number) => (100 * peaks.filter((p) => p >= lo && p <= hi).length) / n;
    const got = [share(95, 99), share(90, 94), share(85, 89), share(80, 84)];
    [5, 10, 60, 25].forEach((target, k) => expect(Math.abs(got[k]! - target)).toBeLessThanOrEqual(6));
  });
});
