import { applyOption, type Ctx } from './events';
import { riskBand, riskOf } from './preview';
import raw from '../data/events.json';
import injuries from '../data/injuries.json';
import tournaments from '../data/nationalTournaments.json';
import ptBR from '../i18n/pt-BR/events.json';

// Regras da skill 10efaixa-narrativa (SPEC v2.23): toda decisão conta uma situação, tem 3 saídas que pesam e diz o risco em palavras.
type Text = { titulo: string; texto?: string; opcoes: Record<string, string> };
const TEXT = ptBR as unknown as Record<string, Text>;
const EVENTS = raw.eventos as unknown as { id: string; opcoes: { id: string; efeitos: [string, string, unknown][] }[] }[];
const RANGES = raw.campos as Record<string, unknown>;

const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).filter(Boolean).length;

describe('narrativa dos eventos (skill 10efaixa-narrativa)', () => {
  it('toda decisão tem 3 opções (os antigos avisos também); só o marco da mentalidade tem 4 (v2.68, exceção aprovada)', () => {
    for (const e of EVENTS) expect(e.opcoes, e.id).toHaveLength((e as { todosOsJeitos?: boolean }).todosOsJeitos ? 4 : 3);
  });

  it('todo evento tem situação de 2 a 3 frases e até 280 caracteres; título até 40; opção até 55, começando por maiúscula', () => {
    for (const e of EVENTS) {
      const tx = TEXT[e.id]!;
      expect(tx.titulo.length, e.id).toBeLessThanOrEqual(40);
      expect(tx.texto, e.id).toBeTruthy();
      expect(tx.texto!.length, e.id).toBeLessThanOrEqual(280);
      expect(sentences(tx.texto!), e.id).toBeGreaterThanOrEqual(2);
      expect(sentences(tx.texto!), e.id).toBeLessThanOrEqual(3);
      for (const o of e.opcoes) {
        const label = tx.opcoes[o.id]!;
        expect(label.length, `${e.id}/${o.id}`).toBeLessThanOrEqual(55);
        expect(label[0], `${e.id}/${o.id}`).toMatch(/\p{Lu}/u);
      }
    }
  });

  it('tipografia: aspas curvas e reticências de um caractere, nunca aspas retas ou três pontos', () => {
    for (const e of EVENTS) {
      const all = [TEXT[e.id]!.titulo, TEXT[e.id]!.texto ?? '', ...Object.values(TEXT[e.id]!.opcoes)].join(' ');
      expect(all, e.id).not.toMatch(/["']|\.\.\./);
    }
  });

  // Consequências que moram em outras tabelas entram na comparação (mais é melhor para o jogador).
  const EXTERNAL: Record<string, Record<string, Record<string, number>>> = {
    'lesao-grave': Object.fromEntries(Object.entries(injuries.grave).map(([k, v]) => [k, { tempoEmCampo: -v.semestresFora, semRecaida: -v.recaida, fisico: -v.perdaFisica }])),
    'copa-sacrificio': Object.fromEntries(Object.entries(tournaments.momentos['copa-sacrificio']).map(([k, v]) => [k, { forca: (v as { forca?: number }).forca ?? 0, semLesao: -((v as { riscoLesao?: number }).riscoLesao ?? 0) }])),
    'copa-fora-posicao': Object.fromEntries(Object.entries(tournaments.momentos['copa-fora-posicao']).map(([k, v]) => [k, { forca: (v as { forca?: number }).forca ?? 0, emCampo: (v as { semImpactoAteOFim?: boolean }).semImpactoAteOFim ? -1 : 0 }])),
  };
  const BASE: Ctx = { moral: 0.5, relacaoTecnico: 0.5, disciplina: 0.5, prestigio: 0.5, idolatria: 0, idolatriaCoracao: 0, patrimonio: 1_000_000, salarioFator: 1 };

  function profile(eventId: string, optionId: string) {
    const out = applyOption(BASE, eventId, optionId);
    const num: Record<string, number> = { ...EXTERNAL[eventId]?.[optionId] };
    const other: string[] = [];
    for (const k of Object.keys(out)) {
      if (Array.isArray(RANGES[k])) num[k] = (out[k] as number) - ((BASE[k] as number) ?? 0);
      else other.push(`${k}=${String(out[k])}`);
    }
    return { num, other: other.sort().join('|') };
  }

  it('nenhuma opção é melhor ou igual em tudo a outra do mesmo evento, nem idêntica a ela', () => {
    for (const e of EVENTS) {
      const ps = e.opcoes.map((o) => ({ id: o.id, ...profile(e.id, o.id) }));
      for (const a of ps) for (const b of ps) {
        if (a === b || a.other !== b.other) continue;
        const keys = new Set([...Object.keys(a.num), ...Object.keys(b.num)]);
        const ge = [...keys].every((k) => (a.num[k] ?? 0) >= (b.num[k] ?? 0));
        expect(ge, `${e.id}: ${a.id} domina ou repete ${b.id}`).toBe(false);
      }
    }
  });

  // v2.26: o risco aparece na tarja da opção (riskOf), em palavras; o rótulo não repete o risco nem traz número
  it('opção com risco: a faixa sai das tabelas pela tarja; o rótulo não repete o risco nem tem número ou %', () => {
    let withRisk = 0;
    for (const e of EVENTS) {
      for (const o of e.opcoes) {
        if (!riskOf(e.id, o.id)) continue;
        withRisk++;
        const label = TEXT[e.id]!.opcoes[o.id]!;
        expect(label, `${e.id}/${o.id}`).not.toMatch(/risco|%|\d/i);
      }
    }
    expect(withRisk).toBe(5);
  });

  it('faixa de risco vem dos limites em preview.json', () => {
    expect(riskBand(0.05)).toBe('baixo');
    expect(riskBand(0.12)).toBe('medio');
    expect(riskBand(0.25)).toBe('alto');
    expect(riskBand(0.45)).toBe('muitoAlto');
  });
});
