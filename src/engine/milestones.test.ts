import { fireMilestones, milestoneKey, type MilestoneFacts } from './milestones';
import data from '../data/milestones.json';
import { t } from '../i18n';

// T25c (SPEC 6.13b, v2.29): marcos da carreira = primeiras vezes. Uma vez por carreira, uma vez por clube; o motor só decide QUAIS
// disparam (dados em milestones.json); o texto e as opções são eventos comuns de events.json.
const base: MilestoneFacts = {
  clubId: 'bahia', proDebut: false, clubDebut: false, titular: false, golsAno: 0, golsCarreira: 0, assistenciasCarreira: 0,
  golsNoClube: 0, cobrador: false, titulosCarreira: 0, finalAno: false, classico: false, capitao: false, convocado: false,
  jogosSelecao: 0, golsSelecaoAno: 0, copa: false, exterior: false, estreouSelecao: false,
};
const fire = (over: Partial<MilestoneFacts>, done: string[] = []) => fireMilestones({ ...base, ...over }, new Set(done)).fired.map((m) => m.id);

describe('marcos da carreira (T25c)', () => {
  it('são 20: 15 de carreira e 5 de clube, ids únicos, todos com gatilho', () => {
    expect(data.marcos).toHaveLength(20);
    expect(new Set(data.marcos.map((m) => m.id)).size).toBe(20);
    expect(data.marcos.filter((m) => m.escopo === 'carreira')).toHaveLength(15);
    expect(data.marcos.filter((m) => m.escopo === 'clube')).toHaveLength(5);
    for (const m of data.marcos) expect(m.gatilho.length, m.id).toBeGreaterThan(0);
  });

  it('nada acontece sem fato novo', () => {
    expect(fire({})).toEqual([]);
  });

  it('a estreia profissional dispara na primeira temporada no profissional, uma vez só', () => {
    expect(fire({ proDebut: true })).toEqual(['estreia-profissional']);
    expect(fire({ proDebut: true }, [milestoneKey('estreia-profissional')])).toEqual([]);
  });

  it('o marco do clube é do clube: estreia em outro clube dispara de novo; no mesmo clube não', () => {
    const k = (id: string, c: string) => milestoneKey(id, c);
    expect(fire({ clubDebut: true, clubId: 'sport' }, [k('estreia-no-clube', 'bahia')])).toEqual(['estreia-no-clube']);
    expect(fire({ clubDebut: true, clubId: 'sport' }, [k('estreia-no-clube', 'sport')])).toEqual([]);
  });

  it('o marco de clube espelho de um de carreira fica de fora na mesma temporada (a estreia no 1º clube é a profissional)', () => {
    expect(fire({ proDebut: true, clubDebut: true })).toEqual(['estreia-profissional']);
  });

  it('no máximo 2 marcos por temporada, na ordem de prioridade dos dados; o resto espera a próxima', () => {
    const many = fire({ proDebut: true, titular: true, golsCarreira: 1, golsNoClube: 1, assistenciasCarreira: 1, finalAno: true });
    expect(many).toHaveLength(data.maxPorTemporada);
    expect(many[0]).toBe('estreia-profissional');
    const later = fire({ titular: true, golsCarreira: 1, assistenciasCarreira: 1 }, [milestoneKey('estreia-profissional')]);
    expect(later).toHaveLength(data.maxPorTemporada);
  });

  it('condições vêm dos dados: primeiro gol exige gol na carreira; título exige título; Copa exige Copa', () => {
    expect(fire({ golsCarreira: 1 })).toEqual(['primeiro-gol']);
    expect(fire({ titulosCarreira: 1 })).toEqual(['primeiro-titulo']);
    expect(fire({ copa: true })).toEqual(['primeira-copa']);
    expect(fire({ exterior: true })).toEqual(['estreia-exterior']);
  });

  it('cobrador: assumir as faltas só para quem ainda não cobra', () => {
    expect(fire({ titular: true, golsCarreira: 5, cobrador: false }, [milestoneKey('primeira-titularidade'), milestoneKey('primeiro-gol')])).toContain('assumir-faltas');
    expect(fire({ titular: true, golsCarreira: 5, cobrador: true }, [milestoneKey('primeira-titularidade'), milestoneKey('primeiro-gol')])).not.toContain('assumir-faltas');
  });

  it('o clube espelho fica em silêncio e registra: o primeiro gol no clube não reaparece na temporada seguinte', () => {
    const r = fireMilestones({ ...base, golsCarreira: 1, golsNoClube: 1 }, new Set());
    expect(r.fired.map((m) => m.id)).toEqual(['primeiro-gol']);
    expect(r.silenced).toEqual([milestoneKey('primeiro-gol-no-clube', 'bahia')]);
    const done = new Set([milestoneKey('primeiro-gol'), ...r.silenced]);
    expect(fireMilestones({ ...base, golsCarreira: 4, golsNoClube: 4 }, done).fired).toEqual([]);
  });

  it('em outro clube o primeiro gol no clube dispara, mesmo com o de carreira já vivido', () => {
    const done = new Set([milestoneKey('primeiro-gol')]);
    expect(fireMilestones({ ...base, golsCarreira: 9, golsNoClube: 1, clubId: 'sport' }, done).fired.map((m) => m.id)).toEqual(['primeiro-gol-no-clube']);
  });
});

describe('álbum dos marcos (T25c)', () => {
  it('todo marco tem um rótulo curto de figurinha em pt-BR, até 30 caracteres', () => {
    for (const m of data.marcos) {
      const label = t(`ui.album.marco.${m.id}`);
      expect(label.length, m.id).toBeGreaterThan(3);
      expect(label.length, m.id).toBeLessThanOrEqual(30);
    }
  });
});
