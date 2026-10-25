/* @layer electron-main @kind logic */
import { checkClientVersion, PROTOCOL_NAME, SUPPORTED_PROTOCOL_VERSIONS } from '@drizztdourden08/archipelia-lobby-protocol';
import type { ClientInfo } from '@drizztdourden08/archipelia-lobby-protocol';
import { TEXT } from './joins.constants';
import type { JoinRecord, LobbyLink } from './joins.type';
import { joinStop } from './join-stop';

const checkLobby = async (link: LobbyLink, record: JoinRecord, client: ClientInfo, ap: string) => {
  const reply = await link.request({ type: 'lobby.info', protocol: { name: PROTOCOL_NAME, versions: SUPPORTED_PROTOCOL_VERSIONS }, lobby: { code: record.code } });
  if (reply.type === 'error') throw joinStop('failed', reply.message);
  if (reply.type !== 'lobby.info.reply') throw joinStop('failed', TEXT.noReply);
  const { lobby } = reply;
  const mismatch = checkClientVersion(lobby.engine.ap, { client, archipelago: { version: ap } });
  if (mismatch) throw joinStop('failed', mismatch.message);
  if (!lobby.joinable) throw joinStop('failed', TEXT.notJoinable);
  if (!lobby.allowUnlisted) throw joinStop('failed', TEXT.listedOnly);
  return { lobbyName: lobby.name, ap: lobby.engine.ap };
};

export { checkLobby };
