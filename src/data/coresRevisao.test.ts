import clubs from './clubs.json';
import europe from './europe.json';
import foreign from './foreignClubs.json';
import revisao from './coresRevisao.json';

// T50j (SPEC v2.37): as cores dos clubes deixam o marinho e branco provisório. O que é palpite fica marcado para o usuário conferir.
const PROVISORIO = ['#14213D', '#FFFFFF'];
const ALL = [...clubs.clubs, ...foreign.clubs, ...europe.clubs, ...europe.outros.clubs, ...europe.foraDoEixo.clubs];
const ids = new Set(ALL.map((c) => c.id));

describe('cores dos clubes (T50j)', () => {
  it('só os clubes de cor desconhecida continuam com o marinho e branco provisório, e estão listados para revisão', () => {
    const left = ALL.filter((c) => c.cores[0] === PROVISORIO[0] && c.cores[1] === PROVISORIO[1]).map((c) => c.id).sort();
    expect(left).toEqual([...revisao.desconhecida].sort());
  });

  it('a revisão tem data, nota e só ids que existem; um clube não é provável e desconhecido ao mesmo tempo', () => {
    expect(revisao.data).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(revisao._nota).toMatch(/estimativa/i);
    for (const id of [...revisao.provavel, ...revisao.desconhecida]) expect(ids.has(id), id).toBe(true);
    expect(revisao.provavel.filter((id) => revisao.desconhecida.includes(id))).toEqual([]);
  });

  it('cores em #RRGGBB, duas por clube', () => {
    for (const c of ALL) {
      expect(c.cores, c.id).toHaveLength(2);
      for (const x of c.cores) expect(x, c.id).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });
});
