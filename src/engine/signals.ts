import cfg from '../data/signals.json';
import retire from '../data/retirement.json';

// v2.85 (SPEC 6.14, 6.15): os sinais do resumo da temporada. Puro e determinístico: cada sinal sai de um dado do motor e
// só aparece quando ele existe. As paradas forçadas avisam uma temporada antes (a próxima checagem é aos `ageNext`).
export type Signal = 'ultimoAno' | 'corpo' | 'nivel' | 'semVaga' | 'salario' | 'tecnico' | 'noitadas' | 'dinheiro' | 'moral' | 'banco';
export interface SignalsInput {
  /** A idade na checagem de aposentadoria do fim da próxima temporada. */
  ageNext: number;
  graves: number; physical: number; peakPhysical: number;
  overall: number; startingOverall: number;
  /** Fração de minutos da temporada (0–1). */
  minutes: number;
  /** O contrato acaba na janela que vem, e a última janela não trouxe proposta nenhuma. */
  contratoAcabando: boolean; semPropostasNaUltimaJanela: boolean;
  salaryDelays: number; coachRelation: number; discipline: number;
  wealthStart: number; wealthEnd: number; morale: number;
  /** Os sinais ativos no fim da temporada anterior (`activeSignals`): os de `soQuandoComeca` não se repetem. */
  anteriores?: readonly Signal[];
}

/** Todos os sinais que valem agora, na ordem de urgência (sem o corte de `max` nem o filtro de repetição). */
export function activeSignals(s: SignalsInput): Signal[] {
  const f = retire.fisico;
  const on: Record<Signal, boolean> = {
    ultimoAno: s.ageNext >= retire.idadeLimite,
    corpo: s.ageNext >= f.idadeMin
      && (s.graves >= f.gravesParaForcar - cfg.corpo.gravesAntes || s.physical <= s.peakPhysical * (f.fracaoDoAuge + cfg.corpo.margemFisico)),
    nivel: s.ageNext >= retire.overallInicial.idadeMin && s.overall <= s.startingOverall + cfg.nivel.margemOver,
    semVaga: s.contratoAcabando && s.semPropostasNaUltimaJanela,
    salario: s.salaryDelays >= cfg.salario.atrasos,
    tecnico: s.coachRelation <= cfg.tecnico.relacaoMax,
    noitadas: s.discipline <= cfg.noitadas.disciplinaMax,
    dinheiro: s.wealthStart >= cfg.dinheiro.patrimonioMin && s.wealthEnd <= s.wealthStart * (1 - cfg.dinheiro.quedaFracao),
    moral: s.morale <= cfg.moral.moralMax,
    banco: s.ageNext - 1 >= cfg.banco.idadeMin && s.minutes < cfg.banco.minutosMax,
  };
  return (cfg.ordem as Signal[]).filter((id) => on[id]);
}

/** Os sinais do resumo: os ativos, sem repetir os apertos da vida que já valiam na temporada anterior, no máximo `max`. */
export function seasonSignals(s: SignalsInput): Signal[] {
  const once = new Set(cfg.soQuandoComeca);
  const before = new Set(s.anteriores ?? []);
  return activeSignals(s).filter((id) => !(once.has(id) && before.has(id))).slice(0, cfg.max);
}
