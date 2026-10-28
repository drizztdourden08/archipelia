/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { REVIEW_SECOND, REVIEW_SESSION, RUN_TIMEOUT_MS } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { checkWidgets } from './check-widgets';
import { clickNamed } from './click-named';
import { openSavedLobby } from './open-saved-lobby';
import { seedSecond } from './seed-second';
import { showSessionTab } from './show-session-tab';
import { stripHas } from './strip-has';
import { tabBody } from './tab-body';
import { HOSTING_WIDGETS, LOBBY_WIDGETS } from './two-tabs.constants';
import { waitText } from './wait-text';
import { withHeartbeat } from './with-heartbeat';

const hostSecond = async (tour: AppReviewTour) => {
  nav.open(ROUTE.sessions);
  await waitText(tour, REVIEW_SECOND, () => tour.find(SELECTOR.layer));
  await openSavedLobby(tour, REVIEW_SECOND);
  await clickNamed(tour, SELECTOR.button, 'Run', tabBody(tour));
  const hosting = await withHeartbeat(tour, waitText(tour, /hosting/i, () => tour.find(SELECTOR.dashboard), RUN_TIMEOUT_MS), () => `waiting for ${REVIEW_SECOND} to host`);
  tour.check('second-hosts', hosting, 'the second session runs and its tab shows the room', `${REVIEW_SECOND} did not host`);
  return hosting;
};

const checkTwoTabs = async (tour: AppReviewTour) => {
  const both = await stripHas(tour, REVIEW_SESSION, REVIEW_SECOND);
  tour.check('two-tabs', both, 'the strip holds one tab for each open session', 'the strip does not hold both tabs');
  const status = await stripHas(tour, 'Lobby', 'Hosting');
  tour.check('two-tab-status', status, 'one tab says Lobby and the other says Hosting', 'the tabs do not show a Lobby and a Hosting status');
};

const widgetsFollow = async (tour: AppReviewTour) => {
  await showSessionTab(tour, REVIEW_SESSION);
  await checkWidgets(tour, LOBBY_WIDGETS, 'tab-lobby');
  await tour.capture('two-tabs-lobby-active');
  await showSessionTab(tour, REVIEW_SECOND);
  await checkWidgets(tour, HOSTING_WIDGETS, 'tab-hosting');
  await tour.capture('two-tabs-hosting-active');
  await showSessionTab(tour, REVIEW_SESSION);
};

const twoTabs = async (tour: AppReviewTour): Promise<boolean> => {
  if (!(await seedSecond())) return false;
  nav.open(ROUTE.sessions);
  await waitText(tour, REVIEW_SESSION, () => tour.find(SELECTOR.layer));
  await openSavedLobby(tour, REVIEW_SESSION, 'session-lobby');
  if (!(await hostSecond(tour))) return false;
  await checkTwoTabs(tour);
  await widgetsFollow(tour);
  return true;
};

export { twoTabs };
