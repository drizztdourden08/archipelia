/* @layer renderer-app @kind logic */
import type { ServerEntry } from '@archipelia/model';
import { NEW_SERVER } from '../ServerManager.constants';

const rowName = (entry: ServerEntry): string => entry.label.trim() || NEW_SERVER.label;

export { rowName };
