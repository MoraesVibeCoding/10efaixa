import { applyOption, autoChoice, eligibleEvents, heartSalaryFactor, jeitoOf, pickEvent, validateEvents } from './events';
import { createPrng } from './prng';
import raw from '../data/events.json';
import scenes from '../data/scenes.json';
import ptBR from '../i18n/pt-BR/events.json';

const ctx = (over: Record<string, number | string | boolean> = {}) => ({
  idade: 25, estiraoGrande: false, tracoDesbloqueado: '', tecnicoTrocado: false, propostaDoRival: false,
  salarioAtrasos: 0, propostaDoCoracao: false, propostaDoRivalDoCoracao: false, jogoContraCoracao: false,
  moral: 0.5, relacaoTecnico: 0.6, idolatria: 10, idolatriaCoracao: 0, patrimonio: 0, salarioFator: 1,
  pedirSaida: false, irParaRival: false, aceitarProposta: false, ...over,
});

const ALL_TEMPERAMENTS = ['frio', 'esquentado', 'lider', 'resenha'];

describe('motor de eventos e dilemas (T25)', () => {
  it('catálogo válido: toda cena existe, campos conhecidos, políticas apontam para opções', () => {
    expect(validateEvents(raw, scenes.cenas)).toEqual([]);
  });

  it('evento sem cena (ou com cena inexistente) falha na validação', () => {
    const noScene = structuredClone(raw);
    delete (noScene.eventos[0] as { cena?: string }).cena;
    expect(validateEvents(noScene, scenes.cenas).join()).toMatch(/cena/);
    const badScene = structuredClone(raw);
    badScene.eventos[0]!.cena = 'lua';
    expect(validateEvents(badScene, scenes.cenas).join()).toMatch(/cena/);
  });

  it('campo de efeito desconhecido e política inválida falham', () => {
    const bad = structuredClone(raw);
    (bad.eventos[0]!.opcoes[0]!.efeitos[0] as unknown[])[0] = 'felicidade';
    bad.eventos[1]!.politica.padrao = 'inexistente';
    expect(validateEvents(bad, scenes.cenas).length).toBeGreaterThanOrEqual(2);
  });

  it('condições determinísticas: só eventos cujas condições valem', () => {
    expect(eligibleEvents(ctx())).toEqual([]);
    expect(eligibleEvents(ctx({ salarioAtrasos: 2 }))).toEqual(['salario-atrasado']);
    expect(eligibleEvents(ctx({ estiraoGrande: true, idade: 17 }))).toContain('estirao-grande');
    expect(eligibleEvents(ctx({ estiraoGrande: true, idade: 19 }))).not.toContain('estirao-grande');
  });

  it('marcos da carreira nunca entram no sorteio comum (só o motor de marcos os dispara)', () => {
    const marcos = (raw.eventos as { id: string; marco?: boolean }[]).filter((e) => e.marco).map((e) => e.id);
    expect(marcos.length).toBe(22); // v2.63: a camisa 10; v2.68: a mentalidade
    for (const s of [ctx(), ctx({ moral: 1 }), ctx({ contratoAnosRestantes: 1 })]) {
      for (const id of marcos) expect(eligibleEvents(s)).not.toContain(id);
    }
  });

  it('sorteio: determinístico pela semente e só entre elegíveis; nada elegível = null', () => {
    const c = ctx({ salarioAtrasos: 1, propostaDoRival: true, tecnicoTrocado: true });
    expect(pickEvent(c, createPrng(5))).toBe(pickEvent(c, createPrng(5)));
    for (let s = 0; s < 50; s++) expect(eligibleEvents(c)).toContain(pickEvent(c, createPrng(s)));
    expect(pickEvent(ctx(), createPrng(1))).toBeNull();
  });

  it('efeitos aplicados de forma pura, com limites', () => {
    const s = ctx({ moral: 0.98 });
    const out = applyOption(s, 'estirao-grande', 'tirar-onda');
    expect(out.moral).toBe(1);
    expect(s.moral).toBe(0.98);
    expect(applyOption(ctx(), 'proposta-coracao', 'aceitar-por-amor')).toMatchObject({ aceitarProposta: true, salarioFator: 0.7, idolatriaCoracao: 10 });
    expect(applyOption(ctx({ idolatriaCoracao: -90 }), 'traicao-coracao', 'aceitar').idolatriaCoracao).toBe(-100);
  });

  it('opção inexistente gera erro', () => {
    expect(() => applyOption(ctx(), 'estirao-grande', 'fugir')).toThrow(RangeError);
  });

  it('escolha automática por temperamento (política)', () => {
    expect(autoChoice('proposta-rival', 'esquentado')).toBe('aceitar');
    expect(autoChoice('proposta-rival', 'lider')).toBe('recusar');
    expect(autoChoice('salario-atrasado', 'frio')).toBe('pedir-saida');
    expect(autoChoice('jogo-contra-coracao', 'resenha')).toBe('nao-comemorar');
  });

  it('todo evento e toda opção têm texto pt-BR', () => {
    for (const e of raw.eventos) {
      const t = ptBR[e.id as keyof typeof ptBR];
      expect(t.titulo).toBeTruthy();
      for (const o of e.opcoes) expect(t.opcoes[o.id as keyof typeof t.opcoes]).toBeTruthy();
    }
  });

  it('três opções por decisão, cada uma com o seu jeito (SPEC v2.17); eventos só narrados têm uma opção', () => {
    for (const e of raw.eventos) {
      // v2.68: o marco da mentalidade é a exceção aprovada, com as 4 mentalidades
      expect(e.id === 'mentalidade' ? [4] : [1, 3], e.id).toContain(e.opcoes.length);
      const jeitos = (e.opcoes as { jeito?: string }[]).map((o) => o.jeito);
      if (e.opcoes.length === 1) { expect(jeitos, e.id).toEqual([undefined]); continue; }
      expect(new Set(jeitos).size, e.id).toBe(e.opcoes.length);
      for (const j of jeitos) expect(ALL_TEMPERAMENTS, e.id).toContain(j);
    }
  });

  it('escolha automática: a opção do jeito do jogador; o temperamento sem opção própria segue o padrão', () => {
    for (const e of raw.eventos.filter((x) => x.opcoes.length === 3)) {
      for (const o of e.opcoes as { id: string; jeito: string }[]) {
        expect(jeitoOf(e.id, o.id)).toBe(o.jeito);
        expect(autoChoice(e.id, o.jeito), e.id).toBe(o.id);
      }
      const fourth = ALL_TEMPERAMENTS.find((tmp) => !(e.opcoes as { jeito: string }[]).some((o) => o.jeito === tmp))!;
      expect(autoChoice(e.id, fourth), e.id).toBe(e.politica.padrao);
    }
    expect(jeitoOf('estirao-grande', 'opcao-que-nao-existe')).toBeNull();
  });

  it('configuração inválida é recusada: duas opções, jeito repetido ou jeito desconhecido', () => {
    const scenes = [...new Set(raw.eventos.map((e) => e.cena))];
    const clone = () => structuredClone(raw) as unknown as { eventos: { opcoes: { id: string; jeito?: string }[] }[] };
    const idx = raw.eventos.findIndex((e) => e.opcoes.length === 3);
    const two = clone(); two.eventos[idx]!.opcoes.pop();
    const dup = clone(); dup.eventos[idx]!.opcoes[1]!.jeito = dup.eventos[idx]!.opcoes[0]!.jeito;
    const unk = clone(); unk.eventos[idx]!.opcoes[0]!.jeito = 'zen';
    for (const bad of [two, dup, unk]) expect(validateEvents(bad, scenes)).not.toEqual([]);
  });
});

