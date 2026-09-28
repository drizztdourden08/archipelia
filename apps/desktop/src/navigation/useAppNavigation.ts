/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import { useNavigation } from '@drizztdourden08/brock-react';
import { useFocusStore } from '../state/useFocusStore';
import { DATA_HUB, MULTIWORLD_HUB } from './app-navigation.constants';

const useAppNavigation = () => {
  const { open, close } = useNavigation();
  const focus = useFocusStore((state) => state.focus);

  const openSession = useCallback((sessionId: string) => { focus(sessionId); close(); }, [focus, close]);
  const openSection = useCallback((section: string, params?: Record<string, unknown>) => open(MULTIWORLD_HUB, { ...params, section }), [open]);
  const openData = useCallback((section: string) => open(DATA_HUB, { section }), [open]);

  return useMemo(() => ({ openData, openSection, openSession }), [openData, openSection, openSession]);
};

export { useAppNavigation };
