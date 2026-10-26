/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { decodeInstallFailure, failureTextOf, INSTALL_FAILURE_CODE, wireInstallFailure } from '../src';

const failure = {
  code: INSTALL_FAILURE_CODE.packageUnavailable,
  message: 'World needs the Python package ctrando (not on PyPI). Archipelia only installs packages from PyPI.',
  packages: [{ name: 'ctrando', githubUrl: 'https://github.com/Pseudoarc/ctrando' }],
};

const IPC = "Error invoking remote method 'ap:games:install': Error: ";

const thrown = (error: unknown) => (error instanceof Error ? error.message : '');

describe('an install failure over the IPC wire', () => {
  test('survives the wrapper the IPC adds to the message', () => {
    const wire = thrown(wireInstallFailure(Object.assign(new Error(failure.message), { code: failure.code, packages: failure.packages })));
    expect(decodeInstallFailure(`${IPC}${wire}`)).toEqual(failure);
  });

  test('is found through the cause of an error', () => {
    const inner = Object.assign(new Error(failure.message), { code: failure.code, packages: failure.packages });
    expect(decodeInstallFailure(thrown(wireInstallFailure(new Error('outer', { cause: inner }))))).toEqual(failure);
  });

  test('leaves any other error as it is', () => {
    const plain = new Error('disk full');
    expect(wireInstallFailure(plain)).toBe(plain);
    expect(decodeInstallFailure('disk full')).toBeUndefined();
  });

  test('refuses a payload with a wrong code or a link outside GitHub', () => {
    const wire = (value: object) => `archipelia:install-failure:${JSON.stringify(value)}`;
    expect(decodeInstallFailure(wire({ ...failure, code: 'other' }))).toBeUndefined();
    expect(decodeInstallFailure(wire({ ...failure, packages: [{ name: 'x', githubUrl: 'https://evil.example/x' }] }))).toBeUndefined();
    expect(decodeInstallFailure('archipelia:install-failure:{broken')).toBeUndefined();
  });

  test('shows the plain sentence of a failure and any other message as it is', () => {
    const wire = thrown(wireInstallFailure(Object.assign(new Error(failure.message), { code: failure.code, packages: failure.packages })));
    expect(failureTextOf(wire)).toBe(failure.message);
    expect(failureTextOf('disk full')).toBe('disk full');
  });
});
