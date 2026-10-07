import { autoDecide, simulateCareer, type Decider } from './career';
import { MAX_PER_SEASON, MILESTONES, milestoneKey } from './milestones';
import { createPrng } from './prng';
import { randomInput } from './simulation';

// T25c (SPEC 6.13b): os marcos disparam dentro da carreira, pelos fatos do motor; cada um vira uma decisão (3 opções) e os efeitos
// valem (Mental, moral, idolatria, relação, cobrador).
const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8];
const IDS = new Set(MILESTONES.map((m) => m.id));
const run = (seed: number, decide?: Decider) => simulateCareer(randomInput(createPrng(seed)), seed, 2026, decide);
const CLUB = new Set(MILESTONES.filter((m) => m.escopo === 'clube').map((m) => m.id));

describe('marcos dentro da carreira (T25c)', () => {
  it('cada marco de carreira acontece no máximo uma vez, e o de clube no máximo uma vez por clube', () => {
    for (const seed of SEEDS) {
      const keys = run(seed).marcos.map((m) => milestoneKey(m.id, CLUB.has(m.id) ? m.clubId : undefined));
      expect(new Set(keys).size, `seed ${seed}`).toBe(keys.length);
    }
  });

  it('no máximo o limite de marcos por temporada, e só marcos dos dados', () => {
    for (const seed of SEEDS) {
      const byYear = new Map<number, number>();
      for (const m of run(seed).marcos) {
        expect(IDS.has(m.id)).toBe(true);
        byYear.set(m.year, (byYear.get(m.year) ?? 0) + 1);
      }
      for (const n of byYear.values()) expect(n).toBeLessThanOrEqual(MAX_PER_SEASON);
    }
  });

  it('a estreia profissional acontece em toda carreira que chega ao profissional, e a do clube não repete na mesma temporada', () => {
    for (const seed of SEEDS) {
      const r = run(seed);
      const debut = r.marcos.find((m) => m.id === 'estreia-profissional');
      expect(debut, `seed ${seed}`).toBeDefined();
      expect(r.marcos.some((m) => m.id === 'estreia-no-clube' && m.year === debut!.year)).toBe(false);
    }
  });

  it('cada marco passa pelo decisor como uma decisão, com a idade e o clube registrados', () => {
    const asked: string[] = [];
    const r = run(3, (id, temp, view) => { asked.push(id); return autoDecide(id, temp, view); });
    for (const m of r.marcos) {
      expect(asked).toContain(m.id);
      expect(m.age).toBeGreaterThanOrEqual(16);
      expect(m.clubId).not.toBe('');
      expect(typeof m.option).toBe('string');
    }
    expect(r.marcos.length).toBeGreaterThan(3);
  });

  it('é determinístico: mesma semente, mesmos marcos', () => {
    expect(run(5).marcos.length).toBeGreaterThan(0);
    expect(run(5).marcos).toEqual(run(5).marcos);
  });

  it('a opção com bônus de Mental rende mais Mental que a sem bônus (mesma carreira, só a escolha muda)', () => {
    const pick = (opt: string): Decider => (id, temp, view) => (id === 'estreia-profissional' ? opt : autoDecide(id, temp, view));
    let better = 0;
    for (const seed of SEEDS) {
      const com = run(seed, pick('respirar-e-jogar-simples')).peakAttributes.mental;
      const sem = run(seed, pick('curtir-cada-segundo')).peakAttributes.mental;
      expect(com).toBeGreaterThanOrEqual(sem - 1);
      if (com > sem) better++;
    }
    expect(better).toBeGreaterThan(0);
  });

  it('assumir as faltas torna o jogador cobrador do clube atual: mais gols de bola parada que quem deixa o cobrador', () => {
    const pick = (opt: string): Decider => (id, temp, view) => (id === 'assumir-faltas' ? opt : autoDecide(id, temp, view));
    let withCooker = 0;
    let without = 0;
    let played = 0;
    for (const seed of SEEDS) {
      const a = run(seed, pick('assumir-as-cobrancas'));
      if (!a.marcos.some((m) => m.id === 'assumir-faltas')) continue;
      played++;
      withCooker += a.stats.goals;
      without += run(seed, pick('deixar-quem-sabe-bater')).stats.goals;
    }
    expect(played).toBeGreaterThan(0);
    expect(withCooker).toBeGreaterThanOrEqual(without);
  });
});
