/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';
import type { TemplateProblem } from '../SessionLobby.type';

const problemSlot = ({ slot }: TemplateProblem, players: SessionPlayer[]): number | null =>
  (players.some((entry) => entry.slot === slot) ? slot : null);

export { problemSlot };
