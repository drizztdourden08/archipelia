/* @layer renderer-app @kind logic */
import type { PatternChoice, PatternValue } from '@drizztdourden08/tessera/composites';
import type { GameNames } from '@archipelia/sessions/live-room';
import { NO_CHOICES } from './console-names-list.constants';
import { PLAYER_SLOT } from './console-room.constants';
import type { ConsoleRoom } from './console-room.type';

const consoleNamesList = (kind: keyof GameNames, room: ConsoleRoom) => (value: PatternValue): readonly PatternChoice[] => {
  const chosen = room.players.find((player) => player.name === value[PLAYER_SLOT]);
  if (chosen === undefined) return NO_CHOICES;
  return room.names[chosen.game]?.[kind].map((name) => ({ value: name })) ?? NO_CHOICES;
};

export { consoleNamesList };
