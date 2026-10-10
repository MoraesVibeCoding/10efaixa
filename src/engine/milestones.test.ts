import { fireMilestones, milestoneKey, type MilestoneFacts, type MilestoneMoment } from './milestones';
import data from '../data/milestones.json';
import { t } from '../i18n';

// T25c (SPEC 6.13b, v2.29): marcos da carreira = primeiras vezes. Uma vez por carreira, uma vez por clube; o motor só decide QUAIS
// disparam (dados em milestones.json); o texto e as opções são eventos comuns de events.json.
const base: MilestoneFacts = {
  clubId: 'bahia', proDebut: false, clubDebut: false, titular: false, golsAno: 0, golsCarreira: 0, assistenciasCarreira: 0,
  golsNoClube: 0, cobrador: false, titulosCarreira: 0, finalAno: false, classico: false, capitao: false, camisa10: false, convocado: false,
  jogosSelecao: 0, golsSelecaoAno: 0, copa: false, exterior: false, estreouSelecao: false,
};
const fire = (over: Partial<MilestoneFacts>, done: string[] = [], momento: MilestoneMoment = 'fim') => fireMilestones({ ...base, ...over }, new Set(done), momento).fired.map((m) => m.id);
// v2.78: a chegada abre a temporada (estreias); a convocação e a Copa vêm na hora delas
const chegada = (over: Partial<MilestoneFacts>, done: string[] = []) => fire(over, done, 'chegada');

describe('marcos da carreira (T25c)', () => {
  it('são 22: 17 de carreira (a camisa 10 entrou na v2.63, a mentalidade na v2.68) e 5 de clube, ids únicos, todos com gatilho', () => {
    expect(data.marcos).toHaveLength(22);
    expect(new Set(data.marcos.map((m) => m.id)).size).toBe(22);
    expect(data.marcos.filter((m) => m.escopo === 'carreira')).toHaveLength(17);
    expect(data.marcos.filter((m) => m.escopo === 'clube')).toHaveLength(5);
    for (const m of data.marcos) expect(m.gatilho.length, m.id).toBeGreaterThan(0);
  });

  it('nada acontece sem fato novo', () => {
    expect(fire({})).toEqual([]);
  });

  it('a estreia profissional dispara na primeira temporada no profissional, uma vez só', () => {
    expect(chegada({ proDebut: true })).toEqual(['estreia-profissional', 'mentalidade']); // v2.68: a mentalidade vem com a estreia
    expect(chegada({ proDebut: true }, [milestoneKey('estreia-profissional'), milestoneKey('mentalidade')])).toEqual([]);
  });

  it('o marco do clube é do clube: estreia em outro clube dispara de novo; no mesmo clube não', () => {
    const k = (id: string, c: string) => milestoneKey(id, c);
    expect(chegada({ clubDebut: true, clubId: 'sport' }, [k('estreia-no-clube', 'bahia')])).toEqual(['estreia-no-clube']);
    expect(chegada({ clubDebut: true, clubId: 'sport' }, [k('estreia-no-clube', 'sport')])).toEqual([]);
  });

  it('o marco de clube espelho de um de carreira fica de fora na mesma temporada (a estreia no 1º clube é a profissional)', () => {
    expect(chegada({ proDebut: true, clubDebut: true })).toEqual(['estreia-profissional', 'mentalidade']);
    // v2.78: a chegada ao exterior toma o lugar da chegada ao clube (uma cena de chegada só)
    expect(chegada({ clubDebut: true, exterior: true, clubId: 'porto' }, [milestoneKey('estreia-profissional'), milestoneKey('mentalidade')])).toEqual(['estreia-exterior']);
  });

  it('no máximo o limite de marcos por temporada (v2.80: 3), na ordem de prioridade dos dados; o resto espera a próxima', () => {
    const many = fire({ proDebut: true, titular: true, golsCarreira: 1, golsNoClube: 1, assistenciasCarreira: 1, finalAno: true });
    expect(many).toHaveLength(data.maxPorTemporada);
    // v2.78: a estreia é da chegada, fora do limite; v2.80: a final vem na frente
    expect(many).toEqual(['primeira-final', 'primeira-titularidade', 'primeiro-gol']);
    // com título no mesmo ano, a final fica em silêncio e o título entra no lugar dela
    expect(fire({ titular: true, golsCarreira: 1, finalAno: true, titulosCarreira: 1 })).toEqual(['primeiro-titulo', 'primeira-titularidade', 'primeiro-gol']);
    const later = fire({ titular: true, golsCarreira: 1, assistenciasCarreira: 1 }, [milestoneKey('estreia-profissional')]);
    expect(later).toHaveLength(data.maxPorTemporada);
  });

  it('condições vêm dos dados: primeiro gol exige gol na carreira; título exige título; Copa exige Copa', () => {
    expect(fire({ golsCarreira: 1 })).toEqual(['primeiro-gol']);
    expect(fire({ titulosCarreira: 1 })).toEqual(['primeiro-titulo']);
    expect(fire({ copa: true }, [], 'copa')).toEqual(['primeira-copa']);
    expect(chegada({ exterior: true })).toEqual(['estreia-exterior']);
    expect(fire({ convocado: true, jogosSelecao: 1 }, [], 'convocacao')).toEqual(['primeira-convocacao', 'estreia-selecao']);
    // cada marco só no seu momento
    expect(fire({ proDebut: true, exterior: true, copa: true, convocado: true })).toEqual([]);
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
