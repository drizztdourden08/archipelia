/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { InstallRequest, PackagePreview } from '@archipelia/catalog';
import { buildRows } from '../../src/views/GameStore/behavior/build-rows';
import { consentedRequest } from '../../src/views/GameStore/behavior/consented-request';
import { indexOfGame } from '../../src/views/GameStore/behavior/index-of-game';
import { sectionsOf } from '../../src/views/GameStore/behavior/sections-of';
import { worldEntry, worldInstalled } from './game-handlers.fixtures';

const index: InstallRequest = { kind: 'index', apworld: 'ctrdi', version: '1.0.0' };
const pkg = (name: string, direct: boolean) => ({ name, version: '1.2.0', pin: `${name}==1.2.0`, url: `https://pypi.org/project/${name}/1.2.0/`, direct });
const preview = (packages: PackagePreview['packages']): PackagePreview => ({ sha256: 'abc', packages });

const run = (request: InstallRequest, found: PackagePreview, answer: boolean) => {
  const asked: string[][] = [];
  const previewed: InstallRequest[] = [];
  const result = consentedRequest({
    request, title: 'Chrono Trigger',
    preview: (asking) => { previewed.push(asking); return Promise.resolve(found); },
    ask: (_title, packages) => { asked.push(packages.map((entry) => entry.name)); return Promise.resolve(answer); },
  });
  return { result, asked, previewed };
};

describe('package consent before an install', () => {
  test('a world with no packages installs as it does today, without a question', async () => {
    const { result, asked } = run(index, preview([]), true);
    expect(await result).toBe(index);
    expect(asked).toEqual([]);
  });

  test('accepting passes the sha and the pin of every package, direct or not', async () => {
    const found = preview([pkg('ctrando', true), pkg('numpy', false)]);
    const { result, asked } = run(index, found, true);
    expect(await result).toEqual({ ...index, acceptPackages: { sha256: 'abc', packages: ['ctrando==1.2.0', 'numpy==1.2.0'] } });
    expect(asked).toEqual([['ctrando', 'numpy']]);
  });

  test('cancelling installs nothing', async () => {
    const { result } = run(index, preview([pkg('ctrando', true)]), false);
    expect(await result).toBeUndefined();
  });

  test('a world from a file asks the same way', async () => {
    const file: InstallRequest = { kind: 'file', fileName: 'w.apworld', bytes: new Uint8Array([1]) };
    const { result, previewed } = run(file, preview([pkg('ctrando', true)]), true);
    expect(await result).toMatchObject({ kind: 'file', acceptPackages: { sha256: 'abc', packages: ['ctrando==1.2.0'] } });
    expect(previewed).toEqual([file]);
  });

  test('an official world has nothing to preview', async () => {
    const official: InstallRequest = { kind: 'official', apworld: 'hk' };
    const { result, previewed } = run(official, preview([pkg('x', true)]), true);
    expect(await result).toBe(official);
    expect(previewed).toEqual([]);
  });
});

describe('finding a world in the grid', () => {
  const rows = buildRows([worldEntry('hk', 'official'), worldEntry('soh', 'index', ['1.0.0']), worldEntry('zzz', 'index', ['1.0.0'])], [worldInstalled('soh', '1.0.0')]);

  test('the index runs through the sections in order, so a card that is not drawn can be scrolled to', () => {
    const sections = sectionsOf(rows, 'all');
    expect(indexOfGame(sections, 'soh')).toBe(0);
    expect(indexOfGame(sections, 'hk')).toBe(1);
    expect(indexOfGame(sections, 'zzz')).toBe(2);
    expect(indexOfGame(sections, 'missing')).toBe(-1);
  });
});
