/* @layer tests @kind test */
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { buildEngine } from '../src/build-engine.mjs';

const fakes = vi.hoisted(() => ({ downloads: [], runs: [], extracts: [], failOn: undefined }));

vi.mock('../src/download.mjs', async (importOriginal) => ({
  ...(await importOriginal()),
  downloadTo: async (url, file, sha256) => {
    fakes.downloads.push({ url, file, sha256 });
    return file;
  },
}));

vi.mock('../src/run.mjs', async () => {
  const { mkdir: makeDir, writeFile: write } = await import('node:fs/promises');
  const { join: joinPath } = await import('node:path');
  return {
    extractTarGz: async (archive, into) => {
      fakes.extracts.push({ archive, into });
      if (into.endsWith('ap')) {
        await makeDir(joinPath(into, 'worlds', 'alpha'), { recursive: true });
        await write(joinPath(into, 'requirements.txt'), 'websockets>=13\nkivy>=2.3\nPyShortcuts==1.0', 'utf8');
        await write(joinPath(into, 'ModuleUpdate.py'), '# fake', 'utf8');
      } else {
        await makeDir(joinPath(into, 'python'), { recursive: true });
      }
    },
    run: async (cmd, args, { onLine } = {}) => {
      fakes.runs.push(args.join(' '));
      if (fakes.failOn && args.join(' ').includes(fakes.failOn)) throw new Error(`${fakes.failOn} failed`);
      if (args.includes('freeze')) ['websockets==13.1', 'requests==2.32.5', 'WARNING: pip is old'].forEach((line) => onLine?.(line));
    },
  };
});

vi.mock('../src/official/pack-official.mjs', () => ({
  OFFICIAL_DIR: 'official',
  packOfficial: async () => {
    fakes.runs.push('pack-official');
  },
}));

const spec = (ap, python) => ({
  id: `ap-${ap}_py-${python}_win32-x64`,
  target: 'win32-x64',
  ap: { version: ap, commit: `${ap.replaceAll('.', '')}`.padEnd(40, 'e') },
  python: { version: python, release: '20261021', file: `cpython-${python}.tar.gz`, sha256: 'f'.repeat(64) },
  requirements: {
    skip: ['kivy', 'pyshortcuts'],
    extra: ['requests==2.32.5'],
    rules: [{ skip: ['kivy', 'pyshortcuts'], extra: ['requests==2.32.5'] }],
  },
});

let buildDir;

beforeEach(async () => {
  buildDir = await mkdtemp(join(tmpdir(), 'archipelia-bundle-'));
  fakes.downloads.length = 0;
  fakes.runs.length = 0;
  fakes.extracts.length = 0;
  fakes.failOn = undefined;
});

afterEach(() => rm(buildDir, { recursive: true, force: true }));

