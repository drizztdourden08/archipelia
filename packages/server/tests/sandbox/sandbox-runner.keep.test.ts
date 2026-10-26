/* @layer tests @kind test */
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import type { EngineRuntime, Lobby, WorldUpload } from '@archipelia/model';
import { adminView } from '../../src/listener/admin/admin-view';
import { lobbyOptions } from '../../src/lobby/state/lobby-options';
import { bwrapCommand } from '../../src/sandbox/bwrap-command';
import { detectSandbox } from '../../src/sandbox/detect-sandbox';
import { noSandbox } from '../../src/sandbox/no-sandbox';
import { pythonHome } from '../../src/sandbox/python-home';
import { createBwrapRunner } from '../../src/sandbox/create-bwrap-runner';
import { BASIC_FEATURES } from '../../src/sandbox/sandbox.constants';
import type { BwrapFeatures } from '../../src/sandbox/sandbox.type';
import { taskCount } from '../../src/sandbox/task-count';

const SYSTEM = [
  '--ro-bind-try', '/usr', '/usr', '--ro-bind-try', '/bin', '/bin', '--ro-bind-try', '/sbin', '/sbin',
  '--ro-bind-try', '/lib', '/lib', '--ro-bind-try', '/lib32', '/lib32', '--ro-bind-try', '/lib64', '/lib64',
  '--ro-bind-try', '/etc/ld.so.cache', '/etc/ld.so.cache', '--ro-bind-try', '/etc/ld.so.conf', '/etc/ld.so.conf',
  '--ro-bind-try', '/etc/ld.so.conf.d', '/etc/ld.so.conf.d', '--ro-bind-try', '/etc/localtime', '/etc/localtime',
];

const TAIL = [
  '--ro-bind', '/srv/engine/python', '/srv/engine/python',
  '--bind', '/srv/lobbies/lb_1/overlay', '/srv/lobbies/lb_1/overlay',
  '--bind', '/srv/sessions/s1/confined', '/srv/sessions/s1/confined',
  '--chdir', '/srv/sessions/s1/confined',
  '--', '/srv/engine/python/bin/python3', '-X', 'utf8', '/srv/lobbies/lb_1/overlay/ap/Generate.py', '--outputpath', '/srv/sessions/s1/confined/output',
];

const ISOLATION = ['--die-with-parent', '--new-session', '--unshare-all', '--cap-drop', 'ALL'];

const FULL: BwrapFeatures = { tmpfsSize: true, disableUserns: true, prlimit: '/usr/bin/prlimit' };

const generate = {
  file: '/srv/engine/python/bin/python3',
  args: ['-X', 'utf8', '/srv/lobbies/lb_1/overlay/ap/Generate.py', '--outputpath', '/srv/sessions/s1/confined/output'],
  cwd: '/srv/sessions/s1/confined',
  env: { PATH: '/home/host/bin:/usr/bin', HOME: '/home/host', ARCHIPELIA_TOKEN: 'secret', SKIP_REQUIREMENTS_UPDATE: '1', PYTHONUNBUFFERED: '1', PYTHONUTF8: '1' },
};

const scope = { readOnly: ['/srv/engine/python'], readWrite: ['/srv/lobbies/lb_1/overlay', '/srv/sessions/s1/confined'] };

const engineAt = (root: string, python: string): EngineRuntime => ({
  id: 'e', apVersion: '0.6.8', apCommit: 'c', pythonVersion: '3', root, python, generate: '', multiServer: '', schemaScript: '',
});

