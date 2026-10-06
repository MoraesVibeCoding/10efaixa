import { cycle } from './look';

describe('cycle (T50g): passo em círculo numa lista', () => {
  const list = ['a', 'b', 'c'];
  it('anda para frente e para trás', () => {
    expect(cycle(list, 'a', 1)).toBe('b');
    expect(cycle(list, 'c', -1)).toBe('b');
  });
  it('depois do último vem o primeiro, e antes do primeiro vem o último', () => {
    expect(cycle(list, 'c', 1)).toBe('a');
    expect(cycle(list, 'a', -1)).toBe('c');
  });
});
