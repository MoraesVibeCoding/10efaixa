import { autoDecide } from '../engine/career';
import { MEETING_EVENT } from '../engine/meeting';
import type { CreationInput } from '../engine/player';
import { runUntilDecision } from '../state/careerRun';
import { VISUAIS } from '../ui/screens/look';
import type { CareerLinkData } from './careerLink';
import { reviewLink } from './reviewLink';

// T57d (SPEC 6.15, v2.49): rever a carreira do link. Refaz com o motor; só abre se as escolhas fecham uma carreira inteira.
const input: Omit<CreationInput, 'name'> = {
  shirtNumber: 11, state: 'BA', position: 'meia', archetypeId: 'classico10',
  biotype: { heightCm: 176, build: 'atletico' }, temperament: 'resenha', celebration: 'aviaozinho',
  origin: 'baseGrande', foot: 'direita', heartClub: 'bahia',
};

/** Joga uma carreira Completa com as escolhas automáticas, como quem compartilhou o cartão. */
function fullCareer(): CareerLinkData {
  const choices: string[] = [];
  const full = { ...input, name: 'Original Secreto' };
  for (let guard = 0; guard < 500; guard++) {
    const step = runUntilDecision(full, 7, choices, 'completo');
    if (step.kind === 'done') break;
    choices.push(step.eventId === MEETING_EVENT ? String(step.view.state.sugestao) : autoDecide(step.eventId, step.view.temperament, () => step.view));
  }
  return { seed: 7, ritmo: 'completo', input, visual: VISUAIS[0]!.id, choices, codigo: '10F-7K3Q-9M2X' };
}

describe('rever carreira do link (T57d)', () => {
  const data = fullCareer();

  it('refaz a carreira inteira com o nome genérico dado (o nome original nunca existe aqui)', () => {
    const r = reviewLink(data, 'Jogador do link');
    expect(r.ok).toBe(true);
    if (r.ok) expect(JSON.stringify(r.result)).not.toContain('Original Secreto');
    if (r.ok) expect(r.input.name).toBe('Jogador do link');
  });

  it('é determinística: o mesmo link dá o mesmo resultado', () => {
    const a = reviewLink(data, 'Jogador do link');
    const b = reviewLink(data, 'Jogador do link');
    expect(a.ok && b.ok && JSON.stringify(a.result) === JSON.stringify(b.result)).toBe(true);
  });

  it('escolhas que não fecham a carreira (faltam decisões) não abrem', () => {
    expect(reviewLink({ ...data, choices: data.choices.slice(0, 3) }, 'Jogador do link')).toEqual({ ok: false });
  });

  it('escolha que o motor não aceita não abre', () => {
    const bad = [...data.choices]; bad[0] = 'opcao-que-nao-existe';
    expect(reviewLink({ ...data, choices: bad }, 'Jogador do link')).toEqual({ ok: false });
  });

  it('escolhas sobrando além do fim da carreira não abrem', () => {
    expect(reviewLink({ ...data, choices: [...data.choices, 'extra'] }, 'Jogador do link')).toEqual({ ok: false });
  });
});
