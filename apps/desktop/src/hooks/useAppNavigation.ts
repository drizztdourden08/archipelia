/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import { useNavigation } from '@drizztdourden08/brock-react';
import { useFocusStore } from '../stores/useFocusStore';

const useAppNavigation = () => {
  const { open, close } = useNavigation();
  const focus = useFocusStore((state) => state.focus);

  const openSession = useCallback((sessionId: string) => { focus(sessionId); close(); }, [focus, close]);

  return useMemo(() => ({ open, openSession }), [open, openSession]);
};

export { useAppNavigation };
