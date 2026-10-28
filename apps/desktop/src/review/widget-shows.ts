/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';

const widgetShows = async (tour: AppReviewTour, id: string, text: RegExp): Promise<boolean> => {
  const frame = await tour.openWidget(id);
  if (!frame) return false;
  return (await tour.waitFor(() => (text.test(frame.innerText) ? true : null), 8000)) === true;
};

export { widgetShows };
