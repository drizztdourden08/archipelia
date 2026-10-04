/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import { nav, useBrock, useNavigation, useProfilesStore } from '@drizztdourden08/brock-react';

const useStartOnHome = (enabled: boolean, loaded: boolean, hasSession: boolean) => {
  const { homeScreen } = useBrock();
  const { active } = useNavigation();
  const profileId = useProfilesStore((state) => state.active?.id ?? null);
  const startedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !loaded || profileId === null || active !== null || startedFor.current === profileId) return;
    startedFor.current = profileId;
    if (!hasSession) nav.open(homeScreen);
  }, [enabled, loaded, profileId, active, hasSession, homeScreen]);
};

export { useStartOnHome };
