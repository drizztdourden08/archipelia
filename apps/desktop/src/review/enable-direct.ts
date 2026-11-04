/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { DIRECT_UI, HOST_UI, LOBBY_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { directLobby } from './direct-lobby';
import { isFree } from './is-free';
import { named } from './named';
import { setToggle } from './set-toggle';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer) ?? undefined;

const readyToggle = (tour: AppReviewTour, name: RegExp) => {
  const found = named(tour, SELECTOR.toggle, name, layer(tour));
  return isFree(found) ? found : null;
};

const enableDirect = async (tour: AppReviewTour) => {
  await setToggle(tour, DIRECT_UI.allow, true, layer(tour));
  const unlisted = await tour.waitFor(() => readyToggle(tour, DIRECT_UI.unlisted), 15000);
  if (unlisted) await setToggle(tour, DIRECT_UI.unlisted, true, layer(tour));
  await setToggle(tour, DIRECT_UI.approval, true, layer(tour));
  await tour.settle();
  const quiet = !directLobby() && named(tour, SELECTOR.button, LOBBY_UI.open, layer(tour)) === null && named(tour, SELECTOR.button, LOBBY_UI.start, layer(tour)) !== null;
  tour.check('direct-setup-only', quiet && unlisted !== null, 'Allow direct connections and its settings are configuration: nothing opens and the setup page offers Save and run', 'the switch opened a lobby, or the setup page does not offer Save and run');
  const local = named(tour, SELECTOR.segment, HOST_UI.local, layer(tour));
  tour.check('direct-keeps-where', local?.getAttribute('aria-checked') === 'true', 'turning on direct connections leaves Where on Local', 'turning on direct connections changed Where');
  await tour.capture('setup-direct');
};

export { enableDirect };
