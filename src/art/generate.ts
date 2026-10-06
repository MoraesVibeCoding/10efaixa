// CLI: `npm run art:generate` grava a arte provisória em src/assets/art/provisoria/ (apaga e recria; a pasta é 100% gerada).
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { generateProvisional, type ProvisionalInput } from './provisional.ts';

const json = (rel: string) => JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'));
const files = generateProvisional({
  scenes: json('../data/scenes.json'), styles: json('../data/avatar.json').styles, celebrations: json('../data/creation.json').celebrations,
  emblems: Object.keys(json('../data/emblems.json').clubes),
} as ProvisionalInput);

const root = join(dirname(new URL(import.meta.url).pathname), '..', 'assets', 'art', 'provisoria');
rmSync(root, { recursive: true, force: true });
for (const [path, svg] of Object.entries(files)) {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), svg);
}
console.log(`${Object.keys(files).length} peças provisórias em ${root}`);
