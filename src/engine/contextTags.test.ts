import { CONTEXT_TAGS, contextCtx, tagsOf, type ContextFacts } from './contextTags';

// T25e (SPEC 6.13c): etiquetas de contexto. A situação do jogador vira palavras de motor; a ordem do arquivo é a prioridade.
const base: ContextFacts = {
  idade: 25, moral: 0.6, idolatria: 10, idolatriaCoracao: 0, minutosFracao: 0.7, salarioAtrasos: 0, convocado: false,
  subiuDivisao: false, caiuDivisao: false, foraDoEixo: false, empresarioPressiona: false, posicaoDisputada: false,
  noClubeDeCoracao: false, capitao: false, campeaoNoAno: false,
};
const tags = (over: Partial<ContextFacts>, mem: { id: string; year: number; age: number; clubId: string }[] = []) => tagsOf(contextCtx({ ...base, ...over }, mem, 2030));

describe('etiquetas de contexto (T25e)', () => {
  it('ids únicos; as 4 memórias de história e as situações do SPEC existem', () => {
    const ids = CONTEXT_TAGS.map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ['jovem', 'veterano', 'noBanco', 'idolo', 'vilao', 'moralBaixa', 'salarioAtrasado', 'convocado', 'subindoDeDivisao', 'foraDoEixo', 'empresarioPressiona', 'posicaoDisputada', 'perdeuFinal', 'recusouEuropa', 'trocouPeloRival', 'lesaoGrave']) expect(ids).toContain(id);
  });

  it('jogador comum de 25 anos não tem etiqueta nenhuma', () => {
    expect(tags({})).toEqual([]);
  });

  it('cada situação liga a sua etiqueta', () => {
    expect(tags({ idade: 19 })).toContain('jovem');
    expect(tags({ idade: 33 })).toContain('veterano');
    expect(tags({ minutosFracao: 0.1 })).toContain('noBanco');
    expect(tags({ idolatria: 80 })).toContain('idolo');
    expect(tags({ idolatria: -50 })).toContain('vilao');
    expect(tags({ moral: 0.2 })).toContain('moralBaixa');
    expect(tags({ salarioAtrasos: 2 })).toContain('salarioAtrasado');
    expect(tags({ convocado: true })).toContain('convocado');
    expect(tags({ subiuDivisao: true })).toContain('subindoDeDivisao');
    expect(tags({ caiuDivisao: true })).toContain('caindoDeDivisao');
    expect(tags({ foraDoEixo: true })).toContain('foraDoEixo');
    expect(tags({ empresarioPressiona: true })).toContain('empresarioPressiona');
    expect(tags({ posicaoDisputada: true })).toContain('posicaoDisputada');
    expect(tags({ noClubeDeCoracao: true })).toContain('noClubeDeCoracao');
    expect(tags({ capitao: true })).toContain('capitao');
    expect(tags({ campeaoNoAno: true })).toContain('campeaoNoAno');
  });

  it('memórias viram etiqueta: final perdida, recusa da Europa, troca pelo rival, lesão grave', () => {
    const mem = (id: string) => [{ id, year: 2028, age: 23, clubId: 'bahia' }];
    expect(tags({}, mem('perdeuFinal'))).toContain('perdeuFinal');
    expect(tags({}, mem('recusouEuropa'))).toContain('recusouEuropa');
    expect(tags({}, mem('trocouPeloRival'))).toContain('trocouPeloRival');
    expect(tags({}, mem('lesaoGrave'))).toContain('lesaoGrave');
  });

  it('a ordem é a prioridade: vilão vem antes de jovem; salário atrasado antes de moral baixa', () => {
    expect(tags({ idade: 19, idolatria: -60 })).toEqual(['vilao', 'jovem']);
    const t = tags({ salarioAtrasos: 1, moral: 0.1 });
    expect(t.indexOf('salarioAtrasado')).toBeLessThan(t.indexOf('moralBaixa'));
  });

  it('o contexto leva os fatos e as memórias (mem.*, anos.*) para as condições de evento', () => {
    const ctx = contextCtx({ ...base, idade: 30 }, [{ id: 'lesaoGrave', year: 2027, age: 27, clubId: 'bahia' }], 2030);
    expect(ctx.idade).toBe(30);
    expect(ctx['mem.lesaoGrave']).toBe(true);
    expect(ctx['anos.lesaoGrave']).toBe(3);
  });
});
