/* @layer renderer-app @kind logic */
import { defineReviewStep, widgets } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import type { Client } from 'archipelago.js';
import { REVIEW_PORT, REVIEW_SECOND, REVIEW_SESSION, RUN_TIMEOUT_MS, TAB_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { checkWidgets } from './check-widgets';
import { clickNamed } from './click-named';
import { joinRoom } from './join-room';
import { checkLiveStatus } from './check-live-status';
import { sendFromConsole } from './send-from-console';
import { closeSessionTab } from './close-session-tab';
import { tabBody } from './tab-body';
import { showSpoiler } from './show-spoiler';
import { twoTabs } from './two-tabs';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';
import { withHeartbeat } from './with-heartbeat';
import { LIVE_WIDGETS, SPOILER_WIDGET, STOPPED_WIDGETS } from './widget-content.constants';

const dashboard = (tour: AppReviewTour) => tour.find(SELECTOR.dashboard);

const hosting = (tour: AppReviewTour) => withHeartbeat(
  tour,
  waitText(tour, /hosting/i, () => (tour.find(SELECTOR.layer) ? null : dashboard(tour)), RUN_TIMEOUT_MS),
  () => `waiting for ${REVIEW_SESSION} to host`,
);

const stopFromDashboard = async (tour: AppReviewTour) => {
  await clickNamed(tour, SELECTOR.button, 'Stop', dashboard(tour) ?? undefined);
  const confirm = await waitNamed(tour, SELECTOR.dialog, 'Stop the room');
  tour.check('stop-asks', confirm !== null, 'Stop asks before it stops the room', 'Stop did not ask first');
  if (confirm) await clickNamed(tour, SELECTOR.button, 'Stop', confirm);
  const stopped = await waitText(tour, /stopped/i, () => dashboard(tour), 30000);
  tour.check('stop-stays', stopped && (await waitText(tour, /The room is stopped/, () => tabBody(tour) ?? null)), 'Stop leaves the tab open with the room stopped and its results', 'the tab did not stay with the stopped room');
  await tour.capture('stopped');
};

const checkStoppedWidgets = async (tour: AppReviewTour, joined: boolean) => {
  widgets.reset();
  await checkWidgets(tour, joined ? STOPPED_WIDGETS : STOPPED_WIDGETS.filter(([id]) => id !== 'hints'), 'stopped');
  await tour.capture('stopped-run');
  await showSpoiler(tour);
  await checkWidgets(tour, SPOILER_WIDGET, 'stopped');
  await tour.capture('spoiler');
  widgets.reset();
};

const closeTabs = async (tour: AppReviewTour) => {
  await closeSessionTab(tour, REVIEW_SESSION);
  const gone = await tour.waitFor(() => (tour.find(SELECTOR.tabStrip)?.innerText.includes(REVIEW_SESSION) ? null : true));
  tour.check('close-stopped', gone === true, 'closing a stopped tab needs no question', 'the stopped tab did not close');
  const ask = await closeSessionTab(tour, REVIEW_SECOND, TAB_UI.stopAndClose);
  tour.check('close-hosting-asks', ask !== null, 'closing a hosting tab asks Stop the room and close', 'closing a hosting tab did not ask');
  const empty = await waitText(tour, /No session is open/, () => tour.find('.idle-base'));
  tour.check('idle-base', empty, 'with no tab open the base shows the idle state', 'the idle state did not come back after the last tab closed');
};

const checkPasswordPrompt = async (tour: AppReviewTour) => {
  const frame = await tour.openWidget('players');
  const asked = frame ? await waitText(tour, /This room has a password/, () => frame) : false;
  tour.check('live-password', asked, 'a lobby run has a room password, so the players widget asks for it before it shows the room live', 'the players widget did not ask for the room password');
};

const checkLive = async (tour: AppReviewTour, client: Client | null) => {
  widgets.reset();
  if (!client) {
    await checkPasswordPrompt(tour);
    await checkWidgets(tour, LIVE_WIDGETS.filter(([id]) => id === 'console'), 'live');
    return;
  }
  tour.check('player-joins', true, 'a player joins the room and checks locations', 'the review player could not join');
  await checkWidgets(tour, LIVE_WIDGETS, 'live');
  await checkLiveStatus(tour);
};

export default defineReviewStep({
  run: async (tour) => {
    await tour.resetUi();
    const ready = await twoTabs(tour);
    if (!ready) return;
    await clickNamed(tour, SELECTOR.button, 'Run', tabBody(tour));
    const hosted = await hosting(tour);
    tour.check('run-hosts', hosted, 'the run hosts and its tab shows the room', `${REVIEW_SESSION} did not host`);
    if (!hosted) return;
    const client: Client | null = await joinRoom(tour, REVIEW_PORT).catch(() => null);
    await checkLive(tour, client);
    await sendFromConsole(tour);
    await tour.capture('hosting');
    client?.socket.disconnect();
    await stopFromDashboard(tour);
    await checkStoppedWidgets(tour, client !== null);
    await closeTabs(tour);
  },
});
