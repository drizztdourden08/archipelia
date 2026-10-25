/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';
import { LOCAL_SERVER } from '../lobbies/lobbies.constants';
import { useLobbyStore } from '../stores/useLobbyStore';
import { HOST_UI, REVIEW_GAME, REVIEW_HOST_PLAYER } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer) ?? undefined;

const hostMember = (lobbyId: string) =>
  useLobbyStore.getState().lobbies[LOCAL_SERVER]?.find((entry) => entry.id === lobbyId)?.members.find((member) => member.kind === 'host');

const ensureGame = async () => {
  const api = appApi();
  if (!(await api.gamesList()).some((game) => game.apworld === REVIEW_GAME.apworld)) await api.gamesInstall({ kind: 'official', apworld: REVIEW_GAME.apworld });
};

const hostPlays = async (tour: AppReviewTour, lobbyId: string) => {
  await ensureGame();
  await tour.capture('lobby-host-player-form');
  await clickNamed(tour, SELECTOR.button, HOST_UI.addPlayer, layer(tour));
  const added = await tour.waitFor(() => {
    const member = hostMember(lobbyId);
    return member?.admission === 'approved' && member.slots.some((slot) => slot.name === REVIEW_HOST_PLAYER) ? member : null;
  }, 15000);
  tour.check('host-player', added !== null, 'Add my player adds the host as an approved player of the lobby', 'the host player was not added');
  await tour.capture('lobby-host-player');
};

export { hostPlays };
