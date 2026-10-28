/* @layer renderer-app @kind logic */
import { defineReviewStep, nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SERVER_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { named } from './named';
import { waitText } from './wait-text';
import { widgetShows } from './widget-shows';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer);

export default defineReviewStep({
  run: async (tour) => {
    nav.open('multiworld/servers/archipelia');
    const summary = await waitText(tour, /Lobby address \S+\. Network mode/, () => layer(tour));
    tour.check('server-summary', summary, 'the Servers page says the lobby address and the network mode in one line', 'the one line status of the lobby server is not shown');
    const moved = await waitText(tour, /Open the Network widget/, () => layer(tour));
    tour.check('server-widget-link', moved, 'the Servers page links to the Network widget', 'the link to the Network widget is missing');
    const reach = await widgetShows(tour, 'network', /seen on your network/i);
    tour.check('server-reach', reach, 'the Network widget shows the reach of the lobby server on this computer', 'the reach of the lobby server is not shown');
    const lanOnly = await widgetShows(tour, 'network', /LAN-only until the server has TLS/);
    tour.check('server-lan-only', lanOnly, 'the widget says the lobby is LAN-only until TLS', 'the widget does not say the lobby is LAN-only');
    const stacked = named(tour, SELECTOR.button, SERVER_UI.back, layer(tour) ?? undefined);
    if (stacked) tour.click(stacked);
    const network = await waitText(tour, /servers on your network/i, () => layer(tour));
    tour.check('server-lan-list', network, 'the page has a Servers on your network section', 'the Servers on your network section is missing');
    await tour.capture('lobby-server');
  },
});
