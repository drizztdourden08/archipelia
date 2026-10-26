/* @layer renderer-app @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { LobbyServerStatus } from '../../../lobbies/lobbies.type';
import { sameComputer } from './same-computer';

const privateFacts = (status: LobbyServerStatus): FactsPanelFact[] => {
  const here = sameComputer(status);
  return here ? [{ label: 'This computer', value: here, mono: true, copyable: 'address on this computer' }] : [];
};

export { privateFacts };
