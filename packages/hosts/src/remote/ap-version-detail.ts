/* @layer core @kind logic */
import { compareVersions } from '@archipelia/engine';
import type { ServerCheck } from '@archipelia/model';
import { NEWER_SEED_NOTE } from './ap-version-detail.constants';

const apVersionDetail = (server: string, appVersion: string | undefined): Pick<ServerCheck, 'ok' | 'detail'> => {
  if (!server) return { ok: false, detail: 'no Archipelago version was found on the server' };
  if (!appVersion) return { ok: true, detail: `Archipelago ${server} on the server` };
  const older = compareVersions(server, appVersion) < 0;
  const detail = `Archipelago ${server} on the server, this app runs ${appVersion}`;
  return { ok: !older, detail: older ? `${detail}. ${NEWER_SEED_NOTE}` : detail };
};

export { apVersionDetail };
