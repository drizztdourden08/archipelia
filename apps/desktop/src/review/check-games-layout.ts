/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { appApi } from '../ipc/app-api';
import { HEADER, MAX_MOUNTED_CARDS, SECTION_ORDER } from './check-games-layout.constants';
import { SELECTOR } from './review-dom.constants';
import { checkGameCards } from './check-game-cards';
import { checkGameDetails } from './check-game-details';
import { waitNamed } from './wait-named';

const headerNamed = (tour: AppReviewTour, layer: HTMLElement, name: string) =>
  tour.findAll(HEADER, layer).find((header) => header.textContent.startsWith(name)) ?? null;

const follows = (before: HTMLElement, after: HTMLElement) => Boolean(before.compareDocumentPosition(after) & Node.DOCUMENT_POSITION_FOLLOWING);

const inOrder = (tour: AppReviewTour, layer: HTMLElement) => {
  const drawn = SECTION_ORDER.map((name) => headerNamed(tour, layer, name)).filter((el): el is HTMLElement => el !== null);
  return drawn.length > 0 && drawn.every((el, at) => at === 0 || follows(drawn[at - 1] ?? el, el));
};

const cardsOf = (tour: AppReviewTour, layer: HTMLElement | undefined) => (layer ? tour.findAll('.item-card', layer) : []);

const checkOfficialVersions = async (tour: AppReviewTour, layer: HTMLElement | undefined): Promise<void> => {
  const cards = cardsOf(tour, layer);
  const apVersion = (await appApi().engineStatus()).apVersion;
  const repeated = apVersion !== undefined && cards.length > 3 && cards.every((card) => card.textContent.includes(apVersion));
  tour.check('games-no-repeated-version', !repeated, 'the cards do not repeat the engine version', `every card shows ${apVersion ?? 'the engine version'}`);
};

const checkMounted = (tour: AppReviewTour, layer: HTMLElement | undefined): void => {
  const mounted = cardsOf(tour, layer).length;
  tour.check('games-draws-cards-in-view', mounted > 0 && mounted <= MAX_MOUNTED_CARDS, `the Games page draws only the cards in view: ${mounted} mounted`, `the Games page mounted ${mounted} cards at once, more than the ${MAX_MOUNTED_CARDS} in view`);
};

const checkGamesLayout = async (tour: AppReviewTour): Promise<void> => {
  const layer = (await tour.waitFor(() => tour.find(SELECTOR.layer))) ?? undefined;
  const search = layer ? await waitNamed(tour, SELECTOR.field, 'Search worlds', layer) : null;
  tour.check('games-search', search !== null, 'one search field covers every section of the Games page', 'the Games page has no search field');
  const sections = layer ? await tour.waitFor(() => (headerNamed(tour, layer, 'Installed') ? layer : null)) : null;
  tour.check('games-sections', sections !== null && inOrder(tour, sections), 'the sections run Installed, Official, Community', 'the Games sections are missing or out of order');
  const bar = layer ? tour.find(SELECTOR.statusBar, layer) : null;
  const add = bar ? await waitNamed(tour, SELECTOR.button, 'Add from file', bar) : null;
  tour.check('games-status-bar', bar !== null && add !== null, 'the status bar at the foot has the totals and Add from file in its own actions', 'the Games status bar or its Add from file action is missing');
  await checkGameCards(tour);
  await checkOfficialVersions(tour, layer);
  checkMounted(tour, layer);
  await tour.capture('games');
  await checkGameDetails(tour, layer);
};

export { checkGamesLayout };
