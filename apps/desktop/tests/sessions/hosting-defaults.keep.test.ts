/* @layer tests @kind test */
import { expect, test } from 'vitest';
import { DEFAULT_SETTINGS } from '../../src/settings.constants';
import { defaultHostOf } from '../../src/views/SessionBuilder/behavior/default-host-of';
import { ggTarget } from '../../src/views/SessionBuilder/behavior/gg-target';
import { hostingDefaults } from '../../src/views/SessionBuilder/behavior/hosting-defaults';
import { newTemplate } from '../../src/views/SessionBuilder/behavior/new-template';

test('a new session takes its host and server options from the Hosting settings', () => {
  const hosting = hostingDefaults({ ...DEFAULT_SETTINGS, hostingLocalPort: 40000, hostingHintCost: 5, hostingReleaseMode: 'goal' });
  const template = newTemplate('t', hosting);
  expect(template.host).toEqual({ kind: 'local', port: 40000 });
  expect(template.server).toMatchObject({ hintCost: 5, releaseMode: 'goal' });
});

test('the archipelago.gg site is only stored when it is not the default one', () => {
  expect(ggTarget('https://archipelago.gg')).toEqual({ kind: 'archipelago-gg' });
  expect(ggTarget('https://ap.example.org')).toEqual({ kind: 'archipelago-gg', baseUrl: 'https://ap.example.org' });
  expect(defaultHostOf(hostingDefaults({ ...DEFAULT_SETTINGS, hostingDefaultHost: 'archipelago-gg' }))).toEqual({ kind: 'archipelago-gg' });
});
