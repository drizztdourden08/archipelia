/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { REVIEW_LAYOUT, SESSIONS_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer) ?? undefined;

const listOf = (tour: AppReviewTour) => tour.find(`ul[aria-label="${SESSIONS_UI.list}"]`, layer(tour));

const shown = (element: HTMLElement | null): element is HTMLElement => element !== null && element.getClientRects().length > 0;

const usable = (list: HTMLElement) => {
  const rows = [...list.children];
  return list.getBoundingClientRect().width >= REVIEW_LAYOUT.minListWidth && rows.length > 0 && rows.every((row) => row.getBoundingClientRect().height >= REVIEW_LAYOUT.minRowHeight);
};

const rowOf = (list: HTMLElement, name: string) => [...list.children].find((row) => row.textContent.startsWith(name)) ?? null;

const checkSessionsLayout = async (tour: AppReviewTour, withTab: string): Promise<boolean> => {
  const stacked = !shown(listOf(tour));
  if (stacked) await clickNamed(tour, SELECTOR.button, SESSIONS_UI.back, layer(tour));
  const list = await tour.waitFor(() => { const found = listOf(tour); return shown(found) ? found : null; });
  const fits = list !== null && usable(list);
  tour.check('layout-list', fits, `the list of sessions is a usable list, ${stacked ? 'stacked with a way back' : 'beside the setup'}`, 'the list of sessions is folded, hidden or too small to use');
  const tabRow = list ? rowOf(list, withTab) : null;
  tour.check('layout-tab-chip', tabRow?.textContent.includes(SESSIONS_UI.tabOpen) === true, `the row of ${withTab} says Tab open`, `the row of ${withTab} does not say Tab open`);
  if (stacked) await tour.capture('list');
  return stacked;
};

export { checkSessionsLayout };
