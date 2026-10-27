/* @layer renderer-app @kind hook */
import type { WizardApi } from '@drizztdourden08/tessera/composites';
import { useEffect, useRef } from 'react';
import type { SourceValues } from '../PackageSourceDialog.type';
import { ADVANCE } from './advance-rules.constants';
import type { Run } from './step-problems.type';

const useAdvance = (wizard: WizardApi<SourceValues>, run: Run): void => {
  const id = wizard.current.id;
  const now = ADVANCE[id]?.(run) ?? false;
  const last = useRef<{ id: string; now: boolean } | null>(null);
  const next = useRef(wizard.goNext);
  next.current = wizard.goNext;
  useEffect(() => {
    const before = last.current;
    last.current = { id, now };
    if (before?.id === id && !before.now && now) next.current();
  }, [id, now]);
};

export { useAdvance };
