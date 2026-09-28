/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { WidgetManager } from '@drizztdourden08/tessera/composites';
import type { SessionDockProps } from './SessionDock.type';
import { SESSION_WIDGETS } from '../../../../widgets/widget-registry.constants';

const SessionDock = ({ layout, content, onUpdate, onClose }: SessionDockProps) => (
  <Box className="session-dashboard__dock" role="region" aria-label="Session widgets">
    <WidgetManager
      definitions={SESSION_WIDGETS}
      layout={layout}
      contextActive
      bounds="container"
      onUpdate={onUpdate}
      onClose={onClose}
    >
      {content}
    </WidgetManager>
  </Box>
);

export { SessionDock };
