/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { GAME_STATUS } from '../src/compounds/GameCard/GameCard.constants';

describe('the status of a world that needs a package Archipelia cannot install', () => {
  test('reads as a warning of its own, apart from Failed', () => {
    expect(GAME_STATUS['needs-package']).toMatchObject({ label: 'Needs a package Archipelia cannot install', tone: 'warning' });
    expect(GAME_STATUS.failed.tone).toBe('danger');
  });
});
