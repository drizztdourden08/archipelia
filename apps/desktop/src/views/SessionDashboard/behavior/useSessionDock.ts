/* @layer renderer-app @kind hook */
import { useWidgetLayout } from '@drizztdourden08/tessera/composites';
import { useMemo } from 'react';
import { SESSION_DOCK_KEY, SESSION_WIDGETS } from '../../../widgets/widget-registry.constants';
import { LOCAL_ONLY } from '../SessionDashboard.constants';
import { SESSION_DOCK_PRESET } from '../../../widgets/session-dock.constants';

const useSessionDock = () => {
  const { layout, update, close, toggle, reset } = useWidgetLayout({
    definitions: SESSION_WIDGETS, profileId: null, io: LOCAL_ONLY, storageKey: SESSION_DOCK_KEY, preset: SESSION_DOCK_PRESET,
  });
  const toggles = useMemo(
    () => SESSION_WIDGETS.map(({ id, label }) => ({ id, label, visible: layout.widgets.find((w) => w.id === id)?.visible ?? false })),
    [layout.widgets],
  );
  return { close, layout, reset, toggle, toggles, update };
};

export { useSessionDock };
