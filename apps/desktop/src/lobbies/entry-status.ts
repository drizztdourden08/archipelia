/* @layer renderer-app @kind logic */
import type { LobbyServerEntry } from '@archipelia/model';
import type { EntryStatus } from './lobbies.type';

const entryStatus = (entry: LobbyServerEntry): EntryStatus => {
  if (!entry.lastTest) return { tone: 'neutral', text: 'Not tested' };
  return entry.lastTest.ok ? { tone: 'success', text: 'Connected' } : { tone: 'danger', text: 'Not reachable' };
};

export { entryStatus };
