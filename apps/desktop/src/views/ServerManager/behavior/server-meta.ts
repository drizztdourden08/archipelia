/* @layer renderer-app @kind logic */
import type { ServerEntry } from '@archipelia/model';
import { NEW_SERVER } from '../ServerManager.constants';

const serverMeta = (entry: ServerEntry): string => {
  if (!entry.id) return NEW_SERVER.meta;
  return `${entry.host} · ${entry.auth.kind === 'ssh-key' ? 'SSH key' : 'password'}`;
};

export { serverMeta };
