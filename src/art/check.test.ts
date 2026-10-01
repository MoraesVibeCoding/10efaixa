import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const run = (dir: string) =>
  spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', 'src/art/check.ts', dir], { encoding: 'utf8' });

describe('npm run art:check (integração)', () => {
  it('pasta só com peças válidas: sai com código 0', () => {
    const dir = mkdtempSync(join(tmpdir(), 'arte-ok-'));
    mkdirSync(join(dir, 'cabelo'));
    writeFileSync(join(dir, 'cabelo', 'cabelo__curto__frente.svg'), '<svg><g id="cabelo-frente"><path fill="#FF8000"/></g></svg>');
    const r = run(dir);
    expect(r.stdout).toContain('1 arquivo');
    expect(r.status).toBe(0);
  });

  it('peça com problema: relatório por arquivo e código 1', () => {
    const dir = mkdtempSync(join(tmpdir(), 'arte-ruim-'));
    writeFileSync(join(dir, 'Cabelo Curto.svg'), '<svg><g id="x"><path fill="#123456"/></g></svg>');
    const r = run(dir);
    expect(r.status).toBe(1);
    expect(r.stdout).toContain('Cabelo Curto.svg');
    expect(r.stdout).toMatch(/nome/);
    expect(r.stdout).toMatch(/#123456/);
  });
});
