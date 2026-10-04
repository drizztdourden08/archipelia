/* @layer renderer-app @kind logic */
import type { SessionPlayer } from '@archipelia/model';
import type { TemplateProblem } from '../SessionBuilder.type';

const problemSlot = ({ slot, field }: TemplateProblem, players: SessionPlayer[]): number | null => {
  if (slot === undefined) return null;
  const player = players.find((entry) => entry.slot === slot);
  return field === 'option' || player?.source.kind === 'preset' ? slot : null;
};

export { problemSlot };
