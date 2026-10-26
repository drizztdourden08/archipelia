/* @layer tests @kind test */
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { buildEnv } from '../../src/build/build-env';
import { BUILD_ENV, COMPILER_VARS, SCRATCH_VARS, SYSTEM_VARS } from '../../src/build/build.constants';
import { buildDirsOf } from '../../src/build/build-dirs';
import { toolsSpec } from '../../src/build/tools-spec';
import { venvPython } from '../../src/build/venv-python';
import { venvSpec } from '../../src/build/venv-spec';
import { wheelSpec } from '../../src/build/wheel-spec';
import { runtimeOf } from '../install/install-fakes';

const dirs = buildDirsOf(join('work', 'archipelia-build-1'));

describe('the commands of a build', () => {
  test('the venv is made by the engine Python, in isolated mode, in the private folder', () => {
    const runtime = runtimeOf('old');
    const { env, ...spec } = venvSpec(runtime, dirs);
    expect(spec).toEqual({ command: runtime.python, args: ['-X', 'utf8', '-I', '-m', 'venv', dirs.venv], cwd: dirs.work });
    expect(env).toMatchObject({ PIP_NO_INPUT: '1' });
  });

  test('the build tools are pinned binary wheels, checked by hash, installed with no dependencies into the venv only', () => {
    const spec = toolsSpec(dirs);
    expect(spec.command).toBe(venvPython(dirs.venv));
    expect(spec.args).toEqual([
      '-X', 'utf8', '-I', '-m', 'pip', 'install', '--isolated', '--disable-pip-version-check', '--no-warn-script-location', '--no-input', '--no-cache-dir',
      '--only-binary=:all:', '--no-deps', '--require-hashes', '-r', dirs.tools,
    ]);
    expect(spec.cwd).toBe(dirs.work);
  });

  test('the project is built by pip wheel with no isolation, no dependencies and no index, into the out folder', () => {
    const spec = wheelSpec(dirs);
    expect(spec.command).toBe(venvPython(dirs.venv));
    expect(spec.args).toEqual([
      '-X', 'utf8', '-I', '-m', 'pip', 'wheel', '--isolated', '--disable-pip-version-check', '--no-warn-script-location', '--no-input', '--no-cache-dir',
      '--no-deps', '--no-build-isolation', '--no-index', '-w', dirs.out, dirs.src,
    ]);
    expect(spec.cwd).toBe(dirs.work);
  });

  test('the venv Python is in Scripts on Windows and in bin elsewhere', () => {
    expect(venvPython('v', 'win32')).toBe(join('v', 'Scripts', 'python.exe'));
    expect(venvPython('v', 'linux')).toBe(join('v', 'bin', 'python'));
    expect(venvPython('v', 'darwin')).toBe(join('v', 'bin', 'python'));
  });
});

describe('the environment of a build', () => {
  const user = {
    PATH: '/usr/bin', GH_TOKEN: 'ghp_secret', GITHUB_TOKEN: 'secret', AWS_SECRET_ACCESS_KEY: 'secret', NPM_TOKEN: 'secret', PYTHONPATH: '/evil', PIP_INDEX_URL: 'https://evil.example/simple',
    CC: 'gcc-14', LIB: 'C:\\sdk\\lib', INCLUDE: 'C:\\sdk\\include', CARGO_HOME: '/home/me/.cargo',
  };

  test('keeps the compiler variables and drops everything else of the user, including tokens, the path and pip settings', () => {
    const env = buildEnv(dirs, user);
    expect(env).toMatchObject({ CC: 'gcc-14', LIB: 'C:\\sdk\\lib', INCLUDE: 'C:\\sdk\\include', CARGO_HOME: '/home/me/.cargo' });
    for (const name of ['PATH', 'GH_TOKEN', 'GITHUB_TOKEN', 'AWS_SECRET_ACCESS_KEY', 'NPM_TOKEN', 'PYTHONPATH', 'PIP_INDEX_URL']) expect(env).not.toHaveProperty(name);
  });

  test('keeps the system variables a compiler needs, and never PATH, which Brock supplies and refuses here', () => {
    const env = buildEnv(dirs, { ...user, SYSTEMROOT: 'C:\\Windows', WINDIR: 'C:\\Windows', HOME: '/home/me', USERPROFILE: 'C:\\Users\\me', [SCRATCH_VARS[0]]: 'C:\\evil', APPDATA: 'C:\\roaming' });
    expect(env).toMatchObject({ SYSTEMROOT: 'C:\\Windows', WINDIR: 'C:\\Windows', HOME: '/home/me', USERPROFILE: 'C:\\Users\\me' });
    expect(env).not.toHaveProperty('PATH');
    expect(env).not.toHaveProperty('APPDATA');
    expect(SCRATCH_VARS.map((name) => env[name])).toEqual([dirs.scratch, dirs.scratch, dirs.scratch]);
  });

  test('holds nothing but the compiler, system, pip and scratch names, whatever the app environment holds', () => {
    const allowed = new Set([...COMPILER_VARS, ...SYSTEM_VARS, ...Object.keys(BUILD_ENV), ...SCRATCH_VARS]);
    const everything = Object.fromEntries(['PATH', 'GH_TOKEN', 'AWS_SECRET_ACCESS_KEY', 'NODE_OPTIONS', 'ELECTRON_RUN_AS_NODE', 'ARCHIPELIA_SECRET', 'SYSTEMROOT', 'HOME', 'CC', 'INCLUDE'].map((name) => [name, 'x']));
    const names = Object.keys(buildEnv(dirs, everything));
    expect(names.sort()).toEqual(expect.arrayContaining(['CC', 'HOME', 'INCLUDE', 'SYSTEMROOT']));
    expect(names.filter((name) => !allowed.has(name as never))).toEqual([]);
  });

  test('turns pip prompts off, keeps the user site out and points every temp folder into the private folder', () => {
    expect(buildEnv(dirs, {})).toEqual({
      PIP_NO_INPUT: '1', PIP_DISABLE_PIP_VERSION_CHECK: '1', PYTHONUTF8: '1', PYTHONUNBUFFERED: '1', PYTHONNOUSERSITE: '1',
      ...Object.fromEntries(['TEMP', 'TMP', 'TMPDIR'].map((name) => [name, dirs.scratch])),
    });
  });
});
