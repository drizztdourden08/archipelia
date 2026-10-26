/* @layer renderer-app @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { LobbyServerStatus } from '../../../lobbies/lobbies.type';
import { NETWORK_TEXT } from './lobby-view.constants';
import { sameComputer } from './same-computer';
import { yourNetwork } from './your-network';

const networkFacts = (status: LobbyServerStatus): FactsPanelFact[] => {
  const here = sameComputer(status);
  const lan = yourNetwork(status);
  if (!here || !lan) return [];
  return [
    { label: 'This computer', value: here, mono: true, copyable: 'address on this computer' },
    { label: 'Your network', value: lan, mono: true, copyable: 'address on your network' },
    { label: 'Announced on your network', value: status.reach?.advertising ? NETWORK_TEXT.announced : NETWORK_TEXT.notAnnounced },
  ];
};

export { networkFacts };
