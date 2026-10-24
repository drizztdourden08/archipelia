/* @layer core @kind logic */
import type { LobbyInfoReply } from '@archipelia/lobby-protocol';
import { PROTOCOL_NAME, PROTOCOL_VERSION, REQUIRED_CAPABILITY, lobbyJoinable } from '@archipelia/lobby-protocol';
import type { Lobby } from '@archipelia/model';
import { SERVER_NAME } from '../lobby.constants';
import { fixedWorlds } from './fixed-worlds';
import { limitsOf } from './limits-of';
import { usedSlots } from './used-slots';

const infoReply = (lobby: Lobby, serverVersion: string): LobbyInfoReply => ({
  type: 'lobby.info.reply',
  protocol: { name: PROTOCOL_NAME, version: PROTOCOL_VERSION },
  server: { name: SERVER_NAME, version: serverVersion },
  lobby: {
    name: lobby.name,
    engine: { ap: lobby.engine.ap },
    phase: lobby.phase,
    joinable: lobbyJoinable(lobby.phase, usedSlots(lobby) >= lobby.options.maxSlots),
    admission: lobby.options.admission,
    allowUnlisted: lobby.options.allowUnlisted,
    worlds: [...fixedWorlds(lobby)].map(([game, worldVersion]) => ({ game, worldVersion })),
    requires: { capabilities: [REQUIRED_CAPABILITY] },
  },
  limits: limitsOf(lobby),
});

export { infoReply };
