import { applyOption, autoChoice, eligibleEvents, pickEvent, temperamentsFor, validateEvents } from './events';
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

  it('sorteio: determinístico pela semente e só entre elegíveis; nada elegível = null', () => {
    const c = ctx({ salarioAtrasos: 1, propostaDoRival: true, tecnicoTrocado: true });
    expect(pickEvent(c, createPrng(5))).toBe(pickEvent(c, createPrng(5)));
    for (let s = 0; s < 50; s++) expect(eligibleEvents(c)).toContain(pickEvent(c, createPrng(s)));
    expect(pickEvent(ctx(), createPrng(1))).toBeNull();
  });

  it('efeitos aplicados de forma pura, com limites', () => {
    const s = ctx({ moral: 0.98 });
    const out = applyOption(s, 'estirao-grande', 'seguir');
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
    expect(autoChoice('proposta-rival', 'frio')).toBe('recusar');
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

  it('temperamentos de cada opção: quem a escolheria sozinho; o padrão fica com os que não têm regra própria', () => {
    expect(temperamentsFor('proposta-coracao', 'aceitar-por-amor', ALL_TEMPERAMENTS)).toEqual(['lider', 'resenha']);
    expect(temperamentsFor('proposta-coracao', 'aceitar', ALL_TEMPERAMENTS)).toEqual(['frio', 'esquentado']);
    expect(temperamentsFor('proposta-coracao', 'recusar', ALL_TEMPERAMENTS)).toEqual([]);
    for (const tmp of ALL_TEMPERAMENTS) expect(temperamentsFor('proposta-coracao', autoChoice('proposta-coracao', tmp), ALL_TEMPERAMENTS)).toContain(tmp);
  });
});
