/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { appApi } from '../ipc/app-api';
import { lobbyAddress } from '../lobbies/lobby-address';
import { HOST_UI, JOIN_UI, REVIEW_DIRECT, REVIEW_JOINER } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer) ?? undefined;

const type = async (tour: AppReviewTour, name: RegExp, text: string) => {
  const field = await waitNamed(tour, SELECTOR.field, name, layer(tour));
  if (field instanceof HTMLInputElement) tour.typeText(field, text);
};

const findServers = async (tour: AppReviewTour) => {
  await clickNamed(tour, SELECTOR.button, HOST_UI.find, layer(tour));
  const looking = await waitText(tour, /Looking for servers|Servers on your network/, () => tour.find(SELECTOR.layer));
  tour.check('join-finds', looking, 'Find servers on my network starts the look and lists what it finds', 'the look for servers did not start');
  await clickNamed(tour, SELECTOR.button, HOST_UI.stopFind, layer(tour));
};

const joinAsPlayer = async (tour: AppReviewTour, code: string) => {
  nav.open(ROUTE.joinSession);
  await findServers(tour);
  await type(tour, JOIN_UI.address, lobbyAddress(await appApi().lobbyServerStatus()) ?? '');
  await type(tour, JOIN_UI.code, code);
  await clickNamed(tour, SELECTOR.button, JOIN_UI.look, layer(tour));
  const seen = await waitText(tour, new RegExp(`${REVIEW_DIRECT} · Archipelago`), () => tour.find(SELECTOR.layer));
  tour.check('join-look', seen, 'an address and a session code show the session name, its Archipelago version and whether it is open', 'the session was not found from its address and code');
  await type(tour, JOIN_UI.player, REVIEW_JOINER);
  await type(tour, JOIN_UI.display, REVIEW_JOINER);
  await clickNamed(tour, SELECTOR.button, JOIN_UI.join, layer(tour));
  const waiting = await waitText(tour, 'Waiting for the host', () => tour.find(SELECTOR.layer), 20000);
  tour.check('join-pending', waiting, 'Join as a player sends the player and waits for Host approval', 'the join did not reach Waiting for the host');
  await tour.capture('join-pending');
};

export { joinAsPlayer };
