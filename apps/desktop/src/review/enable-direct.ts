/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { formatLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import type { AdminLobby } from '@archipelia/model';
import { DIRECT_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { directLobby } from './direct-lobby';
import { named } from './named';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer) ?? undefined;

const readyToggle = (tour: AppReviewTour, name: RegExp) => {
  const found = named(tour, SELECTOR.toggle, name, layer(tour));
  return found && !found.hasAttribute('disabled') && found.getAttribute('aria-disabled') !== 'true' ? found : null;
};

const enableDirect = async (tour: AppReviewTour): Promise<AdminLobby | null> => {
  await clickNamed(tour, SELECTOR.toggle, DIRECT_UI.allow, layer(tour));
  const openButton = await waitNamed(tour, SELECTOR.button, DIRECT_UI.open, layer(tour));
  tour.check('direct-open-first', openButton !== null && !directLobby(), 'Allow direct connections opens nothing yet; the header offers Open lobby', 'the switch opened a lobby, or the header has no Open lobby');
  await tour.capture('direct-before-lobby');
  if (openButton) tour.click(openButton);
  const opened = await tour.waitFor(() => directLobby(), 15000);
  tour.check('direct-on', opened?.phase === 'open','Open lobby opens a lobby for the session with no seed made', 'Open lobby opened no lobby');
  if (!opened) return null;
  const toggle = await tour.waitFor(() => readyToggle(tour, DIRECT_UI.unlisted), 15000);
  if (toggle) tour.click(toggle);
  const unlisted = await tour.waitFor(() => (directLobby(opened.id)?.options.allowUnlisted ? true : null), 15000);
  tour.check('direct-unlisted', unlisted === true, 'Allow unlisted clients reaches the lobby of the session', 'Allow unlisted clients did not reach the lobby');
  const code = formatLobbyCode(opened.code) ?? opened.code;
  const shown = await waitText(tour, code, () => tour.find(SELECTOR.layer));
  tour.check('direct-code', shown, 'the session shows its code under How players join', 'the session code is not shown');
  await tour.capture('direct-on');
  return opened;
};

export { enableDirect };
