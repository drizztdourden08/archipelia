/* @layer tests @kind test */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { BUILD, workspace } from './helpers/cli-workspace';
import { cleanTempDirs } from './helpers/temp-dirs';

afterEach(cleanTempDirs);

const ROOT = join(import.meta.dirname, '..');
const BIN = join(ROOT, 'bin', 'archipelia-kit.mjs');
const DIST = join(ROOT, 'dist');
const BUILD_TIMEOUT = 120000;

const spawn = (cwd: string, args: string[], timezone = 'UTC') => spawnSync(process.execPath, [BIN, ...args], {
  cwd,
  encoding: 'utf8',
  env: { ...process.env, TZ: timezone },
});

const hashOf = (stdout: string): string => (JSON.parse(stdout) as { sha256: string }).sha256;

describe('the bin file runs the source', () => {
  beforeAll(() => rm(DIST, { recursive: true, force: true }));

  test('runs under plain node and gives the same hash in any time zone', async () => {
    const dir = await workspace();
    const first = spawn(dir, BUILD, 'UTC');
    expect(first.status).toBe(0);
    expect(first.stderr).toBe('');
    const second = spawn(dir, BUILD, 'Pacific/Auckland');
    expect(second.status).toBe(0);
    expect(hashOf(second.stdout)).toBe(hashOf(first.stdout));
  });

  test('exits with the failure code and a message', async () => {
    const dir = await workspace();
    const failed = spawn(dir, ['check-fit', 'nothing.apworld', '--ap', '0.6.8']);
    expect(failed.status).toBe(1);
    expect(failed.stderr).toContain('archipelia-kit:');
  });
});

describe('the published package', () => {
  afterAll(() => rm(DIST, { recursive: true, force: true }));

  test('names the GitHub Packages scope and registry, and is not private', () => {
    const manifest = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as Record<string, unknown>;
    expect(manifest.name).toBe('@drizztdourden08/archipelia-client-kit');
    expect(manifest.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(manifest.private).toBeUndefined();
    expect(manifest.publishConfig).toEqual({ registry: 'https://npm.pkg.github.com' });
    expect(manifest.files).toEqual(['bin', 'dist', 'README.md']);
  });

  test('builds plain JavaScript and declarations that run without type stripping', async () => {
    const dir = await workspace();
    const reference = hashOf(spawn(dir, BUILD).stdout);
    const built = spawnSync(process.execPath, [join(ROOT, 'scripts', 'build.mjs')], { cwd: ROOT, encoding: 'utf8' });
    expect(built.status, built.stderr).toBe(0);
    for (const file of ['index.js', 'node.js', 'cli.js', 'types/index.d.ts', 'types/node/index.d.ts']) {
      expect(existsSync(join(DIST, file)), file).toBe(true);
    }
    const viaDist = spawn(dir, BUILD);
    expect(viaDist.status).toBe(0);
    expect(hashOf(viaDist.stdout)).toBe(reference);
    const library = (await import(pathToFileURL(join(DIST, 'index.js')).href)) as { buildPlayerYaml: (input: unknown) => string };
    expect(library.buildPlayerYaml({ game: 'G', slotName: 'S', options: { a: 1 } })).toBe('name: S\ngame: G\nG:\n  a: 1\n');
  }, BUILD_TIMEOUT);
});
