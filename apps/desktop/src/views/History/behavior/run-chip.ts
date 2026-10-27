/* @layer renderer-app @kind logic */
import type { Session } from '@archipelia/model';
import { UNKNOWN_SOURCE_NAME } from '@archipelia/model';
import { TEXT } from '../History.constants';
import type { RunChip } from '../History.type';

const changesText = (count: number): string => (count === 0 ? '' : `, ${count} ${count === 1 ? 'change' : 'changes'}`);

const runChip = ({ source }: Session): RunChip => {
  if (!source || source.match === 'unknown') return { text: UNKNOWN_SOURCE_NAME, recorded: false };
  if (source.match === 'name') return { text: TEXT.byName, recorded: false };
  return { text: `from ${source.sessionName}${changesText(source.overrides.length)}`, recorded: true };
};

export { runChip };
