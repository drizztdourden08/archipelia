/* @layer renderer-app @kind logic */
import { defineReviewStep, nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { REVIEW_SESSION, GUARD_DIALOG } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { checkEditorLayout } from './check-editor-layout';
import { clickNamed } from './click-named';
import { named } from './named';
import { pickInPalette } from './pick-in-palette';
import { waitNamed } from './wait-named';
import { waitText } from './wait-text';

const layer = (tour: AppReviewTour) => tour.find(SELECTOR.layer);

const checkDetail = async (tour: AppReviewTour) => {
  const picked = await clickNamed(tour, SELECTOR.button, new RegExp(`^${REVIEW_SESSION}\\b`), layer(tour) ?? undefined);
  const shown = picked && await waitText(tour, /History of this session \(\d+ runs?\)/, () => layer(tour));
  tour.check('sessions-detail', shown, 'picking a session shows its setup with a link to its history', 'picking a session did not show its setup');
  const run = named(tour, SELECTOR.button, /^(Run|Go to its tab)$/, layer(tour) ?? undefined);
  tour.check('sessions-run', run !== null, 'the picked session offers Run, or Go to its tab when it is open', 'the picked session has no Run or Go to its tab button');
  const seat = named(tour, SELECTOR.toggle, /connect directly$/, layer(tour) ?? undefined);
  tour.check('sessions-direct-switch', seat !== null, 'each saved player has a switch for direct connections', 'the saved players have no direct switch');
  await tour.capture('detail');
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
  if (asked) {
    const closed = await tour.waitFor(() => layer(tour) === null);
    tour.check('builder-guard-discard', closed === true, 'Discard after Escape closes the window, as Escape does', 'Discard after Escape left the window open');
    return;
  }
  const back = await waitText(tour, REVIEW_SESSION, () => layer(tour));
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
    const listed = await waitText(tour, REVIEW_SESSION, () => layer(tour));
    tour.check('sessions-listed', listed, `Sessions lists ${REVIEW_SESSION}`, `Sessions does not list ${REVIEW_SESSION}`);
    await tour.capture('list');
    await checkDetail(tour);
    const picked = await pickInPalette(tour, REVIEW_SESSION);
    const editor = picked && await waitText(tour, 'Edit session', () => layer(tour));
    tour.check('session-search-entry', editor, 'the palette lists the session and picking it opens Edit session', 'the session search entry did not open its editor');
    if (editor) {
      await checkEditorLayout(tour);
      await tour.capture('editor');
    }
    await guardBuilder(tour);
  },
});
