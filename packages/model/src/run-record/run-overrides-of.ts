/* @layer core @kind logic */
import type { RunOverride, SessionTemplate } from '../session.type';
import { OVERRIDE_FIELDS } from './run-record.constants';
import { playerOverridesOf } from './player-overrides-of';

const runOverridesOf = (saved: SessionTemplate, used: SessionTemplate): RunOverride[] => {
  const fields = OVERRIDE_FIELDS.flatMap(({ field, label, read }) => {
    const from = read(saved);
    const to = read(used);
    return from === to ? [] : [{ field, label, from, to }];
  });
  return [...fields, ...playerOverridesOf(saved.players, used.players)];
};

export { runOverridesOf };
