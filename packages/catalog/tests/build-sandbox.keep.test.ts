/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import type { EngineRuntime } from '@archipelia/model';
import type { BuildSandbox, BuildScope } from '../src/build/build.type';
import { behaviour } from './build-engine.fixtures';

vi.mock('@archipelia/engine', async () => (await import('./build-engine.fixtures')).mockedEngine());

const { bed, registerBuildBed } = await import('./build-bed.fixtures');

registerBuildBed();

const fakeSandbox = (): { sandbox: () => Promise<BuildSandbox>; scopes: BuildScope[] } => {
  const scopes: BuildScope[] = [];
  const sandbox: BuildSandbox = {
    confine: (scope) => {
      scopes.push(scope);
      return ({ file, args, cwd, env }) => ({ file: '/usr/bin/bwrap', args: [scope.network ? '--share-net' : '--no-net', '--', file, ...args], cwd, env: { PATH: '/usr/bin', ...env } });
    },
  };
  return { sandbox: () => Promise.resolve(sandbox), scopes };
};

describe('the sandbox of a build', () => {
  test('runs the venv, tools and wheel steps through the sandbox, with the network for the tools only', async () => {
    const { sandbox, scopes } = fakeSandbox();
    const { calls, prepared, requestOf, builds } = bed(sandbox);
    expect((await builds.build(requestOf(await prepared()))).status).toBe('built');
    expect(calls.map((call) => [call.job, call.command, call.args[0]])).toEqual([
      ['venv', '/usr/bin/bwrap', '--no-net'], ['tools', '/usr/bin/bwrap', '--share-net'], ['wheel', '/usr/bin/bwrap', '--no-net'],
    ]);
    expect(calls[2]?.args).toEqual(expect.arrayContaining(['--no-build-isolation', '--no-index']));
    expect(scopes.filter((scope) => scope.network)).toHaveLength(1);
  });

  test('lets the build write to its own folder only and read the engine folder', async () => {
    const { sandbox, scopes } = fakeSandbox();
    const { calls, prepared, builds, workOf } = bed(sandbox);
    await prepared();
    const work = workOf().replace(/[\\/]$/, '');
    expect(calls[0]?.job).toBe('venv');
    expect(scopes.length).toBeGreaterThan(0);
    for (const scope of scopes) {
      expect(scope.readWrite).toEqual([work]);
      expect(scope.readOnly).toEqual([(behaviour.runtime as EngineRuntime).root]);
    }
    await builds.dispose();
  });

  test('keeps PATH to what the sandbox gives and never lets a token of the user through', async () => {
    vi.stubEnv('GH_TOKEN', 'ghp_secret');
    const { sandbox } = fakeSandbox();
    const { calls, prepared, requestOf, builds } = bed(sandbox);
    await builds.build(requestOf(await prepared()));
    for (const call of calls) {
      expect(call.env.PATH).toBe('/usr/bin');
      expect(call.env).not.toHaveProperty('GH_TOKEN');
    }
  });

  test('tells the consent that the build is confined', async () => {
    const { sandbox } = fakeSandbox();
    const confined = bed(sandbox);
    expect((await confined.prepared()).confined).toBe(true);
    await confined.builds.dispose();
  });

  test('tells the consent that the build is not confined where the system has no sandbox', async () => {
    const open = bed(() => Promise.resolve({ confine: () => undefined }));
    expect((await open.prepared()).confined).toBe(false);
    await open.builds.dispose();
    const absent = bed();
    expect((await absent.prepared()).confined).toBe(false);
    await absent.builds.dispose();
  });

  test('runs the steps as they are, with no wrapper, where the system has no sandbox', async () => {
    const { calls, prepared, requestOf, builds } = bed(() => Promise.resolve({ confine: () => undefined }));
    await builds.build(requestOf(await prepared()));
    expect(calls.map((call) => call.args[0])).toEqual(['-X', '-X', '-X']);
  });
});
