/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import type { EngineOverview } from '@archipelia/model';
import { clickNamed } from './click-named';
import { dialogWith } from './dialog-with';
import { SELECTOR } from './review-dom.constants';
import { REHEARSED, REHEARSED_CHOICE, REHEARSED_NOTES } from './startup-rehearsal.constants';
import { rehearse } from './startup-rehearsal';
import { waitText } from './wait-text';

const rehearseOffer = async (tour: AppReviewTour, overview: EngineOverview): Promise<void> => {
  const dialog = dialogWith(tour, /is out/i);
  const offer = () => rehearse(
    { kind: 'offer', from: REHEARSED.current, to: REHEARSED.latest, notesUrl: REHEARSED_NOTES, choice: REHEARSED_CHOICE },
    'ready',
    overview,
  );
  const declined = offer();
  const opened = await waitText(tour, new RegExp(`archipelago ${REHEARSED.latest} is out`, 'i'), dialog);
  tour.check('offer-dialog', opened, 'the upgrade offer opens', 'the upgrade offer never opened');
  const notes = await waitText(tour, /release notes/i, dialog);
  tour.check('offer-notes', notes, 'the offer shows where the release notes are', 'the offer does not show the release notes');
  await tour.capture('offer');
  const notNow = await clickNamed(tour, SELECTOR.button, 'Not now', dialog() ?? undefined);
  tour.check('offer-not-now', notNow, 'the offer can be declined', 'the offer has no Not now button');
  if (notNow) await declined.ran;
  const quiet = declined.installs.length === 0 && declined.offered.join() === REHEARSED.latest;
  tour.check('offer-declined', quiet, 'a declined offer is marked shown and installs nothing', `declined offer: installs ${declined.installs.join() || 'none'}, shown ${declined.offered.join() || 'none'}`);

  const upgrade = offer();
  await waitText(tour, new RegExp(`archipelago ${REHEARSED.latest} is out`, 'i'), dialog);
  const upgraded = await clickNamed(tour, SELECTOR.button, 'Upgrade', dialog() ?? undefined);
  if (upgraded) await upgrade.ran;
  const done = upgrade.installs.join() === REHEARSED.latest && upgrade.offered.length === 1;
  tour.check('offer-upgrade', done, 'Upgrade installs the new release', `Upgrade installed ${upgrade.installs.join() || 'nothing'}`);
};

export { rehearseOffer };
