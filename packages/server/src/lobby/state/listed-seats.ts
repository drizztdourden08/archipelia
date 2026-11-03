/* @layer core @kind logic */
import type { OpenSeats } from '@drizztdourden08/archipelia-lobby-protocol';
import type { Lobby } from '@archipelia/model';
import { openSeatsOf } from './open-seats-of';
import { usedSlots } from './used-slots';

const listedSeats = (lobby: Lobby): OpenSeats =>
  openSeatsOf(lobby) ?? { total: lobby.options.maxSlots, free: Math.max(0, lobby.options.maxSlots - usedSlots(lobby)) };

export { listedSeats };
