/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { bwrapCommand } from '../../src/sandbox/bwrap-command';
import { BASIC_FEATURES } from '../../src/sandbox/sandbox.constants';

const setup = { bwrap: '/usr/bin/bwrap', features: BASIC_FEATURES };

const command = { file: '/srv/work/venv/bin/python', args: ['-m', 'pip', 'wheel'], cwd: '/srv/work', env: { CC: 'gcc', GH_TOKEN: 'secret' } };

describe('the tools of a sandboxed build', () => {
  test('puts the folders it names first on the PATH of the sandbox', () => {
    const { env } = bwrapCommand(setup, { readOnly: ['/srv/engine'], readWrite: ['/srv/work'], path: ['/srv/work/venv/bin', '/srv/tools/cargo/bin'] }, command);
    expect(env.PATH).toBe('/srv/work/venv/bin:/srv/tools/cargo/bin:/usr/local/bin:/usr/bin:/bin');
  });

  test('keeps the plain PATH of the sandbox when it names no folder', () => {
    expect(bwrapCommand(setup, { readOnly: [], readWrite: [] }, command).env.PATH).toBe('/usr/local/bin:/usr/bin:/bin');
    expect(bwrapCommand(setup, { readOnly: [], readWrite: [], path: [] }, command).env.PATH).toBe('/usr/local/bin:/usr/bin:/bin');
  });

  test('passes the cargo and rustup homes, and still not the tokens of the user', () => {
    const { env } = bwrapCommand(setup, { readOnly: [], readWrite: [] }, { ...command, env: { ...command.env, CARGO_HOME: '/srv/tools/cargo', RUSTUP_HOME: '/srv/tools/rustup' } });
    expect(env).toMatchObject({ CARGO_HOME: '/srv/tools/cargo', RUSTUP_HOME: '/srv/tools/rustup', CC: 'gcc' });
    expect(env.GH_TOKEN).toBeUndefined();
  });

  test('binds the folders it is given read-only', () => {
    const { args } = bwrapCommand(setup, { readOnly: ['/srv/engine', '/srv/tools/cargo', '/srv/tools/rustup'], readWrite: ['/srv/work'] }, command);
    expect(args).toEqual(expect.arrayContaining(['--ro-bind', '/srv/tools/cargo', '/srv/tools/cargo', '--ro-bind', '/srv/tools/rustup', '/srv/tools/rustup']));
  });
});
