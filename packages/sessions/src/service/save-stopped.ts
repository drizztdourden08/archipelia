/* @layer core @kind logic */
import type { RunEndReason } from '@archipelia/model';
import type { LiveSession, ServiceDeps } from './service-deps.type';
import { liveEnd } from './live-end';
import { SERVER_LINES, SERVER_LOG } from './session-service.constants';
import { updateRun } from './update-run';

const saveStopped = async (deps: ServiceDeps, id: string, entry: LiveSession, reason: RunEndReason) => {
  const { files, runs } = deps;
  await files.writeText(`${id}/${SERVER_LOG}`, entry.log.map((line) => line.text).join('\n'));
  await files.writeJson(`${id}/${SERVER_LINES}`, entry.log);
  const session = await runs.get(id);
  if (!session) return undefined;
  const end = await liveEnd(files, session, entry, reason);
  return updateRun(deps)(session, { status: 'stopped', serverLog: SERVER_LOG, ...(end ? { end } : {}) });
};

export { saveStopped };
