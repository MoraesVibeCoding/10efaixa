import { clubsIn } from '../engine/clubs';
import arte from '../data/cenasArte.json';
import kits from '../data/kits.json';
import dados from '../data/uniformes.json';
import { camadasUniforme, uniformeTextura } from './uniformes';

// SPEC v2.98: a camisa e o calção dos 20 clubes da Série A vêm das imagens planas do usuário, esticadas em cada parte da máscara.
describe('uniformes com textura (Série A, v2.98)', () => {
  it('os 20 clubes da Série A têm textura de camisa e de calção, e só eles', () => {
    const ids = clubsIn('A').map((c) => c.id).sort();
    expect(Object.keys(dados.clubes).sort()).toEqual(ids);
    for (const id of ids) {
      const t = uniformeTextura(id);
      expect(t, id).not.toBeNull();
      expect(t!.camisa, id).toMatch(/camisa.*\.webp$/);
      expect(t!.calcao, id).toMatch(/calcao.*\.webp$/);
      expect(t!.calcaoPrincipal, id).toMatch(/^#[0-9A-F]{6}$/i);
      expect(kits.clubes, id).toHaveProperty(id);
    }
  });

  it('clube fora da Série A, seleção e id vazio ficam sem textura (usam o desenho em CSS)', () => {
    expect(uniformeTextura('')).toBeNull();
    expect(uniformeTextura('selecao:brasil')).toBeNull();
    expect(uniformeTextura('clube-que-nao-existe')).toBeNull();
  });

  it('o dado cita fonte e data (regra dos dados oficiais)', () => {
    expect(dados.fonte).toBeTruthy();
    expect(dados.conferidoEm).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('toda cena e todo corte têm as partes medidas; o calção tem exatamente uma parte "calcao"', () => {
    for (const [cena, d] of Object.entries(arte.cenas)) {
      for (const [corte, c] of Object.entries(d.cortes)) {
        const partes = (c as { calcao: boolean; partes?: { camisa: number[][]; calcao: [string, ...number[]][] } }).partes;
        expect(partes, `${cena}/${corte}`).toBeDefined();
        expect(partes!.camisa.length, `${cena}/${corte}`).toBeGreaterThan(0);
        const papeis = partes!.calcao.map((p) => p[0]);
        expect(papeis.filter((p) => p === 'calcao'), `${cena}/${corte}`).toHaveLength((c as { calcao: boolean }).calcao ? 1 : 0);
        for (const p of papeis) expect(['calcao', 'meiao', 'resto']).toContain(p);
        for (const caixa of [...partes!.camisa, ...partes!.calcao.map((p) => p.slice(1) as number[])]) {
          const [x0, y0, x1, y1] = caixa as [number, number, number, number];
          expect(x0 >= 0 && y0 >= 0 && x1 <= 1 && y1 <= 1 && x0 < x1 && y0 < y1, `${cena}/${corte} ${caixa}`).toBe(true);
        }
      }
    }
  });
});

describe('camadas do uniforme (v2.98)', () => {
  const partes = {
    camisa: [[0.25, 0.2, 0.75, 0.6], [0.1, 0.3, 0.2, 0.4]],
    calcao: [['calcao', 0.4, 0.4, 0.6, 0.55], ['meiao', 0.45, 0.6, 0.5, 0.75], ['resto', 0.1, 0.45, 0.2, 0.5]] as [string, number, number, number, number][],
  };
  const tex = { camisa: '/c.webp', calcao: '/s.webp', calcaoPrincipal: '#FFFFFF' };
  const kit = { padrao: 'lisa', camisa: ['#000000'], detalhe: '#000000', calcao: '#FFFFFF', meiao: '#112233' };

  it('uma camada por parte da camisa, esticada na caixa (unidades do contêiner da cena)', () => {
    const { camisa } = camadasUniforme(partes, tex, kit);
    expect(camisa.image).toBe('url(/c.webp), url(/c.webp)');
    expect(camisa.size).toBe('50cqw 40cqh, 10cqw 10cqh');
    expect(camisa.position).toBe('25cqw 20cqh, 10cqw 30cqh');
  });

  it('calção do jogador com a textura, meiões na cor do cadastro e companheiros na cor principal do calção', () => {
    const { calcao } = camadasUniforme(partes, tex, kit);
    expect(calcao.image).toBe('url(/s.webp), linear-gradient(#112233, #112233), linear-gradient(#FFFFFF, #FFFFFF)');
    expect(calcao.size).toBe('20cqw 15cqh, 5cqw 15cqh, 10cqw 5cqh');
    expect(calcao.position).toBe('40cqw 40cqh, 45cqw 60cqh, 10cqw 45cqh');
  });

  it('cena sem partes (ou sem calção) devolve camadas vazias de calção e não quebra', () => {
    const r = camadasUniforme({ camisa: [[0, 0, 1, 1]], calcao: [] }, tex, kit);
    expect(r.calcao.image).toBe('');
    expect(r.camisa.image).toBe('url(/c.webp)');
  });
});
