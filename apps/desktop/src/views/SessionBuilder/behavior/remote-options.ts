/* @layer renderer-app @kind logic */
import type { SettingsOption } from '@drizztdourden08/tessera/composites';
import type { RemoteView } from '../SessionBuilder.type';
import { GG_VALUE, LOBBY_PREFIX, REMOTE_TEXT, SSH_PREFIX } from './place.constants';

const remoteOptions = ({ draft, lobbyServers, servers }: RemoteView): SettingsOption[] => {
  const noDirect = draft.direct ? REMOTE_TEXT.needsNoDirect : undefined;
  return [
    { value: GG_VALUE, label: 'archipelago.gg', hint: REMOTE_TEXT.gg, disabled: noDirect },
    ...servers.map((server) => ({ value: `${SSH_PREFIX}${server.id}`, label: `${server.label} over SSH`, hint: REMOTE_TEXT.ssh, disabled: noDirect })),
    ...lobbyServers.map((entry) => ({ value: `${LOBBY_PREFIX}${entry.id}`, label: `${entry.label}, an Archipelia server`, hint: REMOTE_TEXT.lobby })),
  ];
};

export { remoteOptions };
