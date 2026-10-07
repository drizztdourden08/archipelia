/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { named } from './named';
import { CONSOLE_REPLY } from './widget-content.constants';

const sendFromConsole = async (tour: AppReviewTour): Promise<void> => {
  const frame = await tour.openWidget('console');
  const field = frame ? named(tour, SELECTOR.field, 'Server command', frame) : null;
  if (field instanceof HTMLInputElement) tour.typeText(field, '/players');
  const sent = frame && field ? await clickNamed(tour, SELECTOR.button, 'Send', frame) : false;
  const replied = frame && sent ? await tour.waitFor(() => CONSOLE_REPLY.test(frame.innerText), 8000) : null;
  tour.check('console-reply', replied === true, 'the console shows the reply of /players under the command', 'the console shows no reply under /players');
  if (replied) await tour.capture('console-reply');
};

export { sendFromConsole };
