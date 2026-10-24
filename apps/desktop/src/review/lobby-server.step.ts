/* @layer renderer-app @kind logic */
import { defineReviewStep, nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SELECTOR } from './review-dom.constants';
import { waitText } from './wait-text';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer);

export default defineReviewStep({
  run: async (tour) => {
    nav.open('multiworld/servers/archipelia');
    const reach = await waitText(tour, /seen on your network/i, () => layer(tour));
    tour.check('server-reach', reach, 'the Servers page shows the reach of the lobby server on this computer', 'the reach of the lobby server is not shown');
    const lanOnly = await waitText(tour, /LAN-only until the server has TLS/, () => layer(tour));
    tour.check('server-lan-only', lanOnly, 'the page says the lobby is LAN-only until TLS', 'the page does not say the lobby is LAN-only');
    const network = await waitText(tour, /servers on your network/i, () => layer(tour));
    tour.check('server-lan-list', network, 'the page has a Servers on your network section', 'the Servers on your network section is missing');
    await tour.capture('lobby-server');
  },
});
