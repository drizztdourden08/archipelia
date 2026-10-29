/* @layer renderer-app @kind logic */
import { defineReviewStep, nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import type { SessionTemplate } from '@archipelia/model';
import { ROUTE } from '../hooks/app-navigation.constants';
import { useLiveStore } from '../stores/useLiveStore';
import { DIRECT_UI, REVIEW_LAYOUT, SESSIONS_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { checkEditedSession } from './check-edited-session';
import { checkSessionsLayout } from './check-sessions-layout';
import { clearTabs } from './clear-tabs';
import { clickNamed } from './click-named';
import { dropLayout } from './drop-layout';
import { named } from './named';
import { seedLayout } from './seed-layout';
import { waitText } from './wait-text';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer) ?? undefined;

const pick = (tour: AppReviewTour, name: string) => {
  const back = named(tour, SELECTOR.button, SESSIONS_UI.back, layer(tour));
  if (back && back.getClientRects().length > 0) tour.click(back);
  return clickNamed(tour, SELECTOR.button, new RegExp(`^${name}\\b`), layer(tour));
};

const openTab = async (tour: AppReviewTour, template: SessionTemplate) => {
  await pick(tour, template.name);
  await clickNamed(tour, SELECTOR.button, SESSIONS_UI.run, layer(tour));
  const opened = await tour.waitFor(() => (useLiveStore.getState().tabs.some((tab) => tab.sessionId === template.id) ? true : null), 15000);
  tour.check('layout-tab', opened === true, `Run opens a tab for ${template.name}`, `Run did not open a tab for ${template.name}`);
  nav.open(ROUTE.sessions);
  await waitText(tour, SESSIONS_UI.tab, () => layer(tour) ?? null);
};

const editSession = async (tour: AppReviewTour, name: string) => {
  await pick(tour, name);
  await clickNamed(tour, SELECTOR.toggle, DIRECT_UI.unlisted, layer(tour));
  await clickNamed(tour, SELECTOR.toggle, DIRECT_UI.approval, layer(tour));
  await tour.settle();
};

const leave = async (tour: AppReviewTour, made: readonly SessionTemplate[]) => {
  await clickNamed(tour, SELECTOR.button, SESSIONS_UI.discard, layer(tour));
  await clearTabs();
  await dropLayout(made);
};

export default defineReviewStep({
  sizes: [REVIEW_LAYOUT.wide, REVIEW_LAYOUT.small],
  run: async (tour) => {
    const made = await seedLayout();
    const [lan, , solo] = made;
    if (!lan || !solo) return;
    await tour.openWidget('network');
    nav.open(ROUTE.sessions);
    await waitText(tour, solo.name, () => layer(tour) ?? null);
    await openTab(tour, solo);
    const stacked = await checkSessionsLayout(tour, solo.name);
    await editSession(tour, lan.name);
    await checkEditedSession(tour, lan.name, stacked);
    await leave(tour, made);
  },
});
