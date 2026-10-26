/* @layer renderer-app @kind logic */
import { defineReviewStep } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { formatLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import type { AdminLobby } from '@archipelia/model';
import { openSessionEditor } from '../hooks/open-session-editor';
import { openSessionLobby } from '../hooks/open-session-lobby';
import { appApi } from '../ipc/app-api';
import { DIRECT_UI, REVIEW_DIRECT } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { admitPlayers } from './admit-players';
import { checkWhere } from './check-where';
import { startOnLan } from './start-on-lan';
import { stopLan } from './stop-lan';
import { directLobby } from './direct-lobby';
import { enableDirect } from './enable-direct';
import { joinAsPlayer } from './join-as-player';
import { closeLobby } from './close-lobby';
import { runDirect } from './run-direct';
import { seedDirect } from './seed-direct';
import { waitText } from './wait-text';

const openLobbyScreen = async (tour: AppReviewTour, id: string) => {
  openSessionLobby(id);
  return waitText(tour, /Players · \d/i, () => tour.find(SELECTOR.layer), 15000);
};

const showsLobby = async (tour: AppReviewTour, lobby: AdminLobby) => {
  const code = formatLobbyCode(lobby.code) ?? lobby.code;
  const shown = await waitText(tour, code, () => tour.find(SELECTOR.layer));
  tour.check('direct-code', shown, 'the lobby screen shows the session code', 'the session code is not shown on the lobby screen');
  tour.check('direct-unlisted', lobby.options.allowUnlisted, 'Allow unlisted clients from the setup page reaches the lobby', 'Allow unlisted clients did not reach the lobby');
};

const closeAfterRun = async (tour: AppReviewTour, id: string, lobbyId: string) => {
  await openLobbyScreen(tour, id);
  await closeLobby(tour);
  const closed = await tour.waitFor(() => (directLobby(lobbyId)?.phase === 'closed' ? true : null), 15000);
  tour.check('direct-off', closed === true, 'Close lobby on the lobby screen closes the lobby of the session', 'the lobby of the session did not close');
  for (const join of await appApi().joinsList()) if (join.lobbyName === REVIEW_DIRECT) await appApi().joinsDismiss(join.id);
};

export default defineReviewStep({
  run: async (tour) => {
    const status = await appApi().lobbyServerStatus();
    tour.check('lobby-server', status.state === 'listening', 'the embedded lobby server listens', `the lobby server is ${status.state}: ${status.error ?? ''}`);
    const template = status.state === 'listening' ? await seedDirect() : null;
    if (!template) return;
    openSessionEditor(template.id);
    const section = await waitText(tour, DIRECT_UI.section, () => tour.find(SELECTOR.layer));
    tour.check('direct-section', section, 'the setup page has a How players join section', 'the setup page has no How players join section');
    await checkWhere(tour);
    await enableDirect(tour);
    const lobby = await startOnLan(tour);
    if (!lobby) return;
    await showsLobby(tour, directLobby(lobby.id) ?? lobby);
    await stopLan(tour);
    await joinAsPlayer(tour, lobby.code);
    await openLobbyScreen(tour, template.id);
    await admitPlayers(tour, lobby);
    await runDirect(tour, lobby.id);
    await closeAfterRun(tour, template.id, lobby.id);
  },
});
