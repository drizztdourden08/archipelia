/* @layer tests @kind test */
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join } from 'node:path';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { engine } from './build-engine.fixtures';

vi.mock('@archipelia/engine', async () => (await import('./build-engine.fixtures')).mockedEngine());

const { venvPython } = await import('@archipelia/engine');
const { bed, registerBuildBed } = await import('./build-bed.fixtures');

registerBuildBed();

const CMAKE = { name: 'cmake', version: '3.31.6', pin: 'cmake==3.31.6', sha256: 'c'.repeat(64), url: 'https://pypi.org/project/cmake/3.31.6/', direct: true };

const holder = { tools: '' };

beforeAll(async () => {
  holder.tools = await mkdtemp(join(tmpdir(), 'archipelia-build-tools-'));
});

afterAll(() => rm(holder.tools, { recursive: true, force: true }));

describe('adding CMake to a build', () => {
  test('resolves the newest binary wheel with the Python of the private folder, and adds its hashed pin to the plan', async () => {
    const { prepared, builds } = bed();
    const plan = await prepared();
    engine.resolvePackages.mockResolvedValueOnce([CMAKE]);
    const added = await builds.addTool(plan.buildId, 'cmake');
    expect(engine.resolvePackages).toHaveBeenLastCalledWith(
      expect.objectContaining({ python: expect.stringContaining('venv') as string }), ['cmake'], expect.objectContaining({ signal: expect.any(AbortSignal) as AbortSignal }),
    );
    expect(added.tools.map((tool) => tool.pin)).toEqual(['setuptools==80.1.0', 'wheel==0.45.1', 'cmake==3.31.6']);
    expect(builds.hasTool(plan.buildId, 'cmake')).toBe(true);
  });

  test('installs it with the other build tools, by hash, once the user builds the new plan', async () => {
    const { prepared, builds, calls, requestOf } = bed();
    const plan = await prepared();
    engine.resolvePackages.mockResolvedValueOnce([CMAKE]);
    const added = await builds.addTool(plan.buildId, 'cmake');
    expect((await builds.build(requestOf(added))).status).toBe('built');
    expect(calls.find((call) => call.job === 'tools')?.toolsFile).toContain(`cmake==3.31.6 --hash=sha256:${'c'.repeat(64)}`);
  });

  test('does not run the build with a plan the user saw before CMake was added', async () => {
    const { prepared, builds, calls, requestOf } = bed();
    const plan = await prepared();
    engine.resolvePackages.mockResolvedValueOnce([CMAKE]);
    await builds.addTool(plan.buildId, 'cmake');
    const stale = await builds.build(requestOf(plan));
    expect(stale.status).toBe('failed');
    expect(calls.filter((call) => call.job === 'tools')).toEqual([]);
  });

  test('is done once, and only for the build that is ready', async () => {
    const { prepared, builds } = bed();
    const plan = await prepared();
    engine.resolvePackages.mockResolvedValueOnce([CMAKE]);
    await builds.addTool(plan.buildId, 'cmake');
    const calls = engine.resolvePackages.mock.calls.length;
    await builds.addTool(plan.buildId, 'cmake');
    expect(engine.resolvePackages.mock.calls.length).toBe(calls);
    await expect(builds.addTool('00000000-0000-0000-0000-000000000000', 'cmake')).rejects.toThrow(/no build to continue/);
    expect(builds.hasTool('00000000-0000-0000-0000-000000000000', 'cmake')).toBe(false);
  });

  test('refuses a wheel without a checksum', async () => {
    const { prepared, builds } = bed();
    const plan = await prepared();
    engine.resolvePackages.mockResolvedValueOnce([{ ...CMAKE, sha256: undefined }]);
    await expect(builds.addTool(plan.buildId, 'cmake')).rejects.toThrow(/no checksum/);
    expect(builds.hasTool(plan.buildId, 'cmake')).toBe(false);
  });
});

describe('where the build finds its tools', () => {
  test('puts the folder of the private venv first on the path once CMake is installed there', async () => {
    const { prepared, builds, calls, requestOf, workOf } = bed();
    const plan = await prepared();
    engine.resolvePackages.mockResolvedValueOnce([CMAKE]);
    await builds.build(requestOf(await builds.addTool(plan.buildId, 'cmake')));
    const wheel = calls.find((call) => call.job === 'wheel');
    expect(wheel?.env.PATH?.split(delimiter)[0]).toBe(dirname(venvPython(`${workOf()}venv`)));
    expect(calls.find((call) => call.job === 'tools')?.env).not.toHaveProperty('PATH');
  });
});
