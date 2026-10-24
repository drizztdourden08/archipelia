/* @layer renderer-app @kind types */
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import type { ServerPlace } from '../../lobbies/lobbies.type';

type ServerBarProps = {
  serverId: string;
  options: SelectOption[];
  place: ServerPlace;
  notice: string | null;
  onSelect: (serverId: string) => void;
};

export type { ServerBarProps };
