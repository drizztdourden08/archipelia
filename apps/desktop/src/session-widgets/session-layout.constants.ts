/* @layer renderer-app @kind config */
import type { SessionWidgetId } from './session-widget.type';

const SESSION_WIDGET_IDS: readonly SessionWidgetId[] = ['players', 'hints', 'room', 'log', 'console', 'spoiler'];

const TOP_ROW: readonly SessionWidgetId[] = ['players', 'hints', 'room'];

const BOTTOM_ROW: readonly SessionWidgetId[] = ['log', 'console'];

const ROW_SIZES: readonly number[] = [0.34, 0.32, 0.34];

const LAYOUT_SEEDED_PREF = { owner: 'session-layout', key: 'seeded' } as const;

export { BOTTOM_ROW, LAYOUT_SEEDED_PREF, ROW_SIZES, SESSION_WIDGET_IDS, TOP_ROW };
