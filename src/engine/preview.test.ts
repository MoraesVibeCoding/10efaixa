import events from '../data/events.json';
import cfg from '../data/preview.json';
import txt from '../i18n/pt-BR/preview.json';
import type { Offer } from './market';
import { offerPreview, previewOf } from './preview';

const offer = (o: Partial<Offer> = {}): Offer => ({
  clubId: 'x', league: 'BRA-A', currency: 'BRL', annualSalary: 1_000_000, years: 3, role: 'titular', staffQuality: 1,
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
    expect(offerPreview(offer({ role: 'titular' }), 1_000_000).minutos).toBeGreaterThan(offerPreview(offer({ role: 'rodizio' }), 1_000_000).minutos);
    expect(offerPreview(offer({ role: 'rodizio' }), 1_000_000).minutos).toBeGreaterThan(offerPreview(offer({ role: 'aposta' }), 1_000_000).minutos);
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
});
