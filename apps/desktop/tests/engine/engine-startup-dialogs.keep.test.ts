/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { firstRunDialog } from '../../src/hooks/engine-startup/first-run-dialog';
import { listlessDialog } from '../../src/hooks/engine-startup/listless-dialog';
import { offerDialog } from '../../src/hooks/engine-startup/offer-dialog';
import { pickedChoice } from '../../src/hooks/engine-startup/picked-choice';
import { startupAction } from '../../src/hooks/engine-startup/startup-action';
import { startupWanted } from '../../src/hooks/engine-startup/startup-wanted';
import { feedOf, overviewOf, range } from './engine-fixture';
import { broken, first, fresh, latest, missing, offer, ready } from './engine-startup-fixture';

describe('when the start-up check runs', () => {
  test('the setting on always asks main', () => {
    expect(startupWanted(true, ready)).toBe(true);
    expect(startupWanted(true, missing)).toBe(true);
  });

  test('the setting off still asks main when there is no ready engine', () => {
    expect(startupWanted(false, missing)).toBe(true);
    expect(startupWanted(false, broken)).toBe(true);
  });

  test('the setting off with a ready engine skips the check', () => {
    expect(startupWanted(false, ready)).toBe(false);
  });

  test('the setting off drops an offer and keeps a first run', () => {
    expect(startupAction(offer, false)).toEqual({ kind: 'none' });
    expect(startupAction(offer, true)).toEqual(offer);
    expect(startupAction(first, false)).toEqual(first);
  });
});

describe('the first run dialog', () => {
  test('is a searchable select over the releases with the latest preselected', () => {
    const dialog = firstRunDialog(fresh, latest);
    expect(dialog?.look).toBe('select');
    expect(dialog?.searchable).toBe(true);
    expect(dialog?.initial).toBe('0.6.8');
    expect(dialog?.choices.map((entry) => entry.value)).toEqual(['0.6.8', '0.6.7', '0.6.2']);
    expect(dialog?.choices[0]?.description).toBe('latest');
  });

  test('says what will be installed', () => {
    const facts = firstRunDialog(fresh, latest)?.facts ?? [];
    expect(facts.map((fact) => fact.label)).toEqual(['Archipelago', 'Python', 'Requirements', 'Download']);
    expect(facts.find((fact) => fact.label === 'Python')?.value).toContain('3.12.15');
    expect(facts.find((fact) => fact.label === 'Download')?.value).toContain('90 MB');
  });

  test('has no select when no release could be read', () => {
    const offline = overviewOf({ active: undefined, installed: [], feed: feedOf({ state: 'never', releases: [] }) });
    expect(firstRunDialog(offline, latest)).toBeNull();
    expect(firstRunDialog(null, latest)).toBeNull();
    expect(listlessDialog(latest).facts?.find((fact) => fact.label === 'Archipelago')?.value).toBe('0.6.8');
  });
});

describe('the release the owner picks', () => {
  test('the preselected release installs the decided choice', () => {
    expect(pickedChoice(fresh, latest, '0.6.8')).toEqual(latest);
  });

  test('another release installs with a Python that fits it', () => {
    expect(pickedChoice(fresh, latest, '0.6.2')).toEqual({ ap: '0.6.2', python: '3.12.15', pythonRelease: '20261021' });
  });

  test('a release the Python does not fit moves to the newest fitting build', () => {
    const narrow = { ...fresh, ranges: { ...fresh.ranges, '0.6.2': range('3.10.11', '3.12.15') } };
    expect(pickedChoice(narrow, latest, '0.6.2')?.python).toBe('3.12.14');
  });

  test('another release cannot be picked without the lists', () => {
    expect(pickedChoice(null, latest, '0.6.2')).toBeUndefined();
  });
});

describe('the upgrade offer dialog', () => {
  test('names the new version and says what happens', () => {
    const dialog = offerDialog(offer);
    expect(dialog.title).toBe('Archipelago 0.6.8 is out');
    expect(dialog.message).toContain('You run Archipelago 0.6.7');
    expect(dialog.message).toContain('Python 3.12.15');
    expect(dialog.confirmLabel).toBe('Upgrade');
    expect(dialog.cancelLabel).toBe('Not now');
  });

  test('carries the release notes address', () => {
    expect(offerDialog(offer).facts).toEqual([{ label: 'Release notes', value: 'https://example.test/0.6.8' }]);
  });
});
