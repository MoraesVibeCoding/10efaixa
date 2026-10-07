import events from '../data/events.json';
import cfg from '../data/preview.json';
import txt from '../i18n/pt-BR/preview.json';
import type { Offer } from './market';
import { offerPreview, outcomeOf, outcomeVerdict, previewOf, riskOf, timeOutOf } from './preview';

const offer = (o: Partial<Offer> = {}): Offer => ({
  clubId: 'x', league: 'BRA-A', currency: 'BRL', annualSalary: 1_000_000, years: 3, role: 'titularRegular', staffQuality: 1,
  heartClub: false, rivalOfCurrent: false, rivalOfHeart: false, offAxis: false, ...o,
});
const effects = events.eventos.flatMap((e) => e.opcoes.map((o) => ({ e: e.id, o: o.id, efeitos: o.efeitos as [string, string, number | string | boolean][] })));
const find = (pred: (f: [string, string, number | string | boolean]) => boolean) => {
  const x = effects.find((x) => x.efeitos.some(pred))!;
  return { field: x.efeitos.find(pred)![0], preview: previewOf(x.e, x.o) };
};

describe('prévia de consequências por opção (T41b, estilo Copero)', () => {
  it('toda opção de todo evento tem prévia válida, só com campo, sentido e intensidade (nenhum número de atributo)', () => {
    for (const x of effects) {
      for (const p of previewOf(x.e, x.o)) {
        expect(Object.keys(p).sort()).toEqual(['campo', 'intensidade', 'sentido']);
        expect(['sobe', 'desce', 'muda']).toContain(p.sentido);
        expect([1, 2, 3]).toContain(p.intensidade);
        expect((txt.campo as Record<string, string>)[p.campo]).toBeTruthy();
      }
    }
    expect(() => previewOf('nao-existe', 'x')).toThrow(RangeError);
  });

  it('sentido: soma positiva sobe, negativa desce, multiplicar por menos de 1 desce, fixar um valor muda', () => {
    const up = find(([, op, v]) => op === 'add' && (v as number) > 0);
    expect(up.preview.find((p) => p.campo === up.field)!.sentido).toBe('sobe');
    const down = find(([, op, v]) => op === 'add' && (v as number) < 0);
    expect(down.preview.find((p) => p.campo === down.field)!.sentido).toBe('desce');
    const mul = find(([, op, v]) => op === 'mul' && (v as number) < 1);
    expect(mul.preview.find((p) => p.campo === mul.field)!.sentido).toBe('desce');
    const set = find(([, op, v]) => op === 'set' && typeof v === 'number');
    expect(set.preview.find((p) => p.campo === set.field)!.sentido).toBe('muda');
  });

  it('escolhas que são a própria ação (sim/não, texto) não entram na prévia', () => {
    const onlyAction = effects.find((x) => x.efeitos.length > 0 && x.efeitos.every(([, , v]) => typeof v !== 'number'))!;
    expect(previewOf(onlyAction.e, onlyAction.o)).toEqual([]);
  });

  it('intensidade cresce com o tamanho do efeito, pelos limites da configuração', () => {
    const moral = effects.flatMap((x) => x.efeitos.filter(([f, op]) => f === 'moral' && op === 'add').map(([, , v]) => ({ v: Math.abs(v as number), i: previewOf(x.e, x.o).find((p) => p.campo === 'moral')!.intensidade })));
    for (const a of moral) for (const b of moral) if (a.v > b.v) expect(a.i).toBeGreaterThanOrEqual(b.i);
    const [small, big] = cfg.intensidade as [number, number];
    for (const m of moral) expect(m.i).toBe(m.v < small ? 1 : m.v < big ? 2 : 3);
    expect(new Set(moral.map((m) => m.i)).size).toBeGreaterThan(1);
  });

  it('proposta: minutos e espaço no elenco pelo papel, salário em faixa contra o atual, duração do contrato', () => {
    expect(offerPreview(offer({ role: 'titularRegular' }), 1_000_000).minutos).toBeGreaterThan(offerPreview(offer({ role: 'disputa' }), 1_000_000).minutos);
    expect(offerPreview(offer({ role: 'disputa' }), 1_000_000).minutos).toBeGreaterThan(offerPreview(offer({ role: 'jovemPromessa' }), 1_000_000).minutos);
    const s = cfg.salario;
    expect(offerPreview(offer(), 1_000_000).salario).toBe('parecido');
    expect(offerPreview(offer({ annualSalary: 1_000_000 * s.menor * 0.9 }), 1_000_000).salario).toBe('menor');
    expect(offerPreview(offer({ annualSalary: 1_000_000 * s.maior * 1.01 }), 1_000_000).salario).toBe('maior');
    expect(offerPreview(offer({ annualSalary: 1_000_000 * s.muitoMaior * 1.01 }), 1_000_000).salario).toBe('muitoMaior');
    expect(offerPreview(offer({ currency: 'EUR' }), 1_000_000).salario).not.toBe('parecido');
    expect(offerPreview(offer(), null).salario).toBe('maior');
    expect(offerPreview(offer({ years: 4 }), 1).anos).toBe(4);
    for (const k of ['menor', 'parecido', 'maior', 'muitoMaior']) expect((txt.salario as Record<string, string>)[k]).toBeTruthy();
    for (const k of Object.keys(cfg.papel)) expect((txt.papel as Record<string, string>)[k]).toBeTruthy();
  });

  it('o resultado real já traz o ajuste da etiqueta (T25e): festa com moral baixa rende mais ânimo', () => {
    const state = { moral: 0.5, disciplina: 0.6 };
    const base = outcomeOf(state, 'festa', 'ir').find((o) => o.campo === 'moral')!.delta;
    const baixa = outcomeOf(state, 'festa', 'ir', ['moralBaixa']).find((o) => o.campo === 'moral')!.delta;
    expect(baixa).toBeGreaterThan(base);
  });

  it('resultado real da escolha: quanto cada campo ganhou ou perdeu de verdade, respeitando os limites', () => {
    const state = { moral: 0.6, relacaoTecnico: 0.6, idolatria: 40, idolatriaCoracao: 55, disciplina: 0.7, patrimonio: 2_000_000, salarioFator: 1 };
    expect(outcomeOf(state, 'salario-atrasado', 'ficar')).toEqual([
      { campo: 'moral', delta: -0.1, unidade: cfg.unidade.moral },
      { campo: 'idolatria', delta: 5, unidade: cfg.unidade.idolatria },
    ]);
    const house = outcomeOf(state, 'casa-da-familia', 'comprar');
    expect(house.find((o) => o.campo === 'patrimonio')!.delta).toBeCloseTo(-300_000);
    // no teto, o ganho real é zero e não entra no resultado
    expect(outcomeOf({ ...state, moral: 1 }, 'casa-da-familia', 'comprar').some((o) => o.campo === 'moral')).toBe(false);
    // escolha que é só a própria ação não tem ganho nem perda
    expect(outcomeOf(state, 'proposta-rival', 'aceitar')).toEqual([]);
    for (const campo of Object.keys(txt.campo)) expect((cfg.unidade as Record<string, string>)[campo], campo).toBeTruthy();
  });

  it('veredito do resultado: positivo, negativo, misto ou neutro', () => {
    const o = (delta: number) => ({ campo: 'moral', delta, unidade: 'pontos100' });
    expect(outcomeVerdict([o(0.1)])).toBe('positivo');
    expect(outcomeVerdict([o(-0.1)])).toBe('negativo');
    expect(outcomeVerdict([o(0.1), o(-0.1)])).toBe('misto');
    expect(outcomeVerdict([])).toBe('neutro');
  });
});

