import type { Memory } from '../../engine/memory';
import { memoryTextParams } from './memoryText';

// T25d: parâmetros de texto para citar o passado: {mem_<id>_ano}, {mem_<id>_anos}, {mem_<id>_clube}. Só existem para o que aconteceu.
const m = (id: string, year: number, clubId: string): Memory => ({ id, year, age: 20, clubId });

describe('parâmetros de memória para o texto (T25d)', () => {
  it('ano, anos desde então e o nome do clube, pela memória mais recente', () => {
    const p = memoryTextParams([m('perdeuFinal', 2030, 'bahia'), m('lesaoGrave', 2031, 'sport'), m('lesaoGrave', 2035, 'flamengo')], 2038);
    expect(p).toMatchObject({ mem_perdeuFinal_ano: 2030, mem_perdeuFinal_anos: 8, mem_perdeuFinal_clube: 'Bahia' });
    expect(p).toMatchObject({ mem_lesaoGrave_ano: 2035, mem_lesaoGrave_anos: 3, mem_lesaoGrave_clube: 'Flamengo' });
  });

  it('id de marco usa sublinhado no lugar do hífen', () => {
    const p = memoryTextParams([m('primeiro-gol-no-clube', 2027, 'bahia')], 2028);
    expect(p.mem_primeiro_gol_no_clube_anos).toBe(1);
  });

  it('sem a memória, sem o parâmetro (o texto que cita sem a condição falha cedo, no teste de citação)', () => {
    expect(memoryTextParams([], 2030)).toEqual({});
  });
});
