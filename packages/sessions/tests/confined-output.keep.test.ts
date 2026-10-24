/* @layer tests @kind test */
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { zipSync } from 'fflate';
import type { DiskLimit } from '../src/service/disk-limit/disk-limit.type';
import type { SpawnWrap } from '@archipelia/engine';
import type { DataFiles, Session } from '@archipelia/model';
import { diskMessage } from '../src/service/disk-limit/disk-message';
import { produceSession } from '../src/service/produce-session';
import { runtimeOf } from './runtime-of';

const FAKE_GENERATE = [
  "import { cpSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';",
  "import { join } from 'node:path';",
  'const [mode, zip, outside, ...rest] = process.argv.slice(2);',
  "const out = rest[rest.indexOf('--outputpath') + 1];",
  "if (mode === 'sleep') await new Promise((resolve) => setTimeout(resolve, 20000));",
  'mkdirSync(out, { recursive: true });',
  "const junk = Buffer.alloc(3 * 1024 * 1024, 1);",
  "if (mode === 'fill' || mode === 'fillquick') writeFileSync(join(out, 'junk.bin'), junk);",
  "if (mode === 'fillextra') writeFileSync(join(outside, 'junk.bin'), junk);",
  "if (mode === 'fill' || mode === 'fillextra') await new Promise((resolve) => setTimeout(resolve, 20000));",
  "cpSync(zip, join(out, 'AP_1.zip'));",
  "if (mode === 'plant') symlinkSync(outside, join(out, 'AP_1.apsave'), 'junction');",
  "if (mode === 'swap') { cpSync(zip, join(outside, 'AP_1.zip')); rmSync(out, { recursive: true }); symlinkSync(outside, out, 'junction'); }",
  "if (mode === 'link') { rmSync(join(out, 'AP_1.zip')); symlinkSync(zip, join(out, 'AP_1.zip'), 'file'); }",
  "console.log('Creating final archive at ' + join(out, 'AP_1.zip'));",
].join('\n');

let work = '';

beforeEach(async () => {
  work = await mkdtemp(join(tmpdir(), 'archipelia-confined-'));
});

afterEach(async () => {
  await rm(work, { recursive: true, force: true, maxRetries: 20, retryDelay: 100 });
});

const filesAt = (root: string): DataFiles => ({
  path: (rel = '') => join(root, rel),
  exists: (rel) => Promise.resolve(existsSync(join(root, rel))),
  readJson: (_rel, fallback) => Promise.resolve(fallback),
  writeJson: () => Promise.resolve(),
  readText: (rel) => readFile(join(root, rel), 'utf8').catch(() => null),
  writeText: async (rel, text) => {
    await mkdir(dirname(join(root, rel)), { recursive: true });
    await writeFile(join(root, rel), text);
  },
  readBytes: (rel) => readFile(join(root, rel)).then((bytes) => new Uint8Array(bytes), () => null),
  writeBytes: (rel, data) => writeFile(join(root, rel), data),
  list: () => Promise.resolve([]),
  remove: (rel) => rm(join(root, rel), { force: true }),
});

const session: Session = {
  id: 's1', status: 'generating', createdAt: 0,
  snapshot: {
    id: 't', name: 'T', players: [], host: { kind: 'local', port: 1 }, updatedAt: 0,
    generator: { spoiler: 0, race: false, progressionBalancing: true },
    server: { hintCost: 10, releaseMode: 'auto', collectMode: 'auto', remainingMode: 'goal', autoShutdownMinutes: 0 },
  },
};

const produce = async (mode: string, timeoutMs?: number, disk?: DiskLimit) => {
  const script = join(work, 'fake-generate.mjs');
  const zip = join(work, 'seed.zip');
  const outside = join(work, 'outside');
  await mkdir(outside, { recursive: true });
  await writeFile(script, FAKE_GENERATE);
  await writeFile(zip, zipSync({ 'AP_1/AP_1.archipelago': new TextEncoder().encode('multidata') }));
  const wrap: SpawnWrap = (command) => ({ file: process.execPath, args: [script, mode, zip, outside, ...command.args], cwd: work, env: process.env });
  const deps = { files: filesAt(join(work, 'sessions')), emit: () => undefined } as never;
  return produceSession(deps, session, { runtime: runtimeOf('e', '0.6.8'), confine: () => wrap, timeoutMs, disk });
};

const canLinkFiles = await (async () => {
  const dir = await mkdtemp(join(tmpdir(), 'archipelia-link-'));
  const made = await symlink(join(dir, 'target'), join(dir, 'link'), 'file').then(() => true, () => false);
  await rm(dir, { recursive: true, force: true });
  return made;
})();

describe('A1: a confined Generate hands back only its zip', () => {
  test('the zip is copied into a fresh output folder, and a link the world planted is left behind and removed', async () => {
    const { output } = await produce('plant');
    expect(output.zip).toBe('AP_1.zip');
    expect(await readdir(join(work, 'sessions', 's1', 'output'))).toEqual(['AP_1.zip']);
    expect(existsSync(join(work, 'sessions', 's1', 'confined'))).toBe(false);
    expect(await readdir(join(work, 'outside'))).toEqual([]);
  });

  test('an output folder swapped for a link is refused', async () => {
    await expect(produce('swap')).rejects.toThrow('the generator output folder was replaced');
    expect(existsSync(join(work, 'sessions', 's1', 'output'))).toBe(false);
  });

  test.runIf(canLinkFiles)('a zip that is a link is refused', async () => {
    await expect(produce('link')).rejects.toThrow('the generator archive is not a plain file');
  });
});

describe('A3: a Generate run has a time limit', () => {
  test('a run past its limit is stopped and fails with a plain reason', async () => {
    await expect(produce('sleep', 300)).rejects.toThrow(/^Generate ran past/);
  }, 15000);
});

describe('I-81: the disk a confined Generate may fill is capped', () => {
  const cap = (extraDirs: string[] = []): DiskLimit => ({ bytes: 1024 * 1024, extraDirs, intervalMs: 50 });

  test('a run that fills the run folder is stopped while it runs, not after', async () => {
    const started = Date.now();
    await expect(produce('fill', undefined, cap())).rejects.toThrow(/^Generate filled more than/);
    expect(Date.now() - started).toBeLessThan(15000);
    expect(existsSync(join(work, 'sessions', 's1', 'confined'))).toBe(false);
  }, 20000);

  test('the overlay counts too, so a run that fills it is stopped', async () => {
    await expect(produce('fillextra', undefined, cap([join(work, 'outside')]))).rejects.toThrow(/^Generate filled more than/);
  }, 20000);

  test('a run that fills the disk and ends before the next check is still refused', async () => {
    await expect(produce('fillquick', undefined, { ...cap(), intervalMs: 60000 })).rejects.toThrow(/^Generate filled more than/);
  });

  test('a run under the cap passes', async () => {
    const { output } = await produce('plant', undefined, { bytes: 64 * 1024 * 1024, extraDirs: [], intervalMs: 50 });
    expect(output.zip).toBe('AP_1.zip');
  });

  test('a message names the cap in gibibytes', () => {
    expect(diskMessage(2 * 1024 * 1024 * 1024)).toBe('Generate filled more than 2 GiB of disk and was stopped.');
  });
});
