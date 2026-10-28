/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import type { VersionList } from '@archipelia/catalog';
import type { CatalogEntry, InstalledGame } from '@archipelia/model';
import { cardPropsOf } from '../../src/views/GameStore/behavior/card-props';
import { versionPick } from '../../src/views/GameStore/behavior/version-pick';
import { handlers as handlersOf, rowFor as rowOf } from './game-handlers.fixtures';

const handlers = handlersOf([]);

const star = (patch: Partial<CatalogEntry> = {}): CatalogEntry => ({
  apworld: 'star_quest', game: 'Star Quest', displayName: 'Star Quest', tags: [], source: 'first-party', stability: 'unknown',
  versions: [{ version: '1.2.0', url: 'https://x/star.apworld' }], firstParty: { repo: 'maker/star-quest', bundleUrl: 'https://x/bundle' }, ...patch,
});

const record = (patch: Partial<InstalledGame> = {}) =>
  ({ apworld: 'star_quest', game: 'Star Quest', version: '1.1.0', source: 'first-party', installedAt: 0, ...patch }) as InstalledGame;

const LIST: VersionList = {
  by: 'tag',
  choices: [
    { id: 'v2.0.0-beta', label: 'v2.0.0-beta', prerelease: true, version: '2.0.0-beta.1' },
    { id: 'v1.2.0', label: 'v1.2.0', prerelease: false, version: '1.2.0', reason: 'No build for Archipelago 0.6.7; builds exist for 0.6.8' },
    { id: 'v1.1.0', label: 'v1.1.0', prerelease: false, version: '1.1.0' },
  ],
  defaultId: 'v1.1.0',
  latestId: 'v1.2.0',
};

describe('update against the newest stable release', () => {
  test('a pre-release newer than every stable shows no update', () => {
    expect(rowOf(star(), [record({ version: '2.0.0-beta.1', release: { tag: 'v2.0.0-beta', prerelease: true } })]).state).toBe('installed');
  });

  test('a stable release later than the installed one shows an update', () => {
    expect(rowOf(star(), [record()]).state).toBe('update');
    expect(rowOf(star(), [record({ version: '1.2.0' })]).state).toBe('installed');
  });

  test('the stable release of an installed pre-release shows an update', () => {
    const installed = record({ version: '1.2.0-rc1', release: { tag: 'v1.2.0-rc1', prerelease: true } });
    expect(rowOf(star(), [installed]).state).toBe('update');
  });
});

describe('the version picker of the details dialog', () => {
  test('lists every release, tags the pre-release, keeps the blocked one with its reason and starts on the default', () => {
    const { view } = versionPick(rowOf(star()), LIST, undefined);
    expect(view?.value).toBe('v1.1.0');
    expect(view?.options.map((option) => [option.value, option.prerelease ?? false, option.reason !== undefined])).toEqual([
      ['v2.0.0-beta', true, false], ['v1.2.0', false, true], ['v1.1.0', false, false],
    ]);
    expect(view?.options[1]?.note).toBe('Latest stable');
  });

  test('a blocked release cannot be picked', () => {
    expect(versionPick(rowOf(star()), LIST, 'v1.2.0').view?.value).toBe('v1.1.0');
  });

  test('the newest stable installs the way the card does, any other release installs by its tag', () => {
    const open: VersionList = { ...LIST, choices: LIST.choices.map(({ reason, ...choice }) => (reason ? choice : { ...choice })), defaultId: 'v1.2.0' };
    expect(versionPick(rowOf(star()), open, undefined).pick?.request).toEqual({ kind: 'index', apworld: 'star_quest', version: '1.2.0' });
    expect(versionPick(rowOf(star()), open, 'v2.0.0-beta').pick?.request).toEqual({ kind: 'index', apworld: 'star_quest', version: '2.0.0-beta.1', tag: 'v2.0.0-beta' });
  });

  test('picking an older compatible release makes the install button work when the card is blocked', () => {
    const row = rowOf(star({ unavailable: 'Needs Archipelago 0.6.8 or newer, the active engine is 0.6.7' }));
    expect(cardPropsOf(row, handlers).actions[0]).toMatchObject({ label: 'Add', disabled: true });
    const { pick } = versionPick(row, LIST, undefined);
    expect(cardPropsOf(row, handlers, pick).actions[0]).toMatchObject({ label: 'Add', disabled: false });
    expect(cardPropsOf(row, handlers, pick).status).toBeUndefined();
  });

  test('the installed release has no install button and is marked, another one says Install this version', () => {
    const installed = [record({ release: { tag: 'v1.1.0', prerelease: false } })];
    const row = rowOf(star({ versions: [{ version: '1.1.0', url: 'u' }] }), installed);
    const same = versionPick(row, LIST, undefined);
    expect(same.view?.options[2]?.note).toBe('Installed');
    expect(cardPropsOf(row, handlers, same.pick).actions.map((action) => action.id)).not.toContain('install');
    const other = versionPick(row, LIST, 'v2.0.0-beta');
    expect(cardPropsOf(row, handlers, other.pick).actions[0]).toMatchObject({ id: 'install', label: 'Install this version' });
  });

  test('an index world picks by version and the update still reads Update', () => {
    const entry = star({ source: 'index', firstParty: undefined, versions: [{ version: '1.2.0', url: 'u' }, { version: '1.1.0', url: 'u' }] });
    const list: VersionList = {
      by: 'version', choices: [{ id: '1.2.0', label: '1.2.0', prerelease: false, version: '1.2.0' }, { id: '1.1.0', label: '1.1.0', prerelease: false, version: '1.1.0' }], defaultId: '1.2.0', latestId: '1.2.0',
    };
    const row = rowOf(entry, [record({ source: 'index' })]);
    const { pick } = versionPick(row, list, undefined);
    expect(pick).toMatchObject({ request: { kind: 'index', apworld: 'star_quest', version: '1.2.0' }, update: true, same: false });
    expect(cardPropsOf(row, handlers, pick).actions[0]).toMatchObject({ label: 'Update' });
  });

  test('while the list is read the picker is loading, and a problem with no list shows its note only', () => {
    expect(versionPick(rowOf(star()), undefined, undefined)).toEqual({ view: { options: [], loading: true } });
    expect(versionPick(rowOf(star()), { by: 'tag', choices: [], problem: 'GitHub asks Archipelia to wait.' }, undefined)).toEqual({ view: { options: [], note: 'GitHub asks Archipelia to wait.' } });
    expect(versionPick(rowOf(star()), { by: 'tag', choices: [] }, undefined)).toEqual({});
  });
});
