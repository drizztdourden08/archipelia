/* @layer renderer-app @kind logic */
import { defineReviewStep, nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { showRunJob } from '../runs/show-run-job';
import { useRunsStore } from '../stores/useRunsStore';
import { REVIEW_SESSION, GUARD_DIALOG } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { clickNamed } from './click-named';
import { named } from './named';
import { pickInPalette } from './pick-in-palette';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer);

const showRunLog = async (tour: AppReviewTour) => {
  const run = useRunsStore.getState().runs.find((entry) => entry.snapshot.name === REVIEW_SESSION && entry.status === 'stopped');
  if (run) await showRunJob(run);
  const job = await tour.waitFor(() => tour.find(`${SELECTOR.runJob}[data-state="done"]`), 8000);
  tour.check('run-job-dialog', job !== null, 'a finished run opens in the job dialog, replayed from its generate log', 'the finished run opened no job dialog');
  if (!job) return;
  const logged = await tour.waitFor(() => (job.innerText.match(/\n/g)?.length ?? 0) > 6);
  tour.check('run-job-log', logged === true, 'the job dialog holds the steps and the generator log', 'the run job dialog shows no log');
  await tour.capture('run-log');
  const dialog = job.closest<HTMLElement>(SELECTOR.dialog) ?? document.body;
  await clickNamed(tour, SELECTOR.button, 'Close', dialog);
  const closed = await tour.waitFor(() => tour.find(SELECTOR.runJob) === null);
  tour.check('run-job-closes', closed === true, 'Close dismisses the finished run job', 'the run job dialog stayed open');
};

const openDraft = async (tour: AppReviewTour) => {
  await tour.resetUi();
  nav.open(ROUTE.sessions);
  await clickNamed(tour, SELECTOR.button, 'New session', layer(tour) ?? undefined);
  const nameField = await waitNamed(tour, SELECTOR.field, 'Session name', layer(tour) ?? undefined);
  tour.check('builder-opens', nameField !== null, 'New session opens the builder', 'the builder has no Session name field');
  if (nameField instanceof HTMLInputElement) tour.typeText(nameField, 'Review draft');
  await tour.settle();
};

const discardDraft = async (tour: AppReviewTour, backButton: HTMLElement | null, asked: HTMLElement | null) => {
  if (!asked && backButton) tour.click(backButton);
  const last = asked ?? await waitNamed(tour, SELECTOR.dialog, GUARD_DIALOG);
  if (last) await clickNamed(tour, SELECTOR.button, 'Discard', last);
  const back = await waitText(tour, /sessions · [0-9]/i, () => layer(tour));
  tour.check('builder-guard-discard', back, 'Discard goes back to Sessions', 'Discard did not return to Sessions');
};

const guardBuilder = async (tour: AppReviewTour) => {
  await openDraft(tour);
  const backButton = await waitNamed(tour, SELECTOR.button, /^Back( to Sessions)?$/, layer(tour) ?? undefined);
  if (backButton) tour.click(backButton);
  const discard = await waitNamed(tour, SELECTOR.dialog, GUARD_DIALOG);
  tour.check('builder-guard-back', discard !== null, 'Back from a new session with a player asks about unsaved changes', 'Back left the unsaved session without asking');
  if (discard) await clickNamed(tour, SELECTOR.button, 'Keep editing', discard);
  await tour.waitFor(() => !named(tour, SELECTOR.dialog, GUARD_DIALOG));
  backButton?.focus();
  tour.press({ key: 'Escape' });
  const again = await waitNamed(tour, SELECTOR.dialog, GUARD_DIALOG);
  tour.check('builder-guard-escape', again !== null, 'Escape asks the same question', 'Escape left the unsaved session without asking');
  await tour.capture('builder-guard');
  await discardDraft(tour, backButton, again);
};

export default defineReviewStep({
  run: async (tour) => {
    nav.open(ROUTE.sessions);
    const listed = await waitText(tour, REVIEW_SESSION, () => layer(tour)) && await waitText(tour, 'Stopped', () => layer(tour));
    tour.check('sessions-listed', listed, `Sessions lists ${REVIEW_SESSION} and its stopped run`, `Sessions does not list ${REVIEW_SESSION} with a stopped run`);
    await tour.capture('list');
    await showRunLog(tour);
    const picked = await pickInPalette(tour, REVIEW_SESSION);
    const editor = picked && await waitText(tour, 'Edit session', () => layer(tour));
    tour.check('session-search-entry', editor, 'the palette lists the session and picking it opens Edit session', 'the session search entry did not open its editor');
    if (editor) await tour.capture('editor');
    await guardBuilder(tour);
  },
});
