/* @layer renderer-app @kind logic */
import { defineReviewStep, nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { formatLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import type { AdminLobby } from '@archipelia/model';
import { openSessionEditor } from '../hooks/open-session-editor';
import { appApi } from '../ipc/app-api';
import { DIRECT_UI, REVIEW_DIRECT, TAB_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { admitPlayers } from './admit-players';
import { checkWhere } from './check-where';
import { startOnLan } from './start-on-lan';
import { stopLan } from './stop-lan';
import { directLobby } from './direct-lobby';
import { enableDirect } from './enable-direct';
import { joinAsPlayer } from './join-as-player';
import { closeSessionTab } from './close-session-tab';
import { tabBody } from './tab-body';
import { runDirect } from './run-direct';
import { seedDirect } from './seed-direct';
import { waitText } from './wait-text';

const showsTab = (tour: AppReviewTour) => {
  nav.close();
  return waitText(tour, /Players · \d/i, () => tabBody(tour) ?? null, 15000);
};

const showsLobby = async (tour: AppReviewTour, lobby: AdminLobby) => {
  const code = formatLobbyCode(lobby.code) ?? lobby.code;
  const shown = await waitText(tour, code, () => tabBody(tour) ?? null);
  tour.check('direct-code', shown, 'the lobby tab shows the session code', 'the session code is not shown on the lobby tab');
  tour.check('direct-unlisted', lobby.options.allowUnlisted, 'Allow unlisted clients from the setup page reaches the lobby', 'Allow unlisted clients did not reach the lobby');
};

const closeAfterRun = async (tour: AppReviewTour, lobbyId: string) => {
  nav.close();
  const ask = await closeSessionTab(tour, REVIEW_DIRECT, TAB_UI.stopAndClose);
  tour.check('direct-close-asks', ask !== null, 'closing the tab of a hosting room asks Stop the room and close', 'closing the tab of a hosting room did not ask');
  const closed = await tour.waitFor(() => (directLobby(lobbyId)?.phase === 'closed' ? true : null), 15000);
  tour.check('direct-off', closed === true, 'closing the tab closes the lobby of the session', 'the lobby of the session did not close');
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
    await showsTab(tour);
    await admitPlayers(tour, lobby);
    await runDirect(tour, lobby.id);
    await closeAfterRun(tour, lobby.id);
  },
});
