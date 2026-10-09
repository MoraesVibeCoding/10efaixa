import { DEFAULT_FIELD } from './onField';
import { FIELD_SLOTS, slotOf, withSlot } from './onField';

// v2.46: campo com 9 camisas; lateral e ponta têm lado (só figurinha e narrativa, nunca atributo).
describe('vagas do campo (v2.46)', () => {
  it('9 vagas, da defesa ao ataque, com lado nas laterais e nas pontas', () => {
    expect(FIELD_SLOTS.map((s) => s.id)).toEqual([
      'goleiro', 'zagueiro', 'lateral-esquerdo', 'lateral-direito', 'volante', 'meia', 'ponta-esquerda', 'ponta-direita', 'atacante',
    ]);
  });

  it('marcar uma vaga define posição e lado; posições sem lado ficam sem lado', () => {
    const pe = withSlot(DEFAULT_FIELD, 'ponta-esquerda');
    expect([pe.position, pe.side]).toEqual(['ponta', 'esquerdo']);
    const ld = withSlot(pe, 'lateral-direito');
    expect([ld.position, ld.side]).toEqual(['lateral', 'direito']);
    const vol = withSlot(ld, 'volante');
    expect([vol.position, vol.side]).toEqual(['volante', null]);
  });

  it('a vaga marcada sai da posição e do lado; lateral sem lado (save antigo) vale como direito', () => {
    expect(slotOf({ ...DEFAULT_FIELD, position: 'ponta', side: 'esquerdo' })).toBe('ponta-esquerda');
    expect(slotOf({ ...DEFAULT_FIELD, position: 'lateral', side: null })).toBe('lateral-direito');
    expect(slotOf(DEFAULT_FIELD)).toBe('');
  });
});

describe('lado na entrada da carreira (v2.46)', () => {
  it('lateral e ponta levam o lado; as outras posições não', async () => {
    const { toCreationInput } = await import('./draft');
    const id = { name: 'Zé', number: '7', state: 'SP', heartClub: '' } as Parameters<typeof toCreationInput>[0];
    const base = { ...DEFAULT_FIELD, archetypeId: 'ousado', temperament: 'frio' };
    expect(toCreationInput(id, withSlot(base, 'ponta-esquerda'), 'varzea').side).toBe('esquerdo');
    expect(toCreationInput(id, withSlot(base, 'meia'), 'varzea').side).toBeUndefined();
  });
});
