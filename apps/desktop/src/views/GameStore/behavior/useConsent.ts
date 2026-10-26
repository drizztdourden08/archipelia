/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { AskConsent, PendingConsent } from './useConsent.type';

const useConsent = () => {
  const [pending, setPending] = useState<PendingConsent | null>(null);
  const resolver = useRef<((accepted: boolean) => void) | null>(null);

  const answer = useCallback((accepted: boolean) => {
    resolver.current?.(accepted);
    resolver.current = null;
    setPending(null);
  }, []);
  const ask = useCallback<AskConsent>((title, packages, wheels = []) => new Promise<boolean>((resolve) => {
    resolver.current = resolve;
    setPending({ title, packages, wheels });
  }), []);
  const accept = useCallback(() => answer(true), [answer]);
  const cancel = useCallback(() => answer(false), [answer]);
  useEffect(() => () => resolver.current?.(false), []);

  return { accept, ask, cancel, pending };
};

export { useConsent };
