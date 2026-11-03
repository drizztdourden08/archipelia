/* @layer core @kind logic */
import type { HostLogLine } from '@archipelia/hosts';
import { longestFirst } from '../live-room/longest-first';
import type { RunTally, TallyState } from './run-end.type';
import { noteCheck } from './note-check';
import { noteClient } from './note-client';
import { noteGoal } from './note-goal';

const createRunTally = (names: readonly string[]) => {
  const state: TallyState = { lastAt: 0, names: longestFirst(names), entries: new Map(), clients: new Map(), goals: {}, seen: {} };

  const add = (line: HostLogLine) => {
    state.startedAt ??= line.at;
    state.lastAt = line.at;
    noteCheck(state, line.text);
    noteClient(state, line);
    noteGoal(state, line);
  };

  const snapshot = (): RunTally => ({
    startedAt: state.startedAt,
    lastAt: state.lastAt,
    checks: Object.fromEntries([...state.entries].map(([name, entries]) => [name, entries.size])),
    goals: { ...state.goals },
    seen: { ...state.seen },
    online: Object.fromEntries([...state.clients].map(([name, count]) => [name, count > 0])),
  });

  return { add, snapshot };
};

export { createRunTally };
