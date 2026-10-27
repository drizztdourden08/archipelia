/* @layer tests @kind test */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { parseApworldIndex, parseReleaseManifest } from '../src';
import { runCli } from '../src/cli/run-cli';
import { pngBytes } from './helpers/image-bytes';
import { BUILD, workspace } from './helpers/cli-workspace';
import { ROTP_GAME, ROTP_MODULE } from './helpers/rotp-world.constants';
import { readFixture } from './helpers/read-fixture';
import { cleanTempDirs } from './helpers/temp-dirs';
import { writeFiles } from './helpers/write-files';

afterEach(cleanTempDirs);

const run = async (cwd: string, args: string[]): Promise<{ code: number; out: string; err: string }> => {
  let out = '';
  let err = '';
  const code = await runCli(args, { cwd, out: (text) => { out += text; }, err: (text) => { err += text; } });
  return { code, out, err };
};

describe('the command line', () => {
  test('build-apworld writes the file and prints its hash and size', async () => {
    const dir = await workspace();
    const result = await run(dir, [...BUILD, '--author', 'Relic of the Past']);
    expect(result.code).toBe(0);
    const printed = JSON.parse(result.out) as { file: string; module: string; sha256: string; size: number };
    expect(printed.module).toBe(ROTP_MODULE);
    const bytes = await readFile(printed.file);
    expect(bytes.length).toBe(printed.size);
    const inspected = await run(dir, ['inspect', 'out/world.apworld']);
    expect(inspected.code).toBe(0);
    const info = JSON.parse(inspected.out) as { sha256: string; manifest: { authors: string[]; minimumAp: string } };
    expect(info.sha256).toBe(printed.sha256);
    expect(info.manifest).toMatchObject({ authors: ['Relic of the Past'], minimumAp: '0.6.4' });
  });

  test('check-fit exits 0 when the world fits and 1 with the sentence when it does not', async () => {
    const dir = await workspace();
    await run(dir, [...BUILD, '--maximum-ap', '0.6.8']);
    const fits = await run(dir, ['check-fit', 'out/world.apworld', '--ap', '0.6.8']);
    expect(fits.code).toBe(0);
    expect(fits.out).toContain('fits Archipelago 0.6.8');
    const tooNew = await run(dir, ['check-fit', 'out/world.apworld', '--ap', '0.6.9']);
    expect(tooNew.code).toBe(1);
    expect(tooNew.err).toContain('supports Archipelago 0.6.4 to 0.6.8, not Archipelago 0.6.9');
  });

  test('build-set reads a config and writes the files and the index', async () => {
    const dir = await workspace();
    const config = { game: ROTP_GAME, worldVersion: '0.1.0', appVersion: '0.22.0', minimumAp: '0.6.4', worldDir: ROTP_MODULE, dataFolder: 'generated', outDir: 'release', builds: ['0.6.7', { archipelagoVersion: '0.6.8' }] };
    await writeFiles(dir, { 'kit.json': JSON.stringify(config) });
    const result = await run(dir, ['build-set', '--config', 'kit.json']);
    expect(result.code).toBe(0);
    const index = parseApworldIndex(await readFile(join(dir, 'release', 'relic_of_the_past.apworld.json'), 'utf8'));
    expect(index.builds.map((build) => build.file)).toEqual(['relic_of_the_past-ap0.6.7.apworld', 'relic_of_the_past-ap0.6.8.apworld']);
    expect((await readFile(join(dir, 'release', 'relic_of_the_past.apworld'))).length).toBe(index.builds[1]?.size);
  });

  test('player-yaml writes the YAML to stdout or a file and explains an invalid input', async () => {
    const dir = await workspace();
    const options = await readFile(join(import.meta.dirname, 'fixtures', 'rotp-options.json'), 'utf8');
    const input = { game: ROTP_GAME, slotName: 'Link', description: 'Relic of the Past 0.22.0', options: { progression_balancing: 50, accessibility: 'full', death_link: false, shop_shuffle: 'random', capacity_mode: 2, dungeon_count: 5, seed_text: 'seed: 1234' }, preRolled: { pond: { demands: [1, 2, 3] }, shop: { prices: [], tag: 'random' } } };
    await writeFiles(dir, { 'options.json': options, 'player.json': JSON.stringify(input), 'bad.json': JSON.stringify({ ...input, options: { death_link: 3 } }) });
    const ok = await run(dir, ['player-yaml', '--input', 'player.json', '--schema', 'options.json']);
    expect(ok.code).toBe(0);
    expect(ok.out).toBe(readFixture('rotp-player.yaml'));
    const toFile = await run(dir, ['player-yaml', '--input', 'player.json', '--schema', 'options.json', '--out', 'link.yaml']);
    expect(toFile.out).toBe('');
    expect(await readFile(join(dir, 'link.yaml'), 'utf8')).toBe(readFixture('rotp-player.yaml'));
    const bad = await run(dir, ['player-yaml', '--input', 'bad.json', '--schema', 'options.json']);
    expect(bad.code).toBe(1);
    expect(bad.err).toContain('death_link: expected true or false, got 3.');
  });
});

