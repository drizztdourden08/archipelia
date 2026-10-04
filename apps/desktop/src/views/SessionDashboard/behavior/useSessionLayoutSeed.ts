/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useWidgetPref } from '@drizztdourden08/brock-react';
import { resetSessionWidgets } from '../../../session-widgets/reset-session-widgets';
import { LAYOUT_SEEDED_PREF } from '../../../session-widgets/session-layout.constants';

const useSessionLayoutSeed = (hasSession: boolean) => {
  const [seeded, setSeeded] = useWidgetPref(LAYOUT_SEEDED_PREF.owner, LAYOUT_SEEDED_PREF.key, false);
  useEffect(() => {
    if (!hasSession || seeded) return;
    resetSessionWidgets();
    setSeeded(true);
  }, [hasSession, seeded, setSeeded]);
};

export { useSessionLayoutSeed };
