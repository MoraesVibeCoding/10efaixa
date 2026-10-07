import { autoDecide, simulateCareer, type Decider, type DecisionView } from './career';
import { MEMORY_IDS, memoryCtx } from './memory';
import { PROPOSAL_EVENT, STAY, acceptChoice } from './proposals';
import { createPrng } from './prng';
import { randomInput } from './simulation';

// T25d: as memórias nascem dentro da carreira (marcos e fatos de história), com ano, idade e clube, e chegam aos eventos.
const run = (seed: number, decide?: Decider) => simulateCareer(randomInput(createPrng(seed)), seed, 2026, decide);
const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8];

describe('memória dentro da carreira (T25d)', () => {
  it('os 20 marcos viram memória, com o mesmo ano, idade e clube', () => {
    for (const seed of SEEDS) {
      const r = run(seed);
      for (const marco of r.marcos) {
        expect(r.memorias.some((x) => x.id === marco.id && x.year === marco.year && x.age === marco.age && x.clubId === marco.clubId), `${seed} ${marco.id}`).toBe(true);
      }
    }
  });

  it('toda memória tem id conhecido, ano da carreira, idade válida e clube', () => {
    for (const seed of SEEDS) {
      const r = run(seed);
      expect(r.memorias.length).toBeGreaterThan(5);
      for (const x of r.memorias) {
        expect(MEMORY_IDS).toContain(x.id);
        expect(x.year).toBeGreaterThanOrEqual(2026);
        expect(x.age).toBeGreaterThanOrEqual(16);
        expect(x.clubId).not.toBe('');
      }
    }
  });

  it('lesão grave e final perdida aparecem como memória em carreiras de verdade', () => {
    const ids = new Set<string>();
    for (let seed = 1; seed <= 120 && !(ids.has('lesaoGrave') && ids.has('perdeuFinal')); seed++) for (const x of run(seed).memorias) ids.add(x.id);
    expect(ids.has('lesaoGrave')).toBe(true);
    expect(ids.has('perdeuFinal')).toBe(true); // final da copa nacional perdida: raro (cerca de 1 em 20 carreiras)
  });

  it('aceitar proposta de rival do clube atual vira "trocouPeloRival"; ficar com proposta europeia na tela vira "recusouEuropa"', () => {
    const rival: Decider = (id, t, view) => {
      if (id !== PROPOSAL_EVENT) return autoDecide(id, t, view);
      const o = view().propostas?.find((p) => p.marca === 'rival');
      return o ? acceptChoice(o.clubId) : String(view().state.sugestao);
    };
    const europe: Decider = (id, t, view) => (id === PROPOSAL_EVENT && view().propostas?.some((p) => !p.league.startsWith('BRA') && p.league !== 'SAM') ? STAY : autoDecide(id, t, view));
    const seen = { rival: false, europa: false };
    for (let seed = 1; seed <= 40 && !(seen.rival && seen.europa); seed++) {
      if (!seen.rival) seen.rival = run(seed, rival).memorias.some((x) => x.id === 'trocouPeloRival');
      if (!seen.europa) seen.europa = run(seed, europe).memorias.some((x) => x.id === 'recusouEuropa');
    }
    expect(seen).toEqual({ rival: true, europa: true });
  });

  it('"recusou a Europa" entra uma vez só por carreira (a janela europeia vem quase todo ano); as demais podem se repetir', () => {
    for (const seed of SEEDS) {
      const ids = run(seed).memorias.map((x) => x.id);
      expect(ids.filter((id) => id === 'recusouEuropa').length).toBeLessThanOrEqual(1);
    }
  });

  it('o contexto de cada decisão traz mem.* e anos.* e a lista de memórias até ali', () => {
    const views: DecisionView[] = [];
    const r = run(3, (id, t, view) => { views.push(view()); return autoDecide(id, t, view); });
    const last = views.at(-1)!;
    expect(last.memorias.length).toBeGreaterThan(0);
    const ctx = memoryCtx(last.memorias, last.year);
    for (const [k, v] of Object.entries(ctx)) expect(last.state[k], k).toBe(v);
    expect(views[0]!.memorias).toEqual([]);
    expect(r.memorias.length).toBeGreaterThanOrEqual(last.memorias.length);
  });

  it('é determinístico: mesma semente, mesmas memórias (por isso o save, que refaz pelas escolhas, as recupera)', () => {
    expect(run(5).memorias).toEqual(run(5).memorias);
  });
});

// T25e: as etiquetas de contexto de cada decisão, calculadas dos fatos reais da carreira
import { CONTEXT_TAGS } from './contextTags';
describe('etiquetas de contexto dentro da carreira (T25e)', () => {
  const TAGS = new Set(CONTEXT_TAGS.map((x) => x.id));
  const collect = (seed: number) => {
    const out: { age: number; tags: string[] }[] = [];
    run(seed, (id, t, view) => { const v = view(); out.push({ age: v.age, tags: v.etiquetas }); return autoDecide(id, t, view); });
    return out;
  };

  it('toda decisão traz as etiquetas, só de ids conhecidos, sem repetir', () => {
    for (const seed of SEEDS) for (const { tags } of collect(seed)) {
      for (const tag of tags) expect(TAGS.has(tag), tag).toBe(true);
      expect(new Set(tags).size).toBe(tags.length);
    }
  });

  it('idade manda: jovem só até 20 anos, veterano só a partir de 32', () => {
    let jovem = 0;
    let veterano = 0;
    for (const seed of SEEDS) for (const { age, tags } of collect(seed)) {
      if (tags.includes('jovem')) { jovem++; expect(age).toBeLessThanOrEqual(21); }
      if (tags.includes('veterano')) { veterano++; expect(age).toBeGreaterThanOrEqual(32); }
      if (age <= 20) expect(tags).toContain('jovem');
    }
    expect(jovem).toBeGreaterThan(0);
    expect(veterano).toBeGreaterThan(0);
  });

  it('as situações da carreira aparecem em algum momento (e nenhuma etiqueta fica ligada o tempo todo)', () => {
    const seen = new Map<string, number>();
    let total = 0;
    for (let seed = 1; seed <= 25; seed++) for (const { tags } of collect(seed)) { total++; tags.forEach((x) => seen.set(x, (seen.get(x) ?? 0) + 1)); }
    for (const tag of ['campeaoNoAno', 'convocado', 'idolo', 'noBanco', 'moralBaixa', 'capitao', 'salarioAtrasado', 'subindoDeDivisao', 'recusouEuropa']) expect(seen.has(tag), tag).toBe(true);
    // nada fica ligado em mais da metade das decisões (senão deixa de ser contexto)
    for (const [tag, n] of seen) expect(n / total, tag).toBeLessThan(0.5);
  });
});
