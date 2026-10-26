/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { INSTALL_FAILURE_CODE, installFailureFrom, installFailureOf } from '../src';

const failure = {
  code: INSTALL_FAILURE_CODE.packageUnavailable,
  message: 'World needs the Python package ctrando (not on PyPI). Archipelia only installs packages from PyPI.',
  packages: [{ name: 'ctrando', githubUrl: 'https://github.com/Pseudoarc/ctrando' }],
};

const unavailable = () => Object.assign(new Error(failure.message), { code: failure.code, packages: failure.packages });

describe('an install failure', () => {
  test('is found on an error and through its cause', () => {
    expect(installFailureOf(unavailable())).toEqual(failure);
    expect(installFailureOf(new Error('outer', { cause: unavailable() }))).toEqual(failure);
  });

  test('is not found on any other error', () => {
    expect(installFailureOf(new Error('disk full'))).toBeUndefined();
  });

  test('is read back from the code, message and data of a coded error', () => {
    expect(installFailureFrom({ code: failure.code, message: failure.message, data: { packages: failure.packages } })).toEqual(failure);
  });

  test('refuses a wrong code, missing data or a link outside GitHub', () => {
    const data = { packages: failure.packages };
    expect(installFailureFrom({ code: 'other', message: failure.message, data })).toBeUndefined();
    expect(installFailureFrom({ code: failure.code, message: failure.message })).toBeUndefined();
    expect(installFailureFrom({ code: failure.code, message: failure.message, data: { packages: [{ name: 'x', githubUrl: 'https://evil.example/x' }] } })).toBeUndefined();
  });
});
