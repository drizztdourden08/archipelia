/* @layer renderer-app @kind hook */
import { useEffect, useRef, useState } from 'react';
import type { BuildLogView, PackageSourceDialogProps, PackageSourceStep, SourceConsent, SourceFinish } from '@archipelia/design';
import { MOCK_DELAY_MS, MOCK_MODULE, MOCK_SUGGESTIONS, MOCK_TITLE } from '../mock-package-source.constants';
import { mockHandlersOf } from './mock-handlers-of';
import { NO_LOG } from './mock-world.constants';

const useMockWorld = (onClose: () => void): PackageSourceDialogProps => {
  const [step, setStep] = useState<PackageSourceStep>({ kind: 'idle' });
  const [finish, setFinish] = useState<SourceFinish>({ kind: 'idle' });
  const [consent, setConsent] = useState<SourceConsent | null>(null);
  const [buildLog, setBuildLog] = useState<BuildLogView>(NO_LOG);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const missed = useRef(false);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (work: () => void) => { timers.current.push(setTimeout(work, MOCK_DELAY_MS)); };
  const handlers = mockHandlersOf({ setStep, setFinish, setConsent, setBuildLog, later, missed });
  return {
    title: MOCK_TITLE,
    module: MOCK_MODULE,
    search: { suggestions: MOCK_SUGGESTIONS, looking: false, failed: undefined },
    step,
    finish,
    consent,
    buildLog,
    ...handlers,
    onClose,
  };
};

export { useMockWorld };
