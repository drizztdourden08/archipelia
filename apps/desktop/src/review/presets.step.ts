/* @layer renderer-app @kind logic */
import { defineReviewStep, nav } from '@drizztdourden08/brock-react';
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { ROUTE } from '../hooks/app-navigation.constants';
import { appApi } from '../ipc/app-api';
import { REVIEW_PRESET, GUARD_DIALOG } from './review.constants';
import { SELECTOR } from './review-dom.constants';
import { named } from './named';
import { nameOf } from './name-of';
import { pickInPalette } from './pick-in-palette';
import { waitNamed } from './wait-named';

const nameField = (tour: AppReviewTour) => tour.waitFor(() => {
  const field = tour.find(SELECTOR.presetName);
  return field instanceof HTMLInputElement ? field : null;
});

const showsName = (tour: AppReviewTour, name: string) =>
  tour.waitFor(() => (tour.find(SELECTOR.presetName) as HTMLInputElement | null)?.value === name);

const showsUnsaved = async (tour: AppReviewTour) => {
  const status = await tour.waitFor(() => tour.findAll(SELECTOR.status).find((el) => el.innerText.includes('Unsaved changes')) ?? null);
  const save = named(tour, SELECTOR.button, 'Save');
  return Boolean(status) && save instanceof HTMLButtonElement && !save.disabled;
};

const guardOnClose = async (tour: AppReviewTour) => {
  const close = tour.find(SELECTOR.layerClose);
  if (close) tour.click(close);
  const discard = await waitNamed(tour, SELECTOR.dialog, GUARD_DIALOG);
  tour.check('leave-guard-asks', discard !== null, 'closing the hub with an unsaved preset asks about unsaved changes', 'the hub closed over an unsaved preset without asking');
  if (!discard) return;
  await tour.capture('leave-guard');
  const keep = named(tour, SELECTOR.button, 'Keep editing', discard);
  if (keep) tour.click(keep);
  const kept = await tour.waitFor(() => !named(tour, SELECTOR.dialog, GUARD_DIALOG) && tour.find(SELECTOR.layer) !== null);
  tour.check('leave-guard-keeps', kept === true, 'Keep editing leaves the preset editor open with its edit', 'Keep editing did not return to the editor');
};

export default defineReviewStep({
  run: async (tour) => {
    const preset = (await appApi().presetsList()).find((entry) => entry.name === REVIEW_PRESET);
    if (!preset) return tour.check('preset-seeded', false, '', 'the seed made no review preset');
    nav.open(ROUTE.presets, { presetId: preset.id });
    tour.check('preset-param', await showsName(tour, REVIEW_PRESET) === true, 'the presetId param selects the review preset', 'the presetId param did not select the review preset');
    const list = tour.find(SELECTOR.presetList);
    const create = list && tour.find(SELECTOR.newPreset, list);
    tour.check('preset-list', create instanceof HTMLElement && nameOf(create) === 'New preset', 'the presets sit in a list named Presets with New preset, marked for the tour', 'the presets list or its marked New preset button is missing');
    const picked = await pickInPalette(tour, REVIEW_PRESET);
    tour.check('preset-search-entry', picked && await showsName(tour, REVIEW_PRESET) === true, 'the palette lists the preset by name and picking it opens it', 'the palette did not offer the review preset');
    const field = await nameField(tour);
    if (!field) return tour.check('preset-editor', false, '', 'the preset editor has no name field');
    tour.typeText(field, `${REVIEW_PRESET} edited`);
    tour.check('preset-save-bar', await showsUnsaved(tour), 'the save bar says Unsaved changes and offers Save', 'the save bar did not show the unsaved edit');
    await tour.capture('edited');
    await guardOnClose(tour);
    const again = await nameField(tour);
    if (again) tour.typeText(again, REVIEW_PRESET);
    await tour.settle();
    const close = tour.find(SELECTOR.layerClose);
    if (close) tour.click(close);
    const closed = await tour.waitFor(() => tour.find(SELECTOR.layer) === null && !named(tour, SELECTOR.dialog, GUARD_DIALOG));
    return tour.check('leave-guard-clean', closed === true, 'with the edit undone the hub closes without asking', 'the hub asked or stayed open with no unsaved edit');
  },
});