describe('the release-files command', () => {
  test('writes archipelia.json beside the index, copies the files and warns about HTML', async () => {
    const dir = await workspace();
    const config = { game: ROTP_GAME, worldVersion: '0.1.0', appVersion: '0.22.0', minimumAp: '0.6.4', worldDir: ROTP_MODULE, dataFolder: 'generated', outDir: 'release', builds: ['0.6.7', '0.6.8'] };
    await writeFiles(dir, { 'kit.json': JSON.stringify(config), 'about.md': '<p>hi</p>' });
    await writeFile(join(dir, 'art.png'), pngBytes(512, 512));
    await run(dir, ['build-set', '--config', 'kit.json']);
    const result = await run(dir, ['release-files', '--dir', 'release', '--direct', '--thumbnail', 'art.png', '--description', 'about.md']);
    expect(result.code).toBe(0);
    expect(result.err).toContain('warning: the description holds raw HTML');
    const printed = JSON.parse(result.out) as { manifest: string; thumbnail: string; description: string; warnings: string[] };
    expect(printed.warnings).toHaveLength(1);
    expect(printed.thumbnail).toBe(join(dir, 'release', 'archipelia-thumbnail.png'));
    const manifest = parseReleaseManifest(await readFile(printed.manifest, 'utf8'));
    expect(manifest).toMatchObject({ format: 1, direct: true, module: ROTP_MODULE });
    expect(manifest.builds).toHaveLength(2);
    const plain = await run(dir, ['release-files', '--dir', 'release']);
    expect(plain.code).toBe(0);
    expect(parseReleaseManifest(await readFile(join(dir, 'release', 'archipelia.json'), 'utf8')).direct).toBe(false);
  });

  test('exits 1 with the problems when an image is refused, and 2 without a folder', async () => {
    const dir = await workspace();
    const config = { game: ROTP_GAME, worldVersion: '0.1.0', appVersion: '0.22.0', minimumAp: '0.6.4', worldDir: ROTP_MODULE, dataFolder: 'generated', outDir: 'release', builds: ['0.6.8'] };
    await writeFiles(dir, { 'kit.json': JSON.stringify(config) });
    await writeFile(join(dir, 'wide.png'), pngBytes(1280, 640));
    await run(dir, ['build-set', '--config', 'kit.json']);
    const refused = await run(dir, ['release-files', '--dir', 'release', '--thumbnail', 'wide.png']);
    expect(refused.code).toBe(1);
    expect(refused.err).toContain('must be square');
    expect((await run(dir, ['release-files'])).code).toBe(2);
  });
});

describe('the cli reports problems', () => {
  test('usage mistakes exit 2 and say what is wrong', async () => {
    const dir = await workspace();
    expect((await run(dir, [])).code).toBe(2);
    expect((await run(dir, ['help'])).code).toBe(0);
    const unknown = await run(dir, ['nothing']);
    expect(unknown.code).toBe(2);
    expect(unknown.err).toContain('unknown command "nothing"');
    const missing = await run(dir, ['build-apworld', '--world', ROTP_MODULE]);
    expect(missing.code).toBe(2);
    expect(missing.err).toContain('Missing --out');
    expect((await run(dir, ['inspect', 'a.apworld', '--bogus'])).code).toBe(2);
    expect((await run(dir, ['inspect', 'missing.apworld'])).code).toBe(1);
    expect((await run(dir, ['build-set', '--config', 'missing.json'])).code).toBe(2);
  });
});