describe('the bwrap runner', () => {
  test('builds the basic bwrap arguments: no network, no home, the overlay and run folder writable, Python read only', () => {
    expect(bwrapCommand({ bwrap: '/usr/bin/bwrap', features: BASIC_FEATURES }, scope, generate)).toEqual({
      file: '/usr/bin/bwrap',
      args: [...ISOLATION, ...SYSTEM, '--proc', '/proc', '--dev', '/dev', '--tmpfs', '/tmp', ...TAIL],
      cwd: '/srv/sessions/s1/confined',
      env: { PATH: '/usr/local/bin:/usr/bin:/bin', HOME: '/tmp', TMPDIR: '/tmp', LANG: 'C.UTF-8', PYTHONDONTWRITEBYTECODE: '1', SKIP_REQUIREMENTS_UPDATE: '1', PYTHONUNBUFFERED: '1', PYTHONUTF8: '1' },
    });
  });

  test('A3 and A6: adds resource limits, a sized /tmp and no nested user namespaces when the system has them', () => {
    const { file, args } = bwrapCommand({ bwrap: '/usr/bin/bwrap', features: FULL, tasks: 300 }, scope, generate);
    expect(file).toBe('/usr/bin/prlimit');
    expect(args).toEqual([
      '--cpu=3600', '--as=17179869184', '--fsize=1073741824', '--nproc=2348', '--', '/usr/bin/bwrap',
      ...ISOLATION, '--unshare-user', '--disable-userns', ...SYSTEM, '--proc', '/proc', '--dev', '/dev', '--size', '268435456', '--tmpfs', '/tmp', ...TAIL,
    ]);
  });

  test('shares the network and binds only the name resolution files when a scope asks for the network, and never otherwise', () => {
    const online = bwrapCommand({ bwrap: '/usr/bin/bwrap', features: BASIC_FEATURES }, { ...scope, network: true }, generate).args;
    expect(online.indexOf('--share-net')).toBeGreaterThan(online.indexOf('--unshare-all'));
    expect(online).toEqual(expect.arrayContaining(['--ro-bind-try', '/etc/resolv.conf', '/etc/resolv.conf']));
    const offline = bwrapCommand({ bwrap: '/usr/bin/bwrap', features: BASIC_FEATURES }, { ...scope, network: false }, generate).args;
    expect(offline).not.toContain('--share-net');
    expect(offline).not.toContain('/etc/resolv.conf');
  });

  test('passes the build variables of a pip and compiler run into the sandbox and still nothing else', () => {
    const { env } = bwrapCommand({ bwrap: '/usr/bin/bwrap', features: BASIC_FEATURES }, scope, { ...generate, env: { ...generate.env, CC: 'gcc', PIP_NO_INPUT: '1', GH_TOKEN: 'secret' } });
    expect(env).toMatchObject({ CC: 'gcc', PIP_NO_INPUT: '1' });
    expect(env.GH_TOKEN).toBeUndefined();
  });

  test('never passes the host environment into the sandbox', () => {
    const { env } = bwrapCommand({ bwrap: '/usr/bin/bwrap', features: BASIC_FEATURES }, scope, generate);
    expect(env.ARCHIPELIA_TOKEN).toBeUndefined();
    expect(env.HOME).toBe('/tmp');
  });

  test('the none runner leaves a command as it is', () => {
    expect(noSandbox('test').confine(scope)).toBeUndefined();
  });

  test('A5: Python outside the engine folder is refused, so no system folder is bound', () => {
    expect(pythonHome(engineAt('/srv/engine', '/srv/engine/python/bin/python3'))).toBe('/srv/engine/python');
    expect(() => pythonHome(engineAt('/srv/engine', '/usr/bin/python3'))).toThrow('outside the engine folder');
  });
});

describe('I-81: the process limit follows the tasks the server user already has', () => {
  const limitOf = (args: string[]) => args.find((arg) => arg.startsWith('--nproc='));

  test('it is the current count plus a margin, so a busy server is never starved by it', () => {
    expect(limitOf(bwrapCommand({ bwrap: '/usr/bin/bwrap', features: FULL, tasks: 100 }, scope, generate).args)).toBe('--nproc=2148');
    expect(limitOf(bwrapCommand({ bwrap: '/usr/bin/bwrap', features: FULL, tasks: 9000 }, scope, generate).args)).toBe('--nproc=11048');
  });

  test('it is left out when the count is unknown, and the pid namespace is all that bounds the run', () => {
    expect(limitOf(bwrapCommand({ bwrap: '/usr/bin/bwrap', features: FULL }, scope, generate).args)).toBeUndefined();
  });

  test('the count is taken again for every command, so a run started later gets room for the tasks that grew', () => {
    let tasks = 400;
    const wrap = createBwrapRunner('/usr/bin/bwrap', FULL, () => tasks).confine(scope);
    expect(limitOf(wrap?.(generate).args ?? [])).toBe('--nproc=2448');
    tasks = 5000;
    expect(limitOf(wrap?.(generate).args ?? [])).toBe('--nproc=7048');
  });

  test('the count is the tasks the kernel reports in /proc/loadavg', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'archipelia-loadavg-'));
    const file = join(dir, 'loadavg');
    await writeFile(file, '0.10 0.20 0.30 3/871 4242');
    expect(taskCount(file)).toBe(871);
    await writeFile(file, 'garbage');
    expect(taskCount(file)).toBeUndefined();
    expect(taskCount(join(dir, 'missing'))).toBeUndefined();
    await rm(dir, { recursive: true, force: true });
  });
});

