/* @layer electron-main @kind logic */
import type { ServerInfo } from '../../../src/lobbies/lobbies.type';
import { NOT_AN_ADDRESS } from '../../../src/lobbies/lobbies.constants';
import { parseServerUrl } from '../../../src/lobbies/parse-server-url';
import type { AdminChannel, RemoteOptions } from '../lobbies.type';
import { connectAdminLink } from './connect-admin-link';
import { createRemoteChannel } from './create-remote-channel';

const openRemoteChannel = async ({ url, token, certSha256 }: RemoteOptions): Promise<{ channel: AdminChannel; info: ServerInfo }> => {
  const target = parseServerUrl(url);
  if (!target) throw new Error(NOT_AN_ADDRESS);
  const link = await connectAdminLink(target, certSha256);
  try {
    return await createRemoteChannel(link, token);
  } catch (error) {
    link.close();
    throw error;
  }
};

export { openRemoteChannel };