describe('clube do coração (v2.23): o desconto no salário vem dos dados da opção', () => {
  it('assinar = −15%, jogar por amor = −30%, recusar = sem desconto; quem não tem opção própria segue o padrão', () => {
    expect(heartSalaryFactor('lider')).toBe(0.85);
    expect(heartSalaryFactor('resenha')).toBe(0.7);
    expect(heartSalaryFactor('frio')).toBe(1);
    expect(heartSalaryFactor('esquentado')).toBe(0.7);
  });
});

// T25e: consequências ajustadas ao contexto. Cada opção pode ter `ajustes: [{ etiqueta, efeitos }]`; quando a etiqueta vale, os efeitos extras se somam.
describe('ajuste das consequências por etiqueta (T25e)', () => {
  const state = () => ctx({ moral: 0.5, disciplina: 0.6 });

  it('sem etiqueta (ou com etiqueta que a opção não ajusta), o efeito é o de sempre', () => {
    const base = applyOption(state(), 'festa', 'ir');
    expect(applyOption(state(), 'festa', 'ir', [])).toEqual(base);
    expect(applyOption(state(), 'festa', 'ir', ['capitao', 'convocado'])).toEqual(base);
  });

  it('com a etiqueta, os efeitos extras entram: festa com moral baixa levanta mais o ânimo; veterano paga mais caro no dia seguinte', () => {
    const base = applyOption(state(), 'festa', 'ir');
    const baixa = applyOption(state(), 'festa', 'ir', ['moralBaixa']);
    expect(baixa.moral as number).toBeGreaterThan(base.moral as number);
    const vet = applyOption(state(), 'festa', 'ir', ['veterano']);
    expect(vet.disciplina as number).toBeLessThan(base.disciplina as number);
  });

  it('os limites de cada campo continuam valendo com o ajuste', () => {
    const out = applyOption(ctx({ moral: 0.99, disciplina: 0.01 }), 'festa', 'ir', ['moralBaixa', 'veterano']);
    expect(out.moral as number).toBeLessThanOrEqual(1);
    expect(out.disciplina as number).toBeGreaterThanOrEqual(0);
  });

  it('ajustes do catálogo só usam etiquetas que existem e campos do motor', async () => {
    const { CONTEXT_TAGS } = await import('./contextTags');
    const tags = new Set(CONTEXT_TAGS.map((x) => x.id));
    let total = 0;
    for (const e of raw.eventos as { id: string; opcoes: { id: string; ajustes?: { etiqueta: string; efeitos: [string, string, unknown][] }[] }[] }[]) {
      for (const o of e.opcoes) for (const a of o.ajustes ?? []) {
        total++;
        expect(tags.has(a.etiqueta), `${e.id}/${o.id}: ${a.etiqueta}`).toBe(true);
        for (const [field, op] of a.efeitos) { expect(field in raw.campos, `${e.id}/${o.id}: ${field}`).toBe(true); expect(['add', 'set', 'mul']).toContain(op); }
      }
    }
    expect(total).toBeGreaterThanOrEqual(2);
  });
});
