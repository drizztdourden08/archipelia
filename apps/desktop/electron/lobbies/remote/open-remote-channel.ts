/* @layer electron-main @kind logic */
import type { ServerInfo } from '../../../src/lobbies/lobbies.type';
import { parseServerUrl } from '../../../src/lobbies/parse-server-url';
import { serverUrlProblem } from '../../../src/lobbies/server-url-problem';
import type { AdminChannel, RemoteOptions } from '../lobbies.type';
import { connectAdminLink } from './connect-admin-link';
import { createRemoteChannel } from './create-remote-channel';

const openRemoteChannel = async ({ url, token, certSha256 }: RemoteOptions): Promise<{ channel: AdminChannel; info: ServerInfo }> => {
  const target = parseServerUrl(url);
  if (!target) throw new Error(serverUrlProblem(url) ?? 'The address is not valid.');
  const link = await connectAdminLink(target, certSha256);
  try {
    return await createRemoteChannel(link, token);
  } catch (error) {
    link.close();
    throw error;
  }
};

export { openRemoteChannel };
