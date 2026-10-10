import { autoDecide, simulateCareer, type Decider } from './career';
import { MAX_PER_SEASON, MILESTONES, milestoneKey, momentOf } from './milestones';
import { createPrng } from './prng';
import { randomInput } from './simulation';
import clubs from '../data/clubs.json';

// T25c (SPEC 6.13b): os marcos disparam dentro da carreira, pelos fatos do motor; cada um vira uma decisão (3 opções) e os efeitos
// valem (Mental, moral, idolatria, relação, cobrador).
const SEEDS = [1, 2, 3, 4, 5, 6, 7, 8];
const IDS = new Set(MILESTONES.map((m) => m.id));
const run = (seed: number, decide?: Decider) => simulateCareer(randomInput(createPrng(seed)), seed, 2026, decide);
const BRAZIL = new Set(clubs.clubs.map((c) => c.id));
const CLUB = new Set(MILESTONES.filter((m) => m.escopo === 'clube').map((m) => m.id));

describe('marcos dentro da carreira (T25c)', () => {
  it('cada marco de carreira acontece no máximo uma vez, e o de clube no máximo uma vez por clube', () => {
    for (const seed of SEEDS) {
      const keys = run(seed).marcos.map((m) => milestoneKey(m.id, CLUB.has(m.id) ? m.clubId : undefined));
      expect(new Set(keys).size, `seed ${seed}`).toBe(keys.length);
    }
  });

  it('no máximo o limite de marcos de fim de temporada por temporada (v2.78: chegada, convocação e Copa ficam fora), e só marcos dos dados', () => {
    const FIM = new Set(MILESTONES.filter((m) => momentOf(m) === 'fim').map((m) => m.id));
    for (const seed of SEEDS) {
      const byYear = new Map<number, number>();
      for (const m of run(seed).marcos) {
        expect(IDS.has(m.id)).toBe(true);
        if (FIM.has(m.id)) byYear.set(m.year, (byYear.get(m.year) ?? 0) + 1);
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

  it('a opção com bônus de Mental rende mais Mental que a sem bônus (mesma carreira, só a escolha muda), medido aos ~22 anos, antes de o Mental bater no teto', () => {
    // O bônus é +4% no crescimento de Mental; no auge da carreira quase todo mundo já está no teto e a diferença some (medido: 3 melhores e 2 piores em 30).
    // Aos ~22 anos o efeito aparece (medido: melhor em 13 de 40, pior em 3).
    const at22 = (opt: string, seed: number) => {
      let mental = NaN;
      run(seed, (id, t, view) => { const v = view(); if (Number.isNaN(mental) && v.age >= 21.5) mental = v.attributes.mental; return id === 'estreia-profissional' ? opt : autoDecide(id, t, view); });
      return mental;
    };
    let com = 0; let sem = 0; let better = 0; let worse = 0;
    for (let seed = 1; seed <= 40; seed++) {
      const [a, b] = [at22('respirar-e-jogar-simples', seed), at22('curtir-cada-segundo', seed)];
      com += a; sem += b;
      if (a > b) better++;
      if (a < b) worse++;
    }
    expect(com).toBeGreaterThan(sem);
    expect(better).toBeGreaterThan(worse);
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

// v2.63 (SPEC 6.7): a camisa 10 do clube é conquista; vira marco e, dali em diante, o número é 10 em todo clube.
describe('camisa 10 conquistada (v2.63)', () => {
  const careers = Array.from({ length: 60 }, (_, i) => run(i + 1));

  it('quem vestiu a 10 passou pelo marco "camisa-10"; quem não passou, nunca veste a 10', () => {
    let com = 0;
    for (const r of careers) {
      const marco = r.marcos.find((m) => m.id === 'camisa-10');
      const usou = r.spells.some((s) => s.number === 10);
      expect(usou, `${r.player.name}`).toBe(marco !== undefined);
      expect(r.wearsTen).toBe(marco !== undefined);
      if (marco) com++;
    }
    expect(com).toBeGreaterThan(0);
  });

  it('depois do marco, a 10 fica: todo clube seguinte também é com a 10', () => {
    for (const r of careers) {
      const i = r.spells.findIndex((s) => s.number === 10);
      if (i < 0) continue;
      for (const s of r.spells.slice(i)) expect(s.number).toBe(10);
    }
  });
});

// v2.78 (achado do usuário): cada cena no momento em que acontece. A chegada (estreia no profissional, no clube, no exterior)
// abre a temporada, antes de qualquer decisão no clube; a convocação e a Copa vêm antes das decisões da Seleção.
describe('ordem das cenas (v2.78)', () => {
  type Step = { id: string; year: number; clubId: string | null };
  const CHEGADA = new Set(MILESTONES.filter((m) => m.momento === 'chegada').map((m) => m.id));
  const runs = Array.from({ length: 80 }, (_, i) => {
    const steps: Step[] = [];
    const r = run(i + 1, (id, t, view) => { const v = view(); steps.push({ id, year: v.year, clubId: v.clubId }); return autoDecide(id, t, view); });
    return { r, steps };
  });
  const at = (steps: Step[], id: string, year?: number) => steps.findIndex((s) => s.id === id && (year === undefined || s.year === year));

  it('a cena de chegada abre a temporada: nenhuma decisão no clube antes dela', () => {
    let n = 0;
    for (const { r, steps } of runs) {
      for (const m of r.marcos.filter((x) => CHEGADA.has(x.id))) {
        const before = steps.slice(0, at(steps, m.id, m.year)).filter((s) => s.year === m.year && s.clubId === m.clubId && !CHEGADA.has(s.id) && !s.id.startsWith('primeiro-passo'));
        expect(before.map((s) => s.id), `${m.id} ${m.year}`).toEqual([]);
        n++;
      }
    }
    expect(n).toBeGreaterThan(100);
  });

  it('a chegada ao exterior é na primeira temporada fora do Brasil, e no lugar da chegada ao clube (uma cena só)', () => {
    let n = 0;
    for (const { r } of runs) {
      const ext = r.marcos.find((m) => m.id === 'estreia-exterior');
      if (!ext) continue;
      n++;
      const firstAbroad = r.seasons.find((s) => s.clubId !== null && !BRAZIL.has(s.clubId));
      expect(ext.year, r.player.name).toBe(firstAbroad!.year);
      expect(r.marcos.some((m) => m.id === 'estreia-no-clube' && m.clubId === ext.clubId && m.year === ext.year)).toBe(false);
    }
    expect(n).toBeGreaterThan(20);
  });

  it('a primeira convocação vem antes de qualquer decisão da Seleção; a primeira Copa, antes das decisões da Copa', () => {
    let conv = 0; let copa = 0;
    for (const { r, steps } of runs) {
      const pc = r.marcos.find((m) => m.id === 'primeira-convocacao');
      if (pc) {
        conv++;
        const i = at(steps, 'primeira-convocacao');
        expect(steps.slice(0, i).filter((s) => s.id === 'pergunta-da-selecao' || s.id.startsWith('copa-')).map((s) => s.id)).toEqual([]);
      }
      const cp = r.marcos.find((m) => m.id === 'primeira-copa');
      if (cp) {
        copa++;
        const i = at(steps, 'primeira-copa');
        expect(steps.slice(0, i).filter((s) => s.year === cp.year && s.id.startsWith('copa-')).map((s) => s.id)).toEqual([]);
      }
    }
    expect(conv).toBeGreaterThan(20);
    expect(copa).toBeGreaterThan(5);
  });
});

// v2.80 (escolha do usuário: "3"): título e final na frente da fila do fim da temporada e limite de 3; as primeiras vezes do
// desempenho aparecem no ano em que aconteceram, não na temporada seguinte.
describe('primeiras vezes do fim da temporada no ano certo (v2.80)', () => {
  const careers = Array.from({ length: 80 }, (_, i) => run(i + 1));
  const atraso = (id: string, ano: (r: (typeof careers)[number]) => number | undefined) => careers.filter((r) => {
    const m = r.marcos.find((x) => x.id === id);
    const y = ano(r);
    return m !== undefined && y !== undefined && m.year !== y;
  }).map((r) => r.player.name);

  it('primeiro título e primeiro gol saem no ano do fato; a primeira assistência quase sempre', () => {
    expect(atraso('primeiro-titulo', (r) => r.titles.length ? Math.min(...r.titles.map((t) => t.year)) : undefined)).toEqual([]);
    expect(atraso('primeiro-gol', (r) => r.seasons.find((s) => s.goals > 0)?.year)).toEqual([]);
    // com limite 3, a estreia que já vem com título, titularidade, gol e assistência deixa a assistência para o ano seguinte
    // (medido: 2 de 80 carreiras; antes da v2.78, 77%)
    expect(atraso('primeira-assistencia', (r) => r.seasons.find((s) => s.assists > 0)?.year).length).toBeLessThanOrEqual(4);
  });

  it('título e final vêm antes dos outros marcos do fim da temporada', () => {
    const fim = MILESTONES.filter((m) => momentOf(m) === 'fim').map((m) => m.id);
    expect(fim.indexOf('primeira-final')).toBeLessThan(fim.indexOf('primeira-titularidade'));
    // a final fica em silêncio no ano do primeiro título: a cena do título conta a final
    expect(MILESTONES.find((m) => m.id === 'primeira-final')!.espelho).toBe('primeiro-titulo');
    expect(fim.indexOf('primeiro-titulo')).toBeLessThan(fim.indexOf('primeira-titularidade'));
    expect(MAX_PER_SEASON).toBe(3);
  });
});
