/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';
import { SELECTOR } from './review-dom.constants';

const labelOf = (row: HTMLElement) => row.querySelector('.command-palette-row__label')?.textContent.trim() ?? '';

const pickInPalette = async (tour: AppReviewTour, label: string): Promise<boolean> => {
  tour.press({ key: 'k', ctrlKey: true });
  const input = await tour.waitFor(() => tour.find(SELECTOR.paletteInput));
  if (!(input instanceof HTMLInputElement)) return false;
  tour.typeText(input, label);
  const row = await tour.waitFor(() => tour.findAll(SELECTOR.paletteRow).find((candidate) => labelOf(candidate) === label));
  if (!row) {
    tour.press({ key: 'Escape' });
    return false;
  }
  await tour.capture(`palette-${label.toLowerCase().replace(/\W+/g, '-')}`);
  tour.click(row);
  await tour.settle();
  return true;
};

export { pickInPalette };
