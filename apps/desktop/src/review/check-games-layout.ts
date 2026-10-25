/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SECTION_ORDER } from './check-games-layout.constants';
import { SELECTOR } from './review-dom.constants';
import { waitNamed } from './wait-named';

const sectionNamed = (layer: HTMLElement, name: string) => layer.querySelector<HTMLElement>(`section[aria-label="${name}"]`);

const follows = (before: HTMLElement, after: HTMLElement) => Boolean(before.compareDocumentPosition(after) & Node.DOCUMENT_POSITION_FOLLOWING);

const inOrder = (layer: HTMLElement) => {
  const drawn = SECTION_ORDER.map((name) => sectionNamed(layer, name)).filter((el): el is HTMLElement => el !== null);
  return drawn.length > 0 && drawn.every((el, at) => at === 0 || follows(drawn[at - 1] ?? el, el));
};

const checkGamesLayout = async (tour: AppReviewTour): Promise<void> => {
  const layer = (await tour.waitFor(() => tour.find(SELECTOR.layer))) ?? undefined;
  const search = layer ? await waitNamed(tour, SELECTOR.field, 'Search worlds', layer) : null;
  tour.check('games-search', search !== null, 'one search field covers every section of the Games page', 'the Games page has no search field');
  const sections = layer ? await tour.waitFor(() => (sectionNamed(layer, 'Installed') ? layer : null)) : null;
  tour.check('games-sections', sections !== null && inOrder(sections), 'the sections run Installed, Official, Community', 'the Games sections are missing or out of order');
  const bar = layer?.querySelector('section[aria-label="Games status"]') ?? null;
  const add = layer ? await waitNamed(tour, SELECTOR.button, 'Add from file', layer) : null;
  tour.check('games-status-bar', bar !== null && add !== null, 'the status bar at the foot has the totals and Add from file', 'the Games status bar or Add from file is missing');
  await tour.capture('games');
};

export { checkGamesLayout };
