import clubs from './clubs.json';
import europe from './europe.json';
import foreign from './foreignClubs.json';
import revisao from './coresRevisao.json';

// T50j (SPEC v2.37): as cores dos clubes deixam o marinho e branco provisório. O que é palpite fica marcado para o usuário conferir.
const PROVISORIO = ['#14213D', '#FFFFFF'];
const ALL = [...clubs.clubs, ...foreign.clubs, ...europe.clubs, ...europe.outros.clubs, ...europe.foraDoEixo.clubs];
const ids = new Set(ALL.map((c) => c.id));

describe('cores dos clubes (T50j)', () => {
  it('nenhum clube continua no marinho e branco provisório (v2.38: os sem informação foram sorteados)', () => {
    const left = ALL.filter((c) => c.cores[0] === PROVISORIO[0] && c.cores[1] === PROVISORIO[1]).map((c) => c.id);
    expect(left).toEqual([]);
  });

  it('as prováveis foram aprovadas pelo usuário; as sorteadas usam duas cores diferentes da bandeira do estado ou do país', () => {
    expect(revisao.provavel).toEqual([]);
    expect(revisao.aprovadasEm).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const byId = new Map(ALL.map((c) => [c.id, c as { id: string; cores: string[]; uf?: string; pais?: string }]));
    const flags = revisao.bandeiras as Record<string, string[]>;
    expect(revisao.sorteada.length).toBeGreaterThan(0);
    for (const id of revisao.sorteada) {
      const c = byId.get(id)!;
      const place = c.uf ?? c.pais ?? '';
      expect(flags[place], `${id}: sem bandeira de ${place}`).toBeDefined();
      expect(flags[place], id).toEqual(expect.arrayContaining(c.cores));
      expect(c.cores[0], id).not.toBe(c.cores[1]);
    }
  });

  it('a revisão tem data, nota e só ids que existem', () => {
    expect(revisao.data).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(revisao._nota).toMatch(/estimativa/i);
    for (const id of revisao.sorteada) expect(ids.has(id), id).toBe(true);
  });

  it('cores em #RRGGBB, duas por clube', () => {
    for (const c of ALL) {
      expect(c.cores, c.id).toHaveLength(2);
      for (const x of c.cores) expect(x, c.id).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });
});

describe('nomes dos clubes (v2.38)', () => {
  it('nenhum nome se repete entre todos os clubes do jogo (homônimos levam o estado: "Barcelona-BA")', () => {
    const seen = new Map<string, string>();
    const dup: string[] = [];
    for (const c of ALL) {
      const other = seen.get(c.nome);
      if (other) dup.push(`${c.nome}: ${other} e ${c.id}`);
      seen.set(c.nome, c.id);
    }
    expect(dup).toEqual([]);
  });
});
