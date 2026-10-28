/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import type { AdminLobby } from '@archipelia/model';
import { appApi } from '../ipc/app-api';
import { HOST_UI, LOBBY_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { directLobby } from './direct-lobby';
import { named } from './named';
import { waitNamed } from './wait-named';
import { widgetShows } from './widget-shows';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer);

const modeNow = async () => (await appApi().lobbyServerStatus()).options.mode;

const showsLan = async (tour: AppReviewTour) => {
  const mode = await modeNow();
  tour.check('hosting-lan-mode', mode === 'lan', 'the answer switches the network mode to LAN', `the network mode is ${mode}`);
  const both = await widgetShows(tour, 'network', /Room on your network\s*\S+:\d+[\s\S]*Room on this computer\s*127\.0\.0\.1:\d+/i);
  tour.check('hosting-both-addresses', both, 'the Network widget shows the room address on the network and on this computer', 'the Network widget does not show the room addresses');
  await tour.capture('lobby-hosting-lan');
};

const startOnLan = async (tour: AppReviewTour): Promise<AdminLobby | null> => {
  await clickNamed(tour, SELECTOR.segment, HOST_UI.lan, layer(tour) ?? undefined);
  await tour.settle();
  const quiet = named(tour, SELECTOR.dialog, HOST_UI.askTitle) === null && (await modeNow()) === 'off' && !directLobby();
  tour.check('hosting-lan-setup', quiet, 'choosing LAN on the setup page opens nothing and asks nothing', 'choosing LAN opened or asked from the setup page');
  await clickNamed(tour, SELECTOR.button, LOBBY_UI.start, layer(tour) ?? undefined);
  const ask = await waitNamed(tour, SELECTOR.dialog, HOST_UI.askTitle);
  tour.check('hosting-lan-asks', ask !== null, 'Save and run on a LAN session asks once, in plain words, before it opens a port', 'Save and run on a LAN session did not ask');
  if (ask) await clickNamed(tour, SELECTOR.button, HOST_UI.open, ask);
  const opened = await tour.waitFor(() => directLobby() ?? null, 15000);
  tour.check('direct-on', opened?.phase === 'open', 'Save and run opens the lobby of the session with no seed made', 'Save and run opened no lobby');
  if (opened) await showsLan(tour);
  return opened;
};

export { startOnLan };
