/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { bwrapCommand } from '../../src/sandbox/bwrap-command';
import { detectSandbox } from '../../src/sandbox/detect-sandbox';
import { noSandbox } from '../../src/sandbox/no-sandbox';

const SYSTEM = [
  '--ro-bind-try', '/usr', '/usr', '--ro-bind-try', '/bin', '/bin', '--ro-bind-try', '/sbin', '/sbin',
  '--ro-bind-try', '/lib', '/lib', '--ro-bind-try', '/lib32', '/lib32', '--ro-bind-try', '/lib64', '/lib64',
  '--ro-bind-try', '/etc/ld.so.cache', '/etc/ld.so.cache', '--ro-bind-try', '/etc/ld.so.conf', '/etc/ld.so.conf',
  '--ro-bind-try', '/etc/ld.so.conf.d', '/etc/ld.so.conf.d', '--ro-bind-try', '/etc/localtime', '/etc/localtime',
];

const generate = {
  file: '/srv/engine/python/bin/python3',
  args: ['-X', 'utf8', '/srv/lobbies/lb_1/overlay/ap/Generate.py', '--outputpath', '/srv/sessions/s1/output'],
  cwd: '/srv/sessions/s1',
  env: { PATH: '/home/host/bin:/usr/bin', HOME: '/home/host', ARCHIPELIA_TOKEN: 'secret', SKIP_REQUIREMENTS_UPDATE: '1', PYTHONUNBUFFERED: '1', PYTHONUTF8: '1' },
};

const scope = { readOnly: ['/srv/engine/python'], readWrite: ['/srv/lobbies/lb_1/overlay', '/srv/sessions/s1'] };

describe('the bwrap runner', () => {
  test('builds the bwrap arguments: no network, no home, the overlay and run folder writable, Python read only', () => {
    expect(bwrapCommand('/usr/bin/bwrap', scope, generate)).toEqual({
      file: '/usr/bin/bwrap',
      args: [
        '--die-with-parent', '--new-session', '--unshare-all', '--cap-drop', 'ALL',
        ...SYSTEM,
        '--proc', '/proc', '--dev', '/dev', '--tmpfs', '/tmp',
        '--ro-bind', '/srv/engine/python', '/srv/engine/python',
        '--bind', '/srv/lobbies/lb_1/overlay', '/srv/lobbies/lb_1/overlay',
        '--bind', '/srv/sessions/s1', '/srv/sessions/s1',
        '--chdir', '/srv/sessions/s1',
        '--', '/srv/engine/python/bin/python3', '-X', 'utf8', '/srv/lobbies/lb_1/overlay/ap/Generate.py', '--outputpath', '/srv/sessions/s1/output',
      ],
      cwd: '/srv/sessions/s1',
      env: { PATH: '/usr/local/bin:/usr/bin:/bin', HOME: '/tmp', TMPDIR: '/tmp', LANG: 'C.UTF-8', PYTHONDONTWRITEBYTECODE: '1', SKIP_REQUIREMENTS_UPDATE: '1', PYTHONUNBUFFERED: '1', PYTHONUTF8: '1' },
    });
  });

  test('never passes the host environment into the sandbox', () => {
    const { env } = bwrapCommand('/usr/bin/bwrap', scope, generate);
    expect(env.ARCHIPELIA_TOKEN).toBeUndefined();
    expect(env.HOME).toBe('/tmp');
  });

  test('the none runner leaves a command as it is', () => {
    expect(noSandbox('test').confine(scope)).toBeUndefined();
  });
});

describe('sandbox detection', () => {
  const found = () => Promise.resolve('/usr/bin/bwrap');
  const works = () => Promise.resolve(null);

  test.each(['win32', 'darwin'])('%s has no sandbox, whatever is installed', async (platform) => {
    const runner = await detectSandbox({ platform, find: found, problem: works });
    expect(runner.mode).toBe('none');
  });

  test('Linux without bubblewrap has no sandbox', async () => {
    const runner = await detectSandbox({ platform: 'linux', find: () => Promise.resolve(undefined), problem: works });
    expect(runner).toMatchObject({ mode: 'none', reason: 'bubblewrap is not installed' });
  });

  test('Linux where bubblewrap cannot make its namespaces has no sandbox', async () => {
    const runner = await detectSandbox({ platform: 'linux', find: found, problem: () => Promise.resolve('No permissions to create new namespace') });
    expect(runner).toMatchObject({ mode: 'none', reason: 'bubblewrap cannot start here: No permissions to create new namespace' });
  });

  test('Linux with a working bubblewrap wraps every command in it', async () => {
    const runner = await detectSandbox({ platform: 'linux', find: found, problem: works });
    expect(runner.mode).toBe('bwrap');
    expect(runner.confine(scope)?.(generate)).toEqual(bwrapCommand('/usr/bin/bwrap', scope, generate));
  });
});
