/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import { PLAN, SOURCE_URL } from './build.fixtures';
import { behaviour, ZIP } from './build-engine.fixtures';
import { routedFetch } from './source.fixtures';

vi.mock('@archipelia/engine', async () => (await import('./build-engine.fixtures')).mockedEngine());

const { createBuilds } = await import('../src/build/create-builds');
const { bed, exists, registerBuildBed } = await import('./build-bed.fixtures');

registerBuildBed();

const MSVC = ['running build_ext', 'error: Microsoft Visual C++ 14.0 or greater is required.', 'ERROR: Failed building wheel for ctrando'];

describe('a build that fails', () => {
  test('names the missing tool, keeps the log without paths and lets Check again run the build without downloading again', async () => {
    behaviour.runs.wheel = { status: 'failed', code: 1, lines: [...MSVC, 'copying C:\\Users\\someone\\AppData\\Local\\Temp\\x.c'] };
    const { prepared, requestOf, builds, calls, seen } = bed();
    const plan = await prepared();
    const first = await builds.build(requestOf(plan));
    expect(first).toMatchObject({ status: 'missing', missing: { tool: 'msvc' } });
    expect(JSON.stringify(first)).not.toContain('someone');
    behaviour.runs = {};
    expect((await builds.build(requestOf(plan))).status).toBe('built');
    expect(seen).toEqual([SOURCE_URL]);
    expect(calls.map((call) => call.job)).toEqual(['venv', 'tools', 'wheel', 'tools', 'wheel']);
  });

  test('says the build failed with its log when nothing known is missing, and offers to try again', async () => {
    behaviour.runs.wheel = { status: 'failed', code: 1, lines: ['SyntaxError: invalid syntax'] };
    const { prepared, requestOf, builds } = bed();
    const failed = await builds.build(requestOf(await prepared()));
    expect(failed).toEqual({ status: 'failed', message: 'The build failed. The log says why.', log: ['SyntaxError: invalid syntax'], retry: true });
    await builds.dispose();
  });

  test('ends as cancelled and leaves no folder behind when it is cancelled', async () => {
    behaviour.runs.wheel = { status: 'cancelled', code: null, lines: [] };
    const { prepared, requestOf, builds, workOf } = bed();
    const plan = await prepared();
    expect(await builds.build(requestOf(plan))).toEqual({ status: 'cancelled' });
    expect(await exists(workOf())).toBe(false);
  });

  test('ends the build with a failure and a plain message when a step is rejected', async () => {
    behaviour.runs.tools = { status: 'rejected', code: null, lines: [], error: 'No such process job.' };
    const { prepared, requestOf, builds } = bed();
    expect(await builds.build(requestOf(await prepared()))).toMatchObject({ status: 'failed', message: 'Archipelia could not install the build tools into the private build folder.' });
    await builds.dispose();
  });

  test('works in the desktop app only: without a runner it fails with a plain message', async () => {
    const { net } = routedFetch({ [SOURCE_URL]: () => new Response(ZIP) });
    const builds = createBuilds({ fetch: net, engineDir: () => Promise.resolve('engine') });
    expect(await builds.prepare(PLAN)).toMatchObject({ status: 'failed', message: 'Building from source works in the desktop app only.' });
  });
});
