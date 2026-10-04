/* @layer core @kind config */
import type { HintState } from './live-room.type';

const HINT_LINE = /\[Hint\]: (.+?)'s (.+) is at (.+) in (.+?)'s World(?: at (.+?))?\. \(([^)]+)\)\s*$/;

const STATE_BY_TEXT: Record<string, HintState> = { found: 'found', priority: 'priority', avoid: 'avoid', 'no priority': 'no priority' };

export { HINT_LINE, STATE_BY_TEXT };
