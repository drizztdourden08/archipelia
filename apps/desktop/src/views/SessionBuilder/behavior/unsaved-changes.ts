/* @layer renderer-app @kind logic */
import { runOverridesOf } from '@archipelia/model';
import type { SessionTemplate } from '@archipelia/model';
import type { UnsavedChanges } from '../SessionBuilder.type';

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

const outsideRun = (base: SessionTemplate, draft: SessionTemplate, pending: boolean): number =>
  [draft.name !== base.name, !same(draft.host, base.host), !same(draft.lobby, base.lobby), draft.server.passwordRef !== base.server.passwordRef || pending]
    .filter(Boolean).length;

const unsavedChanges = (base: SessionTemplate, draft: SessionTemplate, pending: boolean): UnsavedChanges => {
  const outside = outsideRun(base, draft, pending);
  const runnable = runOverridesOf(base, draft).length;
  return { count: Math.max(runnable, outside), runnable: outside === 0 && runnable > 0 };
};

export { unsavedChanges };
