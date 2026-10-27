/* @layer tests @kind test */
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import type { EngineRuntime } from '@archipelia/model';
import { archiveOf, PROJECT_FILES, TOOLS } from './build.fixtures';
import { behaviour, engine } from './build-engine.fixtures';

vi.mock('@archipelia/engine', async () => (await import('./build-engine.fixtures')).mockedEngine());

const { bed, fakeSandbox, registerBuildBed } = await import('./build-bed.fixtures');

registerBuildBed();

const holder = { tools: '' };

beforeAll(async () => {
  holder.tools = await mkdtemp(join(tmpdir(), 'archipelia-build-rust-'));
});

afterAll(() => rm(holder.tools, { recursive: true, force: true }));

const withRust = async () => {
  const dir = await mkdtemp(join(holder.tools, 'rust-'));
  await mkdir(join(dir, 'cargo', 'bin'), { recursive: true });
  await mkdir(join(dir, 'rustup'), { recursive: true });
  return dir;
};

const serveRust = (lock: boolean) => {
  behaviour.served = archiveOf({ ...PROJECT_FILES, 'Cargo.toml': '[package]\nname = "x"\n', ...(lock ? { 'Cargo.lock': '# lock\n' } : {}) });
};

const CARGO = process.platform === 'win32' ? 'cargo.exe' : 'cargo';

describe('Rust in the build', () => {
  test('gives the wheel step the shared rustup home and its own cargo home, and only that step', async () => {
    const dir = await withRust();
    const { prepared, builds, calls, requestOf, workOf } = bed(undefined, { toolsDir: () => Promise.resolve(dir) });
    await builds.build(requestOf(await prepared()));
    const wheel = calls.find((call) => call.job === 'wheel');
    expect(wheel?.env).toMatchObject({ CARGO_HOME: join(workOf(), 'cargo-home'), RUSTUP_HOME: join(dir, 'rustup') });
    expect(wheel?.env.PATH?.split(delimiter)[0]).toBe(join(dir, 'cargo', 'bin'));
    for (const call of calls.filter((entry) => entry.job !== 'wheel')) {
      expect(call.env).not.toHaveProperty('CARGO_HOME');
      expect(call.env).not.toHaveProperty('PATH');
    }
  });

  test('adds nothing, and downloads no crates, when Rust was not installed by Archipelia', async () => {
    serveRust(true);
    const dir = await mkdtemp(join(holder.tools, 'empty-'));
    const { prepared, builds, calls, requestOf } = bed(undefined, { toolsDir: () => Promise.resolve(dir) });
    await builds.build(requestOf(await prepared()));
    expect(calls.map((call) => call.job)).toEqual(['venv', 'tools', 'wheel']);
    for (const call of calls) expect(call.env.CARGO_HOME).toBeUndefined();
  });
});

describe('the crates of a Rust project', () => {
  test('are downloaded with cargo fetch --locked between the tools and the wheel, into the cargo home of the build', async () => {
    serveRust(true);
    const dir = await withRust();
    const { prepared, builds, calls, requestOf, workOf } = bed(undefined, { toolsDir: () => Promise.resolve(dir) });
    expect((await builds.build(requestOf(await prepared()))).status).toBe('built');
    expect(calls.map((call) => call.job)).toEqual(['venv', 'tools', 'crates', 'wheel']);
    const crates = calls.find((call) => call.job === 'crates');
    expect(crates?.command).toBe(join(dir, 'cargo', 'bin', CARGO));
    expect(crates?.args).toEqual(['fetch', '--locked']);
    expect(crates?.env).toMatchObject({ CARGO_HOME: join(workOf(), 'cargo-home'), RUSTUP_HOME: join(dir, 'rustup') });
  });

  test('are fetched and built with the network in the sandbox, and the shared folders are never writable', async () => {
    serveRust(true);
    const dir = await withRust();
    const { sandbox, scopes } = fakeSandbox();
    const { prepared, builds, calls, requestOf, workOf } = bed(sandbox, { toolsDir: () => Promise.resolve(dir) });
    await builds.build(requestOf(await prepared()));
    const root = (behaviour.runtime as EngineRuntime).root;
    const work = workOf().replace(/[\\/]$/, '');
    const rustScopes = scopes.filter((scope) => scope.readOnly.length === 3);
    expect(rustScopes.map((scope) => scope.network)).toEqual([true, true]);
    for (const scope of rustScopes) {
      expect(scope.readOnly).toEqual([root, join(dir, 'cargo'), join(dir, 'rustup')]);
      expect(scope.path).toEqual([join(dir, 'cargo', 'bin')]);
    }
    for (const scope of scopes) expect(scope.readWrite).toEqual([work]);
    expect(calls.find((call) => call.job === 'wheel')?.env).toMatchObject({ CARGO_HOME: join(workOf(), 'cargo-home') });
  });

  test('stop the build with a plain message when they cannot be downloaded', async () => {
    serveRust(true);
    behaviour.runs = { crates: { status: 'failed', code: 101, lines: ['error: failed to download'] } };
    const dir = await withRust();
    const { prepared, builds, calls, requestOf } = bed(undefined, { toolsDir: () => Promise.resolve(dir) });
    const end = await builds.build(requestOf(await prepared()));
    expect(end).toMatchObject({ status: 'failed', message: expect.stringContaining('Rust crates') as string });
    expect(calls.map((call) => call.job)).toEqual(['venv', 'tools', 'crates']);
  });

  test('are not downloaded ahead without a Cargo.lock, and the wheel step still has the network', async () => {
    serveRust(false);
    const dir = await withRust();
    const { sandbox, scopes } = fakeSandbox();
    const { prepared, builds, calls, requestOf } = bed(sandbox, { toolsDir: () => Promise.resolve(dir) });
    await builds.build(requestOf(await prepared()));
    expect(calls.map((call) => call.job)).toEqual(['venv', 'tools', 'wheel']);
    expect(scopes.at(-1)?.network).toBe(true);
  });
});

describe('which builds are Rust builds', () => {
  const MATURIN = { name: 'maturin', version: '1.7.0', pin: 'maturin==1.7.0', sha256: 'd'.repeat(64), url: 'https://pypi.org/project/maturin/1.7.0/', direct: true };

  test('a plain Python project is not', async () => {
    const { prepared } = bed();
    expect((await prepared()).rust).toBe(false);
  });

  test('a project with a Cargo.toml is', async () => {
    serveRust(false);
    const { prepared } = bed();
    expect((await prepared()).rust).toBe(true);
  });

  test.each(['maturin', 'setuptools-rust', 'setuptools_rust'])('a project that needs %s is', async (name) => {
    engine.resolvePackages.mockResolvedValueOnce([...TOOLS, { ...MATURIN, name, pin: `${name}==1.0.0` }]);
    const { prepared } = bed();
    expect((await prepared()).rust).toBe(true);
  });

  test('only a Rust build gets the network for its wheel step, and no other step gets it but the tools', async () => {
    const netOf = (calls: { job: string; args: string[] }[]) => calls.map((call) => [call.job, call.args[0]]);
    const first = bed(fakeSandbox().sandbox);
    await first.builds.build(first.requestOf(await first.prepared()));
    expect(netOf(first.calls)).toEqual([['venv', '--no-net'], ['tools', '--share-net'], ['wheel', '--no-net']]);
    serveRust(false);
    const second = bed(fakeSandbox().sandbox);
    await second.builds.build(second.requestOf(await second.prepared()));
    expect(netOf(second.calls)).toEqual([['venv', '--no-net'], ['tools', '--share-net'], ['wheel', '--share-net']]);
  });
});
