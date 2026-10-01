// Validador de entregas de arte (T43; briefing seções 4–5). Puro e sem imports de runtime:
// roda nos testes (Vitest) e no CLI (Node, `npm run art:check`). Mensagens são para o ilustrador.
export type IssueKind = 'nome' | 'camada' | 'cor' | 'peso' | 'proibido';
export interface Issue { kind: IssueKind; message: string }

export interface ArtFormat {
  palette: string[];
  keyColors: Record<string, string>;
  fixedColors: string[];
  angles: string[];
  forbiddenElements: string[];
  categories: Record<string, {
    angle: boolean; budgetKB: number; ordered?: boolean;
    layers?: string[]; anyOf?: string[]; pivots?: string[];
  }>;
}

const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*){1,3}\.svg$/;

/** #abc / #AABBCC → #AABBCC; qualquer outra coisa → null. */
function hex(value: string): string | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!m) return null;
  const h = m[1]!.length === 3 ? [...m[1]!].map((c) => c + c).join('') : m[1]!;
  return `#${h.toUpperCase()}`;
}

function checkName(fileName: string, format: ArtFormat): Issue[] {
  const bad = (message: string): Issue[] => [{ kind: 'nome', message }];
  if (!NAME.test(fileName)) {
    return bad('Nome fora do padrão categoria__peca__variante__angulo.svg (minúsculas, sem acento, palavras com hífen).');
  }
  const parts = fileName.slice(0, -4).split('__');
  const cat = format.categories[parts[0]!];
  if (!cat) return bad(`Categoria "${parts[0]}" desconhecida. Use: ${Object.keys(format.categories).join(', ')}.`);
  if (cat.angle && (parts.length < 3 || !format.angles.includes(parts.at(-1)!))) {
    return bad(`Peça de cabeça precisa terminar com o ângulo: ${format.angles.join(', ')}.`);
  }
  return [];
}

// ponytail: leitura por regex, suficiente para SVG exportado de editor; trocar por parser XML se aparecer SVG atípico.
function checkLayers(fileName: string, svg: string, format: ArtFormat): Issue[] {
  const cat = format.categories[fileName.split('__')[0]!];
  if (!cat) return [];
  const groups = [...svg.matchAll(/<g\b[^>]*\bid="([^"]+)"[^>]*>/g)].map((m) => ({ id: m[1]!, tag: m[0] }));
  const ids = groups.map((x) => x.id);
  const issues: Issue[] = [];
  for (const l of cat.layers ?? []) {
    if (!ids.includes(l)) issues.push({ kind: 'camada', message: `Falta a camada (grupo) "${l}".` });
  }
  if (cat.anyOf && !cat.anyOf.some((l) => ids.includes(l))) {
    issues.push({ kind: 'camada', message: `Precisa de pelo menos uma destas camadas: ${cat.anyOf.join(', ')}.` });
  }
  if (cat.ordered) {
    const pos = (cat.layers ?? []).map((l) => ids.indexOf(l)).filter((i) => i >= 0);
    if (pos.some((p, i) => i > 0 && p < pos[i - 1]!)) {
      issues.push({ kind: 'camada', message: `Camadas fora de ordem. De trás para frente: ${cat.layers!.join(' · ')}.` });
    }
  }
  for (const p of cat.pivots ?? []) {
    const tag = groups.find((x) => x.id === p)?.tag;
    if (tag && !/\bdata-pivo="-?\d+(\.\d+)?,-?\d+(\.\d+)?"/.test(tag)) {
      issues.push({ kind: 'camada', message: `A camada "${p}" precisa do ponto de articulação data-pivo="x,y".` });
    }
  }
  return issues;
}

function checkColors(svg: string, format: ArtFormat): Issue[] {
  const allowed = new Set([...format.palette, ...Object.values(format.keyColors), ...format.fixedColors].map((c) => hex(c)));
  const values = [
    ...[...svg.matchAll(/\b(?:fill|stroke|stop-color|color)="([^"]+)"/g)].map((m) => m[1]!),
    ...[...svg.matchAll(/\bstyle="([^"]*)"/g)].flatMap((m) =>
      [...m[1]!.matchAll(/(?:fill|stroke|stop-color)\s*:\s*([^;]+)/g)].map((x) => x[1]!)),
  ];
  const bad = [...new Set(values.filter((v) => v.trim() !== 'none' && !allowed.has(hex(v))))];
  return bad.map((v) => ({
    kind: 'cor' as const,
    message: `Cor "${v.trim()}" não é cor-chave nem da paleta/lista fixa. Use o hex exato (ex.: pele ${format.keyColors.pele}).`,
  }));
}

function checkForbidden(svg: string, format: ArtFormat): Issue[] {
  return format.forbiddenElements
    .filter((el) => new RegExp(`<${el}\\b`, 'i').test(svg))
    .map((el) => ({ kind: 'proibido' as const, message: `Elemento <${el}> não é permitido (sem raster, script, gradiente, texto ou estilo).` }));
}

function checkWeight(fileName: string, svg: string, format: ArtFormat): Issue[] {
  const cat = format.categories[fileName.split('__')[0]!];
  if (!cat) return [];
  const kb = new TextEncoder().encode(svg).length / 1024;
  return kb > cat.budgetKB
    ? [{ kind: 'peso', message: `Arquivo com ${kb.toFixed(1)} KB; o limite para "${fileName.split('__')[0]}" é ${cat.budgetKB} KB.` }]
    : [];
}

/** Todos os problemas de uma peça; lista vazia = aprovada. */
export function validateArt(fileName: string, svg: string, format: ArtFormat): Issue[] {
  return [
    ...checkName(fileName, format),
    ...checkLayers(fileName, svg, format),
    ...checkColors(svg, format),
    ...checkForbidden(svg, format),
    ...checkWeight(fileName, svg, format),
  ];
}
