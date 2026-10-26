/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import type { PythonRun } from '../../src/process/run-python.type';
import { engineTags } from '../../src/wheel/engine-tags';
import { parseWheelName } from '../../src/wheel/parse-wheel-name';
import { wheelFit } from '../../src/wheel/wheel-fit';
import { runtimeOf } from '../install/install-fakes';
import { LINUX_TAGS, WINDOWS_TAGS } from './wheel.fixtures';

describe('reading a wheel file name', () => {
  test('splits the name and expands every tag combination', () => {
    expect(parseWheelName('ctrando-1.2.0-cp312-cp312-win_amd64.whl')).toEqual({ distribution: 'ctrando', version: '1.2.0', triples: ['cp312-cp312-win_amd64'] });
    expect(parseWheelName('pkg-1.0-1-py2.py3-none-any.whl')?.triples).toEqual(['py2-none-any', 'py3-none-any']);
    expect(parseWheelName('pkg-1.0-cp312-cp312.abi3-manylinux_2_17_x86_64.manylinux2014_x86_64.whl')?.triples).toHaveLength(4);
  });

  test('refuses anything that is not a wheel name', () => {
    for (const bad of ['ctrando.tar.gz', 'ctrando-1.2.0.whl', '../x-1-py3-none-any.whl', 'a-b-c-d-e-f-g-py3-none-any.whl', 'x-1-py3-none-any.whl.exe', 'x 1-1-py3-none-any.whl']) {
      expect(parseWheelName(bad)).toBeUndefined();
    }
  });
});

describe('matching a wheel to the engine tags', () => {
  test('an exact build for this Python and platform fits and ranks first', () => {
    expect(wheelFit('ctrando-1.2.0-cp312-cp312-win_amd64.whl', WINDOWS_TAGS)).toEqual({ rank: 0, kind: 'exact' });
  });

  test('a stable ABI build fits an engine of that Python or newer, as abi3', () => {
    expect(wheelFit('ctrando-1.2.0-cp310-abi3-win_amd64.whl', WINDOWS_TAGS)).toEqual({ rank: 4, kind: 'abi3' });
  });

  test('a pure Python wheel fits any engine, as pure', () => {
    expect(wheelFit('ctrando-1.2.0-py3-none-any.whl', WINDOWS_TAGS)?.kind).toBe('pure');
    expect(wheelFit('ctrando-1.2.0-py2.py3-none-any.whl', LINUX_TAGS)?.kind).toBe('pure');
  });

  test('another Python version, another platform or an old Linux standard has no fit', () => {
    expect(wheelFit('ctrando-1.2.0-cp311-cp311-win_amd64.whl', WINDOWS_TAGS)).toBeUndefined();
    expect(wheelFit('ctrando-1.2.0-cp313-cp313-win_amd64.whl', WINDOWS_TAGS)).toBeUndefined();
    expect(wheelFit('ctrando-1.2.0-cp312-cp312-win32.whl', WINDOWS_TAGS)).toBeUndefined();
    expect(wheelFit('ctrando-1.2.0-cp312-cp312-musllinux_1_2_x86_64.whl', LINUX_TAGS)).toBeUndefined();
    expect(wheelFit('ctrando-1.2.0-cp312-cp312-macosx_11_0_arm64.whl', LINUX_TAGS)).toBeUndefined();
    expect(wheelFit('not-a-wheel.zip', LINUX_TAGS)).toBeUndefined();
  });

  test('a manylinux build matches by tag, and the first tag the engine lists wins', () => {
    expect(wheelFit('x-1-cp312-cp312-manylinux2014_x86_64.whl', LINUX_TAGS)).toEqual({ rank: 1, kind: 'exact' });
    expect(wheelFit('x-1-cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64.whl', LINUX_TAGS)?.rank).toBe(0);
  });
});

const answering = (code: number, lines: string[]) => vi.fn((_runtime: unknown, _run: PythonRun) => Promise.resolve({ code, lines }));

describe('asking the engine Python for its tags', () => {
  test('runs the engine Python isolated and reads the last line as the tag list', async () => {
    const run = answering(0, ['', JSON.stringify(WINDOWS_TAGS)]);
    expect(await engineTags(runtimeOf('old'), { run })).toEqual(WINDOWS_TAGS);
    const args = run.mock.calls[0]?.[1].args ?? [];
    expect(args.slice(0, 2)).toEqual(['-I', '-c']);
    expect(args[2]).toContain('sys_tags');
  });

  test('a failed run or a list that is not tags is refused', async () => {
    await expect(engineTags(runtimeOf('old'), { run: answering(1, ['ERROR: no pip']) })).rejects.toThrow('did not list its wheel tags: no pip');
    await expect(engineTags(runtimeOf('old'), { run: answering(0, ['not json']) })).rejects.toThrow('cannot read');
    await expect(engineTags(runtimeOf('old'), { run: answering(0, ['["x; rm -rf /"]']) })).rejects.toThrow('cannot read');
    await expect(engineTags(runtimeOf('old'), { run: answering(0, ['[]']) })).rejects.toThrow('cannot read');
  });
});
