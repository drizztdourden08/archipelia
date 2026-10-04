/* @layer renderer-app @kind logic */
import { defineReviewStep, nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { REVIEW_SERVER, SERVER_FIELDS, SERVER_PROBLEMS } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { named } from './named';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer);

const fill = (tour: AppReviewTour, label: string, value: string) => {
  const field = named(tour, SELECTOR.field, label, layer(tour) ?? undefined);
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) tour.typeText(field, value);
  return field !== null;
};

const showProblems = async (tour: AppReviewTour) => {
  await clickNamed(tour, SELECTOR.button, 'Add', layer(tour) ?? undefined);
  fill(tour, 'Label', '');
  fill(tour, 'Archipelago path on the host', 'opt/archipelago');
  const shown = await tour.waitFor(() => SERVER_PROBLEMS.every((problem) => layer(tour)?.innerText.includes(problem)));
  tour.check('server-problems', shown === true, 'an empty server form names every missing field', 'the server form did not name every problem');
  const save = named(tour, SELECTOR.button, 'Save', layer(tour) ?? undefined);
  tour.check('server-save-off', save instanceof HTMLButtonElement && save.disabled, 'Save stays off while the form has problems', 'Save was on with problems in the form');
  await tour.capture('validation');
};

const saveAndRemove = async (tour: AppReviewTour) => {
  const filled = SERVER_FIELDS.every(([label, value]) => fill(tour, label, value));
  tour.check('server-filled', filled, 'every server field takes its value', 'a server field was not found');
  await clickNamed(tour, SELECTOR.button, 'Save', layer(tour) ?? undefined);
  const entry = await waitNamed(tour, SELECTOR.button, new RegExp(`^${REVIEW_SERVER.label} ${REVIEW_SERVER.host}`), layer(tour) ?? undefined);
  tour.check('server-saved', entry !== null, `${REVIEW_SERVER.label} is in the list once saved`, 'the saved server is not in the list');
  await tour.capture('saved');
  await clickNamed(tour, SELECTOR.button, 'Remove', layer(tour) ?? undefined);
  const confirm = await waitNamed(tour, SELECTOR.dialog, `Delete ${REVIEW_SERVER.label}?`);
  tour.check('server-delete-asks', confirm !== null, `removing asks Delete ${REVIEW_SERVER.label}?`, 'removing a server did not ask first');
  if (confirm) await clickNamed(tour, SELECTOR.button, 'Delete', confirm);
  const gone = await tour.waitFor(() => !named(tour, SELECTOR.button, new RegExp(`^${REVIEW_SERVER.label} `), layer(tour) ?? undefined));
  tour.check('server-removed', gone === true, 'the server leaves the list once deleted', 'the deleted server is still listed');
};

export default defineReviewStep({
  run: async (tour) => {
    nav.open('multiworld/servers');
    const opened = await waitText(tour, /servers · [0-9]/i, () => layer(tour));
    tour.check('servers-open', opened, 'the Servers page lists the saved servers', 'the Servers page did not open');
    await showProblems(tour);
    await saveAndRemove(tour);
  },
});
