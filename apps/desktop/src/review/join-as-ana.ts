/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';
import { useRunsStore } from '../stores/useRunsStore';
import type { Joined } from './join-as-ana.type';
import { joinRoom } from './join-room';
import { REVIEW_PORT, REVIEW_SESSION } from './review.constants';

const roomPassword = async (): Promise<string | undefined> => {
  const run = useRunsStore.getState().runs.find((entry) => entry.snapshot.name === REVIEW_SESSION && entry.status === 'hosting');
  return run ? (await appApi().sessionsRoomPassword(run.id)) ?? undefined : undefined;
};

const joinAsAna = async (tour: AppReviewTour): Promise<Joined> => {
  try {
    return { client: await joinRoom(tour, REVIEW_PORT, await roomPassword()), failure: '' };
  } catch (error) {
    return { client: null, failure: error instanceof Error ? error.message : String(error) };
  }
};

export { joinAsAna };