describe('risco e tempo fora por opção (T49c): lidos das tabelas de lesão e de Copa, em faixa de palavras', () => {
  it('lesão grave: o risco é de recaída, na faixa que injuries.json dá; o tempo fora vem em semestres', () => {
    expect(riskOf('lesao-grave', 'operar')).toEqual({ tipo: 'recaida', faixa: 'baixo' });
    expect(riskOf('lesao-grave', 'conservador')).toEqual({ tipo: 'recaida', faixa: 'medio' });
    expect(riskOf('lesao-grave', 'voltar-antes')).toEqual({ tipo: 'recaida', faixa: 'muitoAlto' });
    expect(timeOutOf('lesao-grave', 'operar')).toBe(2);
    expect(timeOutOf('lesao-grave', 'voltar-antes')).toBe(0.5);
  });

  it('Copa no sacrifício: o risco é de lesão; poupar não tem risco', () => {
    expect(riskOf('copa-sacrificio', 'jogar')).toEqual({ tipo: 'lesao', faixa: 'alto' });
    expect(riskOf('copa-sacrificio', 'entrar-no-segundo-tempo')).toEqual({ tipo: 'lesao', faixa: 'medio' });
    expect(riskOf('copa-sacrificio', 'poupar')).toBeNull();
  });

  it('evento sem risco nem tempo fora devolve null', () => {
    expect(riskOf('festa', 'ir')).toBeNull();
    expect(timeOutOf('festa', 'ir')).toBeNull();
    expect(timeOutOf('copa-sacrificio', 'jogar')).toBeNull();
  });
});
