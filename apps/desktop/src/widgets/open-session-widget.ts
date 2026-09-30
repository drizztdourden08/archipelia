/* @layer renderer-app @kind logic */
import { isWidgetOpen, openWidget } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { FLOATING_PLACES } from './dock-preset.constants';
import { SESSION_WIDGETS } from './widget-registry.constants';

const openSessionWidget = (layout: WidgetLayout, id: string): WidgetLayout => {
  const place = FLOATING_PLACES[id];
  if (!place || isWidgetOpen(layout, id)) return openWidget(layout, id, SESSION_WIDGETS);
  return { ...layout, floating: [...layout.floating, { ...place }] };
};

export { openSessionWidget };
