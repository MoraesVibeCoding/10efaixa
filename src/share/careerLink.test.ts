import { autoDecide } from '../engine/career';
import { MEETING_EVENT, encodeProposal } from '../engine/meeting';
import { FOCI, type Focus } from '../engine/evolution';
import type { CreationInput } from '../engine/player';
import { runUntilDecision } from '../state/careerRun';
import { VISUAIS } from '../ui/screens/look';
import { careerLinkFragment, parseCareerLink, type CareerLinkData } from './careerLink';

// T57b (SPEC 6.15, v2.49): link da carreira no fragmento da URL, sem nome nem apelido, com leitura estrita.
const input: Omit<CreationInput, 'name'> = {
  shirtNumber: 10, state: 'BA', position: 'meia', archetypeId: 'classico10',
  biotype: { heightCm: 176, build: 'atletico' }, temperament: 'resenha', celebration: 'aviaozinho',
  origin: 'baseGrande', foot: 'direita', heartClub: 'bahia',
};
const data: CareerLinkData = { seed: 1_759_000_000_000, ritmo: 'normal', input, visual: VISUAIS[0]!.id, choices: ['aceitar', 'principal|secundario'] };

/** Monta um link com o conteúdo bruto dado, igual ao que o codec grava (para testar a leitura estrita). */
function rawLink(payload: unknown): string {
  const b64 = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `#c=${b64}`;
}
const good = { v: 1, s: data.seed, r: data.ritmo, i: input, x: data.visual, c: data.choices };

describe('link da carreira (T57b)', () => {
  it('ida e volta devolve a mesma carreira', () => {
    expect(parseCareerLink(careerLinkFragment(data))).toEqual({ ok: true, data });
  });

  it('o fragmento é "#c=" + base64url (sem + / = nem espaço)', () => {
    expect(careerLinkFragment(data)).toMatch(/^#c=[A-Za-z0-9_-]+$/);
  });

  it('nunca carrega nome nem apelido, mesmo que o chamador passe um objeto com eles', () => {
    const leaky = { ...data, input: { ...input, name: 'Fulano Segredo', nickname: 'Apelidão' } } as unknown as CareerLinkData;
    const frag = careerLinkFragment(leaky);
    const decoded = atob(frag.slice(3).replace(/-/g, '+').replace(/_/g, '/'));
    expect(decoded).not.toMatch(/Fulano|Segredo|Apelid|name|nickname/);
    expect(parseCareerLink(frag)).toEqual({ ok: true, data });
  });

  it('opcionais (lado e mentalidade) sobrevivem à ida e volta', () => {
    const d = { ...data, input: { ...input, position: 'ponta' as const, archetypeId: 'ousado', side: 'esquerdo' as const, mentality: 'capitao' } };
    expect(parseCareerLink(careerLinkFragment(d))).toEqual({ ok: true, data: d });
  });

  it('carreira Completa inteira cabe em até 3000 caracteres (medido: ~2400)', () => {
    const choices: string[] = [];
    const full = { ...input, name: 'Jogador Teste' };
    for (let guard = 0; guard < 500; guard++) {
      const step = runUntilDecision(full, data.seed, choices, 'completo');
      if (step.kind === 'done') break;
      choices.push(step.eventId === MEETING_EVENT ? encodeProposal({ main: FOCI[0] as Focus, secondary: FOCI[1] as Focus }) : autoDecide(step.eventId, step.view.temperament, () => step.view));
    }
    expect(choices.length).toBeGreaterThan(20);
    expect(careerLinkFragment({ ...data, ritmo: 'completo', choices }).length).toBeLessThanOrEqual(3000);
  });

  it.each([
    ['vazio', ''],
    ['sem prefixo', 'c=abc'],
    ['prefixo errado', '#x=abc'],
    ['base64 quebrado', '#c=***'],
    ['não é JSON', '#c=bm90IGpzb24'],
  ])('rejeita link com formato ruim: %s', (_n, hash) => {
    expect(parseCareerLink(hash)).toEqual({ ok: false, reason: 'formato' });
  });

  it('rejeita versão desconhecida', () => {
    expect(parseCareerLink(rawLink({ ...good, v: 2 }))).toEqual({ ok: false, reason: 'versao' });
  });

  it('rejeita link grande demais antes de decodificar', () => {
    expect(parseCareerLink(`#c=${'A'.repeat(5000)}`)).toEqual({ ok: false, reason: 'tamanho' });
  });

  it.each([
    ['semente negativa', { s: -1 }],
    ['semente fracionária', { s: 1.5 }],
    ['semente em texto', { s: '123' }],
    ['ritmo desconhecido', { r: 'turbo' }],
    ['visual desconhecido', { x: 'visual-que-nao-existe' }],
    ['posição e estilo incompatíveis', { i: { ...input, archetypeId: 'goleiro-seguro' } }],
    ['clube de coração inexistente', { i: { ...input, heartClub: 'inexistente' } }],
    ['altura fora da faixa', { i: { ...input, biotype: { heightCm: 300, build: 'atletico' } } }],
    ['campo a mais na criação', { i: { ...input, extra: 1 } }],
    ['nome dentro do link', { i: { ...input, name: 'Jogador Teste' } }],
    ['lado inválido', { i: { ...input, side: 'meio' } }],
    ['campo a mais na raiz', { extra: 1 }],
    ['escolhas que não são lista', { c: 'aceitar' }],
    ['escolha que não é texto', { c: ['aceitar', 7] }],
    ['escolha longa demais', { c: ['a'.repeat(65)] }],
    ['escolha com espaço', { c: ['a b'] }],
    ['escolhas demais', { c: Array.from({ length: 301 }, () => 'a') }],
  ])('rejeita conteúdo inválido: %s', (_n, patch) => {
    expect(parseCareerLink(rawLink({ ...good, ...patch }))).toEqual({ ok: false, reason: 'invalido' });
  });

  it('rejeita payload que não é objeto', () => {
    expect(parseCareerLink(rawLink([1, 2]))).toEqual({ ok: false, reason: 'invalido' });
    expect(parseCareerLink(rawLink(null))).toEqual({ ok: false, reason: 'invalido' });
  });
});
