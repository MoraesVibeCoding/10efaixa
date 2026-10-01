// CLI do validador de arte: `npm run art:check -- <pasta>`. Roda direto no Node (remoção de tipos), sem build.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { validateArt, type ArtFormat } from './validateArt.ts';

const dir = process.argv[2];
if (!dir) {
  console.error('Uso: npm run art:check -- <pasta com SVGs>');
  process.exit(2);
}

const format = JSON.parse(readFileSync(new URL('./format.json', import.meta.url), 'utf8')) as ArtFormat;
const walk = (d: string): string[] =>
  readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const files = walk(dir).filter((f) => f.toLowerCase().endsWith('.svg')).sort();

let problems = 0;
for (const file of files) {
  const issues = validateArt(basename(file), readFileSync(file, 'utf8'), format);
  if (!issues.length) continue;
  problems += issues.length;
  console.log(`\n✗ ${relative(dir, file)}`);
  for (const i of issues) console.log(`  [${i.kind}] ${i.message}`);
}

const total = `${files.length} arquivo${files.length === 1 ? '' : 's'}`;
console.log(problems ? `\n${total} conferidos, ${problems} problema(s).` : `\n${total} conferidos, nenhum problema.`);
process.exit(problems ? 1 : 0);
