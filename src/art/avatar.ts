import cfg from '../data/avatar.json';
import fmt from './format.json';

// T44 (SPEC 6.17): monta o avatar a partir das peças SVG da skill de arte. Puro e determinístico.
export interface AvatarSpec {
  skin: string; hairColor: string; hairStyle: string; beard: string | null; expression: string;
  heightCm: number; build: string; age: number; uniform1: string; uniform2: string; boots: string; headband: string | null;
}

const K = fmt.keyColors;
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
const num = (x: number) => String(+x.toFixed(3));
const toRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
const toHex = (c: number[]) => `#${c.map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('').toUpperCase()}`;

export const shade = (hex: string, factor: number) => toHex(toRgb(hex).map((v) => v * factor));
export const mixHex = (a: string, b: string, t: number) => {
  const [x, y] = [toRgb(a), toRgb(b)];
  return toHex(x.map((v, i) => v + (y[i]! - v) * t));
};

/** Troca cada cor-chave exata (sem diferenciar maiúsculas) pela cor real; qualquer outra cor fica como está. */
export function recolor(svg: string, map: Record<string, string>): string {
  const up = Object.fromEntries(Object.entries(map).map(([k, v]) => [k.toUpperCase(), v]));
  return svg.replace(/#[0-9a-f]{6}\b/gi, (c) => up[c.toUpperCase()] ?? c);
}

export function proportion(heightCm: number, build: string) {
  const b = (cfg.build as Record<string, { tronco: number; braco: number; perna: number }>)[build] ?? cfg.build.atletico;
  return { scaleY: heightCm / cfg.base.heightCm, ...b };
}

export function agingOf(age: number, hairStyle: string) {
  const a = cfg.aging;
  return {
    gray: clamp((age - a.grayFrom) / (a.grayFull - a.grayFrom), 0, 1) * a.grayMax,
    entradas: age >= a.entradasFrom && hairStyle !== 'raspado',
    rugas: age >= a.rugasFrom,
  };
}

/** Arquivos da cabeça, de trás para frente (o cabelo é um arquivo só; o compositor separa cabelo-tras e cabelo-frente). */
export function headFiles(s: AvatarSpec, angle: string): string[] {
  const ag = agingOf(s.age, s.hairStyle);
  return [
    `rosto__base__${angle}.svg`,
    ...(ag.rugas ? [`rugas__base__${angle}.svg`] : []),
    `expressao__${s.expression}__${angle}.svg`,
    ...(s.beard ? [`barba__${s.beard}__${angle}.svg`] : []),
    `cabelo__${s.hairStyle}${ag.entradas ? '-entradas' : ''}__${angle}.svg`,
    ...(s.headband ? [`acessorio__faixa-de-cabelo__${angle}.svg`] : []),
  ];
}

export function uniformColors(u1: string, u2: string): Record<string, string> {
  const f = cfg.shadowFactor;
  return { [K.uniforme1]: u1, [K.uniforme1Sombra]: shade(u1, f), [K.uniforme2]: u2, [K.uniforme2Sombra]: shade(u2, f) };
}

function palette(s: AvatarSpec): Record<string, string> {
  const skin = cfg.skinTones.find((t) => t.id === s.skin)!.hex;
  const base = cfg.hairColors.find((h) => h.id === s.hairColor)!.hex;
  const hair = mixHex(base, cfg.aging.gray, agingOf(s.age, s.hairStyle).gray);
  const f = cfg.shadowFactor;
  return {
    [K.pele]: skin, [K.peleSombra]: shade(skin, f),
    ...uniformColors(s.uniform1, s.uniform2),
    [K.cabelo]: hair, [K.cabeloSombra]: shade(hair, f),
    [K.chuteira]: s.boots, [K.acessorio]: s.headband ?? '#FFFFFF',
  };
}

const inner = (svg: string) => svg.replace(/^[\s\S]*?<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const attr = (tag: string, name: string) => new RegExp(`\\b${name}="([^"]*)"`).exec(tag)?.[1];
const hide = (svg: string, id: string) => svg.replace(new RegExp(`<g\\b([^>]*\\bid="${id}"[^>]*)>`), '<g display="none"$1>');
const PART: Record<string, 'tronco' | 'braco' | 'perna'> = {
  tronco: 'tronco', pescoco: 'tronco', 'braco-tras': 'braco', 'braco-frente': 'braco', 'perna-tras': 'perna', 'perna-frente': 'perna',
};

/** Escala cada parte do corpo em x em torno do seu pivô (compleição), por atributo `transform` na abertura do grupo. */
function shapeBody(pose: string, p: ReturnType<typeof proportion>): string {
  return pose.replace(/<g\b([^>]*)>/g, (tag, attrs: string) => {
    const part = PART[attr(attrs, 'id') ?? ''];
    const f = part && p[part];
    if (!f || f === 1) return tag;
    const [px, py] = (attr(attrs, 'data-pivo') ?? `${cfg.base.centerX},0`).split(',');
    return `<g transform="translate(${px} ${py}) scale(${num(f)} 1) translate(-${px} -${py})"${attrs}>`;
  });
}

export function composeAvatar(s: AvatarSpec, pose: string, parts: Record<string, string>): string {
  const anchorTag = /<g\b[^>]*\bid="cabeca-ancora"[^>]*>/.exec(pose)?.[0] ?? '';
  const rect = /<rect\b[^>]*>/.exec(pose.slice(pose.indexOf(anchorTag)))?.[0] ?? '';
  const [x, y, w] = ['x', 'y', 'width'].map((n) => Number(attr(rect, n) ?? 0));
  const angle = attr(anchorTag, 'data-angulo') ?? 'frente';

  const files = headFiles(s, angle).filter((f) => parts[f]);
  const vbW = Number(/viewBox="[\d.\-]+ [\d.\-]+ ([\d.]+)/.exec(parts[files[0] ?? ''] ?? '')?.[1] ?? w);
  const hairAt = files.findIndex((f) => f.startsWith('cabelo__'));
  const hair = hairAt >= 0 ? parts[files[hairAt]!]! : null;
  const layer = (f: string) => inner(parts[f]!);
  // cabelo-tras atrás de tudo; cabelo-frente depois da barba e antes do acessório (briefing 5.2).
  const ordered = [
    ...(hair ? [inner(hide(hair, 'cabelo-frente'))] : []),
    ...files.filter((_, i) => i !== hairAt && (hairAt < 0 || i < hairAt)).map(layer),
    ...(hair ? [inner(hide(hair, 'cabelo-tras'))] : []),
    ...files.filter((_, i) => hairAt >= 0 && i > hairAt).map(layer),
  ];
  const p = proportion(s.heightCm, s.build);
  const { centerX: cx, feetY: fy } = cfg.base;
  const body = `<g transform="translate(${cx} ${fy}) scale(1 ${num(p.scaleY)}) translate(-${cx} -${fy})">${shapeBody(inner(pose), p)}`
    + `<g transform="translate(${x} ${y}) scale(${num(w && vbW ? w / vbW : 1)})">${ordered.join('')}</g></g>`;
  return recolor(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 800">${body}</svg>`, palette(s));
}
