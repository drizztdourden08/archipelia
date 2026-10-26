/* @layer renderer-app @kind logic */
import type { GameSectionRows } from '../GameStore.type';

const indexOfGame = (sections: readonly GameSectionRows[], apworld: string): number =>
  sections.flatMap((section) => section.rows).findIndex((row) => row.entry.apworld === apworld);

export { indexOfGame };