describe('buildEngine', () => {
  test('builds into a folder named by the spec id and writes the extended manifest', async () => {
    const steps = [];
    const stamp = await buildEngine({ buildDir, spec: spec('0.6.8', '3.12.15'), onStep: (step) => steps.push(step) });
    expect(stamp).toBe(join(buildDir, 'ap-0.6.8_py-3.12.15_win32-x64', 'engine.json'));
    const manifest = JSON.parse(await readFile(stamp, 'utf8'));
    expect(manifest).toMatchObject({
      id: 'ap-0.6.8_py-3.12.15_win32-x64',
      apVersion: '0.6.8',
      pythonVersion: '3.12.15',
      pythonRelease: '20261021',
      target: 'win32-x64',
      root: '.',
      generate: 'ap/Generate.py',
      multiServer: 'ap/MultiServer.py',
      official: 'official',
      packages: ['requests==2.32.5', 'websockets==13.1'],
      rules: [{ skip: ['kivy', 'pyshortcuts'], extra: ['requests==2.32.5'] }],
    });
    expect(manifest.apCommit).toHaveLength(40);
    expect(typeof manifest.builtAt).toBe('number');
    expect(steps).toEqual(['python', 'archipelago', 'requirements', 'official']);
  });

  test('downloads the Python build with its checksum and the source by commit', async () => {
    const built = spec('0.6.8', '3.12.15');
    await buildEngine({ buildDir, spec: built });
    expect(fakes.downloads[0]).toMatchObject({
      url: 'https://github.com/astral-sh/python-build-standalone/releases/download/20261021/cpython-3.12.15.tar.gz',
      sha256: 'f'.repeat(64),
    });
    expect(fakes.downloads[1].url).toBe(`https://codeload.github.com/ArchipelagoMW/Archipelago/tar.gz/${built.ap.commit}`);
    expect(fakes.downloads[1].sha256).toBeUndefined();
    expect(fakes.downloads.every((entry) => entry.file.startsWith(join(buildDir, 'downloads')))).toBe(true);
  });

  test('applies the requirement rules to the requirements file', async () => {
    await buildEngine({ buildDir, spec: spec('0.6.8', '3.12.15') });
    const text = await readFile(join(buildDir, 'ap-0.6.8_py-3.12.15_win32-x64', 'requirements.engine.txt'), 'utf8');
    expect(text.split('\n')).toEqual(['websockets>=13', 'requests==2.32.5']);
  });

  test('a second spec builds beside the first and leaves it untouched', async () => {
    const first = await buildEngine({ buildDir, spec: spec('0.6.7', '3.12.14') });
    await writeFile(join(buildDir, 'ap-0.6.7_py-3.12.14_win32-x64', 'user-world.apworld'), 'x', 'utf8');
    const before = await readFile(first, 'utf8');
    await buildEngine({ buildDir, spec: spec('0.6.8', '3.13.17') });
    expect((await readdir(buildDir)).sort()).toEqual(['ap-0.6.7_py-3.12.14_win32-x64', 'ap-0.6.8_py-3.13.17_win32-x64']);
    expect(await readFile(first, 'utf8')).toBe(before);
    expect(await readdir(join(buildDir, 'ap-0.6.7_py-3.12.14_win32-x64'))).toContain('user-world.apworld');
  });

  test('a built engine skips the base steps when it is built again', async () => {
    const skipped = [];
    await buildEngine({ buildDir, spec: spec('0.6.8', '3.12.15') });
    fakes.downloads.length = 0;
    await buildEngine({ buildDir, spec: spec('0.6.8', '3.12.15'), onSkip: (step) => skipped.push(step) });
    expect(skipped).toEqual(['python', 'archipelago', 'requirements']);
    expect(fakes.downloads).toEqual([]);
  });

  test('a failure removes the half-built folder and keeps the other engines', async () => {
    await buildEngine({ buildDir, spec: spec('0.6.7', '3.12.14') });
    fakes.failOn = 'pip install';
    await expect(buildEngine({ buildDir, spec: spec('0.6.8', '3.12.15') })).rejects.toThrow('pip install failed');
    expect(await readdir(buildDir)).toEqual(expect.not.arrayContaining(['ap-0.6.8_py-3.12.15_win32-x64']));
    expect(await readdir(buildDir)).toContain('ap-0.6.7_py-3.12.14_win32-x64');
  });

  test('a failure while rebuilding a complete engine keeps it', async () => {
    await buildEngine({ buildDir, spec: spec('0.6.8', '3.12.15') });
    fakes.failOn = 'freeze';
    await expect(buildEngine({ buildDir, spec: spec('0.6.8', '3.12.15') })).rejects.toThrow('freeze failed');
    expect(await readdir(buildDir)).toContain('ap-0.6.8_py-3.12.15_win32-x64');
  });

  test('a cancel before the build leaves no folder and starts no download', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(buildEngine({ buildDir, spec: spec('0.6.8', '3.12.15'), signal: controller.signal })).rejects.toThrow();
    expect(await readdir(buildDir)).toEqual([]);
    expect(fakes.downloads).toEqual([]);
  });

  test('a cancel during the requirements removes the folder', async () => {
    const controller = new AbortController();
    const verifySource = async () => controller.abort();
    await expect(buildEngine({ buildDir, spec: spec('0.6.8', '3.12.15'), signal: controller.signal, verifySource })).rejects.toThrow();
    expect(await readdir(buildDir)).toEqual([]);
    expect(fakes.runs.some((line) => line.includes('pip install'))).toBe(false);
  });

  test('the source check runs before pip and a mismatch stops the build', async () => {
    const seen = [];
    const verifySource = async (apRoot) => {
      seen.push(apRoot);
      throw new Error('Archipelago 0.6.8 needs 3.11.9 to 3.13.x');
    };
    await expect(buildEngine({ buildDir, spec: spec('0.6.8', '3.14.9'), verifySource })).rejects.toThrow('needs 3.11.9');
    expect(seen).toEqual([join(buildDir, 'ap-0.6.8_py-3.14.9_win32-x64', 'ap')]);
    expect(fakes.runs).toEqual([]);
    expect(await readdir(buildDir)).toEqual([]);
  });

  test('a source warning reaches the log', async () => {
    const lines = [];
    await buildEngine({ buildDir, spec: spec('0.6.8', '3.11.10'), verifySource: async () => 'Archipelago warns this Python has security issues', onLine: (line) => lines.push(line) });
    expect(lines).toContain('Archipelago warns this Python has security issues');
  });

  test('a call without a spec is refused', async () => {
    await expect(buildEngine({ buildDir })).rejects.toThrow('spec');
  });
});
