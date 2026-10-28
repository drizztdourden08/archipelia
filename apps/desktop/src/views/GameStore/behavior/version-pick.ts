/* @layer renderer-app @kind logic */
import type { VersionChoice, VersionList } from '@archipelia/catalog';
import type { GameRow, VersionPick } from '../GameStore.type';
import { isInstalledVersion } from './is-installed-version';
import { versionOptions } from './version-options';
import { versionRequest } from './version-request';
import type { VersionPickView } from './version-pick.type';

const pickOf = (row: GameRow, list: VersionList, choice: VersionChoice): VersionPick | undefined => {
  const request = versionRequest(row, list, choice);
  return request && { request, same: isInstalledVersion(row, choice, list.by), update: row.state === 'update' && choice.id === list.latestId };
};

const chosenOf = (list: VersionList, picked: string | undefined): VersionChoice | undefined =>
  list.choices.find((choice) => choice.id === picked && !choice.reason) ?? list.choices.find((choice) => choice.id === list.defaultId);

const versionPick = (row: GameRow, list: VersionList | undefined, picked: string | undefined): VersionPickView => {
  if (!list) return { view: { options: [], loading: true } };
  if (list.choices.length === 0) return list.problem ? { view: { options: [], note: list.problem } } : {};
  const choice = chosenOf(list, picked);
  const pick = choice && pickOf(row, list, choice);
  return {
    view: { options: versionOptions(row, list), ...(choice ? { value: choice.id } : {}), ...(list.problem ? { note: list.problem } : {}) },
    ...(pick ? { pick } : {}),
  };
};

export { versionPick };
