/* @layer renderer-app @kind logic */
import type { RadioOption } from '@drizztdourden08/tessera/primitives';
import { LOCAL_SERVER } from '../../../lobbies/lobbies.constants';
import { TEXT, WHERE_OPTIONS } from '../HostChoice.constants';
import type { HostWhere } from '../HostChoice.type';

const whereOptions = (lockedServer: string | undefined): RadioOption<HostWhere>[] => {
  if (lockedServer === undefined) return WHERE_OPTIONS;
  const here = lockedServer === LOCAL_SERVER;
  return WHERE_OPTIONS.map((option) => ((option.value === 'remote') === here ? { ...option, disabled: here ? TEXT.lockedHere : TEXT.lockedRemote } : option));
};

export { whereOptions };
