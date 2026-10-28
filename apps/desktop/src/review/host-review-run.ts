/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import type { Session, SessionTemplate } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { joinRoom } from './join-room';
import { runSummary } from './run-summary';

const hostReviewRun = async (tour: AppReviewTour, template: SessionTemplate): Promise<Session> => {
  const run = await appApi().sessionsRun(template);
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
