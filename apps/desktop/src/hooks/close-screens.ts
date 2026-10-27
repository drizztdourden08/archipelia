/* @layer renderer-app @kind logic */
import type { TourStepContext } from '@drizztdourden08/brock-react';

const closeScreens = ({ close }: TourStepContext): void => {
  close();
};

export { closeScreens };
