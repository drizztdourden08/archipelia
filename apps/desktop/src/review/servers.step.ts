/* @layer renderer-app @kind logic */
import { defineReviewStep, nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { REVIEW_SERVER, SAVE_STATE, SERVER_FIELDS, SERVER_PROBLEMS, SERVER_UI, SERVER_UNTOUCHED } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { named } from './named';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer) ?? undefined;

const fill = (tour: AppReviewTour, label: string, value: string) => {
  const field = named(tour, SELECTOR.field, label, layer(tour));
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) tour.typeText(field, value);
  return field !== null;
};

const serverCount = (tour: AppReviewTour) => layer(tour)?.innerText.match(/servers · [0-9]+/i)?.[0];

const shows = (tour: AppReviewTour, problem: string) => layer(tour)?.innerText.includes(problem) === true;

const saveBarReads = async (tour: AppReviewTour, state: RegExp) => (await waitNamed(tour, SELECTOR.status, state, layer(tour))) !== null;

const startServer = async (tour: AppReviewTour) => {
  await clickNamed(tour, SELECTOR.button, SERVER_UI.add, layer(tour));
  const name = await waitNamed(tour, SELECTOR.field, SERVER_UI.name, layer(tour));
  tour.check('server-create-form', name !== null, `${SERVER_UI.add} opens the create form at the top of the list`, 'the create form did not open');
  fill(tour, SERVER_UI.name, REVIEW_SERVER.label);
  await clickNamed(tour, SELECTOR.button, SERVER_UI.create, layer(tour));
  const editing = await waitNamed(tour, SELECTOR.field, 'Label', layer(tour));
  tour.check('server-draft', editing !== null, 'the new server opens in the editor before it is saved', 'the new server did not open in the editor');
};

const showProblems = async (tour: AppReviewTour) => {
  await startServer(tour);
  fill(tour, 'Label', '');
  fill(tour, 'Archipelago path on the host', 'opt/archipelago');
  await tour.settle();
  tour.check('server-problems-wait', !shows(tour, SERVER_UNTOUCHED), 'a field the user has not reached shows no problem yet', 'an untouched field showed its problem');
  const before = serverCount(tour);
  await clickNamed(tour, SELECTOR.button, SERVER_UI.save, layer(tour));
  const shown = await tour.waitFor(() => SERVER_PROBLEMS.every((problem) => shows(tour, problem)));
  tour.check('server-problems', shown === true, 'Save names every problem under its field', 'Save did not name every problem in the form');
  tour.check('server-save-refused', serverCount(tour) === before, 'Save with problems saves nothing', 'Save stored a server with problems');
  await tour.capture('validation');
};

const saveServer = async (tour: AppReviewTour) => {
  const filled = SERVER_FIELDS.every(([label, value]) => fill(tour, label, value));
  tour.check('server-filled', filled, 'every server field takes its value, the key file in its path input', 'a server field was not found');
  await clickNamed(tour, SELECTOR.button, SERVER_UI.save, layer(tour));
  const entry = await waitNamed(tour, SELECTOR.button, new RegExp(`^${REVIEW_SERVER.label} ${REVIEW_SERVER.host}`), layer(tour));
  tour.check('server-saved', entry !== null, `${REVIEW_SERVER.label} is in the list once saved`, 'the saved server is not in the list');
  tour.check('server-save-bar', await saveBarReads(tour, SAVE_STATE.saved), 'the save bar reads Saved', 'the save bar did not read Saved');
  await tour.capture('saved');
};

const discardEdit = async (tour: AppReviewTour) => {
  fill(tour, SERVER_UI.host, 'edited.example.net');
  tour.check('server-dirty', await saveBarReads(tour, SAVE_STATE.dirty), 'an edit turns the save bar to Unsaved changes', 'the save bar missed the edit');
  await tour.capture('unsaved');
  await clickNamed(tour, SELECTOR.button, SERVER_UI.discard, layer(tour));
  const host = named(tour, SELECTOR.field, SERVER_UI.host, layer(tour));
  const back = host instanceof HTMLInputElement && host.value === REVIEW_SERVER.host;
  tour.check('server-discard', back && await saveBarReads(tour, SAVE_STATE.clean), 'Discard puts the saved host back', 'Discard did not put the saved server back');
};

const removeServer = async (tour: AppReviewTour) => {
  await clickNamed(tour, SELECTOR.button, SERVER_UI.remove, layer(tour));
  const confirm = await waitNamed(tour, SELECTOR.dialog, `Delete ${REVIEW_SERVER.label}?`);
  tour.check('server-delete-asks', confirm !== null, `removing asks Delete ${REVIEW_SERVER.label}?`, 'removing a server did not ask first');
  if (confirm) await clickNamed(tour, SELECTOR.button, 'Delete', confirm);
  const gone = await tour.waitFor(() => !named(tour, SELECTOR.button, new RegExp(`^${REVIEW_SERVER.label} `), layer(tour)));
  tour.check('server-removed', gone === true, 'the server leaves the list once deleted', 'the deleted server is still listed');
};

export default defineReviewStep({
  run: async (tour) => {
    nav.open('multiworld/servers');
    const opened = await waitText(tour, /servers · [0-9]/i, () => layer(tour) ?? null);
    tour.check('servers-open', opened, 'the Servers page lists the saved servers', 'the Servers page did not open');
    await showProblems(tour);
    await saveServer(tour);
    await discardEdit(tour);
    await removeServer(tour);
  },
});
