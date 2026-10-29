/* @layer renderer-app @kind logic */
import { defineReviewStep, nav, widgets } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import type { AdminLobby } from '@archipelia/model';
import { ROUTE } from '../hooks/app-navigation.constants';
import { LOCAL_SERVER } from '../lobbies/lobbies.constants';
import { useLobbyStore } from '../stores/useLobbyStore';
import { LAN_STEP_TIMEOUT_MS, LOBBY_STAGE, LOBBY_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { addLobbyPlayer } from './add-lobby-player';
import { checkDock } from './check-dock';
import { checkLobbyStage } from './check-lobby-stage';
import { clickNamed } from './click-named';
import { openSavedLobby } from './open-saved-lobby';
import { pendingJoin } from './pending-join';
import { seedLobby } from './seed-lobby';
import { tabStrip } from './tab-strip';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';

const stageLobby = (): AdminLobby | undefined =>
  useLobbyStore.getState().lobbies[LOCAL_SERVER]?.find((lobby) => lobby.name === LOBBY_STAGE.session && lobby.phase !== 'closed');

const closeStage = async (tour: AppReviewTour) => {
  await clickNamed(tour, SELECTOR.button, new RegExp(`^Close.*${LOBBY_STAGE.session}`), tabStrip(tour));
  const dialog = await waitNamed(tour, SELECTOR.dialog, LOBBY_UI.closeTitle);
  if (dialog) await clickNamed(tour, SELECTOR.button, LOBBY_UI.close, dialog);
  const closed = await tour.waitFor(() => (stageLobby() ? null : true), 15000);
  tour.check('lobby-stage-closed', closed === true, 'closing the tab asks once and closes the lobby', 'the lobby stayed open after closing its tab');
};

const openStage = async (tour: AppReviewTour): Promise<AdminLobby | null> => {
  if (!(await seedLobby())) return null;
  nav.open(ROUTE.sessions);
  await waitText(tour, LOBBY_STAGE.session, () => tour.find(SELECTOR.layer));
  await openSavedLobby(tour, LOBBY_STAGE.session);
  nav.close();
  return tour.waitFor(() => stageLobby() ?? null, 15000);
};

export default defineReviewStep({
  timeoutMs: LAN_STEP_TIMEOUT_MS,
  sizes: LOBBY_STAGE.sizes,
  run: async (tour) => {
    widgets.reset();
    const lobby = await openStage(tour);
    tour.check('lobby-stage-open', lobby !== null, `${LOBBY_STAGE.session} opens its lobby in a tab`, `${LOBBY_STAGE.session} did not open a lobby`);
    if (!lobby) return;
    await addLobbyPlayer(tour);
    const release = await pendingJoin(tour, lobby);
    await tour.settle();
    checkLobbyStage(tour);
    checkDock(tour);
    await tour.capture('lobby');
    await closeStage(tour);
    release();
  },
});
