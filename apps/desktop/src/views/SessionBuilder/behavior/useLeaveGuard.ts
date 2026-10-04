/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useRef } from 'react';
import { confirmAction, nav, useDialogStore, useEscapeLayer } from '@drizztdourden08/brock-react';
import type { EscapeLayer } from '@drizztdourden08/brock-react';
import { DISCARD_CONFIRM } from '../SessionBuilder.constants';

const useLeaveGuard = (dirty: boolean, onBack: () => void) => {
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  const asking = useRef(false);

  const ask = useCallback((leave: () => void) => {
    if (!dirtyRef.current) {
      leave();
      return;
    }
    if (asking.current) return;
    asking.current = true;
    void confirmAction(DISCARD_CONFIRM).then((confirmed) => {
      asking.current = false;
      if (confirmed) leave();
    });
  }, []);

  const layer = useMemo<EscapeLayer>(() => ({
    isOpen: () => dirtyRef.current && useDialogStore.getState().dialog === null,
    close: () => ask(nav.close),
  }), [ask]);
  useEscapeLayer(layer);

  return useCallback(() => ask(onBack), [ask, onBack]);
};

export { useLeaveGuard };
