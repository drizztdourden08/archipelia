/* @layer tests @kind test */
import { describe, expect, test, vi } from 'vitest';
import { INSTALL_FAILURE_CODE } from '@archipelia/model';
import { needOfLine } from '../src/install/need-of-line';
import { engine, GAME, MISSING, notLoaded, pypi, registerBed } from './world-packages.fixtures';

vi.mock('@archipelia/engine', async () => (await import('./world-packages.fixtures')).mockedEngine());

const { commitInstall } = await import('../src/install/commit-install');
const { PackageUnavailableError } = await import('../src/install/package-unavailable-error');

const bed = registerBed();

const gone = () => new Response('', { status: 404 });

const THE_REPO = 'https://github.com/Pseudoarc/ctrando';

const installFailureOf = (err: unknown) =>
  (err instanceof PackageUnavailableError ? { code: err.code, message: err.message, packages: err.packages } : undefined);

const catching = async (work: Promise<unknown>) => work.then(() => undefined, (err: unknown) => err);

describe('a requirement given as an address', () => {
  test('a GitHub requirement names the package and links its repo', () => {
    expect(needOfLine('ctrando @ git+https://github.com/Pseudoarc/ctrando.git@main')).toEqual({ name: 'ctrando', githubUrl: THE_REPO });
    expect(needOfLine('git+https://github.com/Pseudoarc/ctrando.git#egg=ctrando')).toEqual({ name: 'ctrando', githubUrl: THE_REPO });
    expect(needOfLine('git+ssh://git@github.com/Pseudoarc/ctrando')).toEqual({ name: 'ctrando', githubUrl: THE_REPO });
  });

  test('another host has a name and no link', () => {
    expect(needOfLine('thing @ https://example.com/dl/thing-1.0.tar.gz')).toEqual({ name: 'thing' });
    expect(needOfLine('https://gitlab.com/group/thing.git')).toEqual({ name: 'thing' });
  });

  test('an option, a local path or a wheel name is not a package address', () => {
    expect(needOfLine('--index-url https://evil.example/simple')).toBeUndefined();
    expect(needOfLine('evil.whl')).toBeUndefined();
    expect(needOfLine('file:///tmp/evil')).toBeUndefined();
  });
});

describe('a world that needs a package Archipelia cannot install', () => {
  test('a requirement from GitHub is a typed failure that names the package and its repo', async () => {
    const err = await catching(commitInstall(await bed.jobOf('ctrando @ git+https://github.com/Pseudoarc/ctrando\n')));
    expect(err).toBeInstanceOf(PackageUnavailableError);
    expect(installFailureOf(err)).toEqual({
      code: INSTALL_FAILURE_CODE.packageUnavailable,
      message: `${GAME} needs the Python package ctrando (not on PyPI, only on GitHub: ${THE_REPO}). Archipelia only installs packages from PyPI.`,
      packages: [{ name: 'ctrando', githubUrl: THE_REPO }],
    });
    expect(engine.resolvePackages).not.toHaveBeenCalled();
    expect(pypi).not.toHaveBeenCalled();
  });

  test('a listed package that PyPI does not have is a typed failure', async () => {
    engine.resolvePackages.mockRejectedValue(new Error('No matching distribution found for ctrando'));
    pypi.mockResolvedValue(gone());
    const err = await catching(commitInstall(await bed.jobOf('ctrando>=1\n')));
    expect(installFailureOf(err)?.packages).toEqual([{ name: 'ctrando' }]);
    expect(installFailureOf(err)?.message).toBe(`${GAME} needs the Python package ctrando (not on PyPI). Archipelia only installs packages from PyPI.`);
    expect(pypi.mock.calls[0]?.[0]).toBe('https://pypi.org/pypi/ctrando/json');
  });

  test('a package that is on PyPI but cannot be resolved stays an ordinary failure', async () => {
    engine.resolvePackages.mockRejectedValue(new Error('No matching distribution found for ctrando>=99'));
    pypi.mockResolvedValue(new Response('{}', { status: 200 }));
    const err = await catching(commitInstall(await bed.jobOf('ctrando>=99\n')));
    expect(installFailureOf(err)).toBeUndefined();
    expect((err as Error).message).toContain('could not be installed: No matching distribution found for ctrando>=99.');
  });

  test('an import the world never lists, that PyPI does not have, is a typed failure', async () => {
    engine.readOptionsSchema.mockResolvedValue(notLoaded(MISSING));
    pypi.mockResolvedValue(gone());
    const err = await catching(commitInstall(await bed.jobOf(undefined)));
    expect(installFailureOf(err)?.packages).toEqual([{ name: 'ctrando' }]);
    expect(await bed.placed()).toBe(false);
  });

  test('an offline lookup never turns a failure into a typed one', async () => {
    engine.readOptionsSchema.mockResolvedValue(notLoaded(MISSING));
    const err = await catching(commitInstall(await bed.jobOf(undefined)));
    expect(installFailureOf(err)).toBeUndefined();
    expect((err as Error).message).toContain('the world does not list it in a requirements.txt');
  });
});
