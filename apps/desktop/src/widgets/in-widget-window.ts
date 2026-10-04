/* @layer renderer-app @kind logic */
import { WIDGET_WINDOW_QUERY } from './widget-window.constants';

const inWidgetWindow = (): boolean => new URLSearchParams(window.location.search).has(WIDGET_WINDOW_QUERY);

export { inWidgetWindow };
