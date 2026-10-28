/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { named } from './named';
import { VERSION_FIELD_NAME } from './check-version-picker.constants';
import { SELECTOR } from './review-dom.constants';

const checkVersionPicker = (tour: AppReviewTour, dialog: HTMLElement): void => {
  const picker = named(tour, SELECTOR.combobox, VERSION_FIELD_NAME, dialog);
  tour.check('games-details-built-in-no-picker', picker === null, 'the details dialog of a built-in world has no version picker', 'the details dialog of a built-in world shows a version picker');
};

export { checkVersionPicker };