describe('sandbox detection', () => {
  const found = () => Promise.resolve('/usr/bin/bwrap');
  const full = () => Promise.resolve(FULL);
  const works = () => Promise.resolve(null);

  test.each(['win32', 'darwin'])('%s has no sandbox, whatever is installed', async (platform) => {
    const runner = await detectSandbox({ platform, find: found, features: full, problem: works });
    expect(runner.mode).toBe('none');
  });

  test('Linux without bubblewrap has no sandbox', async () => {
    const runner = await detectSandbox({ platform: 'linux', find: () => Promise.resolve(undefined), features: full, problem: works });
    expect(runner).toMatchObject({ mode: 'none', reason: 'bubblewrap is not installed' });
  });

  test('Linux where bubblewrap cannot make its namespaces has no sandbox', async () => {
    const runner = await detectSandbox({ platform: 'linux', find: found, features: full, problem: () => Promise.resolve('No permissions to create new namespace') });
    expect(runner).toMatchObject({ mode: 'none', reason: 'bubblewrap cannot start here: No permissions to create new namespace' });
  });

  test('Linux with a working bubblewrap wraps every command with every feature it has', async () => {
    const runner = await detectSandbox({ platform: 'linux', find: found, features: full, problem: works, tasks: () => 300 });
    expect(runner.mode).toBe('bwrap');
    expect(runner.confine(scope)?.(generate)).toEqual(bwrapCommand({ bwrap: '/usr/bin/bwrap', features: FULL, tasks: 300 }, scope, generate));
  });

  test('falls back to the basic arguments when the extra features fail to start', async () => {
    const problem = (_bwrap: string, features: BwrapFeatures) => Promise.resolve(features.prlimit ? 'prlimit refused' : null);
    const runner = await detectSandbox({ platform: 'linux', find: found, features: full, problem, tasks: () => 300 });
    expect(runner.confine(scope)?.(generate)).toEqual(bwrapCommand({ bwrap: '/usr/bin/bwrap', features: BASIC_FEATURES, tasks: 300 }, scope, generate));
  });
});

describe('A4: the consent data names the sandbox', () => {
  const world: WorldUpload = {
    sha256: 'w', size: 1, game: 'Quest', module: 'quest', worldVersion: '1.0.0', memberId: 'm_1', trust: { level: 'unlisted', detail: 'not in the registry', checkedAt: 0 },
  };
  const lobby: Lobby = { id: 'l', code: 'c', name: 'n', phase: 'open', rev: 1, engine: { id: 'e', ap: '0.6.8', python: '3' }, options: lobbyOptions(), members: [], worlds: [world], nextMember: 1, createdAt: 0, closesAt: 0 };

  test('with no sandbox, an unlisted world says plainly that it runs unconfined on this machine', () => {
    expect(adminView('none', lobby)?.worlds[0]).toMatchObject({ runsUnconfined: true, consentNote: expect.stringContaining('runs unconfined on this machine') as unknown });
  });

  test('with bubblewrap, an unlisted world says it runs in a sandbox', () => {
    expect(adminView('bwrap', lobby)?.worlds[0]).toMatchObject({ runsUnconfined: false, consentNote: expect.stringContaining('sandbox') as unknown });
  });
});
