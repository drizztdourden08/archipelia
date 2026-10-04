/* @layer renderer-app @kind logic */
import { useWidgetLayoutStore } from '@drizztdourden08/brock-react';
import { sessionLayout } from './session-layout';

const resetSessionWidgets = (): void => useWidgetLayoutStore.getState().change(sessionLayout);

export { resetSessionWidgets };
