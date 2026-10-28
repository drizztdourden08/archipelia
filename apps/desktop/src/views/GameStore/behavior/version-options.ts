/* @layer renderer-app @kind logic */
import type { GameDetailsVersion } from '@archipelia/design';
import type { VersionChoice, VersionList } from '@archipelia/catalog';
import { VERSION_NOTE } from '../GameStore.constants';
import type { GameRow } from '../GameStore.type';
import { isInstalledVersion } from './is-installed-version';

const noteOf = (row: GameRow, list: VersionList, choice: VersionChoice): string =>
  [choice.id === list.latestId ? VERSION_NOTE.latest : '', isInstalledVersion(row, choice, list.by) ? VERSION_NOTE.installed : ''].filter(Boolean).join(', ');

const optionOf = (row: GameRow, list: VersionList, choice: VersionChoice): GameDetailsVersion => {
  const note = noteOf(row, list, choice);
  return {
    value: choice.id,
    label: choice.label,
    ...(choice.prerelease ? { prerelease: true } : {}),
    ...(row.entry.firstParty?.appVersion && choice.version ? { worldVersion: choice.version } : {}),
    ...(note ? { note } : {}),
    ...(choice.reason ? { reason: choice.reason } : {}),
  };
};

const versionOptions = (row: GameRow, list: VersionList): GameDetailsVersion[] => list.choices.map((choice) => optionOf(row, list, choice));

export { versionOptions };
