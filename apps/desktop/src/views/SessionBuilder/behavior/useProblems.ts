/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SessionTemplate } from '@archipelia/model';
import type { LibraryView, TemplateProblem } from '../SessionBuilder.type';
import { validateTemplate } from './template-validation';
import { focusProblem } from './focus-problem';
import { problemSlot } from './problem-slot';

const useProblems = (draft: SessionTemplate, library: LibraryView, select: Dispatch<SetStateAction<number | null>>) => {
  const { installed, presets } = library;
  const problems = useMemo(() => validateTemplate(draft, { installed, presets }), [draft, installed, presets]);
  const [runAttempted, setRunAttempted] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  const attemptRun = useCallback(() => {
    setRunAttempted(true);
    return problems.length === 0;
  }, [problems.length]);

  const showProblem = useCallback((problem: TemplateProblem) => {
    const slot = problemSlot(problem, draft.players);
    if (slot !== null) select(slot);
    requestAnimationFrame(() => focusProblem(rootRef.current, problem));
  }, [draft.players, select]);

  return { attemptRun, problems, rootRef, runAttempted, showProblem };
};

export { useProblems };
