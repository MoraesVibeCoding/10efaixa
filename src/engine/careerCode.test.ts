import { careerCode } from './careerCode';
import type { CreationInput } from './player';

// T55a (SPEC 6.15): código curto da carreira no cartão; os dados para refazer vão no link (T56).
const input: CreationInput = {
  name: 'Jogador Teste', shirtNumber: 11, state: 'SP', position: 'meia', archetypeId: 'armador',
  biotype: { heightCm: 175, build: 'atletico' }, temperament: 'frio', celebration: 'aviaozinho',
  origin: 'varzea', foot: 'direita', heartClub: null,
};
const base = { seed: 1_759_000_000_000, ritmo: 'normal', input, choices: ['aceitar', 'principal|secundario'] };

describe('código da carreira (T55a)', () => {
  it('formato 10F-XXXX-XXXX em base32 Crockford (sem I, L, O, U)', () => {
    expect(careerCode(base)).toMatch(/^10F-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/);
  });

  it('mesma carreira, mesmo código', () => {
    expect(careerCode({ ...base, input: { ...input }, choices: [...base.choices] })).toBe(careerCode(base));
  });

  it('muda com a semente, o ritmo, a criação ou qualquer escolha', () => {
    const c = careerCode(base);
    expect(careerCode({ ...base, seed: base.seed + 1 })).not.toBe(c);
    expect(careerCode({ ...base, ritmo: 'rapido' })).not.toBe(c);
    expect(careerCode({ ...base, input: { ...input, shirtNumber: 9 } })).not.toBe(c);
    expect(careerCode({ ...base, choices: ['recusar', 'principal|secundario'] })).not.toBe(c);
    expect(careerCode({ ...base, choices: ['aceitarprincipal|secundario'] })).not.toBe(c);
  });
});
