/* @layer renderer-app @kind logic */
import { defineReviewStep, nav, widgets } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import type { Client } from 'archipelago.js';
import { ROUTE } from '../hooks/app-navigation.constants';
import { useFocusStore } from '../stores/useFocusStore';
import { useRunsStore } from '../stores/useRunsStore';
import { REVIEW_PORT, REVIEW_SESSION, RUN_TIMEOUT_MS } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { checkWidgets } from './check-widgets';
import { clickNamed } from './click-named';
import { joinRoom } from './join-room';
import { checkLiveStatus } from './check-live-status';
import { sendFromConsole } from './send-from-console';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';
import { withHeartbeat } from './with-heartbeat';
import { LIVE_WIDGETS } from './widget-content.constants';

const dashboard = (tour: AppReviewTour) => tour.find(SELECTOR.dashboard);

const hosting = (tour: AppReviewTour) => withHeartbeat(
  tour,
  waitText(tour, /hosting/i, () => (tour.find(SELECTOR.layer) ? null : dashboard(tour)), RUN_TIMEOUT_MS),
  () => `waiting for ${REVIEW_SESSION} to host`,
);

const startFromSessions = async (tour: AppReviewTour) => {
  nav.open(ROUTE.sessions);
  await waitText(tour, REVIEW_SESSION, () => tour.find(SELECTOR.layer));
  await clickNamed(tour, SELECTOR.button, `Run ${REVIEW_SESSION}`, tour.find(SELECTOR.layer) ?? undefined);
  const job = await tour.waitFor(() => tour.find(`${SELECTOR.runJob}[data-state="running"]`), 15000);
  tour.check('run-job-opens', job !== null, 'Run opens the run job dialog while the seed generates', 'Run showed no run job dialog');
  if (job) await tour.capture('run-job');
};

const stopFromDashboard = async (tour: AppReviewTour) => {
  await clickNamed(tour, SELECTOR.button, 'Stop', dashboard(tour) ?? undefined);
  const confirm = await waitNamed(tour, SELECTOR.dialog, 'Stop the room');
  tour.check('stop-asks', confirm !== null, 'Stop asks before it stops the room', 'Stop did not ask first');
  if (confirm) await clickNamed(tour, SELECTOR.button, 'Stop', confirm);
  const stopped = await waitText(tour, /stopped/i, () => dashboard(tour), 30000);
  tour.check('stop-stops', stopped, 'the dashboard shows the room stopped', 'the room did not stop');
  await tour.capture('stopped');
};

const forgetLiveRun = async (seeded: string) => {
  const live = useFocusStore.getState().sessionId;
  if (live && live !== seeded) await useRunsStore.getState().remove(live);
  useFocusStore.getState().focus(seeded);
};

export default defineReviewStep({
  run: async (tour) => {
    const seeded = useFocusStore.getState().sessionId;
    await startFromSessions(tour);
    const hosted = await hosting(tour);
    tour.check('run-hosts', hosted, 'the run hosts and the dashboard shows it', `${REVIEW_SESSION} did not host`);
    if (!hosted) return;
    const client: Client | null = await joinRoom(tour, REVIEW_PORT).catch(() => null);
    tour.check('player-joins', client !== null, 'a player joins the room and checks locations', 'the review player could not join');
    widgets.reset();
    await checkWidgets(tour, LIVE_WIDGETS, 'live');
    await checkLiveStatus(tour);
    await sendFromConsole(tour);
    await tour.capture('hosting');
    client?.socket.disconnect();
    await stopFromDashboard(tour);
    await forgetLiveRun(seeded);
  },
});
