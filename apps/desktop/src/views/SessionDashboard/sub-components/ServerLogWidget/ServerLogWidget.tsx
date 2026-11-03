/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { useWidgetState } from '@drizztdourden08/brock-react';
import { LogLines } from '@archipelia/design';
import { serverRows } from '../../behavior/server-rows';
import type { ServerLogWidgetProps } from './ServerLogWidget.type';

const ServerLogWidget = ({ lines }: ServerLogWidgetProps) => {
  const [search, setSearch] = useWidgetState('search', '');
  const rows = useMemo(() => serverRows(lines), [lines]);
  return <LogLines rows={rows} search={search} onSearchChange={setSearch} emptyLabel="The server has not written anything yet." filterPlacement="left" size="sm" />;
};

export { ServerLogWidget };
