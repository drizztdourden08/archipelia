/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SELECTOR } from '../review-dom.constants';
import { WIZARD_TITLE } from './package-wizard.constants';

const wizardRoot = (tour: AppReviewTour) => (): HTMLElement | null =>
  tour.findAll(SELECTOR.dialog).find((el) => WIZARD_TITLE.test(el.innerText)) ?? null;

export { wizardRoot };
