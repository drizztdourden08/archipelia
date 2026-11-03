/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import type { SessionTemplate } from '@archipelia/model';
import { validatePlayers } from '@archipelia/sessions/validation';
import type { LibraryView, TemplateProblem } from '@archipelia/sessions/validation';
import { focusProblem } from './focus-problem';
import { problemSlot } from './problem-slot';

const useProblems = (draft: SessionTemplate, library: LibraryView, select: (slot: number, option?: string) => void) => {
  const { installed, presets } = library;
  const problems = useMemo(() => validatePlayers(draft, { installed, presets }), [draft, installed, presets]);
  const [runAttempted, setRunAttempted] = useState(false);

  const attemptRun = useCallback(() => {
    setRunAttempted(true);
    return problems.length === 0;
  }, [problems.length]);

  const showProblem = useCallback((problem: TemplateProblem) => {
    const slot = problemSlot(problem, draft.players);
    if (slot !== null) select(slot, problem.field === 'option' ? problem.optionKey : undefined);
    if (problem.field !== 'option') requestAnimationFrame(() => focusProblem(document.body, problem));
  }, [draft.players, select]);

  const openSlot = useCallback((slot: number) => {
    const problem = problems.find((entry) => entry.slot === slot);
    if (problem) showProblem(problem);
    else select(slot);
  }, [problems, select, showProblem]);

  return { attemptRun, openSlot, problems, runAttempted, showProblem };
};

export { useProblems };
