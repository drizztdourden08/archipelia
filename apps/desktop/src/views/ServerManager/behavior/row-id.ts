/* @layer renderer-app @kind logic */
import type { ServerEntry } from '@archipelia/model';
import { NEW_SERVER } from '../ServerManager.constants';

const rowId = (entry: ServerEntry): string => entry.id || NEW_SERVER.id;

export { rowId };
