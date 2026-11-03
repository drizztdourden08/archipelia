/* @layer core @kind logic */
import type { BrowsedLobby } from '@drizztdourden08/archipelia-lobby-protocol';
import { lobbyJoinable } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Lobby } from '@archipelia/model';
import { listedSeats } from './listed-seats';
import { usedSlots } from './used-slots';

const browsedLobby = (lobby: Lobby, joinToken: string): BrowsedLobby => ({
  name: lobby.name,
  joinToken,
  engine: { ap: lobby.engine.ap },
  admission: lobby.options.admission,
  allowUnlisted: lobby.options.allowUnlisted,
  joinable: lobbyJoinable(lobby.phase, usedSlots(lobby) >= lobby.options.maxSlots),
  seats: listedSeats(lobby),
});

export { browsedLobby };
