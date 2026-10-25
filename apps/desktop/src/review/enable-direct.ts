/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { formatLobbyCode } from '@drizztdourden08/archipelia-lobby-protocol';
import type { AdminLobby } from '@archipelia/model';
import { DIRECT_UI } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { directLobby } from './direct-lobby';
import { waitText } from './wait-text';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer) ?? undefined;

const enableDirect = async (tour: AppReviewTour): Promise<AdminLobby | null> => {
  await clickNamed(tour, SELECTOR.toggle, DIRECT_UI.allow, layer(tour));
  const opened = await tour.waitFor(() => directLobby(), 15000);
  tour.check('direct-on', opened !== null, 'Allow direct connection opens a lobby for the session', 'turning on Allow direct connection opened no lobby');
  if (!opened) return null;
  await clickNamed(tour, SELECTOR.toggle, DIRECT_UI.unlisted, layer(tour));
  const unlisted = await tour.waitFor(() => (directLobby(opened.id)?.options.allowUnlisted ? true : null), 15000);
  tour.check('direct-unlisted', unlisted === true, 'Allow unlisted clients reaches the lobby of the session', 'Allow unlisted clients did not reach the lobby');
  const code = formatLobbyCode(opened.code) ?? opened.code;
  const shown = await waitText(tour, code, () => tour.find(SELECTOR.layer));
  tour.check('direct-code', shown, 'the session shows its code under How players join', 'the session code is not shown');
  await tour.capture('direct-on');
  return opened;
};

export { enableDirect };
