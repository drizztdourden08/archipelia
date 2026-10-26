/* @layer renderer-app @kind hook */
import type { SessionTemplate } from '@archipelia/model';
import { usePendingCloses } from '../../../hooks/usePendingCloses';
import { lobbyServerOf } from '../../../lobbies/lobby-server-of';
import { sessionReach } from '../../../lobbies/session-reach';
import { roomFacts } from './room-facts';
import { useNetworkMode } from './useNetworkMode';

const useConnection = (template: SessionTemplate) => {
  const network = useNetworkMode();
  const reach = sessionReach(template);
  const open = network.mode !== undefined && network.mode !== 'off';
  const exposed = reach === 'lan' || (template.direct !== undefined && reach === 'local') || open;
  return {
    reach, open, busy: network.busy, error: network.error,
    serverId: lobbyServerOf(template),
    closing: usePendingCloses(template.id).length > 0,
    localStatus: reach !== 'archipelia' && exposed ? network.status : null,
    facts: roomFacts(template, network.status),
    stop: () => void network.setMode('off'),
  };
};

export { useConnection };
