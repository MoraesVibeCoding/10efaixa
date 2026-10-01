import { afterClassico, afterSemester, afterTransfer, status } from './idolatry';
import cfg from '../data/idolatry.json';

describe('clássicos, torcida, ídolo e vilão (T22)', () => {
  it('status: ídolo e vilão pelos limites', () => {
    expect(status(cfg.limites.idolo)).toBe('idolo');
    expect(status(cfg.limites.vilao)).toBe('vilao');
    expect(status(0)).toBe('neutro');
  });

  it('semestre jogando bem aumenta a idolatria; jogando mal diminui; fica em −100..100', () => {
    expect(afterSemester({}, 'bahia', 0.9, 0.8, 'resenha').bahia).toBeGreaterThan(0);
    expect(afterSemester({}, 'bahia', 0.9, -0.8, 'resenha').bahia).toBeLessThan(0);
    let s = {};
    for (let i = 0; i < 50; i++) s = afterSemester(s, 'bahia', 1, 1, 'lider');
    expect((s as Record<string, number>).bahia).toBeLessThanOrEqual(100);
  });

  it('clássico muda a idolatria nos dois sentidos', () => {
    expect(afterClassico({}, 'gremio', 1, 'resenha', null).gremio).toBeGreaterThan(0);
    expect(afterClassico({}, 'gremio', -1, 'resenha', null).gremio).toBeLessThan(0);
  });

  it('temperamento: Esquentado amplifica clássicos; Frio demora a conquistar a torcida', () => {
    const esq = afterClassico({}, 'gremio', 1, 'esquentado', null).gremio!;
    const neutro = afterClassico({}, 'gremio', 1, 'resenha', null).gremio!;
    const frio = afterClassico({}, 'gremio', 1, 'frio', null).gremio!;
    expect(esq).toBeGreaterThan(neutro);
    expect(frio).toBeLessThan(neutro);
    expect(afterClassico({}, 'gremio', -1, 'esquentado', null).gremio!).toBeLessThan(afterClassico({}, 'gremio', -1, 'resenha', null).gremio!);
  });

  it('clássico defendendo o clube de coração vale o dobro (6.18)', () => {
    expect(afterClassico({}, 'gremio', 1, 'resenha', 'gremio').gremio).toBe(2 * afterClassico({}, 'gremio', 1, 'resenha', null).gremio!);
  });

  it('ir para o rival: vira vilão da torcida antiga', () => {
    const s = afterTransfer({ flamengo: 30 }, 'flamengo', 'vasco', null);
    expect(status(s.flamengo!)).toBe('vilao');
    expect(afterTransfer({ flamengo: 30 }, 'flamengo', 'gremio', null).flamengo).toBe(30);
  });

  it('clube de coração: chegada com idolatria maior; ir para rival dele é traição', () => {
    expect(afterTransfer({}, 'bahia', 'vasco', 'vasco').vasco).toBe(cfg.coracao.chegada);
    const s = afterTransfer({ vasco: 20 }, 'bahia', 'flamengo', 'vasco');
    expect(s.vasco).toBe(20 + cfg.coracao.traicao);
  });
});
