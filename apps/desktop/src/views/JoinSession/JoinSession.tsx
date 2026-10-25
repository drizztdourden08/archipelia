/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera/primitives';
import { useFindSession } from './behavior/useFindSession';
import { useJoinLibrary } from './behavior/useJoinLibrary';
import { useJoins } from './behavior/useJoins';
import { FindPanel } from './sub-components/FindPanel';
import { JoinedList } from './sub-components/JoinedList';
import { JoinPlayer } from './sub-components/JoinPlayer';

const JoinSession = () => {
  const find = useFindSession();
  const joined = useJoins();
  const { installed, localAp } = useJoinLibrary();
  return (
    <Stack>
      <FindPanel model={find} localAp={localAp} />
      <JoinPlayer target={{ address: find.address, code: find.code, ready: find.canCheck }} installed={installed} />
      <JoinedList joined={joined} />
    </Stack>
  );
};

export { JoinSession };
