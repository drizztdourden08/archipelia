/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import type { Session, SessionTemplate } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { hostReviewRun } from './host-review-run';

const finishedRun = async (tour: AppReviewTour, template: SessionTemplate): Promise<Session | undefined> => {
  const api = appApi();
  const kept = (await api.sessionsList()).find((run) => run.templateId === template.id && run.status === 'stopped' && run.output);
  if (kept) return kept;
  const hosted = await hostReviewRun(tour, template);
  return hosted.status === 'hosting' ? api.sessionsStop(hosted.id) : hosted;
};

export { finishedRun };
