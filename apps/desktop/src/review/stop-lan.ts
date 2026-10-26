/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';
import { HOST_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { waitText } from './wait-text';

const stopLan = async (tour: AppReviewTour) => {
  const layer = () => tour.find(SELECTOR.layer);
  await clickNamed(tour, SELECTOR.button, HOST_UI.stop, layer() ?? undefined);
  const quiet = await waitText(tour, /Only this computer can reach the lobby server/, layer);
  const stopped = quiet && (await appApi().lobbyServerStatus()).options.mode === 'off';
  tour.check('hosting-stop', stopped, 'Stop switches the network mode back to Off', 'Stop did not switch the network mode off');
};

export { stopLan };
