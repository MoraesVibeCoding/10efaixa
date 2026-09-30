import { ATTRIBUTES, type Attribute, type Attributes } from './attributes';
import { POSITIONS, overall } from './overall';
import { ARCHETYPES, archetypesFor, inspiracao, validateArchetypes } from './archetypes';
import raw from '../data/archetypes.json';
import ptBR from '../i18n/pt-BR/archetypes.json';

const flat = (v: number): Attributes =>
  Object.fromEntries(ATTRIBUTES.map((a) => [a, v])) as Attributes;

const byId = (id: string) => ARCHETYPES.find((a) => a.id === id)!;

// Destaques da tabela 6.2, traduzidos para as chaves de atributo (goleiro via 6.3).
const HIGHLIGHTS: Record<string, Attribute[]> = {
  matador: ['finalizacao', 'mental'],
  arrancador: ['velocidade', 'drible', 'finalizacao'],
  magico: ['habilidade', 'drible', 'passe'],
  centroavanteForca: ['forca', 'finalizacao', 'jogoAereo'],
  classico10: ['passe', 'habilidade', 'finalizacao'],
  regente: ['passe', 'mental', 'marcacao'],
  volanteRaiz: ['marcacao', 'forca', 'fisico'],
  motorzinho: ['velocidade', 'passe', 'fisico'],
  xerifao: ['forca', 'marcacao', 'jogoAereo'],
  zagueiroTecnico: ['passe', 'mental', 'marcacao'],
  lateralApoiador: ['velocidade', 'fisico', 'passe'],
  lateralFoguete: ['velocidade', 'finalizacao'],
  lateralConstrutor: ['passe', 'mental', 'marcacao'],
  paredao: ['velocidade', 'habilidade'],
  goleiroLibero: ['passe', 'jogoAereo'],
  pegadorPenalti: ['velocidade', 'mental'],
};

describe('arquétipos', () => {
  it('o JSON passa no schema', () => {
    expect(validateArchetypes(raw)).toEqual([]);
  });

  it('schema recusa distribuição que não soma 100 e atributo desconhecido', () => {
    const bad = structuredClone(raw) as unknown as Record<string, unknown>[];
    (bad[0]!.distribution as Record<string, number>).finalizacao! += 1;
    (bad[1]!.distribution as Record<string, number>).chute = 0;
    expect(validateArchetypes(bad).length).toBeGreaterThanOrEqual(2);
  });

  it('schema reporta item nulo em vez de quebrar', () => {
    expect(validateArchetypes([null]).length).toBeGreaterThan(0);
  });

  it('são 16, com ids únicos', () => {
    expect(new Set(ARCHETYPES.map((a) => a.id)).size).toBe(16);
    expect(Object.keys(HIGHLIGHTS).sort()).toEqual(ARCHETYPES.map((a) => a.id).sort());
  });

  it.each(Object.entries(HIGHLIGHTS))('%s: destaques estão entre os 4 maiores pesos', (id, hs) => {
    const d = byId(id).distribution;
    const top4 = [...ATTRIBUTES].sort((a, b) => d[b] - d[a]).slice(0, 4);
    for (const h of hs) expect(top4).toContain(h);
  });

  it('Centroavante de força tem pouca Velocidade', () => {
    const d = byId('centroavanteForca').distribution;
    expect(d.velocidade).toBeLessThanOrEqual(5);
  });

  it('traço: 1 por arquétipo; Mágico escolhe entre Ambidestro e Bola parada', () => {
    for (const a of ARCHETYPES) expect(a.traits.length).toBe(a.id === 'magico' ? 2 : 1);
    expect(byId('magico').traits).toEqual(['ambidestro', 'bolaParada']);
  });

  it('Goleiro-líbero nasce com Cobrador latente; só ele', () => {
    expect(byId('goleiroLibero').latentTrait).toBe('cobrador');
    expect(ARCHETYPES.filter((a) => a.latentTrait).length).toBe(1);
  });

  it('toda posição tem ao menos 2 arquétipos; goleiros só no gol', () => {
    for (const p of POSITIONS) expect(archetypesFor(p).length).toBeGreaterThanOrEqual(2);
    expect(archetypesFor('goleiro').map((a) => a.id)).toEqual(['paredao', 'goleiroLibero', 'pegadorPenalti']);
  });

  it('inspiracao obedece à flag inspiracaoLendas', () => {
    expect(inspiracao(byId('matador'), { inspiracaoLendas: true })).toBe('Romário');
    expect(inspiracao(byId('matador'), { inspiracaoLendas: false })).toBeNull();
  });

  it('Centroavante de força: Jogo aéreo pesa mais no overall de atacante', () => {
    const cf = byId('centroavanteForca');
    const base = flat(50);
    const header = { ...base, jogoAereo: 90 };
    const gainPlain = overall(header, 'atacante') - overall(base, 'atacante');
    const gainCf = overall(header, 'atacante', cf.overallWeightBonus) - overall(base, 'atacante', cf.overallWeightBonus);
    expect(gainCf).toBeGreaterThan(gainPlain);
  });

  it('todo arquétipo e todo traço têm rótulo pt-BR', () => {
    for (const a of ARCHETYPES) {
      expect(ptBR.archetype[a.id as keyof typeof ptBR.archetype]).toBeTruthy();
      for (const t of [...a.traits, a.latentTrait ?? a.traits[0]!]) {
        expect(ptBR.trait[t as keyof typeof ptBR.trait]).toBeTruthy();
      }
    }
    expect(ptBR.inspiracao).toContain('{lenda}');
  });
});
