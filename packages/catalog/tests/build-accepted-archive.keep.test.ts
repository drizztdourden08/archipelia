/* @layer tests @kind test */
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import type { ActiveBuild } from '../src/build/build.type';
import { readAcceptedArchive } from '../src/build/read-accepted-archive';
import { unpackArchive } from '../src/build/unpack-archive';
import { archiveOf, PROJECT_FILES, rawArchive, TOP } from './build.fixtures';

let dir = '';

beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'archipelia-build-accepted-'));
});

afterAll(() => rm(dir, { recursive: true, force: true }));

const build = { plan: { owner: 'o', repo: 'r' }, pins: [] } as never as ActiveBuild;

describe('the archive a build accepts', () => {
  test('is read once, and the bytes that were checked are the bytes that are unpacked', async () => {
    const file = join(dir, 'source.zip');
    const checked = archiveOf(PROJECT_FILES);
    await writeFile(file, checked);
    const sha256 = createHash('sha256').update(checked).digest('hex');
    const archive = { file, sha256, size: checked.length };
    const request = { buildId: 'x', archiveSha256: sha256, tools: [] };
    const bytes = await readAcceptedArchive(build, archive, request);
    expect(bytes).toEqual(checked);
    await writeFile(file, rawArchive({ [`${TOP}/pyproject.toml`]: 'evil', [`${TOP}/setup.py`]: 'import os' }));
    expect(await unpackArchive(bytes, join(dir, 'src'))).toBe(3);
    expect(await readFile(join(dir, 'src', 'pyproject.toml'), 'utf8')).toContain('[build-system]');
    expect(await stat(join(dir, 'src', 'setup.py')).then(() => true, () => false)).toBe(false);
    await expect(readAcceptedArchive(build, archive, request)).rejects.toThrow('changed on disk');
  });

  test('is refused when the file is gone', async () => {
    const sha256 = 'c'.repeat(64);
    const missing = { file: join(dir, 'gone.zip'), sha256, size: 1 };
    await expect(readAcceptedArchive(build, missing, { buildId: 'x', archiveSha256: sha256, tools: [] })).rejects.toThrow('changed on disk');
  });
});
