import { seasonSignals, type Signal, type SignalsInput } from './signals';
import cfg from '../data/signals.json';
import retire from '../data/retirement.json';

// v2.85 (pedido do usuário em 2026-10-11): o resumo da temporada avisa o que está para acontecer. Cada sinal sai de um dado
// do motor e só aparece quando ele existe; as paradas forçadas (40 anos, corpo, nível) avisam uma temporada antes.
const base: SignalsInput = {
  ageNext: 28, graves: 0, physical: 80, peakPhysical: 84, overall: 80, startingOverall: 55, minutes: 0.7,
  contratoAcabando: false, semPropostasNaUltimaJanela: false, salaryDelays: 0, coachRelation: 0.6, discipline: 0.6,
  wealthStart: 1_000_000, wealthEnd: 1_100_000, morale: 0.6,
};
const sinais = (o: Partial<SignalsInput> = {}) => seasonSignals({ ...base, ...o });

describe('sinais do resumo da temporada (v2.85)', () => {
  it('carreira tranquila: nenhum sinal', () => {
    expect(sinais()).toEqual([]);
  });

  it('último ano: a próxima temporada chega ao limite de idade', () => {
    expect(sinais({ ageNext: retire.idadeLimite })).toContain('ultimoAno');
    expect(sinais({ ageNext: retire.idadeLimite - 1 })).not.toContain('ultimoAno');
  });

  it('corpo: perto do gatilho físico (lesões graves ou físico perto da fração do auge), só na idade dele', () => {
    const f = retire.fisico;
    expect(sinais({ ageNext: f.idadeMin, graves: f.gravesParaForcar - 1 })).toContain('corpo');
    expect(sinais({ ageNext: f.idadeMin, physical: 84 * (f.fracaoDoAuge + cfg.corpo.margemFisico / 2) })).toContain('corpo');
    expect(sinais({ ageNext: f.idadeMin - 1, graves: f.gravesParaForcar - 1 })).not.toContain('corpo');
  });

  it('nível: o Over perto do inicial depois do auge', () => {
    const o = retire.overallInicial;
    expect(sinais({ ageNext: o.idadeMin, overall: 55 + cfg.nivel.margemOver })).toContain('nivel');
    expect(sinais({ ageNext: o.idadeMin, overall: 55 + cfg.nivel.margemOver + 1 })).not.toContain('nivel');
    expect(sinais({ ageNext: o.idadeMin - 1, overall: 55 })).not.toContain('nivel');
  });

  it('sem vaga: contrato acabando e ninguém ligou na última janela', () => {
    expect(sinais({ contratoAcabando: true, semPropostasNaUltimaJanela: true })).toContain('semVaga');
    expect(sinais({ contratoAcabando: true })).not.toContain('semVaga');
  });

  it('apertos da vida: salário atrasado, técnico, noitadas, dinheiro, moral e banco', () => {
    expect(sinais({ salaryDelays: cfg.salario.atrasos })).toEqual(['salario']);
    expect(sinais({ coachRelation: cfg.tecnico.relacaoMax })).toEqual(['tecnico']);
    expect(sinais({ discipline: cfg.noitadas.disciplinaMax })).toEqual(['noitadas']);
    expect(sinais({ wealthEnd: 1_000_000 * (1 - cfg.dinheiro.quedaFracao) })).toEqual(['dinheiro']);
    expect(sinais({ wealthStart: cfg.dinheiro.patrimonioMin / 2, wealthEnd: 0 })).toEqual([]);
    expect(sinais({ morale: cfg.moral.moralMax })).toEqual(['moral']);
    expect(sinais({ minutes: cfg.banco.minutosMax / 2 })).toEqual(['banco']);
    expect(sinais({ minutes: 0, ageNext: cfg.banco.idadeMin - 1 })).toEqual([]);
  });

  // os apertos da vida avisam quando começam (não toda temporada); os riscos de parar repetem enquanto valerem
  it('técnico, noitadas, dinheiro, moral e banco não se repetem na temporada seguinte; corpo e salário, sim', () => {
    expect(seasonSignals({ ...base, discipline: 0, anteriores: ['noitadas'] })).toEqual([]);
    expect(seasonSignals({ ...base, discipline: 0, anteriores: [] })).toEqual(['noitadas']);
    expect(seasonSignals({ ...base, salaryDelays: 2, anteriores: ['salario'] })).toEqual(['salario']);
    expect(seasonSignals({ ...base, ageNext: retire.fisico.idadeMin, graves: 9, anteriores: ['corpo'] })).toEqual(['corpo']);
    for (const id of cfg.soQuandoComeca) expect(cfg.ordem).toContain(id);
  });

  it('no máximo dois, na ordem de urgência', () => {
    const tudo = sinais({ ageNext: retire.idadeLimite, graves: 9, salaryDelays: 3, morale: 0, minutes: 0 });
    expect(tudo).toHaveLength(cfg.max);
    expect(tudo).toEqual((cfg.ordem as Signal[]).filter((id) => tudo.includes(id)));
    expect(tudo[0]).toBe('ultimoAno');
  });
});
