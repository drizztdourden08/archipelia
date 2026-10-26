/* @layer renderer-app @kind logic */
import type { SettingsOption } from '@drizztdourden08/tessera/composites';
import type { LobbyServerEntry } from '@archipelia/model';
import type { RemoteView } from '../SessionBuilder.type';
import { GG_VALUE, LOBBY_PREFIX, PLACE_TEXT, REMOTE_TEXT, SSH_PREFIX } from './place.constants';

const lobbyLock = ({ draft, connected }: RemoteView, entry: LobbyServerEntry): string | undefined => {
  const { direct } = draft;
  if (!direct) return REMOTE_TEXT.needsDirect;
  return connected > 0 && entry.id !== direct.serverId ? PLACE_TEXT.lockedRemote : undefined;
};

const remoteOptions = (view: RemoteView): SettingsOption[] => {
  const noDirect = view.draft.direct ? REMOTE_TEXT.needsNoDirect : undefined;
  return [
    { value: GG_VALUE, label: 'archipelago.gg', hint: REMOTE_TEXT.gg, disabled: noDirect },
    ...view.servers.map((server) => ({ value: `${SSH_PREFIX}${server.id}`, label: `${server.label} over SSH`, hint: REMOTE_TEXT.ssh, disabled: noDirect })),
    ...view.lobbyServers.map((entry) => ({ value: `${LOBBY_PREFIX}${entry.id}`, label: `${entry.label}, an Archipelia server`, hint: REMOTE_TEXT.lobby, disabled: lobbyLock(view, entry) })),
  ];
};

export { remoteOptions };
