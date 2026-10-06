import { checkName } from './nameFilter';

describe('filtro de nomes', () => {
  it.each(['', '   '])('vazio: %j', (n) => expect(checkName(n)).toBe('empty'));
  it('curto e longo demais', () => {
    expect(checkName('A')).toBe('tooShort');
    expect(checkName('A'.repeat(25))).toBe('tooLong');
  });

  it.each(['Porra', 'Hitler', 'Macaco', 'Viado', 'João Caralho', 'MÉRDA', 'p0rr4', 'Porrrrra', 'Zé Bóst@', 'caralho-silva'])(
    'palavrão bloqueado mesmo disfarçado: %s', (n) => expect(checkName(n)).toBe('blocked'),
  );

  it.each(['Neymar', 'Ronaldo Nazário', 'Vinícius Júnior', 'Roberto Carlos da Silva', 'Messi'])(
    'nome de pessoa real conhecida bloqueado: %s', (n) => expect(checkName(n)).toBe('blocked'),
  );

  it.each(['Ronaldo Silva', 'Vinícius Cunha', 'Roberto Alves', 'Carlos', 'Deputado Souza', 'Zé', 'Pelé', 'Casagrande', 'Falcão', 'Sócrates', 'Romário', 'Zico', 'Cafu', 'Vagabundo', 'Corno', 'Piranha', 'Babaca'])(
    'nome comum passa: %s', (n) => expect(checkName(n)).toBe('ok'),
  );
});
