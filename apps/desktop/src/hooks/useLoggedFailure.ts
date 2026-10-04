/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { logFailure } from './log-failure';

const useLoggedFailure = (raw: string | null | undefined, sentence: string): string | null => {
  useEffect(() => { if (raw) logFailure(sentence, raw); }, [raw, sentence]);
  return raw ? sentence : null;
};

export { useLoggedFailure };
