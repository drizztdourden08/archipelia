/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';

const stopLan = async (tour: AppReviewTour) => {
  const api = appApi();
  const { options } = await api.lobbyServerStatus();
  const after = await api.lobbyServerApply({ ...options, mode: 'off' });
  tour.check('hosting-stop', after.options.mode === 'off', 'switching the network mode back to Off closes the lobby server to the network', 'the network mode did not switch off');
};

export { stopLan };
