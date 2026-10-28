/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { buttonsOf } from './builder-buttons';
import { setupProblems } from './setup-problems';
import { unsavedChanges } from './unsaved-changes';
import { SETUP_TEXT } from '../SessionBuilder.constants';
import type { BuilderActionsInput } from '../SessionBuilder.type';
import { validatePlayers } from '../../SessionLobby';

const useBuilderActions = ({ draft, base, dirty, pending, stored, tab, library, runs, onSave, onDiscard }: BuilderActionsInput) => {
  const changes = useMemo(() => unsavedChanges(base, draft, pending), [base, draft, pending]);
  const problem = [...setupProblems(draft), ...validatePlayers(draft, library).map((entry) => entry.message)][0];
  const buttons = buttonsOf({ stored, dirty, hasTab: tab !== undefined });
  const reasons = { setup: problem, once: changes.runnable ? undefined : SETUP_TEXT.onceBlocked };
  const on = { tab: runs.goToTab, run: runs.run, once: runs.runOnce, 'save-run': runs.saveAndRun, save: onSave, discard: onDiscard };
  return { buttons, changes: dirty ? changes.count : 0, on, reasons };
};

export { useBuilderActions };
