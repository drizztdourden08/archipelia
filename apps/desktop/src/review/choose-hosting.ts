/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { appApi } from '../ipc/app-api';
import { HOST_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer);

const modeNow = async () => (await appApi().lobbyServerStatus()).options.mode;

const openLan = async (tour: AppReviewTour) => {
  await clickNamed(tour, SELECTOR.radio, HOST_UI.lan, layer(tour) ?? undefined);
  const ask = await waitNamed(tour, SELECTOR.dialog, HOST_UI.askTitle);
  tour.check('hosting-lan-asks', ask !== null, 'choosing My local network asks once, in plain words, before it opens a port', 'choosing My local network did not ask');
  if (ask) await clickNamed(tour, SELECTOR.button, HOST_UI.open, ask);
  const running = await waitText(tour, /On your network at \S+:\d+/, () => layer(tour));
  tour.check('hosting-lan-running', running, 'the page shows On your network at the LAN address and port', 'the page does not show the LAN address');
  const mode = await modeNow();
  tour.check('hosting-lan-mode', mode === 'lan', 'the answer switches the network mode to LAN', `the network mode is ${mode}`);
  const both = await waitText(tour, /this computer\s*127\.0\.0\.1:\d+/i, () => layer(tour));
  tour.check('hosting-both-addresses', both, 'the state shows the address on this computer and the address on the network', 'the same-computer address is not shown');
  await tour.capture('lobby-hosting-lan');
};

const stopLan = async (tour: AppReviewTour) => {
  await clickNamed(tour, SELECTOR.button, HOST_UI.stop, layer(tour) ?? undefined);
  const quiet = await waitText(tour, /Only this computer can reach the lobby server/, () => layer(tour));
  const stopped = quiet && (await modeNow()) === 'off';
  tour.check('hosting-stop', stopped, 'Stop switches the network mode back to Off', 'Stop did not switch the network mode off');
};

const chooseHosting = async (tour: AppReviewTour) => {
  nav.open(ROUTE.lobbies);
  const asked = await waitText(tour, /where to host/i, () => layer(tour));
  const options = await waitText(tour, /This computer only[\s\S]*My local network \(LAN\)[\s\S]*A remote Archipelia server/, () => layer(tour));
  tour.check('hosting-choice', asked && options, 'the Lobbies page asks where to host with three options', 'the Where to host choice is missing or incomplete');
  await tour.capture('lobby-hosting-private');
  await openLan(tour);
  await stopLan(tour);
  const joinPath = await waitText(tour, /join a lobby/i, () => layer(tour));
  tour.check('join-path', joinPath, 'the page has a Join a lobby path', 'the Join a lobby path is missing');
};

export { chooseHosting };
