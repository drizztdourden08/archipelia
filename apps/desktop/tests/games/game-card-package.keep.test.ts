/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { wireInstallFailure } from '@archipelia/model';
import { cardPropsOf } from '../../src/views/GameStore/behavior/card-props';
import { failureOf } from '../../src/views/GameStore/behavior/failure-of';
import { needOf } from '../../src/views/GameStore/behavior/need-of';
import { needProps } from '../../src/views/GameStore/behavior/need-props';
import { reasonOf } from '../../src/views/GameStore/behavior/reason-of';
import { handlers, row } from './game-handlers.fixtures';

const MESSAGE = 'Chrono Trigger needs the Python package ctrando (not on PyPI, only on GitHub: https://github.com/Pseudoarc/ctrando). Archipelia only installs packages from PyPI.';

const PACKAGES = [{ name: 'ctrando', githubUrl: 'https://github.com/Pseudoarc/ctrando' }];

const wireOf = () => {
  const wire = wireInstallFailure(Object.assign(new Error(MESSAGE), { code: 'package-unavailable', packages: PACKAGES }));
  return wire instanceof Error ? wire.message : '';
};

const ipcError = () => new Error(`Error invoking remote method 'ap:games:install': Error: ${wireOf()}`);

describe('a world that needs a package Archipelia cannot install', () => {
  const failed = () => handlers([], { hk: reasonOf(ipcError(), 'Could not install the game.') });

  test('the card has its own state with the sentence of the owner, not Failed', () => {
    expect(cardPropsOf(row, failed()).status).toBe('needs-package');
  });

  test('the code survives the IPC wrapper and the plain sentence names the package', () => {
    expect(needOf(row, failed())).toMatchObject({ code: 'package-unavailable', packages: PACKAGES });
    expect(failureOf(row, failed())).toBe(MESSAGE);
  });

  test('the dialog gets the message and the repo to open', () => {
    expect(needProps(needOf(row, failed()))).toEqual({ need: { message: MESSAGE, href: 'https://github.com/Pseudoarc/ctrando' } });
    expect(needProps(undefined)).toEqual({});
  });

  test('an ordinary failure stays Failed and has no package state', () => {
    const other = handlers([], { hk: 'disk full' });
    expect(cardPropsOf(row, other).status).toBe('failed');
    expect(needOf(row, other)).toBeUndefined();
  });
});
