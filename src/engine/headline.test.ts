import { simulateCareer } from './career';
import { headlineOf } from './headline';
import { LABELS, VERDICTS } from './legacy';
import { createPrng } from './prng';
import { checkName } from './nameFilter';
import creation from '../data/creation.json';
import ptBR from '../i18n/pt-BR/headlines.json';
import labels from '../i18n/pt-BR/creation.json';

const career = (seed: number, celebration = 'aviaozinho') => simulateCareer({
  name: 'Jogador Teste', shirtNumber: 9, state: 'SP', position: 'atacante', archetypeId: 'matador',
  biotype: { heightCm: 180, build: 'atletico' }, temperament: 'lider', celebration, origin: 'peneira', foot: 'direita', heartClub: null,
}, seed);

describe('manchetes e comentários (T41, SPEC 6.15)', () => {
  it('todo veredito tem pelo menos uma manchete e um comentário', () => {
    for (const v of VERDICTS) {
      expect((ptBR.manchete as Record<string, string[]>)[v]?.length).toBeGreaterThan(0);
      expect((ptBR.comentario as Record<string, string[]>)[v]?.length).toBeGreaterThan(0);
    }
  });

  it('a carreira traz apelido filtrado, manchete e comentário sem placeholder sobrando', () => {
    for (let seed = 0; seed < 30; seed++) {
      const r = career(seed);
      expect(r.nickname).toBeTruthy();
      expect(checkName(r.nickname)).toBe('ok');
      for (const t of [r.headline, r.comment]) {
        expect(t).toBeTruthy();
        expect(t).not.toMatch(/[{}]/);
      }
    }
  });

  it('todo comentário cita a comemoração, e todo rótulo tem comentário próprio', () => {
    const comments = [...Object.values(ptBR.comentario), ...Object.values(ptBR.comentarioRotulo)].flat();
    for (const t of comments) expect(t).toContain('{comemoracao}');
    for (const l of LABELS) expect((ptBR.comentarioRotulo as Record<string, string[]>)[l]?.length).toBeGreaterThan(0);
  });

  it('na carreira, o comentário traz a comemoração do jogador e o apelido aparece nos textos', () => {
    let nick = false;
    for (let s = 0; s < 40; s++) {
      const r = career(s, 'cambalhota');
      expect(r.comment).toContain(labels.celebration.cambalhota.toLowerCase());
      nick ||= (r.headline + r.comment).includes(r.nickname);
    }
    expect(nick).toBe(true);
  });

  it('é determinística pela semente e não mexe no resto da carreira', () => {
    const a = career(7);
    expect(career(7)).toEqual(a);
    expect(headlineOf(a, createPrng(1))).toEqual(headlineOf(a, createPrng(1)));
  });

  it('toda comemoração tem texto e nenhum template cita placeholder desconhecido', () => {
    const known = new Set(['apelido', 'nome', 'comemoracao']);
    const all = [...Object.values(ptBR.manchete), ...Object.values(ptBR.comentario), ...Object.values(ptBR.comentarioRotulo)].flat();
    for (const t of all) for (const m of t.matchAll(/\{(\w+)\}/g)) expect(known.has(m[1]!)).toBe(true);
    for (const c of creation.celebrations) expect((labels.celebration as Record<string, string>)[c]).toBeTruthy();
  });
});
