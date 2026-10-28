/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { useWidgetState } from '@drizztdourden08/brock-react';
import { LogLines } from '@archipelia/design';
import { serverRows } from '../../behavior/server-rows';
import type { LobbyLogProps } from './LobbyLog.type';

const LobbyLog = ({ events }: LobbyLogProps) => {
  const [search, setSearch] = useWidgetState('search', '');
  const rows = useMemo(() => serverRows(events), [events]);
  return <LogLines rows={rows} search={search} onSearchChange={setSearch} emptyLabel="Nothing has happened in this lobby yet." />;
};

export { LobbyLog };
