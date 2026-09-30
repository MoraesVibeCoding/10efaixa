import { ATTRIBUTES, type Attributes } from './attributes';
import { BUILDS, applyBiotype, isHeightAllowed, type Biotype } from './biotype';
import { POSITIONS } from './overall';
import data from '../data/biotype.json';

const flat = (v: number): Attributes =>
  Object.fromEntries(ATTRIBUTES.map((a) => [a, v])) as Attributes;
const caps = (b: Biotype) => applyBiotype(flat(80), b);

describe('biotipo', () => {
  it.each([
    ['goleiro', 182, 200], ['zagueiro', 178, 198], ['volante', 170, 190],
    ['lateral', 165, 185], ['meia', 162, 185], ['atacante', 162, 195],
  ] as const)('%s: altura escolhível de %i a %i cm, bordas inclusas', (pos, min, max) => {
    expect(isHeightAllowed(pos, min)).toBe(true);
    expect(isHeightAllowed(pos, max)).toBe(true);
    expect(isHeightAllowed(pos, min - 1)).toBe(false);
    expect(isHeightAllowed(pos, max + 1)).toBe(false);
  });

  it('dados: faixa definida para toda posição e toda compleição com efeito', () => {
    for (const p of POSITIONS) expect(data.heightRangesCm[p].min).toBeLessThan(data.heightRangesCm[p].max);
    expect(Object.keys(data.buildCapDelta).sort()).toEqual([...BUILDS].sort());
  });

  it('mais alto: teto maior de Jogo aéreo, menor de Velocidade e Drible', () => {
    const alto = caps({ heightCm: 195, build: 'atletico' });
    const baixo = caps({ heightCm: 165, build: 'atletico' });
    expect(alto.jogoAereo).toBeGreaterThan(baixo.jogoAereo);
    expect(alto.velocidade).toBeLessThan(baixo.velocidade);
    expect(alto.drible).toBeLessThan(baixo.drible);
  });

  it('altura de referência e compleição atlética não mudam os tetos', () => {
    expect(caps({ heightCm: data.referenceHeightCm, build: 'atletico' })).toEqual(flat(80));
  });

  it('compleição: franzino ágil e fraco, forte com Força e menos Velocidade', () => {
    const ref = data.referenceHeightCm;
    const franzino = caps({ heightCm: ref, build: 'franzino' });
    const forte = caps({ heightCm: ref, build: 'forte' });
    expect(franzino.forca).toBeLessThan(80);
    expect(franzino.velocidade).toBeGreaterThan(80);
    expect(franzino.drible).toBeGreaterThan(80);
    expect(forte.forca).toBeGreaterThan(80);
    expect(forte.velocidade).toBeLessThan(80);
  });

  it('tetos sempre inteiros em 1–99, mesmo nos extremos', () => {
    for (const heightCm of [155, 210]) {
      for (const build of BUILDS) {
        for (const base of [1, 99]) {
          for (const v of Object.values(applyBiotype(flat(base), { heightCm, build }))) {
            expect(Number.isInteger(v) && v >= 1 && v <= 99).toBe(true);
          }
        }
      }
    }
  });

  it('aparência não tem efeito: campos visuais extras não mudam nada', () => {
    const b: Biotype = { heightCm: 188, build: 'forte' };
    const comVisual = { ...b, pele: 3, cabelo: 'black power', barba: 'cheia', acessorio: 'faixa' };
    expect(applyBiotype(flat(70), comVisual)).toEqual(applyBiotype(flat(70), b));
  });
});
