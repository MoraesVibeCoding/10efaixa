import { autoDecide, simulateCareer, type Decider } from './career';
import { createPlayer } from './player';
import { createPrng } from './prng';
import { randomInput } from './simulation';
import raw from '../data/events.json';
import creation from '../data/creation.json';

// v2.68 (docs/proposta-inicio-de-carreira.md, seção 2, aprovada): a comemoração e a mentalidade saem da criação. A comemoração é a
// escolha do marco "primeiro gol"; a mentalidade é o marco "Que profissional você vai ser?", com 4 opções (exceção aprovada).
const semEscolhas = (seed: number) => {
  const { celebration: _c, mentality: _m, ...input } = randomInput(createPrng(seed));
  return input;
};
const MENTALIDADES = ['fominha', 'capitao', 'professor', 'maquina'];

describe('criação mais curta (v2.68)', () => {
  it('a criação aceita jogador sem comemoração e sem mentalidade', () => {
    expect(createPlayer(semEscolhas(1), createPrng(1)).ok).toBe(true);
  });

  it('o marco da mentalidade tem as 4 mentalidades, cada uma com um jeito diferente', () => {
    const e = (raw.eventos as { id: string; opcoes: { id: string; jeito: string }[] }[]).find((x) => x.id === 'mentalidade')!;
    expect(e.opcoes.map((o) => o.id).sort()).toEqual([...MENTALIDADES].sort());
    expect(new Set(e.opcoes.map((o) => o.jeito)).size).toBe(4);
  });

  it('quem estreia no profissional passa pelo marco da mentalidade uma vez, e a escolha fica no resultado', () => {
    let com = 0;
    for (let s = 1; s <= 40; s++) {
      const r = simulateCareer(semEscolhas(s), s);
      const m = r.marcos.filter((x) => x.id === 'mentalidade');
      expect(m.length).toBeLessThanOrEqual(1);
      if (m.length) { com++; expect(r.mentality).toBe(m[0]!.option); } else expect(r.mentality).toBeNull();
    }
    expect(com).toBeGreaterThan(30);
  });

  it('a mentalidade escolhida muda a evolução daí em diante', () => {
    const pick = (id: string): Decider => (e, t, v) => (e === 'mentalidade' ? id : autoDecide(e, t, v));
    let diferentes = 0;
    for (let s = 1; s <= 10; s++) {
      const a = simulateCareer(semEscolhas(s), s, 2026, pick('fominha'));
      const b = simulateCareer(semEscolhas(s), s, 2026, pick('maquina'));
      if (JSON.stringify(a.peakAttributes) !== JSON.stringify(b.peakAttributes)) diferentes++;
    }
    expect(diferentes).toBeGreaterThan(5);
  });

  it('a comemoração vem do marco do primeiro gol; sem gol, fica a comemoração padrão', () => {
    const map: Record<string, string> = { 'correr-para-a-torcida': 'aviaozinho', 'fazer-a-danca-ensaiada': 'dancinha', 'abracar-quem-deu-o-passe': 'coracaoMaos' };
    let gols = 0;
    for (let s = 1; s <= 40; s++) {
      const r = simulateCareer(semEscolhas(s), s);
      const m = r.marcos.find((x) => x.id === 'primeiro-gol');
      if (m) { gols++; expect(r.celebration).toBe(map[m.option]); } else expect(r.celebration).toBe(creation.comemoracaoPadrao);
    }
    expect(gols).toBeGreaterThan(20);
  });
});
