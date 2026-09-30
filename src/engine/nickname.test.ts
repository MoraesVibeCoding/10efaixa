import { checkName } from './nameFilter';
import { generateNickname, type NicknameInput } from './nickname';
import { createPrng } from './prng';

const base: NicknameInput = { name: 'Pedro Henrique Souza', state: 'BA', origin: 'varzea', archetypeId: 'centroavanteForca' };

const sample = (over: Partial<NicknameInput>, n = 2_000) => {
  const rng = createPrng(12);
  return Array.from({ length: n }, () => generateNickname({ ...base, ...over }, rng));
};

describe('gerador de apelido', () => {
  it('mesma semente, mesmo apelido', () => {
    expect(generateNickname(base, createPrng(3))).toBe(generateNickname(base, createPrng(3)));
  });

  it('usa o diminutivo do primeiro nome', () => {
    expect(sample({ origin: 'baseGrande' })).toContain('Pedrinho');
    expect(sample({ name: 'João Silva', origin: 'baseGrande' })).toContain('Joãozinho');
  });

  it('usa o gentílico do estado natal', () => {
    expect(sample({}).some((n) => n.includes('Baiano'))).toBe(true);
    expect(sample({ state: 'MG' }).some((n) => n.includes('Mineiro'))).toBe(true);
    expect(sample({ state: 'MG' }).some((n) => n.includes('Baiano'))).toBe(false);
  });

  it('usa o estilo do arquétipo', () => {
    expect(sample({}).some((n) => n.includes('Bomba'))).toBe(true);
    expect(sample({ archetypeId: 'paredao' }).some((n) => n.includes('Paredão'))).toBe(true);
  });

  it('origem pesa: várzea usa mais gentílico/origem, base usa mais diminutivo', () => {
    const dim = (xs: string[]) => xs.filter((n) => n === 'Pedrinho').length;
    expect(dim(sample({ origin: 'baseGrande' }))).toBeGreaterThan(dim(sample({ origin: 'varzea' })));
  });

  it('10 mil apelidos, nenhum bloqueado pelo filtro, nenhum vazio', () => {
    const rng = createPrng(99);
    const names = ['Pedro Souza', 'Carlos Lima', 'Zé Pequeno', 'Tiago Alves', 'Ana Paula'];
    const states = ['BA', 'MG', 'SP', 'RS', 'AM', 'PE'];
    const archetypes = ['matador', 'magico', 'xerifao', 'paredao', 'regente', 'lateralFoguete'];
    const bad: string[] = [];
    for (let i = 0; i < 10_000; i++) {
      const n = generateNickname({
        name: names[i % 5]!, state: states[i % 6]!, archetypeId: archetypes[i % 6]!,
        origin: ['varzea', 'peneira', 'baseGrande'][i % 3]!,
      }, rng);
      if (checkName(n) !== 'ok') bad.push(n);
    }
    expect(bad).toEqual([]);
  });

  it('apelido que cairia no filtro é trocado (nunca devolve texto bloqueado)', () => {
    const n = generateNickname({ ...base, name: 'Neymar' }, createPrng(1));
    expect(checkName(n)).toBe('ok');
  });
});
