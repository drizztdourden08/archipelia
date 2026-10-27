/* @layer tests @kind fixture */
import { mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import type { EngineRuntime, SourceBuildJob } from '@archipelia/model';
import type { BuildDeps, BuildRunner, BuildSandbox, BuildScope } from '../src/build/build.type';
import { createBuilds } from '../src/build/create-builds';
import { behaviour, engine, WHEEL_BYTES, ZIP } from './build-engine.fixtures';
import { PLAN, SOURCE_URL, WHEEL } from './build.fixtures';
import { routedFetch } from './source.fixtures';
import { TAGS } from './wheel.fixtures';

type Call = { job: SourceBuildJob; command: string; args: string[]; env: Record<string, string>; sourceSeen: boolean; toolsFile: string | undefined };

const argAfter = (args: string[], flag: string) => args[args.indexOf(flag) + 1] ?? '';

const exists = (path: string) => stat(path).then(() => true, () => false);

const registerBuildBed = () => {
  const holder = { base: '' };
  beforeAll(async () => {
    holder.base = await mkdtemp(join(tmpdir(), 'archipelia-build-flow-'));
  });
  afterAll(() => rm(holder.base, { recursive: true, force: true }));
  afterEach(() => vi.unstubAllEnvs());
  beforeEach(async () => {
    const root = await mkdtemp(join(holder.base, 'engine-'));
    behaviour.runtime = { id: 'e', root, python: join(root, 'python.exe') } as EngineRuntime;
    behaviour.tags = TAGS;
    behaviour.runs = {};
    behaviour.wheel = WHEEL_BYTES;
    behaviour.served = ZIP;
    engine.resolvePackages.mockClear();
  });
  return { cached: () => readdir(join((behaviour.runtime as EngineRuntime).root, 'wheels')).catch(() => []) };
};

const bed = (sandbox?: BuildDeps['sandbox'], extra: Partial<BuildDeps> = {}) => {
  const calls: Call[] = [];
  const logs: string[] = [];
  const { net, seen } = routedFetch({ [SOURCE_URL]: () => new Response(behaviour.served) });
  const holder: { builds?: ReturnType<typeof createBuilds> } = {};
  const run: BuildRunner = async (job, buildId) => {
    const spec = await (holder.builds as ReturnType<typeof createBuilds>).specOf(job, { buildId });
    calls.push({
      job, command: spec.command, args: spec.args, env: spec.env, sourceSeen: await exists(join(spec.cwd, 'src', 'pyproject.toml')),
      toolsFile: job === 'tools' ? await readFile(argAfter(spec.args, '-r'), 'utf8') : undefined,
    });
    if (job === 'wheel' && behaviour.wheel) await writeFile(join(argAfter(spec.args, '-w'), WHEEL), behaviour.wheel);
    return behaviour.runs[job] ?? { status: 'done', code: 0, lines: [] };
  };
  const builds = createBuilds({ fetch: net, engineDir: () => Promise.resolve('engine'), run, sandbox, ...extra, log: (message) => logs.push(message) });
  holder.builds = builds;
  const prepared = async () => {
    const made = await builds.prepare(PLAN);
    if (made.status !== 'ready') throw new Error(`not ready: ${JSON.stringify(made)}`);
    return made.plan;
  };
  const requestOf = (plan: Awaited<ReturnType<typeof prepared>>, patch: object = {}) => ({
    buildId: plan.buildId, archiveSha256: plan.archiveSha256, tools: plan.tools.map((tool) => tool.pin), ...patch,
  });
  const workOf = () => (calls[0]?.args.at(-1) ?? '').replace(/venv$/, '');
  return { builds, calls, logs, seen, prepared, requestOf, workOf };
};

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

export { bed, exists, fakeSandbox, registerBuildBed };
