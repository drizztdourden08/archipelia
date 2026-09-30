/* @layer renderer-app @kind hook */
import { isWidgetOpen, useWidgetLayout } from '@drizztdourden08/tessera/composites';
import { useCallback, useMemo } from 'react';
import { SESSION_DOCK_KEY, SESSION_WIDGETS } from '../../../widgets/widget-registry.constants';
import { LOCAL_ONLY } from '../SessionDashboard.constants';
import { SESSION_DOCK_PRESET } from '../../../widgets/session-dock.constants';
import { openSessionWidget } from '../../../widgets/open-session-widget';

const useSessionDock = () => {
  const { layout, setLayout, close, reset } = useWidgetLayout({
    definitions: SESSION_WIDGETS, profileId: null, io: LOCAL_ONLY, storageKey: SESSION_DOCK_KEY, preset: SESSION_DOCK_PRESET,
  });
  const toggles = useMemo(
    () => SESSION_WIDGETS.map(({ id, label }) => ({ id, label, visible: isWidgetOpen(layout, id) })),
    [layout],
  );
  const toggle = useCallback(
    (id: string) => (isWidgetOpen(layout, id) ? close(id) : setLayout(openSessionWidget(layout, id))),
    [layout, close, setLayout],
  );
  return { layout, reset, setLayout, toggle, toggles };
};

export { useSessionDock };
