/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { appApi } from '../ipc/app-api';
import { lobbyAddress } from '../lobbies/lobby-address';
import { HOST_UI, REVIEW_LOBBY } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer) ?? undefined;

const findServers = async (tour: AppReviewTour) => {
  await clickNamed(tour, SELECTOR.button, HOST_UI.find, layer(tour));
  const looking = await waitText(tour, /Looking for servers|Servers on your network/, () => tour.find(SELECTOR.layer));
  tour.check('join-finds', looking, 'Find servers on my network starts the look and lists what it finds', 'the look for servers did not start');
  await clickNamed(tour, SELECTOR.button, HOST_UI.stopFind, layer(tour));
};

const lookAtLobby = async (tour: AppReviewTour, code: string) => {
  nav.open(ROUTE.lobbies);
  await findServers(tour);
  const address = lobbyAddress(await appApi().lobbyServerStatus());
  const addressField = await waitNamed(tour, SELECTOR.field, /^Server address/, layer(tour));
  const codeField = await waitNamed(tour, SELECTOR.field, /^Lobby code/, layer(tour));
  if (addressField instanceof HTMLInputElement && address) tour.typeText(addressField, address);
  if (codeField instanceof HTMLInputElement) tour.typeText(codeField, code);
  await clickNamed(tour, SELECTOR.button, HOST_UI.look, layer(tour));
  const seen = await waitText(tour, new RegExp(`${REVIEW_LOBBY} · Archipelago`), () => tour.find(SELECTOR.layer));
  tour.check('join-look', seen, 'an address and a lobby code show the lobby name, its Archipelago version and whether it is open', 'the lobby was not found from its address and code');
  await tour.capture('lobby-join');
};

export { lookAtLobby };
