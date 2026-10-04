/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';

const checkWidgets = async (tour: AppReviewTour, widgets: readonly [string, RegExp][], prefix: string): Promise<void> => {
  for (const [id, content] of widgets) {
    const frame = await tour.openWidget(id);
    const filled = frame ? await tour.waitFor(() => content.test(frame.innerText), 8000) : null;
    tour.check(`${prefix}-${id}`, filled === true, `the ${id} widget shows the run's ${id}`, `the ${id} widget is ${frame ? `missing ${String(content)}` : 'not drawn'}`);
  }
};

export { checkWidgets };
