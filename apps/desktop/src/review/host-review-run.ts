/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import type { Session, SessionTemplate } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { useRunsStore } from '../stores/useRunsStore';
import { joinRoom } from './join-room';
import { RUN_TIMEOUT_MS } from './review.constants';
import { runSummary } from './run-summary';
import { withHeartbeat } from './with-heartbeat';

const statusOf = (templateId: string, startedAt: number) => {
  const run = useRunsStore.getState().runs.find((entry) => entry.templateId === templateId && entry.createdAt >= startedAt);
  return run ? `the run is ${run.status}` : 'the run is starting';
};

const timeout = (ms: number) => new Promise<never>((_resolve, reject) => { setTimeout(() => reject(new Error(`no hosting room after ${ms / 1000} s`)), ms); });

const hostReviewRun = async (tour: AppReviewTour, template: SessionTemplate): Promise<Session> => {
  const startedAt = Date.now() - 1000;
  const run = await withHeartbeat(tour, Promise.race([appApi().sessionsRun(template), timeout(RUN_TIMEOUT_MS)]), () => statusOf(template.id, startedAt));
  tour.check('run-hosts', run.status === 'hosting', runSummary(run), runSummary(run));
  if (run.status !== 'hosting' || template.host.kind !== 'local') return run;
  const checked = await joinRoom(tour, template.host.port).then((client) => {
    const count = client.room.checkedLocations.length;
    client.socket.disconnect();
    return count;
  }, (err: Error) => {
    tour.check('player-joined', false, '', `the review player did not play: ${err.message}`);
    return 0;
  });
  tour.check('player-checks', checked > 0, `${checked} locations checked by the first player`, 'the review player checked nothing');
  await appApi().sessionsCommand(run.id, '/players');
  await tour.delay(500);
  return run;
};

export { hostReviewRun };
