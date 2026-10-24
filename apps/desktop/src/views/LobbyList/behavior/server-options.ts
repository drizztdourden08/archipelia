/* @layer renderer-app @kind logic */
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import type { LobbyServerEntry } from '@archipelia/model';
import { LOCAL_SERVER } from '../../../lobbies/lobbies.constants';

const serverOptions = (entries: readonly LobbyServerEntry[]): SelectOption[] => [
  { value: LOCAL_SERVER, label: 'This computer' },
  ...entries.map((entry) => ({ value: entry.id, label: entry.label })),
];

export { serverOptions };
