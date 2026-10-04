/* @layer renderer-app @kind logic */
import { defineReviewStep, nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { appApi } from '../ipc/app-api';
import { REVIEW_PRESET } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { named } from './named';
import { pickInPalette } from './pick-in-palette';
import { waitNamed } from './wait-named';

const nameField = (tour: AppReviewTour) => tour.waitFor(() => {
  const field = tour.find(SELECTOR.presetName);
  return field instanceof HTMLInputElement ? field : null;
});

const showsName = (tour: AppReviewTour, name: string) =>
  tour.waitFor(() => (tour.find(SELECTOR.presetName) as HTMLInputElement | null)?.value === name);

const guardOnClose = async (tour: AppReviewTour) => {
  const close = tour.find(SELECTOR.layerClose);
  if (close) tour.click(close);
  const discard = await waitNamed(tour, SELECTOR.dialog, 'Discard changes?');
  tour.check('leave-guard-asks', discard !== null, 'closing the hub with an unsaved preset asks Discard changes?', 'the hub closed over an unsaved preset without asking');
  if (!discard) return;
  await tour.capture('leave-guard');
  const keep = named(tour, SELECTOR.button, 'Keep editing', discard);
  if (keep) tour.click(keep);
  const kept = await tour.waitFor(() => !named(tour, SELECTOR.dialog, 'Discard changes?') && tour.find(SELECTOR.layer) !== null);
  tour.check('leave-guard-keeps', kept === true, 'Keep editing leaves the preset editor open with its edit', 'Keep editing did not return to the editor');
};

export default defineReviewStep({
  run: async (tour) => {
    const preset = (await appApi().presetsList()).find((entry) => entry.name === REVIEW_PRESET);
    if (!preset) return tour.check('preset-seeded', false, '', 'the seed made no review preset');
    nav.open(ROUTE.presets, { presetId: preset.id });
    tour.check('preset-param', await showsName(tour, REVIEW_PRESET) === true, 'the presetId param selects the review preset', 'the presetId param did not select the review preset');
    const picked = await pickInPalette(tour, REVIEW_PRESET);
    tour.check('preset-search-entry', picked && await showsName(tour, REVIEW_PRESET) === true, 'the palette lists the preset by name and picking it opens it', 'the palette did not offer the review preset');
    const field = await nameField(tour);
    if (!field) return tour.check('preset-editor', false, '', 'the preset editor has no name field');
    tour.typeText(field, `${REVIEW_PRESET} edited`);
    await tour.capture('edited');
    await guardOnClose(tour);
    const again = await nameField(tour);
    if (again) tour.typeText(again, REVIEW_PRESET);
    await tour.settle();
    const close = tour.find(SELECTOR.layerClose);
    if (close) tour.click(close);
    const closed = await tour.waitFor(() => tour.find(SELECTOR.layer) === null && !named(tour, SELECTOR.dialog, 'Discard changes?'));
    return tour.check('leave-guard-clean', closed === true, 'with the edit undone the hub closes without asking', 'the hub asked or stayed open with no unsaved edit');
  },
});
