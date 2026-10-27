/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useNavigation } from '@drizztdourden08/brock-react';
import { showRun } from '../live/show-run';

const useAppNavigation = () => {
  const { open } = useNavigation();
  return useMemo(() => ({ open, openRun: showRun }), [open]);
};

export { useAppNavigation };
