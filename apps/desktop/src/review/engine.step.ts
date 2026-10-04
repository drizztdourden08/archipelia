/* @layer renderer-app @kind logic */
import { defineReviewStep, nav } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { appApi } from '../ipc/app-api';
import { SELECTOR } from './review-dom.constants';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';

export default defineReviewStep({
  run: async (tour) => {
    nav.open(ROUTE.engine);
    const layer = () => tour.find(SELECTOR.layer);
    const ready = await waitText(tour, 'Ready', layer, 10000);
    tour.check('engine-ready', ready, 'the Engine page says Ready', 'the Engine page never said Ready');
    const apVersion = (await appApi().engineStatus()).apVersion ?? 'an unknown version';
    const version = await waitText(tour, apVersion, layer);
    tour.check('engine-version', version, `the Engine page shows Archipelago ${apVersion}`, `the Engine page does not show ${apVersion}`);
    const check = await waitNamed(tour, SELECTOR.button, 'Check again', layer() ?? undefined);
    tour.check('engine-check-again', check !== null, 'Check again is offered once the engine is ready', 'no Check again button on the Engine page');
    await tour.capture('ready');
  },
});
