/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import type { DraftField, DraftProblem } from '../ServerManager.type';
import { shownErrors } from './shown-errors';

const useDraftErrors = (problems: readonly DraftProblem[]) => {
  const [touched, setTouched] = useState<ReadonlySet<DraftField>>(new Set());
  const [attempted, setAttempted] = useState(false);
  const errors = useMemo(() => shownErrors(problems, touched, attempted), [problems, touched, attempted]);
  const touch = useCallback((field: DraftField) => setTouched((prev) => (prev.has(field) ? prev : new Set(prev).add(field))), []);
  const attempt = useCallback(() => setAttempted(true), []);
  const reset = useCallback(() => {
    setTouched(new Set());
    setAttempted(false);
  }, []);
  return { attempt, errors, reset, touch };
};

export { useDraftErrors };
