/* @layer tests @kind test */
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { downloadArchive } from '../src/build/download-archive';
import { entryParts } from '../src/build/entry-parts';
import { readArchiveFile } from '../src/build/read-archive-file';
import { unpackArchive } from '../src/build/unpack-archive';
import { archiveOf, COMMIT, PROJECT_FILES, rawArchive, SOURCE_URL, TOP } from './build.fixtures';
import { routedFetch } from './source.fixtures';

let base = '';

beforeAll(async () => {
  base = await mkdtemp(join(tmpdir(), 'archipelia-build-archive-'));
});

afterAll(() => rm(base, { recursive: true, force: true }));

const fresh = async (name: string) => {
  const dir = join(base, name);
  await mkdir(dir, { recursive: true });
  return dir;
};

const site = { owner: 'Pseudoarc', repo: 'ctrando', sha: COMMIT };

const signal = new AbortController().signal;

describe('downloading the source archive', () => {
  test('takes the archive of the pinned commit from codeload, and hashes the bytes it received', async () => {
    const bytes = archiveOf(PROJECT_FILES);
    const { net, seen } = routedFetch({ [SOURCE_URL]: () => new Response(bytes) });
    const dir = await fresh('download');
    const archive = await downloadArchive(site, net, { dir, signal });
    expect(seen).toEqual([SOURCE_URL]);
    expect(archive).toMatchObject({ sha256: createHash('sha256').update(bytes).digest('hex'), size: bytes.length });
    expect(new Uint8Array(await readFile(archive.file))).toEqual(bytes);
  });

  test('never follows a redirect, so the archive can only come from codeload', async () => {
    const { net, seen } = routedFetch({ [SOURCE_URL]: () => new Response(null, { status: 302, headers: { location: 'https://evil.example/x.zip' } }) });
    await expect(downloadArchive(site, net, { dir: await fresh('redirect'), signal })).rejects.toThrow('GitHub answered 302');
    expect(seen).toEqual([SOURCE_URL]);
  });

  test('refuses an answer that is not a success, and an archive that announces more than it takes', async () => {
    const missing = routedFetch({});
    await expect(downloadArchive(site, missing.net, { dir: await fresh('missing'), signal })).rejects.toThrow('GitHub answered 404');
    const huge = routedFetch({ [SOURCE_URL]: () => new Response('x', { headers: { 'content-length': String(900 * 1024 * 1024) } }) });
    await expect(downloadArchive(site, huge.net, { dir: await fresh('huge'), signal })).rejects.toThrow('larger than Archipelia takes');
  });
});

describe('unpacking the source archive', () => {
  test('writes the project into the folder without the top folder of the archive', async () => {
    const dir = await fresh('unpack');
    const file = join(dir, 'source.zip');
    await writeFile(file, archiveOf(PROJECT_FILES));
    expect(await unpackArchive(file, join(dir, 'src'))).toBe(3);
    expect(await readFile(join(dir, 'src', 'pyproject.toml'), 'utf8')).toContain('[build-system]');
    expect((await readdir(join(dir, 'src', 'src', 'ctrando'))).sort()).toEqual(['__init__.py', 'compression']);
    expect(await readArchiveFile(file, 'pyproject.toml')).toContain('setuptools>=61');
    expect(await readArchiveFile(file, 'setup.py')).toBeUndefined();
  });

  const hostile: Record<string, Record<string, string>> = {
    'a path that climbs out': { [`${TOP}/../evil.txt`]: 'x' },
    'a path that climbs out deeper': { [`${TOP}/a/../../../evil.txt`]: 'x' },
    'an absolute path': { '/evil.txt': 'x' },
    'a drive letter': { [`${TOP}/C:/evil.txt`]: 'x' },
    'a backslash path': { [`${TOP}\\..\\evil.txt`]: 'x' },
    'a nul byte': { [`${TOP}/a\0b`]: 'x' },
    'an empty segment': { [`${TOP}//evil.txt`]: 'x' },
  };

  test.each(Object.keys(hostile))('refuses an archive with %s, and writes nothing outside the folder', async (label) => {
    const dir = await fresh(`hostile-${label.replace(/\W+/g, '-')}`);
    const file = join(dir, 'source.zip');
    await writeFile(file, rawArchive({ [`${TOP}/ok.txt`]: 'fine', ...hostile[label] }));
    await expect(unpackArchive(file, join(dir, 'src'))).rejects.toThrow(/will not unpack|outside its folder/);
    expect(await stat(join(dir, 'evil.txt')).then(() => true, () => false)).toBe(false);
    expect(await stat(join(base, 'evil.txt')).then(() => true, () => false)).toBe(false);
    expect(await stat(join(dir, 'src')).then(() => true, () => false)).toBe(false);
  });

  test.each(['file.txt:stream', 'con.txt', 'AUX', 'odd.', 'odd '])('refuses the name %j on Windows only, where it means something else', (part) => {
    expect(() => entryParts(`${TOP}/${part}`, 'win32')).toThrow('will not unpack');
    expect(entryParts(`${TOP}/${part}`, 'linux').parts).toEqual([TOP, part]);
    expect(entryParts(`${TOP}/${part}`, 'darwin').folder).toBe(false);
  });

  test.each(['linux', 'darwin', 'win32'] as const)('refuses a path that climbs out on %s', (platform) => {
    expect(() => entryParts(`${TOP}/../evil.txt`, platform)).toThrow('will not unpack');
    expect(() => entryParts('/evil.txt', platform)).toThrow('will not unpack');
  });

  test('refuses an archive that does not hold one project folder, or holds a path twice', async () => {
    const dir = await fresh('layout');
    const file = join(dir, 'source.zip');
    await writeFile(file, rawArchive({ [`${TOP}/ok.txt`]: 'a', 'other/ok.txt': 'b' }));
    await expect(unpackArchive(file, join(dir, 'one'))).rejects.toThrow('does not hold one project folder');
    await writeFile(file, rawArchive({ 'loose.txt': 'a' }));
    await expect(unpackArchive(file, join(dir, 'two'))).rejects.toThrow('does not hold one project folder');
    await writeFile(file, rawArchive({ [`${TOP}/Readme.md`]: 'a', [`${TOP}/README.md`]: 'b' }));
    await expect(unpackArchive(file, join(dir, 'three'))).rejects.toThrow('same path twice');
  });

  test('refuses an archive that is not a zip', async () => {
    const dir = await fresh('garbage');
    const file = join(dir, 'source.zip');
    await writeFile(file, 'this is not a zip file at all, it has no central directory');
    await expect(unpackArchive(file, join(dir, 'src'))).rejects.toThrow('no central directory');
  });
});
