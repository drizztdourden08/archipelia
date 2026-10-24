/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import type { EngineOverview } from '@archipelia/model';
import { clickNamed } from './click-named';
import { dialogWith } from './dialog-with';
import { SELECTOR } from './review-dom.constants';
import { REHEARSED, REHEARSED_CHOICE } from './startup-rehearsal.constants';
import { rehearse } from './startup-rehearsal';
import { waitText } from './wait-text';

const rehearseFirstRun = async (tour: AppReviewTour, overview: EngineOverview): Promise<void> => {
  const dialog = dialogWith(tour, /set up the engine/i);
  const first = rehearse({ kind: 'first-run', choice: REHEARSED_CHOICE }, 'missing', overview);
  const titled = await waitText(tour, /set up the engine/i, dialog);
  tour.check('first-run-dialog', titled, 'the first run dialog opens', 'the first run dialog never opened');
  const facts = await waitText(tour, /python[\s\S]*requirements[\s\S]*download[\s\S]*90 MB/i, dialog);
  tour.check('first-run-facts', facts, 'the dialog lists Python, requirements and the size', 'the first run dialog has no facts');
  const picked = await waitText(tour, REHEARSED.latest, dialog);
  tour.check('first-run-latest', picked, `the latest stable release ${REHEARSED.latest} is preselected`, 'the latest release is not shown in the first run dialog');
  await tour.capture('first-run');
  const install = await clickNamed(tour, SELECTOR.button, 'Install', dialog() ?? undefined);
  tour.check('first-run-install', install, 'the dialog offers Install', 'the first run dialog has no Install button');
  if (install) await first.ran;
  tour.check('first-run-ran', first.installs.join() === REHEARSED.latest, 'Install started the install of the preselected release', `Install started ${first.installs.join() || 'nothing'}`);
};

export { rehearseFirstRun };
