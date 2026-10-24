/* @layer electron-main @kind logic */
import { LOCAL_SERVER } from '../../src/lobbies/lobbies.constants';
import { createLobbyOps } from './create-lobby-ops';
import type { AdminChannel, RegistryDeps } from './lobbies.type';
import { MISSING_TOKEN } from './lobbies.constants';
import { tokenSecret } from '../../src/lobbies/token-secret';
import { openRemoteChannel } from './remote/open-remote-channel';

const createAdminRegistry = ({ local, store, secrets, onLobby }: RegistryDeps) => {
  const remote = new Map<string, AdminChannel>();
  local.watch((lobby) => onLobby({ serverId: LOCAL_SERVER, lobby }));

  const channelFor = async (serverId: string): Promise<AdminChannel> => {
    if (serverId === LOCAL_SERVER) return local;
    const known = remote.get(serverId);
    if (known?.alive()) return known;
    const entry = await store.require(serverId);
    const token = await secrets.get(tokenSecret(entry.id));
    if (!token) throw new Error(MISSING_TOKEN);
    const { channel } = await openRemoteChannel({ url: entry.url, token, ...(entry.certSha256 ? { certSha256: entry.certSha256 } : {}) });
    channel.watch((lobby) => onLobby({ serverId, lobby }));
    remote.set(serverId, channel);
    return channel;
  };

  const forget = (serverId: string) => {
    remote.get(serverId)?.close();
    remote.delete(serverId);
  };

  const closeAll = () => {
    for (const serverId of [...remote.keys()]) forget(serverId);
  };

  const opsFor = async (serverId: string) => createLobbyOps(await channelFor(serverId));

  return { opsFor, forget, closeAll };
};

export { createAdminRegistry };
