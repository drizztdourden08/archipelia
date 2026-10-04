/* @layer renderer-app @kind logic */
import type { AppReviewTour } from '@drizztdourden08/brock-react';

const waitText = async (tour: AppReviewTour, text: string | RegExp, root: () => HTMLElement | null, timeoutMs?: number): Promise<boolean> => {
  const found = await tour.waitFor(() => {
    const content = root()?.innerText ?? '';
    return typeof text === 'string' ? content.includes(text) : text.test(content);
  }, timeoutMs);
  return found === true;
};

export { waitText };
