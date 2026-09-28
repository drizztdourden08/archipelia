/* @layer tests @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from 'vitest';
import { ENGINE_AP_VERSION } from '../src';

test('the engine version matches the bundle pins', () => {
  const pins: unknown = JSON.parse(readFileSync(join(import.meta.dirname, '../../../tooling/engine-bundle/engine-pins.json'), 'utf8'));
  expect(pins).toMatchObject({ ap: { version: ENGINE_AP_VERSION } });
});
