/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import type { EngineStateFile, InstalledEngine } from '@archipelia/model';
import { ENGINE_TEXT } from '../../src/install/engine-text.constants';
import { removeEngine } from '../../src/install/remove-engine';
import type { RemoveDeps } from '../../src/install/remove-engine.type';

const engineOf = (id: string, apCommit: string, python: string, pythonRelease: string): InstalledEngine => ({
  id, ap: '0.6.7', apCommit, python, pythonRelease, target: 'win32-x64', builtAt: 0, state: 'ready',
});

const state: EngineStateFile = {
  version: 1,
  active: 'in-use',
  installed: [
    engineOf('in-use', 'aaa', '3.12.14', '20260924'),
    engineOf('old', 'bbb', '3.12.14', '20260924'),
    engineOf('other', 'ccc', '3.13.17', '20261021'),
  ],
};

const fakeRemove = (inUse?: string) => ({
  state: () => Promise.resolve(state),
  inUse: vi.fn(() => inUse),
  forget: vi.fn(() => Promise.resolve()),
  discard: vi.fn(() => Promise.resolve()),
  downloads: () => Promise.resolve([
    'ap-aaa.tar.gz', 'ap-bbb.tar.gz', 'ap-ccc.tar.gz',
    'cpython-3.12.14+20260924-x86_64-pc-windows-msvc-install_only.tar.gz',
    'cpython-3.13.17+20261021-x86_64-pc-windows-msvc-install_only.tar.gz',
  ]),
  dropDownload: vi.fn(() => Promise.resolve()),
}) satisfies RemoveDeps;

describe('removing an engine', () => {
  test('refuses the engine in use', async () => {
    const deps = fakeRemove();
    await expect(removeEngine(deps, 'in-use')).rejects.toThrow(ENGINE_TEXT.removeActive);
    expect(deps.discard).not.toHaveBeenCalled();
  });

  test('refuses an engine a running session uses', async () => {
    const deps = fakeRemove(ENGINE_TEXT.hosting);
    await expect(removeEngine(deps, 'old')).rejects.toThrow(ENGINE_TEXT.hosting);
    expect(deps.forget).not.toHaveBeenCalled();
  });

  test('refuses an engine that is not installed', async () => {
    await expect(removeEngine(fakeRemove(), 'gone')).rejects.toThrow(ENGINE_TEXT.unknown);
  });

  test('forgets the engine, deletes its folder and only the downloads no other engine uses', async () => {
    const deps = fakeRemove();
    await removeEngine(deps, 'old');
    expect(deps.forget).toHaveBeenCalledWith('old');
    expect(deps.discard).toHaveBeenCalledWith('old');
    expect(deps.dropDownload.mock.calls).toEqual([['ap-bbb.tar.gz']]);
  });
});
