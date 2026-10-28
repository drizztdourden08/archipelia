/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';
import { HOST_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { widgetShows } from './widget-shows';

const stopLan = async (tour: AppReviewTour) => {
  const offered = await widgetShows(tour, 'network', /open to your network\. Stop closes it/);
  tour.check('hosting-stop-offered', offered, 'the Network widget offers Stop while the computer is open to the network', 'the Network widget does not offer Stop');
  const frame = await tour.openWidget('network');
  await clickNamed(tour, SELECTOR.button, HOST_UI.stop, frame ?? undefined);
  const closed = frame ? await tour.waitFor(() => (/Stop closes it/.test(frame.innerText) ? null : true), 8000) : null;
  const off = closed === true && (await appApi().lobbyServerStatus()).options.mode === 'off';
  tour.check('hosting-stop', off,'Stop in the Network widget switches the network mode back to Off', 'Stop in the Network widget did not switch the network mode off');
  await tour.capture('lobby-network-stopped');
};

export { stopLan };
