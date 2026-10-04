/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { failureOf } from '../../src/views/SessionBuilder/behavior/failure-of';

describe('builder failures', () => {
  test('each builder action has its own sentence', () => {
    expect(failureOf('save')).toBe('Could not save the session.');
    expect(failureOf('run')).toBe('Could not start the run.');
    expect(failureOf('password')).toBe('Could not clear the room password.');
    expect(failureOf('yaml-2')).toBe('Could not import that YAML file.');
    expect(failureOf('preset-1')).toBe('Could not make a preset for that player.');
  });

  test('an unknown key gets a general sentence', () => {
    expect(failureOf('savings')).toBe('Something went wrong. Try again.');
  });
});
