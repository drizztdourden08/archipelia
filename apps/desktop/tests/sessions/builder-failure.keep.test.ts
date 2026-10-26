/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { failureOf as failureFrom } from '../../src/hooks/failure-of';
import { BUILDER_FAILURE } from '../../src/views/SessionBuilder/SessionBuilder.constants';
import { LOBBY_FAILURE } from '../../src/views/SessionLobby/SessionLobby.constants';

const failureOf = failureFrom({ ...BUILDER_FAILURE, ...LOBBY_FAILURE });

describe('builder failures', () => {
  test('each action of the setup page and the lobby has its own sentence', () => {
    expect(failureFrom(BUILDER_FAILURE)('save')).toBe('Could not save the session.');
    expect(failureOf('start')).toBe('Could not start the session.');
    expect(failureOf('run')).toBe('Could not start the run.');
    expect(failureOf('close')).toBe('Could not close the lobby.');
    expect(failureOf('password')).toBe('Could not clear the room password.');
    expect(failureOf('yaml-2')).toBe('Could not import that YAML file.');
    expect(failureOf('preset-1')).toBe('Could not make a preset for that player.');
  });

  test('an unknown key gets a general sentence', () => {
    expect(failureOf('savings')).toBe('Something went wrong. Try again.');
    expect(failureOf('constructor')).toBe('Something went wrong. Try again.');
  });
});
