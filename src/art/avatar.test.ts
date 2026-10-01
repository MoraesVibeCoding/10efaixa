import { agingOf, composeAvatar, headFiles, mixHex, proportion, recolor, shade, type AvatarSpec } from './avatar';
import cfg from '../data/avatar.json';
import fmt from './format.json';

const K = fmt.keyColors;
const spec: AvatarSpec = {
  skin: cfg.skinTones[0]!.id, hairColor: cfg.hairColors[0]!.id, hairStyle: 'curto', beard: null, expression: 'neutra',
  heightCm: 180, build: 'atletico', age: 20, uniform1: '#112233', uniform2: '#AABBCC', boots: '#334455', headband: null,
};
const pose = `<svg viewBox="0 0 400 800"><g id="braco-tras" data-pivo="150,300"><path fill="${K.pele}"/></g><g id="tronco"><path fill="${K.uniforme1}"/></g>`
  + `<g id="perna-frente" data-pivo="200,500"><path fill="${K.chuteira}"/></g><g id="cabeca-ancora" data-angulo="frente"><rect x="150" y="40" width="100" height="120" fill="none"/></g></svg>`;
const head = (id: string) => `<svg viewBox="0 0 100 120"><g id="${id}"><path fill="${K.cabelo}"/></g></svg>`;

describe('avatar (T44, SPEC 6.17)', () => {
  it('recolor troca só as cores-chave exatas, sem diferenciar maiúsculas', () => {
    const out = recolor(`<path fill="${K.pele}"/><path fill="#ff00fe"/><path fill="${K.pele.toLowerCase()}"/>`, { [K.pele]: '#8D5524' });
    expect(out).toBe('<path fill="#8D5524"/><path fill="#ff00fe"/><path fill="#8D5524"/>');
  });

  it('tem 10 tons de pele e sombra mais escura que o tom', () => {
    expect(cfg.skinTones).toHaveLength(10);
    expect(shade('#FFFFFF', 0.5)).toBe('#808080');
    expect(mixHex('#000000', '#FFFFFF', 0.5)).toBe('#808080');
  });

  it('proporção: altura estica o boneco; compleição alarga ou afina tronco e membros', () => {
    expect(proportion(180, 'atletico')).toEqual({ scaleY: 1, tronco: 1, braco: 1, perna: 1 });
    expect(proportion(198, 'atletico').scaleY).toBeCloseTo(1.1);
    expect(proportion(162, 'atletico').scaleY).toBeCloseTo(0.9);
    expect(proportion(180, 'franzino').tronco).toBeLessThan(1);
    expect(proportion(180, 'forte').tronco).toBeGreaterThan(1);
  });

  it('envelhecimento: grisalho gradual, entradas e rugas por idade', () => {
    expect(agingOf(20, 'curto')).toEqual({ gray: 0, entradas: false, rugas: false });
    const old = agingOf(40, 'curto');
    expect(old.gray).toBeGreaterThan(agingOf(34, 'curto').gray);
    expect(old).toMatchObject({ entradas: true, rugas: true });
    expect(agingOf(40, 'raspado').entradas).toBe(false);
  });

  it('peças da cabeça por ângulo, na ordem do briefing, trocando para entradas e rugas com a idade', () => {
    expect(headFiles(spec, 'frente')).toEqual([
      'rosto__base__frente.svg', 'expressao__neutra__frente.svg', 'cabelo__curto__frente.svg',
    ]);
    const old = headFiles({ ...spec, age: 40, beard: 'cheia', headband: '#FFFFFF' }, 'perfil');
    expect(old).toEqual([
      'rosto__base__perfil.svg', 'rugas__base__perfil.svg', 'expressao__neutra__perfil.svg', 'barba__cheia__perfil.svg',
      'cabelo__curto-entradas__perfil.svg', 'acessorio__faixa-de-cabelo__perfil.svg',
    ]);
  });

  it('monta a cena: recolor, escala por altura, compleição por grupo e cabeça na âncora', () => {
    const parts = { 'rosto__base__frente.svg': head('cabeca'), 'cabelo__curto__frente.svg': head('cabelo-frente'), 'expressao__neutra__frente.svg': head('expressao') };
    const svg = composeAvatar({ ...spec, heightCm: 198, build: 'forte' }, pose, parts);
    expect(svg).toContain(cfg.skinTones[0]!.hex);
    expect(svg).toContain('#112233');
    expect(svg).toContain('#334455');
    for (const k of Object.values(K)) expect(svg).not.toContain(k);
    expect(svg).toMatch(/scale\(1 1\.1\)/);
    expect(svg).toMatch(/<g transform="[^"]*scale\(1\.18 1\)[^"]*" id="tronco"/);
    expect(svg).toMatch(/translate\(150 40\) scale\(1\)/);
    expect(svg.indexOf('id="cabeca"')).toBeLessThan(svg.lastIndexOf('id="cabelo-frente"'));
    expect(composeAvatar(spec, pose, parts)).toBe(composeAvatar(spec, pose, parts));
  });

  it('cabelo-tras fica atrás do rosto e cabelo-frente na frente', () => {
    const hair = '<svg viewBox="0 0 100 120"><g id="cabelo-tras"><path/></g><g id="cabelo-frente"><path/></g></svg>';
    const face = head('cabeca');
    const svg = composeAvatar(spec, pose, { 'rosto__base__frente.svg': face, 'cabelo__curto__frente.svg': hair, 'expressao__neutra__frente.svg': head('expressao') });
    const shown = (id: string) => [...svg.matchAll(new RegExp(`<g[^>]*id="${id}"[^>]*>`, 'g'))].filter((m) => !m[0].includes('display="none"')).map((m) => m.index!);
    expect(shown('cabelo-tras')[0]).toBeLessThan(svg.indexOf('id="cabeca"'));
    expect(shown('cabelo-frente')[0]).toBeGreaterThan(svg.indexOf('id="cabeca"'));
  });
});
