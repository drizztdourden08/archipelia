/* @layer renderer-app @kind types */
import type { StatusBarWidget } from '../../SessionStatusBar.type';

type WidgetToggleProps = StatusBarWidget & { onToggle: (id: string) => void };

export type { WidgetToggleProps };
