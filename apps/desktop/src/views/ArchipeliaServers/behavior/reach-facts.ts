/* @layer renderer-app @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { LobbyServerStatus } from '../../../lobbies/lobbies.type';
import { MODE_OPTIONS, REACH_TEXT } from '../ArchipeliaServers.constants';

const advertisedText = (status: LobbyServerStatus): string => {
  if (status.reach?.advertising) return REACH_TEXT.advertised;
  if (status.options.mode === 'off') return REACH_TEXT.notAdvertisedOff;
  return status.automation ? REACH_TEXT.notAdvertisedAutomated : REACH_TEXT.notAdvertised;
};

const routerText = (status: LobbyServerStatus): string => {
  if (status.options.mode !== 'lan-and-internet') return REACH_TEXT.noRouterRequest;
  return status.reach?.lobbyPort ?? REACH_TEXT.waitingRouter;
};

const roomFacts = (status: LobbyServerStatus, names: Record<string, string>): FactsPanelFact[] =>
  Object.entries(status.reach?.rooms ?? {}).map(([lobbyId, message]) => ({ label: `Room of ${names[lobbyId] ?? 'a lobby'}`, value: message }));

const reachFacts = (status: LobbyServerStatus, names: Record<string, string>): FactsPanelFact[] => {
  if (status.state !== 'listening' || status.port === undefined) return [];
  const address = `${status.automation ? '127.0.0.1' : status.lanAddress}:${status.port}`;
  const mode = MODE_OPTIONS.find((option) => option.value === status.options.mode)?.label ?? status.options.mode;
  return [
    { label: 'Lobby address', value: address, mono: true, copyable: 'lobby address' },
    { label: 'Network mode', value: mode },
    { label: 'Seen on your network', value: advertisedText(status) },
    { label: 'Router port', value: routerText(status) },
    { label: 'Public address check', value: status.reach?.publicAddress ?? REACH_TEXT.noLookup },
    { label: 'TLS', value: status.secure ? REACH_TEXT.tlsOn : REACH_TEXT.tlsOff },
    ...roomFacts(status, names),
  ];
};

export { reachFacts };
