/* @layer electron-main @kind config */
import type { SmokeResult } from '@archipelia/model';

const ENGINE_TEXT = {
  busy: 'Another engine change is running. Wait for it to end.',
  external: 'ARCHIPELIA_ENGINE_DIR points at an engine managed outside the app.',
  notSetUp: 'The engine is not set up yet: open Settings, Engine.',
  unknown: 'This engine is not installed.',
  removeActive: 'The engine in use cannot be removed. Switch to another engine first.',
  hosting: 'A running session is hosted with this engine. Stop the session first.',
  generating: 'A session is being generated with this engine. Wait for it to end.',
  badChoice: 'The engine choice is not valid.',
  coarse: 'Generate printed no progress line the app knows. Progress may be coarse with this version.',
  noSmokeGame: 'None of the test games is among the official worlds of this engine.',
  hostTimeout: 'MultiServer did not say it was hosting within 60 s.',
} as const;

const CHECK_NAME: Record<NonNullable<SmokeResult['failed']>, string> = {
  schema: 'The options check',
  generate: 'The test seed',
  host: 'The test server',
};

export { CHECK_NAME, ENGINE_TEXT };
