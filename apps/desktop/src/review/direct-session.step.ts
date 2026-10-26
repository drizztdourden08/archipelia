/* @layer renderer-app @kind logic */
import { defineReviewStep } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { openSessionEditor } from '../hooks/open-session-editor';
import { appApi } from '../ipc/app-api';
import { DIRECT_UI, REVIEW_DIRECT } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { admitPlayers } from './admit-players';
import { chooseHosting } from './choose-hosting';
import { clickNamed } from './click-named';
import { directLobby } from './direct-lobby';
import { enableDirect } from './enable-direct';
import { joinAsPlayer } from './join-as-player';
import { runDirect } from './run-direct';
import { seedDirect } from './seed-direct';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer) ?? undefined;

const openEditor = async (tour: AppReviewTour, id: string) => {
  openSessionEditor(id);
  return waitText(tour, DIRECT_UI.section, () => tour.find(SELECTOR.layer));
};

const turnOff = async (tour: AppReviewTour, id: string, lobbyId: string) => {
  await openEditor(tour, id);
  await clickNamed(tour, SELECTOR.toggle, DIRECT_UI.allow, layer(tour));
  const ask = await waitNamed(tour, SELECTOR.dialog, DIRECT_UI.offTitle);
  if (ask) await clickNamed(tour, SELECTOR.button, DIRECT_UI.off, ask);
  const off = await tour.waitFor(() => (directLobby(lobbyId)?.phase === 'closed' ? true : null), 15000);
  tour.check('direct-off', ask !== null && off === true, 'turning off direct connection asks first and closes the lobby', 'direct connection did not turn off');
  for (const join of await appApi().joinsList()) if (join.lobbyName === REVIEW_DIRECT) await appApi().joinsDismiss(join.id);
};

export default defineReviewStep({
  run: async (tour) => {
    const status = await appApi().lobbyServerStatus();
    tour.check('lobby-server', status.state === 'listening', 'the embedded lobby server listens', `the lobby server is ${status.state}: ${status.error ?? ''}`);
    const template = status.state === 'listening' ? await seedDirect() : null;
    if (!template) return;
    const section = await openEditor(tour, template.id);
    tour.check('direct-section', section, 'the session editor has a How players join section', 'the session editor has no How players join section');
    const lobby = await enableDirect(tour);
    if (!lobby) return;
    await chooseHosting(tour);
    await joinAsPlayer(tour, lobby.code);
    await openEditor(tour, template.id);
    await admitPlayers(tour, lobby);
    await runDirect(tour, template.id, lobby.id);
    await turnOff(tour, template.id, lobby.id);
  },
});
