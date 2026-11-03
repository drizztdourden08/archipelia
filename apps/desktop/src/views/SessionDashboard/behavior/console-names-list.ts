/* @layer renderer-app @kind logic */
import type { PatternChoice, PatternValue } from '@drizztdourden08/tessera/composites';
import type { GameNames } from '@archipelia/sessions/live-room';
import { NAME_CHOICES, NO_CHOICES } from './console-names-list.constants';
import { PLAYER_SLOT } from './console-room.constants';
import type { ConsoleRoom } from './console-room.type';

const choicesOf = (names: readonly string[]): readonly PatternChoice[] => {
  const known = NAME_CHOICES.get(names);
  if (known !== undefined) return known;
  const made = names.map((name) => ({ value: name }));
  NAME_CHOICES.set(names, made);
  return made;
};

const consoleNamesList = (kind: keyof GameNames, room: ConsoleRoom) => (value: PatternValue): readonly PatternChoice[] => {
  const chosen = room.players.find((player) => player.name === value[PLAYER_SLOT]);
  const names = chosen === undefined ? undefined : room.names[chosen.game]?.[kind];
  return names === undefined ? NO_CHOICES : choicesOf(names);
};

export { consoleNamesList };
