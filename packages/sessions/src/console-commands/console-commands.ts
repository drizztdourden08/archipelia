/* @layer core @kind config */
import type { ConsoleCommand } from './console-command.type';
import { itemsGroup } from './groups/items-group';
import { playersGroup } from './groups/players-group';
import { roomGroup } from './groups/room-group';
import { serverGroup } from './groups/server-group';

const consoleCommands: readonly ConsoleCommand[] = [...playersGroup, ...itemsGroup, ...roomGroup, ...serverGroup];

export { consoleCommands };
